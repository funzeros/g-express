import {GMap} from "../rwws/tools";
import {KBClient, KBWSDTO, KBWSTypes, KBWSVO, UserInfo, XY} from "./type";

function WSJSON<T>(options: Partial<KBWSVO<T>>) {
  return new KBWSDTO(options).toSDTO();
}

const Clients = new GMap<number, KBClient>();

class KBTool {
  static syncUsers(ws: WebSocket, res: KBWSVO) {
    ws.send(
      WSJSON({
        type: "syncUsers",
        data: Clients.map(v => v.userInfo),
        targetId: res.sourceId,
      })
    );
  }
}
const wsFunc: Partial<KBWSTypes> = {
  connect(ws, res: KBWSVO<UserInfo>) {
    const {data} = res;
    Clients.set(res.sourceId, {ws, userInfo: data});
    ws.send(
      WSJSON({
        type: "connect",
        targetId: data.id,
        data: {
          msg: "连接成功",
          type: "success",
        },
      })
    );
    ws.onclose = () => {
      const id = data.id;
      Clients.delete(id);
    };
  },
  syncUsers(ws, res: KBWSVO<XY>) {
    const client = Clients.get(res.sourceId);
    Object.assign(client.userInfo, res.data);
    Clients.set(res.sourceId, client);
    KBTool.syncUsers(ws, res);
  },
};

const useKBWS = (ws: WebSocket, res: KBWSDTO) => {
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
    const res = JSON.parse(e) as KBWSDTO;
    useKBWS(ws, res);
  });
};
