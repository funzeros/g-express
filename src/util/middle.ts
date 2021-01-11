// 中间件
const error_handler_middleware = (err: any, req: any, res: any): void => {
  if (err) {
    const {message} = err;
    res.status(500);
    res.json({
      message: `${message || "服务器异常"}`,
    });
  }
};
// 404处理
const not_found_handler = (req: unknown, res: any): void => {
  res.json({
    message: "api不存在",
  });
};

export {error_handler_middleware, not_found_handler};
