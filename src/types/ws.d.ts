export interface WSVO<T = any> {
  code?: number; // 状态码
  data?: T; // 数据体
  source?: string; // 请求端
  type?: number; // 请求类型
  sourceId?: number; // 请求来源id
  targetId?: number; // 请求目标id
}
