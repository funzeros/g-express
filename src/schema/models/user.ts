import {STRING} from "sequelize";
import {v4 as uuidv4} from "uuid";

import {defineModel} from "../db";
const user = defineModel("user", {
  name: STRING(32),
  password: STRING(32),
  token: {
    allowNull: true,
    type: STRING(36),
  },
});

/**
 * 根据条件查询用户信息
 * @param name
 * @param password
 */
export const getUserInfo = async (where: any) => {
  const data = await user.findAll({
    attributes: ["id", "name", "token"],
    where,
  });
  return data[0];
};
/**
 * 根据名字查数量
 * @param name
 */
export const getCountByName = async (name: string) => {
  return await user.count({
    where: {
      name: name,
    },
  });
};

/**
 * 更新token
 * @param id
 */
export const updateToken = async (id: string) => {
  const token = uuidv4();
  return await user.update(
    {token},
    {
      where: {
        id,
      },
    }
  );
};

export default user;
