import "dotenv/config";
import express from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser"; //用于req.body获取值的

import scheduleWs from "./util/autoSchedule";
import moduleRouter from "./module/index";
import {not_found_handler, error_handler_middleware} from "./util/middle";
import {connectDB} from "./schema/index";
// 初始化连接数据库
connectDB();
// express
const appBase = express();
// websocket
const wsInstance = expressWs(appBase);
const {app} = wsInstance;
app.ws("/autoSchedule", ws => {
  // 将 ws 传递给函数
  scheduleWs(ws);
});

// 前置中间件
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({extended: false}));

// 加载模块
Object.entries(moduleRouter).forEach(([name, module]) => {
  app.use("/" + name, module);
});

// 后置中间件
app.use(not_found_handler); // 先判断此异常
app.use(error_handler_middleware); // 最后判断此异常

const PORT = process.env.PORT || 10045;
app.listen(PORT, () => {
  console.log(`服务已启动--> http://127.0.0.1:${PORT}`);
});
