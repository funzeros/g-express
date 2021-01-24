import router from "./index";
import {DTO} from "../../types";
import {getPageFn, isAuth} from "../../../util/util";
import user from "../../../schema/models/user";
const prefixUrl = "/admin";

/**
 * 用户管理分页
 */
router.get(`${prefixUrl}/page`, async (req, res) => {
  if (!(await isAuth(req, res))) return;
  try {
    await getPageFn(req, res)(user, ["id", "name"]);
  } catch (error) {
    DTO.error(error);
  }
});

export default router;
