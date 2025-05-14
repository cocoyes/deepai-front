import { http } from "@/utils/http";

type ResponseResult<T = any> = {};

export function register(data?: object): Promise<ResponseResult> {
  return http.request({
    url: "/user/register",
    method: "post",
    data
  });
}

type LoginResult<T = any> = {
  userId: string;
  username: string;
  token: string;
  nickName: string;
  signature: string;
  point: number;
  musicCount: number;
  modelCount: number;
};
export function login(data?: object): Promise<LoginResult> {
  return http.request({
    url: "/user/login",
    method: "post",
    data
  });
}

export function getProfile(): Promise<LoginResult> {
  return http.request({
    url: "/user/getUserInfo",
    method: "get"
  });
}

export interface UserSong {
  id: string; // 主键
  userId: string; // 用户ID
  modeId: string; // 模型ID
  musicUrl: string; // 合成音乐链接
  audioUrl: string; // 音频链接
  imageUrl: string; // 图片链接
  createTime: string; // 创建时间（ISO 格式字符串，如 '2025-05-14T08:00:00Z'）
  createTimeStamp: number; // 创建时间戳（毫秒或秒时间戳）
  lyrics: string; // 歌词
  title: string; // 标题
  tags: string; // 标签（建议按需定义为 string[]）
  prompt: string; // 提示词
  releaseStatus: number; // 是否公开
  deleteStatus: number; // 是否删除，0 否 1 是
}

export function getMySongs(params?: object): Promise<UserSong[]> {
  return http.request({
    url: "/song/getMySongs",
    method: "get",
    params
  });
}
