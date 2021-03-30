import {WSVO} from "../types/ws";
import useTaroWS from "./ws";

export default (ws: any): void => {
  ws.on("message", (e: any) => {
    const res = JSON.parse(e) as WSVO;
    if (res.source === "g-taro") {
      useTaroWS(ws, res);
    }
  });
};
