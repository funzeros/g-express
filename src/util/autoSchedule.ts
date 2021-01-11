// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (ws: any): void => {
  ws.send("开始调用");
  // 业务代码
};
