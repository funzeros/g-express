import {useRouter} from "../../router";
import {DTO} from "../../types";
import battleRecords from "../../../schema/models/rw/battle/records";
import {getPageFn, validType} from "../../../util/util";
import {Op} from "sequelize";
import cardItem from "../../../schema/models/rw/card/item";
import {getInfoByToken} from "../../../schema/models/user";

const router = useRouter();

// /battle/records
// 战斗记录添加
router.post("/battle/records/add", async (req, res) => {
  const valid: any = await validType(req.body, {
    winName: String,
    winId: Number,
    winCards: Array,
    failName: String,
    failId: Number,
    failCards: Array,
    endTime: Number,
    startTime: Number,
  });
  if (valid.f) {
    try {
      await battleRecords.create(valid.resData);
      return DTO.data(res)(true);
    } catch {
      return DTO.error(res)("对战记录保存错误");
    }
  }
  return DTO.error(res)(valid.err);
});
// 战斗记录分页
router.get("/battle/records/page", async (req, res) => {
  try {
    const {id} = req.query;
    await getPageFn(req, res)(
      battleRecords,
      [
        "id",
        "winName",
        "winId",
        "winCards",
        "failName",
        "failId",
        "failCards",
        "endTime",
        "startTime",
      ],
      {
        [Op.or]: [{winId: id}, {failId: id}],
      }
    );
    return;
  } catch (error) {
    return DTO.error(res)(error);
  }
});

// /card/item
// 获得卡片
router.post("/card/item/add", async (req, res) => {
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const {id} = userInfo;
      const valid: any = await validType(req.body, {
        cardId: String,
      });
      const data = await cardItem.findOne({where: {cardId: valid.resData.cardId, userId: id}});
      if (data) return DTO.error(res)("已拥有此骑士，不可重复获得");
      await cardItem.create({...valid.resData, userId: id});
      return DTO.data(res)(true);
    }
    return DTO.noAuth(res)();
  } catch (error) {
    console.log(error);
    return DTO.error(res)("获得卡牌出错");
  }
});

// 批量获得卡片
router.post("/card/item/bulk", async (req, res) => {
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const {id} = userInfo;
      const valid: any = await validType(req.body, {
        cardIds: Array,
      });
      const now = Date.now();
      await cardItem.bulkCreate(
        valid.resData.cardIds.map((m: string) => ({
          cardId: m,
          userId: id,
          createdAt: now,
          updatedAt: now,
          version: 0,
        }))
      );
      return DTO.data(res)(true);
    }
    return DTO.noAuth(res)();
  } catch (error) {
    console.log(error);
    return DTO.error(res)("批量获得卡牌出错");
  }
});

// 拥有卡片数组
router.get("/card/item/list", async (req, res) => {
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const {id} = userInfo;
      const data = await cardItem.findAll({
        attributes: ["cardId", "userId"],
        where: {userId: id},
      });
      return DTO.data(res)(data);
    }
    return DTO.noAuth(res)();
  } catch (error) {
    console.log(error);
    return DTO.error(res)("查询拥有卡组出错");
  }
});

export default router;
