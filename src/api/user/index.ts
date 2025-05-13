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
