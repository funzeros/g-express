import {router} from "../router";
import {DTO} from "../types";
import schema from "../../schema/index";
import {validType} from "../../util/util";
const user = schema.user.default;

/**
 * 注册
 */
router.post("/register", async (req, res) => {
  const valid: any = await validType(req.body, {
    name: String,
    password: String,
  });
  if (valid.f) {
    const amount = await user.count({
      where: {
        name: valid.resData.name,
      },
    });
    if (amount) return DTO.error(res)("该用户名已注册");
    const data = await user.create(valid.resData);
    return DTO.data(res)(data);
  }
  return DTO.error(res)(valid.err);
});

export default router;
