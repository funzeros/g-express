export default (ws: any): void => {
  ws.on("message", (e: any) => {
    console.log(e);
  });
};
