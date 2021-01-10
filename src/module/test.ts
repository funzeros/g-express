import express from "express";
const router = express.Router();
router.get("/list", (req, res) => {
  res.json({
    list: ["鞋子"],
  });
});
export default router;
