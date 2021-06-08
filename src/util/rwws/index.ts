import {RWClient, RWWSTypes, RWWSVO, UserInfo} from "../../types/ws";
import {RWWSDTO} from "./types";

const Clients = new Map<number, RWClient>();
const ClientsFn = {
  length() {
    let count = 0;
    Clients.forEach(({online}) => {
      if (online) ++count;
    });
    return count;
  },
};
const WSJSON = (options: RWWSVO) => {
  return new RWWSDTO(options).toSDTO();
};
const wsFunc: RWWSTypes = {
  connect: (ws, res: RWWSDTO<UserInfo>) => {
    const {data} = res;
    Clients.set(data.id, {ws, userInfo: data, online: true});
    ws.send(
      WSJSON({
        type: "connect",
        targetId: data.id,
        data: {msg: `已连接至线上，当前在线用户数${ClientsFn.length()}个`, type: "success"},
      })
    );
    ws.onclose = () => {
      const id = data.id;
      Clients.delete(id);
    };
  },
};
const useRWWS = (ws: WebSocket, res: RWWSDTO) => {
  const fn = wsFunc[res.type];
  if (fn) {
    fn(ws, res);
  } else {
    ws.send(
      WSJSON({
        code: 1,
        type: "error",
        data: {msg: "类型错误，请求无效", type: "error"},
      })
    );
  }
};

export default (ws: any): void => {
  ws.on("message", (e: any) => {
    const res = JSON.parse(e) as RWWSDTO;
    useRWWS(ws, res);
  });
};
