import "dotenv/config";
import express from "express";
import expressWs from "express-ws";
import scheduleWs from "./util/autoSchedule";
import moduleRouter from "./module/index";
const appBase = express();
// websocket
const wsInstance = expressWs(appBase);
const { app } = wsInstance;
app.ws("/autoSchedule", (ws: any, req: any) => {
  // 将 ws 传递给函数
  scheduleWs(ws);
});

// 加载模块
Object.entries(moduleRouter).forEach(([name, module]) => {
  app.use("/" + name, module);
});

// 错误接口返回;
app.all("*", (req, res) => {
  res.json({
    code: 1,
    message: "接口地址错误",
  });
});
const PORT = process.env.PORT || 10045;
app.listen(PORT, () => {
  console.log(`服务已启动--> http://127.0.0.1:${PORT}`);
});
