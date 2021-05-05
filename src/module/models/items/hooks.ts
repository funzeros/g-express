import {Op} from "sequelize";
import items from "../../../schema/models/items";

const useItem = () => {
  const getNewPosition = async (roleId: number, type: string) => {
    // 获取当前角色该分类下的所有非0数量物品 按位置排序
    const rows = await items.findAll({
      attributes: ["position"],
      where: {
        roleId,
        type,
        count: {[Op.gt]: 0},
        delFlag: false,
      },
      order: [["position", "ASC"]],
    });
    let position = 0;
    // 如果有物品 则算出 最小的物品空位
    if (rows.length) {
      for (const item of rows) {
        if (item.getDataValue("position") === position) {
          ++position;
        } else {
          break;
        }
      }
    }
    return position;
  };
  return {
    getNewPosition,
  };
};

export default useItem;
