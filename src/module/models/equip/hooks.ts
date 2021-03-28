import {EquipDTO} from "./types";

export const useEquip = () => {
  return {
    init(options: EquipDTO) {
      const option = new EquipDTO();
      Object.assign(option, options);
      option.fn = option.effects.join(",");
      return option;
    },
  };
};
