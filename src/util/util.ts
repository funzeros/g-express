export const validType = (data: any, rule: any) =>
  new Promise((res: any, rej: any) => {
    try {
      const resData: any = {};
      const flag = Object.keys(rule).every(k => {
        resData[k] = data[k];
        return data[k].constructor === rule[k];
      });
      if (flag) {
        res({f: true, resData});
      } else {
        res({f: false, err: "参数错误"});
      }
    } catch (err) {
      rej(err);
    }
  });
