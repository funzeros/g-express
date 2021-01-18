import {BOOLEAN, STRING} from "sequelize";
import {defineModel} from "../db";
const menu = defineModel("menu", {
  // 菜单名称
  menuName: STRING(12),
  // 路由名称
  name: STRING(12),
  // 父id
  parentId: {
    type: STRING(36),
    defaultValue: "",
  },
  // 是否隐藏路由 即非菜单
  isHidden: {
    type: BOOLEAN,
    defaultValue: false,
  },
  // 路由路径
  path: STRING,
  // 组件路由
  component: STRING,
});

export default menu;
