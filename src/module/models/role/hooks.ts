import {random} from "../../../util/util";
import {RoleDTO} from "./type";
export const useRole = () => {
  return {
    baseV: 50,
    countProp(a: number, b: number) {
      return Math.ceil(this.baseV * (a / 10) * (b / 10));
    },
    init(options: RoleDTO) {
      const option = new RoleDTO();
      Object.assign(option, options);
      let a1,
        a2,
        b1,
        b2 = 0;
      //  a1 物理 a2魔法 b1攻击 b2 防御
      if (option.pom === "1") {
        a1 = random(5, 8);
        a2 = 10 - a1;
      } else {
        a1 = random(3, 5);
        a2 = 10 - a1;
      }
      if (option.aod === "1") {
        b1 = random(5, 8);
        b2 = 10 - b1;
      } else {
        b1 = random(3, 5);
        b2 = 10 - b1;
      }
      option.strg = this.countProp(a1, b1);
      option.mindg = this.countProp(a2, b1);
      option.vitg = this.countProp(a1, b2);
      option.willg = this.countProp(a2, b2);
      option.str += option.level * option.strg;
      option.mind += option.level * option.mindg;
      option.vit += option.level * option.vitg;
      option.will += option.level * option.willg;
      return option;
    },
  };
};
