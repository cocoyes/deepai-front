<script setup lang="ts">
import { ref } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import { redeem } from "@/api/redeem";
defineOptions({ name: "CouponExchange" });

const couponCode = ref("");
const captchaCode = ref("");
const exchangeResult = ref<string | null>(null);

const captchaSrc = ref(getCaptchaUrl());

function getCaptchaUrl() {
  // 时间戳防止缓存
  return `/ai-api/user/getCaptcha?ts=${Date.now()}`;
}
function refreshCaptcha() {
  captchaSrc.value = getCaptchaUrl();
}
interface ExchangeRequest {
  code: string;
  captcha: string;
}

async function exchange() {
  if (!couponCode.value) {
    showFailToast("请输入兑换券码");
    return;
  }
  if (!captchaCode.value) {
    showFailToast("请输入图形验证码");
    return;
  }
  const params: ExchangeRequest = {
    code: couponCode.value,
    captcha: captchaCode.value
  };
  const pointRes = await redeem(params);
  // 模拟兑换逻辑，成功后更新积分
  showSuccessToast("兑换成功！");
  exchangeResult.value = `兑换成功，已获得 ${pointRes} 积分`;
  couponCode.value = "";
  captchaCode.value = "";
}
</script>

<template>
  <div class="px-[10px] py-[10px]">
    <van-field
      v-model="couponCode"
      label="兑换券码"
      placeholder="请输入兑换券码"
      clearable
      class="my-[10px]"
    />

    <div class="flex items-center my-[10px]">
      <van-field
        v-model="captchaCode"
        label="验证码"
        placeholder="请输入验证码"
        clearable
        class="flex-1"
      />
      <img
        :src="captchaSrc"
        alt="验证码"
        class="ml-[10px] w-[100px] h-[40px] object-cover rounded cursor-pointer"
        @click="refreshCaptcha"
      />
    </div>

    <van-button type="primary" block @click="exchange"> 兑换 </van-button>

    <div v-if="exchangeResult" class="mt-[20px] text-green-600 text-center">
      {{ exchangeResult }}
    </div>
  </div>
</template>
