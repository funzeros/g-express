import {useRouter} from "../../router";
import {DTO} from "../../types";

import items, {getItemsInfo, updateItems} from "../../../schema/models/items";
import useItem from "./hooks";
import {Op} from "sequelize";
import {itemsType} from "../../../const/items";
import material from "../../../schema/models/material";

const router = useRouter();
const {getNewPosition} = useItem();
/**
 * 增加物品
 */
router.post("/add", async (req, res) => {
  try {
    const {type, relationId, count, roleId} = req.body;
    const info = await getItemsInfo({roleId, type, relationId});
    if (info) {
      const oldCount = info.getDataValue("count");
      let position = info.getDataValue("position");
      // 如果原本没数量了，就给新位置
      if (!oldCount) {
        position = await getNewPosition(roleId, type);
      }
      const id = info.getDataValue("id");
      await updateItems({count: count + oldCount, position}, {id});
      return DTO.data(res)(true);
    } else {
      // 没有物品就新建 新位置
      const position = await getNewPosition(roleId, type);
      await items.create({type, roleId, relationId, count, position});
      return DTO.data(res)(true);
    }
  } catch (error) {
    DTO.error("物品创建错误");
  }
});

/**
 * 背包
 */
router.get("/list", async (req, res) => {
  try {
    const {roleId, type} = req.query;
    const rows = await items.findAll({
      attributes: ["relationId", "count", "type", "position"],
      where: {
        roleId,
        type,
        count: {[Op.gt]: 0},
        delFlag: false,
      },
      order: [["id", "ASC"]],
    });
    if (type === itemsType.material) {
      const mrows = await material.findAll({
        attributes: ["name", "code", "url", "type", "desc", "data"],
        where: {
          id: {[Op.in]: rows.map(m => m.getDataValue("relationId"))},
          delFlag: false,
        },
        order: [["id", "ASC"]],
      });
      return DTO.data(res)(rows.map((m, i) => ({...m.toJSON(), detail: mrows[i]})));
    }
    DTO.data(res)(rows);
  } catch (error) {
    DTO.error("背包获取失败");
  }
});
export default router;
