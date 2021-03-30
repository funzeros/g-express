import {WsType} from "../../const/ws";
import {GObj} from "../../types/common";
import {WSVO} from "../../types/ws";
import {WSDTO} from "./types";

const Clinets: GObj = {};
const useTaroWS = (ws: any, res: WSVO) => {
  if (res.type === WsType.lianjie) {
    const {sourceId} = res;
    Clinets[sourceId] = ws;
    const params = {
      data: {
        message: "在线服务已连接",
      },
      targetId: sourceId,
      type: WsType.sys,
    };
    sendMsg(new WSDTO(params).toSDTO());
  }
};

function sendMsg(data: string) {
  const {sourceId, targetId} = JSON.parse(data);
  if (sourceId === targetId) {
    const params = {
      data: {
        message: "不能对自己操作",
      },
      targetId,
      type: WsType.sys,
    };
    Clinets[sourceId] && Clinets[sourceId].send(new WSDTO(params).toSDTO());
    return;
  }
  const client = Clinets[targetId];
  if (client) {
    client.send(data);
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
export default useTaroWS;
