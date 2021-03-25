import user from "./models/user";
import menu from "./models/menu";
import role from "./models/role";
import userAdmin from "./models/user/admin";

const models = {
  user,
  menu,
  role,
};
export const loadChunkModels = {
  userAdmin,
};
console.log("加载了", Object.keys(models).join("/"), "主模块(接口)");
console.log("加载了", Object.keys(loadChunkModels).join("/"), "副模块(接口)");

export default models;
