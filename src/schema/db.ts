import {BIGINT, Sequelize, UUID, UUIDV4} from "sequelize";

import "dotenv/config";

const database = process.env.DB_NAME || "test";
const name = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "123456";

export const sequelize = new Sequelize(database, name, password, {
  dialect: "mysql", //数据库类型
  host: "127.0.0.1", //主机地址
  port: 3306,
  pool: {
    //连接池设置
    max: 5, //最大连接数
    idle: 30000,
    acquire: 60000,
  },
  dialectOptions: {
    charset: "utf8mb4", //字符集
    collate: "utf8mb4_unicode_ci",
  },
  define: {
    //模型设置
    freezeTableName: true, //自定义表面，不设置会自动将表名转为复数形式
    timestamps: false, //自动生成更新时间、创建时间字段：updatedAt,createdAt
  },
  timezone: "+08:00", //东八时区
});

// 公共的定义方法
export const defineModel = (name: string, attributes: any) => {
  const attrs: any = {};
  for (const key in attributes) {
    const value = attributes[key];
    if (typeof value === "object" && value["type"]) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false,
      };
    }
  }
  attrs.id = {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  };
  attrs.createdAt = {
    type: BIGINT,
    allowNull: false,
  };
  attrs.updatedAt = {
    type: BIGINT,
    allowNull: false,
  };
  attrs.version = {
    type: BIGINT,
    allowNull: false,
  };
  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeValidate: (obj: any) => {
        const now = Date.now();
        if (obj.isNewRecord) {
          obj.createdAt = now;
          obj.updatedAt = now;
          obj.version = 0;
        } else {
          obj.updatedAt = Date.now();
          obj.version++;
        }
      },
    },
  });
};
