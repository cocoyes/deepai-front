import { http } from "@/utils/http";

export interface UserOrderDetailVo {
  musicUrl: string; // 用户音频链接
  audioUrl: string; // AI音频链接
  imageUrl: string; // 封面图链接
  lyrics: string; // 歌词
  title: string; // 标题
  tags: string; // 标签
}

export interface UserOrdersVo {
  id: string;
  userId: string; // 用户ID
  taskType: string; // 操作类型，如 text2song
  bizId: string; // 第三方业务ID
  status: number; // 状态：0待处理，1处理中，2待查询 ，3已完成，4失败
  createTime: string; // 创建时间（ISO 字符串）
  createTimeStamp: number; // 创建时间戳（毫秒）
  sourceText: string; // 源文本
  musics: UserOrderDetailVo[];
  userModelName: string; // 用户模型名称
}

export function createMusic(data?: object): Promise<string> {
  return http.request({
    url: "/song/textToMusic",
    method: "post",
    data
  });
}

export function queryMusicProgress(params?: object): Promise<UserOrdersVo> {
  return http.request({
    url: "/song/queryMusicProgress",
    method: "get",
    params
  });
}
