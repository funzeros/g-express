import {useRouter} from "../../router";
import {DTO} from "../../types";

import role, {getCountByRoleName, getRoleList, updateRole} from "../../../schema/models/role";
import {getInfoByToken} from "../../../schema/models/user";
import {isAuth} from "../../../util/util";
const router = useRouter();

/**
 * 创建角色
 */
router.post("/create", async (req, res) => {
  const amount = await getCountByRoleName(req.body.roleName);
  if (amount) return DTO.error(res)("该角色名已注册");
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const data = {
        ...req.body,
        userId: userInfo.id,
      };
      await role.create(data);
      return DTO.data(res)(true);
    }
    return DTO.noAuth(res)();
  } catch {
    return DTO.error(res)("创建角色失败");
  }
});

/**
 * 是否重名
 */
router.post("/repeatName", async (req, res) => {
  const amount = await getCountByRoleName(req.body.roleName);
  if (amount) return DTO.error(res)("该角色名已注册");
  return DTO.data(res)(true);
});

/**
 * 角色列表
 */

router.get("/list", async (req, res) => {
  try {
    const userInfo: any = await getInfoByToken(req);
    if (userInfo) {
      const data = await getRoleList({userId: userInfo.id}, [
        "id",
        "roleName",
        "avatarUrl",
        "level",
      ]);
      return DTO.data(res)(data);
    }
    return DTO.noAuth(res)();
  } catch (error) {
    return DTO.error(res)("角色列表查找失败");
  }
});
/**
 * 删除角色
 */
router.get("/delete", async (req, res) => {
  if (!(await isAuth(req, res))) return;
  const {id} = req.query;
  if (id) {
    await updateRole(
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
export default router;
