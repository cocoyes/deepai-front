<script setup lang="ts">
import { nextTick, reactive, ref } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import GridPatternDashed from "@/components/grid-pattern/grid-pattern-dashed.vue";
import { useRouter } from "vue-router";
import { register,login } from "@/api/user";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const router = useRouter();

function goRegister() {
  router.push("/register");
}
defineOptions({
  name: "LoginPage"
});

const form = reactive({
  username: "",
  password: "",
  captcha: ""
});

const captchaSrc = ref(getCaptchaUrl());

function getCaptchaUrl() {
  // 时间戳防止缓存
  return `/ai-api/user/getCaptcha?ts=${Date.now()}`;
}

function refreshCaptcha() {
  captchaSrc.value = getCaptchaUrl();
}

async function onLogin() {
  if (!form.username || !form.password || !form.captcha) {
    showFailToast("请填写完整信息");
    return;
  }
  // 示例登录逻辑，可换成实际接口调用
  showSuccessToast(`登录中: ${form.username}`);
  const token = await login(form)
  console.log("token=",token)
  userStore.setToken(token.token)
  router.replace("/profile");

}
</script>

<template>
  <GridPatternDashed />

  <div class="px-[24px] pt-[60px] pb-[40px]">
   <!-- 替换后 -->
<div class="flex justify-center mb-[16px]">
  <img
    src="https://static.deeptok.top/logo_melomini.png"
    alt="网站 Logo"
    class="w-[160px] h-auto max-h-[60px] object-contain"
  />
</div>
<div class="text-center text-[16px] font-semibold text-[var(--color-text)] mb-[24px]">
  发现让你感动的声音
</div>
    <div
      class="bg-[var(--color-block-background)] p-[20px] rounded-[12px] shadow"
    >
      <h2 class="text-center text-[20px] font-bold mb-[24px]">账号登录</h2>

      <van-field
        v-model="form.username"
        label="账号"
        placeholder="请输入账号"
        clearable
        class="mb-[12px]"
      />
      <van-field
        v-model="form.password"
        label="密码"
        type="password"
        placeholder="请输入密码"
        clearable
        class="mb-[12px]"
      />

      <div class="flex items-center mb-[16px]">
        <van-field
          v-model="form.captcha"
          label="验证码"
          placeholder="请输入验证码"
          clearable
          class="flex-1"
        />
        <img
          :src="captchaSrc"
          @click="refreshCaptcha"
          class="w-[80px] h-[36px] rounded ml-[12px] border border-[var(--color-border)] object-cover"
          alt="验证码"
        />
      </div>

      <van-button
        type="primary"
        block
        class="rounded-[8px] mt-[8px]"
        @click="onLogin"
      >
        登录
      </van-button>
      <div class="text-center text-[14px] mt-[16px] text-[var(--color-text)]">
        还没有账号？
        <span
          class="text-[var(--van-primary-color)] underline cursor-pointer"
          @click="goRegister"
        >
          去注册
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可根据需要增加动画或自定义样式 */
</style>
