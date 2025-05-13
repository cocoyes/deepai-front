import { http } from "@/utils/http";

type ResponseResult<T = any> = {};

export function redeem(data?: object): Promise<number> {
  return http.request({
    url: "/redeem/redeemPoint",
    method: "post",
    data
  });
}
