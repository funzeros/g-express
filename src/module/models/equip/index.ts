import {useRouter} from "../../router";
import {DTO} from "../../types";

import equip, {
  getCountByEquipName,
  getEquipInfo,
  getEquipList,
  updateEquip,
} from "../../../schema/models/equip";
import {getInfoByToken} from "../../../schema/models/user";
import {isAuth} from "../../../util/util";
import {useEquip} from "./hooks";
const router = useRouter();

/**
 * 创建装备
 */
router.post("/create", async (req, res) => {
  const amount = await getCountByEquipName(req.body.roleName);
  if (amount) return DTO.error(res)("此名已现世");
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const data = {
        ...req.body,
        creator: userInfo.id,
      };
      await equip.create(useEquip().init(data));
      return DTO.data(res)(true);
    }
    return DTO.noAuth(res)();
  } catch {
    return DTO.error(res)("装备创建失败");
  }
});

/**
 * 是否重名
 */
router.post("/repeatName", async (req, res) => {
  const amount = await getCountByEquipName(req.body.roleName);
  if (amount) return DTO.error(res)("此名已现世");
  return DTO.data(res)(true);
});

/**
 * 打造过的装备列表
 */

router.get("/list", async (req, res) => {
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const data = await getEquipList({userId: userInfo.id}, ["id", "equipName", "url", "level"]);
      return DTO.data(res)(data);
    }
    return DTO.noAuth(res)();
  } catch (error) {
    return DTO.error(res)("装备列表查找失败");
  }
});
/**
 * 删除角色
 */
router.get("/delete", async (req, res) => {
  if (!(await isAuth(req, res))) return;
  const {id} = req.query;
  if (id) {
    await updateEquip(
      {
        delFlag: true,
      },
      {
        id,
      }
    );
    return DTO.data(res)(true);
  }
  DTO.error(res)("缺少删除id");
});

/**
 * 装备详情
 */
router.get("/info/:id", async (req, res) => {
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const {id} = req.params;
      if (id !== "undefined") {
        const data: any = await getEquipInfo({id});
        if (data) {
          data.effects = data.fn.split(",");
          return DTO.data(res)(data);
        }
      }
      return DTO.error(res)("未获取到装备信息");
    }
    return DTO.noAuth(res)();
  } catch {
    return DTO.error(res)("装备信息获取失败");
  }
});
export default router;
