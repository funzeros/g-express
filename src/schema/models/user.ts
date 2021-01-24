import {BIGINT, STRING} from "sequelize";
import {v4 as uuidv4} from "uuid";

import {defineModel} from "../db";
const user = defineModel("user", {
  name: STRING(32),
  password: STRING(32),
  token: {
    allowNull: true,
    type: STRING(36),
  },
  roleId: {
    type: BIGINT,
    allowNull: true,
  },
});

/**
 * 根据条件查询用户信息
 * @param name
 * @param password
 */
export const getUserInfo = async (where: any) => {
  const data = await user.findOne({
    attributes: ["id", "name", "token"],
    where: {...where, delFlag: false},
  });
  return data;
};
/**
 * 根据名字查数量
 * @param name
 */
export const getCountByName = async (name: string) => {
  return await user.count({
    where: {
      name: name,
      delFlag: false,
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
        delFlag: false,
      },
    }
  );
};

/**
 * 验证token 根据token 取信息
 */
export const getInfoByToken = async (req: any) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    if (token) return await getUserInfo({token});
  }
  return undefined;
};

export default user;
