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

export {error_handler_middleware, not_found_handler};
