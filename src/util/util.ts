import {DTO} from "../module/types";
import {getInfoByToken} from "../schema/models/user";

// 验证控制
export const isEmpty = (params: any) => {
  return [null, undefined, ""].includes(params);
};

// 验证类型
export const validType = (data: any, rule: any) =>
  new Promise((res: any, rej: any) => {
    try {
      const resData: any = {};
      const flag = Object.keys(rule).every(k => {
        resData[k] = data[k];
        const ruleItem = rule[k];
        if (ruleItem.constructor === Object) {
          if (!ruleItem.allowNull) {
            if (isEmpty(data[k])) return false;
          }
        } else {
          if (isEmpty(data[k])) return false;
        }
        return data[k].constructor === ruleItem;
      });
      if (flag) {
        res({f: true, resData});
      } else {
        res({f: false, err: "参数错误，请检查类型和空值"});
      }
    } catch (err) {
      rej(err);
    }
  });

// 判断权限
export const isAuth = async (req: any, res: any) => {
  const data = await getInfoByToken(req);
  if (data) return data;
  DTO.noAuth(res)();
  return undefined;
};
