import {BIGINT, STRING, UUID, UUIDV4} from "sequelize";

// export default class User {

// }
export const user = (sequelize: any) => {
  return sequelize.define("user", {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: STRING(10),
    password: STRING(40),
    createdAt: BIGINT,
    updatedAt: BIGINT,
  });
};

export const addUser = async (sequelize: any) => {
  const User = user(sequelize);
  const now = Date.now();
  const dog = await User.create({
    name: "Odie",
    password: "",
    createdAt: now,
    updatedAt: now,
    version: 0,
  });
  console.log("created: " + JSON.stringify(dog));
};
