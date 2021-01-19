import user from "./models/user";
import menu from "./models/menu";
const models = {
  user,
  menu,
};
console.log("引入了", Object.keys(models).join("/"), "模块(接口)");
export default models;
