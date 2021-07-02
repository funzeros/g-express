import user from "./models/user";
import menu from "./models/menu";
import role from "./models/role";
import equip from "./models/equip";
import userAdmin from "./models/user/admin";
import material from "./models/material/index";
import items from "./models/items/index";
import rw from "./models/rw/index";
const models = {
  user,
  menu,
  role,
  equip,
  material,
  items,
  rw,
};
export const loadChunkModels = {
  userAdmin,
};
console.log("加载了", Object.keys(models).join("/"), "主模块(接口)");
console.log("加载了", Object.keys(loadChunkModels).join("/"), "副模块(接口)");

export default models;
