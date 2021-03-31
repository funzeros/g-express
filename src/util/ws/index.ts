import {WsType, MsgType} from "../../const/ws";
import {GObj} from "../../types/common";
import {WSVO} from "../../types/ws";
import {WSDTO} from "./types";

const Clinets: GObj = {};
const useTaroWS = (ws: any, res: WSVO) => {
  if (res.type === WsType.connect) {
    const {sourceId} = res;
    ws.id = sourceId;
    Clinets[sourceId] = ws;
    ws.on("close", () => {
      delete Clinets[ws.id];
    });
    //
    const params = {
      data: {
        message: "在线服务已连接",
      },
      targetId: sourceId,
      type: WsType.sys,
    };
    sendMsg(new WSDTO(params));
  } else if (res.type === WsType.msg) {
    if (res.data.msgType === MsgType.world) {
      broadcast(res, Object.values(Clinets));
    } else if (res.data.msgType === MsgType.whisper) {
      sendMsg(res);
    }
  }
};

function sendMsg(data: WSVO) {
  const {sourceId, targetId} = data;
  const client = Clinets[targetId];
  if (client) {
    client.send(JSON.stringify(data));
  } else {
    const params = {
      data: {
        message: "对方已下线",
      },
      targetId,
      type: WsType.sys,
    };
    Clinets[sourceId] && Clinets[sourceId].send(new WSDTO(params).toSDTO());
  }
}
function broadcast(data: WSVO, list: GObj[]) {
  list.forEach(m => {
    sendMsg({...data, targetId: m.id});
  });
}
export default useTaroWS;
