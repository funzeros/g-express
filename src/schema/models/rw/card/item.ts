import {BIGINT, STRING} from "sequelize";

import {defineModel} from "../../../db";
const cardItem = defineModel("cardItem", {
  userId: BIGINT,
  cardId: STRING,
});

export default cardItem;
