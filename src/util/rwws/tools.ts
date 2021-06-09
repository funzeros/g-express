export const randomLenNum = (length = 4) => {
  const str = (Math.random() * Math.pow(10, length)).toFixed(0);
  const fillZero = new Array(length - str.length).fill("0").join("");
  return Number(fillZero + str);
};

export const uniqueNum = (arr: number[], length = 4): number => {
  const num = randomLenNum(length);
  if (arr.includes[num]) return uniqueNum(arr, length);
  return num;
};
