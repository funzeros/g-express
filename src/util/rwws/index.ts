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
  round: number;
  subRound: number;
  actTime: number;
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
  // 回合结束
  endTurn(room: RoomVO) {
    room.actTime = 10;
    room.subRound += 1;
    if (room.subRound === 2) {
      room.subRound = 0;
      room.round += 1;
    }
    room.player[room.turnId].currentAct = room.player[room.turnId].maxAct;
    const lackLength = 5 - room.player[room.turnId].handCards.length;
    room.player[room.turnId].handCards.push(
      ...room.player[room.turnId].libCards.splice(0, lackLength)
    );
    room.player[room.turnId].riderCards.forEach(m => {
      m.sAtks = m.mAtks;
    });
    if (room.round > 30) {
      Object.values(room.player).forEach(m => {
        m.currentHP = Math.max(m.currentHP - (room.round - 30), 0);
      });
    }
    Rooms.set(room.roomId, room);
    ClientsFn.bordercast(
      Object.keys(room.player).map(m => Clients.get(+m)),
      {
        type: "nextTurn",
        data: room,
      }
    );
    ClientsFn.isGameEnd(room);
  },
  // 检查游戏胜负
  isGameEnd(room: RoomVO) {
    const noHps: number[] = [];
    Object.values(room.player).forEach(m => {
      if (m.currentHP <= 0) noHps.push(m.id);
    });
    if (noHps.length) {
      const bordercastTargets = Object.keys(room.player).map(m => Clients.get(+m));
      const faildId = noHps.length === 1 ? noHps[0] : 0;
      ClientsFn.bordercast(bordercastTargets, {
        type: "gameEnd",
        data: {
          faildId,
          status: "online",
        },
      });
      bordercastTargets.forEach(m => {
        m.status = "online";
      });
      Rooms.delete(room.roomId);
    }
  },
};
/**
 * 比赛匹配
 */
const gameMate = () => {
  const allUserRoomIds = Clients.map(v => v.roomId);
  const roomIds = Rooms.getkeys();
  roomIds.forEach(id => {
    if (!allUserRoomIds.includes(id)) Rooms.delete(id);
  });
  const list = ClientsFn.mattingUser();
  if (list.length < 2) return;
  chunk(shuffle(list), 2).forEach(m => {
    if (m.length === 2) {
      const newRoomId = GMath.uniqueNum(roomIds);
      const params: RoomVO = {
        roomId: newRoomId,
        player: {},
        turnId: GMath.randomArray(m).userInfo.id,
        round: 1,
        subRound: 0,
        actTime: 20,
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
          riderCards: [],
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
};
const timerInit = () => {
  let time = 0;
  setInterval(() => {
    // 每5秒匹配一次
    if (++time >= 5) {
      time = 0;
      gameMate();
    }
    Rooms.forEach(room => {
      if (--room.actTime < 0) {
        room.turnId = +Object.keys(room.player).filter(m => +m !== room.turnId)[0];
        ClientsFn.endTurn(room);
      }
    });
    // 每秒房间倒计时
  }, 1000);
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
  syncState(ws, res: RWWSDTO) {
    const {sourceId, data} = res;
    const c = Clients.get(sourceId);
    const room = Rooms.get(c.roomId);
    Object.assign(room, data);
    room.actTime = 10;
    ClientsFn.bordercast(
      Object.keys(room.player).map(m => Clients.get(+m)),
      {
        type: "syncState",
        data: room,
      }
    );
  },
  nextTurn(ws, res: RWWSDTO<{roomId: number}>) {
    const {
      sourceId,
      data: {roomId},
    } = res;
    const room = Rooms.get(roomId);
    if (room.turnId !== sourceId) return;
    room.turnId = +Object.keys(room.player).filter(m => +m !== sourceId)[0];
    ClientsFn.endTurn(room);
  },
  // 发动过攻击
  attack(ws, res: RWWSDTO<{actionList: GObj[]; room: GObj}>) {
    const {sourceId, data} = res;
    const c = Clients.get(sourceId);
    const room = Rooms.get(c.roomId);
    Object.assign(room, data.room);
    room.actTime = 10;
    const bordercastTargets = Object.keys(room.player).map(m => Clients.get(+m));
    ClientsFn.bordercast(bordercastTargets, {
      type: "attack",
      data: {actionList: data.actionList, room},
    });
    ClientsFn.isGameEnd(room);
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
timerInit();
export default (ws: any): void => {
  ws.on("message", (e: any) => {
    const res = JSON.parse(e) as RWWSDTO;
    useRWWS(ws, res);
  });
};
