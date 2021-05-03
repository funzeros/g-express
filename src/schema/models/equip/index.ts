import {BIGINT, INTEGER, STRING} from "sequelize";

import {defineModel} from "../../db";
const equip = defineModel("equip", {
  equipName: STRING(32), // 装备名称
  url: STRING(255), // 装备图标
  creator: BIGINT, // 打造者id
  level: {
    // 装备等级
    defaultValue: 1,
    type: INTEGER,
  },
  qua: {
    // 装备品质
    defaultValue: 1,
    type: INTEGER,
  },
  money: {
    // 装备价格
    defaultValue: 0,
    type: INTEGER,
  },
  type: {
    // 装备类型
    defaultValue: 1,
    type: INTEGER,
  },
  fn: {
    // 特殊效果
    defaultValue: "[]",
    type: STRING(32),
  },
  as: {
    // 攻速加成
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
  }, // 力量 百分比
  mind: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意念
  mindg: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意念 百分比
  vit: {
    defaultValue: 0,
    type: INTEGER,
  }, // 体质
  vitg: {
    defaultValue: 0,
    type: INTEGER,
  }, // 体质 百分比
  will: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意志
  willg: {
    defaultValue: 0,
    type: INTEGER,
  }, // 意志 百分比
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
export const getEquipInfo = async (where: any) => {
  const data = await equip.findOne({
    where: {...where, delFlag: false},
  });
  return data;
};

export const getEquipList = async (where: any, attributes: string[]) => {
  const data = await equip.findAndCountAll({
    attributes,
    where: {...where, delFlag: false},
  });
  return data;
};

/**
 * 根据名字查数量
 * @param equipName
 */
export const getCountByEquipName = async (equipName: string) => {
  return await equip.count({
    where: {
      equipName: equipName,
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
export const updateEquip = async (uData: any, where: any) => {
  delete uData.id;
  const data = await equip.update(uData, {
    where: {...where, delFlag: false},
  });
  return data;
};
export default equip;
