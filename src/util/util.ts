import {intersection, isNil, keys, omitBy, pick} from "lodash";
import {DTO} from "../module/types";
import {getInfoByToken} from "../schema/models/user";
import {GObj} from "../types/common";

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

// 随机范围

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * 正版验证解法
 */
//  export const wgaFn = (time: number) => {
//   const oldTime = ("" + time).substr(6, 6);
//   const newTime = ((+oldTime % 9845) + 127) * 1998;
//   return oldTime + "-" + newTime;
// };
export const wgaFn = (req: any, res: any) => {
  return new Promise(resolve => {
    const wga: string = req.headers.wga;
    if (wga) {
      const [oldTime, newTime] = wga.split("-");
      const newTime2 = ((+oldTime % 9845) + 127) * 1998;
      if (+newTime === newTime2) {
        resolve(true);
      } else {
        DTO.error(res)("正版验证失败");
        resolve(false);
      }
    } else {
      DTO.noAuth(res)();
      resolve(false);
    }
  });
};

/**
 * 覆盖对象属性
 * @param distObject 初始化对象
 * @param srcObject 传递过来新对象
 */
export function mergeProperties<T>(distObject: T, srcObject: GObj) {
  const distPropList = keys(distObject);
  const srcPropList = keys(omitBy(srcObject, isNil));
  const propList = intersection(distPropList, srcPropList);
  return {
    ...distObject,
    ...pick(srcObject, propList),
  };
}
