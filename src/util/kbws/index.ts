import {GObj} from "../../types/common";
import {GMap} from "../rwws/tools";
import {KBWSDTO, KBWSTypes, KBWSVO} from "./type";

function WSJSON<T>(options: Partial<KBWSVO<T>>) {
  return new KBWSDTO(options).toSDTO();
}

const Clients = new GMap<number, GObj>();

class KBTool {
  static syncUsers(ws: WebSocket, res: KBWSVO) {
    ws.send(
      WSJSON({
        type: "syncUsers",
        data: Clients.getValues(),
        targetId: res.sourceId,
      })
    );
  }
}
const wsFunc: Partial<KBWSTypes> = {
  connect(ws, res) {
    const {data} = res;
    Clients.set(res.sourceId, data);
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
  syncUsers(ws, res) {
    const client = Clients.get(res.sourceId);
    Object.assign(client, res.data);
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
