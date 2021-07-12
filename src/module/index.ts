import user from "./models/user";
import equip from "./models/equip";
import material from "./models/material/index";
import items from "./models/items/index";
const models = {
  user,
  equip,
  material,
  items,
};

console.log("加载了", Object.keys(models).join("/"), "主模块(接口)");

export default models;
