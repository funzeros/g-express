import {BIGINT, INTEGER, JSON, STRING} from "sequelize";

import {defineModel} from "../../../db";
const battleRecords = defineModel("battleRecords", {
  winName: STRING(32),
  winId: INTEGER,
  winCards: JSON,
  failName: STRING(32),
  failId: INTEGER,
  failCards: JSON,
  endTime: BIGINT,
  startTime: BIGINT,
});

export default battleRecords;
