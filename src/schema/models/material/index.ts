import {JSON, STRING} from "sequelize";

import {defineModel} from "../../db";
const material = defineModel("material", {
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
export const getMaterialInfo = async (where: any) => {
  const data = await material.findOne({
    where: {...where, delFlag: false},
  });
  return data;
};

export const getMaterialList = async (where: any, attributes: string[]) => {
  const data = await material.findAndCountAll({
    attributes,
    where: {...where, delFlag: false},
  });
  return data;
};

/**
 * 根据code查数量
 * @param
 */
export const getCountByMaterialCode = async (code: string) => {
  return await material.count({
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
export const updateMaterial = async (uData: any, where: any) => {
  delete uData.id;
  const data = await material.update(uData, {
    where: {...where, delFlag: false},
  });
  return data;
};
export default material;
