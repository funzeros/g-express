import {DTO} from "../module/types";
// 中间件
const error_handler_middleware = (err: any, req: any, res: any): void => {
  if (err) {
    const {message} = err;
    res.status(500);
    DTO.error(res)(`${message || "服务器异常"}`);
  }
};
// 404处理
const not_found_handler = (req: any, res: any): void => {
  DTO.error(res)("api不存在");
};

const allowCrossDomain = (req: any, res: any, next: any) => {
  const allowedOrigins = [
    "http://localhost:9191",
    "http://aote.fun:10087",
    "http://game.aote.fun",
    "https://game.aote.fun",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
};
export {error_handler_middleware, not_found_handler, allowCrossDomain};
