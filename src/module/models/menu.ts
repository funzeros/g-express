import menu, {getMenu} from "../../schema/models/menu";
import {isAuth, validType} from "../../util/util";
import {router} from "../router";
import {DTO} from "../types";

/**
 * 获取全部的菜单分页（父子结构）
 */
router.get("/page", async (req, res) => {
  // 判断token
  if (!(await isAuth(req, res))) return;
  try {
    const data = await getMenu();
    const resData = {
      total: 10,
      size: 10,
      current: 10,
      records: data,
    };
    DTO.data(res)(resData);
  } catch {
    DTO.error(res)("菜单获取失败");
  }
});

/**
 * 新增菜单
 */
router.post("/create", async (req, res) => {
  if (!(await isAuth(req, res))) return;
  const valid: any = await validType(req.body, {
    menuName: String,
    name: String,
    parentId: {
      allowNull: true,
      type: Number,
    },
    isHidden: Boolean,
    path: String,
    component: String,
  });
  if (valid.f) {
    try {
      await menu.create(valid.resData);
      return DTO.data(res)(true);
    } catch {
      return DTO.error(res)("菜单新增失败");
    }
  }
  return DTO.error(res)(valid.err);
});
export default router;
