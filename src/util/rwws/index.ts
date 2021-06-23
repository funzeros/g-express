import {chunk, shuffle} from "lodash";
import {GObj} from "../../types/common";
import {PlayVO, RWClient, RWWSTypes, RWWSVO, UserInfo, UserStatus} from "../../types/ws";
import {GMap, GMath} from "./tools";
import {RWWSDTO} from "./types";

// 游戏房间
interface RoomVO {
  roomId: number;
  player: GObj<PlayVO>;
  turnId: number;
}
const Rooms = new GMap<number, RoomVO>();
// 连接到线上的用户
const Clients = new GMap<number, RWClient>();
const ClientsFn = {
  // 在线的用户组
  onlineUser() {
    return Clients.filter(({status}) => {
      return status !== "offLine";
    });
  },
  // 匹配中的用户组
  mattingUser() {
    return Clients.filter(({status}) => {
      return status === "matting";
    });
  },
  // 游戏中的用户组
  gamingUser() {
    return Clients.filter(({status}) => {
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
    const roomIds = Rooms.getkeys();
    chunk(shuffle(list), 2).forEach(m => {
      if (m.length === 2) {
        const newRoomId = GMath.uniqueNum(roomIds);
        const params: RoomVO = {
          roomId: newRoomId,
          player: {},
          turnId: GMath.randomArray(m).userInfo.id,
        };
        Rooms.set(newRoomId, params);
        m.forEach(o => {
          const libCards = shuffle(o.cards);
          const handCards = libCards.splice(0, 5);
          params.player[o.userInfo.id] = {
            maxHP: 50,
            currentHP: 50,
            currentAct: 10,
            maxAct: 10,
            handCards,
            libCards,
            ...o.userInfo,
          };
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
    const oldClient = Clients.get(data.id);
    const params: RWClient = {ws, userInfo: data, status};
    if (oldClient) {
      params.status = "gaming";
      params.roomId = oldClient.roomId;
    }
    Clients.set(data.id, params);
    const msg = oldClient
      ? "对局重连成功"
      : `已连接至线上，当前在线用户数${ClientsFn.onlineUser().length}个`;
    ws.send(
      WSJSON({
        type: "connect",
        targetId: data.id,
        data: {
          msg,
          type: "success",
          status: params.status,
          roomId: params.roomId,
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
    client.cards = res.data.cards;
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
  gameStart(ws, res: RWWSDTO<{roomId: number}>) {
    const {roomId} = res.data;
    const room = Rooms.get(roomId);

    ws.send(
      WSJSON({
        type: "gameStart",
        targetId: res.sourceId,
        data: {room},
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
