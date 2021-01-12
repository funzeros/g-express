import {router} from "../router";
import {DTO} from "../types";

router.get("/list", (req, res) => {
  const data = {list: ["鞋子"]};
  DTO.data(res)(data);
});

export default router;
