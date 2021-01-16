import {router} from "../router";
import {DTO} from "../types";
import {validType} from "../../util/util";
import user, {getUserInfo, getCountByName, updateToken} from "../../schema/models/user";

/**
 * 注册
 */
router.post("/register", async (req, res) => {
  const valid: any = await validType(req.body, {
    name: String,
    password: String,
  });
  if (valid.f) {
    const amount = await getCountByName(valid.resData.name);
    if (amount) return DTO.error(res)("该用户名已注册");
    try {
      await user.create(valid.resData);
      return DTO.data(res)(true);
    } catch {
      return DTO.error(res)("注册失败");
    }
  }
  return DTO.error(res)(valid.err);
});

/**
 * 登录
 */
router.post("/login", async (req, res) => {
  const valid: any = await validType(req.body, {
    name: String,
    password: String,
  });
  if (valid.f) {
    try {
      const data: any = await getUserInfo({
        name: valid.resData.name,
        password: valid.resData.password,
      });
      if (data) {
        await updateToken(data.id);
        const userInfo: any = await getUserInfo({
          id: data.id,
        });
        return DTO.data(res)(userInfo);
      } else {
        return DTO.error(res)("用户名或密码错误");
      }
    } catch {
      return DTO.error(res)("登录失败");
    }
  }
  return DTO.error(res)(valid.err);
});
export default router;
