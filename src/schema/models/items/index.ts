import {BIGINT, INTEGER, STRING} from "sequelize";

import {defineModel} from "../../db";
const items = defineModel("items", {
  roleId: BIGINT,
  type: STRING,
  relationId: BIGINT,
  position: INTEGER,
  count: BIGINT,
});

/**
 * 根据条件查询信息
 */
export const getItemsInfo = async (where: any) => {
  const data = await items.findOne({
    where: {...where, delFlag: false},
  });
  return data;
};

export const getItemsList = async (where: any, attributes: string[]) => {
  const data = await items.findAndCountAll({
    attributes,
    where: {...where, delFlag: false},
  });
  return data;
};

/**
 * 查数量
 * @param
 */
export const getCount = async (where: any) => {
  return await items.count({
    where: {
      ...where,
      delFlag: false,
    },
  });
};
/**
 * 更改数据
 * @param uData
 * @param where
 * @returns
 */
export const updateItems = async (uData: any, where: any) => {
  delete uData.id;
  const data = await items.update(uData, {
    where: {...where, delFlag: false},
  });
  return data;
};
export default items;
