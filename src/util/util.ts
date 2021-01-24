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
          if (isEmpty(data[k])) return ruleItem.allowNull;
          return data[k].constructor === ruleItem.type;
        } else {
          if (isEmpty(data[k])) return false;
          return data[k].constructor === ruleItem;
        }
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

// 分页查询
export const getPageFn = (req: any, res: any) => {
  const {current = 1, size = 10, ...arg} = req.query;
  const offset = (+current - 1) * +size;
  const limit = +size;
  return async (model: any, attributes?: string[], where?: any) => {
    const data = await model.findAndCountAll({
      attributes,
      where: {...(where || arg), delFlag: false},
      offset,
      limit,
    });
    const resData = {
      ...data,
      current: +current,
      size: +size,
    };
    DTO.page(res)(resData);
    return resData;
  };
};
