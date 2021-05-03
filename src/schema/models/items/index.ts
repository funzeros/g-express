import {JSON, STRING} from "sequelize";

import {defineModel} from "../../db";
const items = defineModel("items", {
  name: STRING(32),
  code: STRING(32),
  url: STRING(255),
  type: STRING(32),
  desc: STRING(255),
  data: JSON,
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
 * 根据code查数量
 * @param
 */
export const getCountByItemsCode = async (code: string) => {
  return await items.count({
    where: {
      code,
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
