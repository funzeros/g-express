import test from "./models/test";
import user from "./models/user";
const models = {
  test,
  user,
};
console.log("引入了", Object.keys(models).join("/"), "模块");
export default models;
