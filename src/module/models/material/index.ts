import {useRouter} from "../../router";
import {DTO} from "../../types";

import material, {getCountByMaterialCode, getMaterialList} from "../../../schema/models/material";

const router = useRouter();
/**
 * 是否已存在
 */
router.post("/repeat", async (req, res) => {
  const amount = await getCountByMaterialCode(req.body.code);
  if (amount) return DTO.error(res)("材料code已存在");
  return DTO.data(res)(true);
});

/**
 * 新增材料
 */
router.post("/create", async (req, res) => {
  const amount = await getCountByMaterialCode(req.body.code);
  if (amount) return DTO.error(res)("材料code已存在");
  try {
    await material.create(req.body);
    return DTO.data(res)(true);
  } catch {
    return DTO.error(res)("材料新增失败");
  }
});
/**
 *  材料列表
 */
router.get("/list", async (req, res) => {
  try {
    const data = await getMaterialList({}, ["id", "name", "code", "url", "type", "desc", "data"]);
    return DTO.data(res)(data);
  } catch (error) {
    return DTO.error(res)("装备列表查找失败");
  }
});
export default router;
