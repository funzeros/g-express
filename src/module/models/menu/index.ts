import menu, {getMenu, getMenuOne, updateMenu} from "../../../schema/models/menu";
import {menuToTree} from "../../../util/menuUtil";
import {isAuth, validType} from "../../../util/util";
import {useRouter} from "../../router";
import {DTO} from "../../types";
const router = useRouter();

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
      records: menuToTree(data),
    };
    DTO.data(res)(resData);
  } catch {
    DTO.error(res)("菜单获取失败");
  }
});

/**
 * 获取全部的菜单列表（父子结构）
 */
router.get("/list", async (req, res) => {
  // 判断token
  if (!(await isAuth(req, res))) return;
  try {
    const data = await getMenu();
    DTO.data(res)(menuToTree(data));
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
      const resData = valid.resData;
      if (resData.parentId) {
        const data = await getMenu({id: resData.parentId});
        if (!data.length) return DTO.error(res)("父菜单不存在");
      }
      await menu.create(valid.resData);
      return DTO.data(res)(true);
    } catch {
      return DTO.error(res)("菜单新增失败");
    }
  }
  return DTO.error(res)(valid.err);
});

/**
 * 删除菜单
 */
router.get("/delete", async (req, res) => {
  if (!(await isAuth(req, res))) return;
  const {id} = req.query;
  if (id) {
    await updateMenu(
      {
        delFlag: true,
      },
      {
        id,
      }
    );
    return DTO.data(res)(true);
  }
  DTO.error(res)("缺少删除id");
});

/**
 * 获取菜单详情
 */

router.get("/detail", async (req, res) => {
  if (!(await isAuth(req, res))) return;
  const {id} = req.query;
  if (id) {
    const detail = await getMenuOne({id});
    if (detail) return DTO.data(res)(detail);
    return DTO.error(res)("找了个寂寞");
  }
  DTO.error(res)("缺少删除id");
});

/**
 * 更新菜单详情
 */

router.post("/update", async (req, res) => {
  if (!(await isAuth(req, res))) return;
  try {
    if (req.body.parentId) {
      const data = await getMenuOne({id: req.body.parentId});
      if (!data) return DTO.error(res)("父菜单不存在");
    }
    await updateMenu(req.body, {
      id: req.body.id,
    });
    return DTO.data(res)(true);
  } catch {
    return DTO.error(res)("菜单更新失败");
  }
});

export default router;
