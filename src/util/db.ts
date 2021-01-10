import { Sequelize } from "sequelize";
import "dotenv/config";
const database = process.env.DB || "test";
const name = process.env.NAME || "root";
const password = process.env.PASSWORD || "123456";
const db = new Sequelize(database, name, password, {
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
  //
});
export const connectDB = () => {
  db.authenticate()
    .then(() => {
      console.log("数据库已连接！");
    })
    .catch((err) => {
      console.log(err);
      console.log("连接失败");
    });
};

export const initDB = () => {
  connectDB();
};
