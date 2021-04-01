import {WsType, MsgType} from "../../const/ws";
import {WSVO} from "../../types/ws";
import {WSDTO} from "./types";

const Clinets = new Map();
const useTaroWS = (ws: any, res: WSVO) => {
  if (res.type === WsType.connect) {
    const {sourceId, data} = res;
    const {roleName, avatarUrl, blockXY} = data;
    ws.id = sourceId;
    ws.roleName = roleName;
    ws.avatarUrl = avatarUrl;
    ws.blockXY = blockXY;
    Clinets.set(sourceId, ws);
    ws.on("close", () => {
      Clinets.delete(sourceId);
    });
    //
    const params = {
      data: {
        message: "在线服务已连接",
      },
      targetId: sourceId,
      type: WsType.connect,
    };
    sendMsg(new WSDTO(params));
    sendCurrentBlockList(sourceId, blockXY);
  } else if (res.type === WsType.msg) {
    if (res.data.msgType === MsgType.world) {
      broadcast(res, Clinets);
    } else if (res.data.msgType === MsgType.whisper) {
      sendMsg(res);
    }
  } else if (res.type === WsType.syncP) {
    ws.blockXY = res.data;
    sendCurrentBlockList(ws.id, ws.blockXY);
  }
};

function sendMsg(data: WSVO) {
  const {sourceId, targetId} = data;
  const client = Clinets.get(targetId);
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
    Clinets.has(sourceId) && Clinets.get(sourceId).send(new WSDTO(params).toSDTO());
  }
}
function broadcast(data: WSVO, list: Map<number, any>) {
  list.forEach(m => {
    sendMsg({...data, targetId: m.id});
  });
}
function sendCurrentBlockList(targetId: number, tXY: number[][]) {
  const list: any = [];
  Clinets.forEach(m => {
    const {id, roleName, avatarUrl, blockXY} = m;
    if (targetId !== id && JSON.stringify(blockXY[0]) === JSON.stringify(tXY[0])) {
      list.push({
        id,
        blockXY,
        roleName,
        avatarUrl,
      });
    }
  });
  const params = {
    targetId,
    data: list,
    type: WsType.syncP,
  };
  sendMsg(new WSDTO(params));
}
export default useTaroWS;
