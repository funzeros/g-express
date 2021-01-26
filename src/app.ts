import path from "path";
import express from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser"; //用于req.body获取值的

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./static/swagger.json";
import scheduleWs from "./ws/dns/autoSchedule";
import luckVentWs from "./ws/luckVent/autoSchedule";

import moduleRouter from "./module/index";
import {not_found_handler, error_handler_middleware} from "./util/middle";
import {connectDB} from "./schema/index";
import {loadEnv} from "./util/env";
const {PREFIX, PORT} = loadEnv();
// 初始化连接数据库
connectDB();
// express
const appBase = express();

// websocket
const wsInstance = expressWs(appBase);
const {app} = wsInstance;
app.ws("/ws", ws => {
  // 将 ws 传递给函数
  scheduleWs(ws);
});
// 幸运降临的webscoket
app.ws("/lvws", ws => {
  luckVentWs(ws);
});
// 前置中间件
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({extended: false}));
app.use("/html", express.static(path.join(__dirname, "static")));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 加载模块
Object.entries(moduleRouter).forEach(([name, module]) => {
  app.use(PREFIX + "/" + name, module);
});

// 后置中间件
app.use(not_found_handler); // 先判断此异常
app.use(error_handler_middleware); // 最后判断此异常
app.listen(PORT, () => {
  console.log(`服务已启动--> http://127.0.0.1:${PORT}`);
});
