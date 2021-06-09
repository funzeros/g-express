import {chunk, shuffle} from "lodash";
import {RWClient, RWWSTypes, RWWSVO, UserInfo, UserStatus} from "../../types/ws";
import {uniqueNum} from "./tools";
import {RWWSDTO} from "./types";

// 连接到线上的用户
const Clients = new Map<number, RWClient>();
const ClientsFn = {
  // 用户MAP过滤方法
  filter(fn: (m: RWClient) => boolean) {
    const arr: RWClient[] = [];
    Clients.forEach(m => {
      if (fn(m)) arr.push(m);
    });
    return arr;
  },
  // 在线的用户组
  onlineUser() {
    return ClientsFn.filter(({status}) => {
      return status !== "offLine";
    });
  },
  // 匹配中的用户组
  mattingUser() {
    return ClientsFn.filter(({status}) => {
      return status === "matting";
    });
  },
  // 游戏中的用户组
  gamingUser() {
    return ClientsFn.filter(({status}) => {
      return status === "gaming";
    });
  },
  // 广播
  bordercast(list: RWClient[], opt: RWWSVO) {
    list.forEach(({userInfo, ws}) => {
      if (ws) {
        opt.targetId = userInfo.id;
        ws.send(WSJSON(opt));
      }
    });
  },
};
/**
 * 比赛匹配
 */
const gameMate = () => {
  setInterval(() => {
    const list = ClientsFn.mattingUser();
    if (list.length < 2) return;
    const roomIds = ClientsFn.gamingUser().map(({roomId}) => roomId);
    list;
    chunk(shuffle(list), 2).forEach(m => {
      if (m.length === 2) {
        const newRoomId = uniqueNum(roomIds);
        m.forEach(o => {
          o.roomId = newRoomId;
          o.status = "gaming";
          o.ws.send(
            WSJSON({
              type: "mate",
              data: {
                msg: "匹配成功，即将进入对战",
                status: o.status,
                roomId: newRoomId,
              },
              targetId: o.userInfo.id,
            })
          );
        });
      }
    });
  }, 5000);
};

function WSJSON<T>(options: RWWSVO<T>) {
  return new RWWSDTO(options).toSDTO();
}
const wsFunc: RWWSTypes = {
  connect(ws, res: RWWSDTO<UserInfo>) {
    const {data} = res;
    const status: UserStatus = "online";
    const oldClient = Clients.get(res.sourceId);
    const params: RWClient = {ws, userInfo: data, status};
    if (oldClient) {
      // const {status} = oldClient;
      params.status = "gaming";
    }
    Clients.set(data.id, params);
    ws.send(
      WSJSON({
        type: "connect",
        targetId: data.id,
        data: {
          msg: `已连接至线上，当前在线用户数${ClientsFn.onlineUser().length}个`,
          type: "success",
          status,
        },
      })
    );
    ws.onclose = () => {
      const id = data.id;
      const clinet = Clients.get(id);
      if (clinet.status === "gaming") {
        clinet.status = "offLine";
        clinet.ws = null;
        return;
      }
      Clients.delete(id);
    };
  },
  mate(ws, res: RWWSDTO) {
    const client = Clients.get(res.sourceId);
    client.status = res.data.status;
    ws.send(
      WSJSON({
        type: "mate",
        targetId: res.sourceId,
        data: {
          status: res.data.status,
        },
      })
    );
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

/**
 *  自执行
 */
gameMate();
export default (ws: any): void => {
  ws.on("message", (e: any) => {
    const res = JSON.parse(e) as RWWSDTO;
    useRWWS(ws, res);
  });
};
