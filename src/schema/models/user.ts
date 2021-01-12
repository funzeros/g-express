import {STRING} from "sequelize";
import {defineModel} from "../db";
export default defineModel("user", {
  name: STRING(10),
  password: STRING(40),
});
