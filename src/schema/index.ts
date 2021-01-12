import fs from "fs";
import {sequelize} from "./db";
import "dotenv/config";
const files = fs.readdirSync(__dirname + "/models");
const exportsObj: any = {};
files
  .filter(f => {
    return f.endsWith(".ts");
  }, files)
  .forEach(f => {
    const name = f.substring(0, f.length - 3);
    console.log(`从文件${f} 导入模块${name}...`);
    exportsObj[name] = require(__dirname + "/models/" + f);
  });

export const connectDB = (): void => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("数据库已连接！");
      sequelize
        .sync({
          alter: !!process.env.DB_ALTER, // 表格结构有变更时修改 生产环境用
          force: !process.env.DB_ALTER, // 每次都删表重新建 开发环境用
        })
        .then(() => {
          console.log("数据库表初始化 ok");
        })
        .catch(err => {
          console.log("数据库表初始化 error", err);
        });
    })
    .catch(err => {
      console.log(err);
      console.log("数据库连接失败");
    });
};

export default exportsObj;
