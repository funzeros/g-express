import {BIGINT, INTEGER, STRING} from "sequelize";

import {defineModel} from "../../db";
const role = defineModel("role", {
  roleName: STRING(32), // 角色名称
  avatarUrl: STRING(5000), // 角色头像
  userId: BIGINT, // 用户id
  level: {
    // 等级
    defaultValue: 1,
    type: INTEGER,
  },
  money: {
    // 金币
    defaultValue: 0,
    type: INTEGER,
  },
  str: {
    defaultValue: 0,
    type: INTEGER,
  }, // 力量
  strg: {
    defaultValue: 0,
    type: INTEGER,
  }, // 力量 成长值
  mind: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意念
  mindg: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意念 成长值
  vit: {
    defaultValue: 0,
    type: INTEGER,
  }, // 体质
  vitg: {
    defaultValue: 0,
    type: INTEGER,
  }, // 体质 成长值
  will: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意志
  willg: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意志 成长值
  mhp: {
    defaultValue: 0,
    type: INTEGER,
  }, // 血量上限
  atk: {
    defaultValue: 0,
    type: INTEGER,
  }, //  攻击力
  satk: {
    defaultValue: 0,
    type: INTEGER,
  }, // 特攻
  def: {
    defaultValue: 0,
    type: INTEGER,
  }, // 防御力
  sdef: {
    defaultValue: 0,
    type: INTEGER,
  }, // 特防
  dod: {
    defaultValue: 0,
    type: INTEGER,
  }, // 回避率
  hit: {
    defaultValue: 0,
    type: INTEGER,
  }, // 命中率
  cri: {
    defaultValue: 0,
    type: INTEGER,
  }, // 暴击率
  crd: {
    defaultValue: 0,
    type: INTEGER,
  }, // 暴击伤害
  add: {
    defaultValue: 0,
    type: INTEGER,
  }, //附加伤害
  fin: {
    defaultValue: 0,
    type: INTEGER,
  }, // 最终伤害
  red: {
    defaultValue: 0,
    type: INTEGER,
  }, // 减伤率
  ign: {
    defaultValue: 0,
    type: INTEGER,
  }, // 无视防御
  fen: {
    defaultValue: 0,
    type: INTEGER,
  }, // 火强
  fre: {
    defaultValue: 0,
    type: INTEGER,
  }, // 火抗
  ien: {
    defaultValue: 0,
    type: INTEGER,
  }, // 冰强
  ere: {
    defaultValue: 0,
    type: INTEGER,
  }, // 冰抗
  len: {
    defaultValue: 0,
    type: INTEGER,
  }, // 光强
  lre: {
    defaultValue: 0,
    type: INTEGER,
  }, // 光抗
  den: {
    defaultValue: 0,
    type: INTEGER,
  }, // 暗强
  dre: {
    defaultValue: 0,
    type: INTEGER,
  }, // 暗抗
});

/**
 * 根据条件查询信息
 */
export const getRoleInfo = async (where: any) => {
  const data = await role.findOne({
    where: {...where, delFlag: false},
  });
  return data;
};

export const getRoleList = async (where: any, attributes: string[]) => {
  const data = await role.findAndCountAll({
    attributes,
    where: {...where, delFlag: false},
  });
  return data;
};

/**
 * 根据名字查数量
 * @param roleName
 */
export const getCountByRoleName = async (roleName: string) => {
  return await role.count({
    where: {
      roleName: roleName,
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
export const updateRole = async (uData: any, where: any) => {
  delete uData.id;
  const data = await role.update(uData, {
    where: {...where, delFlag: false},
  });
  return data;
};
export default role;
