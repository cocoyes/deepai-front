<script setup lang="ts">
import { reactive } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import GridPatternDashed from "@/components/grid-pattern/grid-pattern-dashed.vue";
import { useRouter } from "vue-router";
import { register,login } from "@/api/user";
defineOptions({ name: "RegisterPage" });

const router = useRouter();

const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  phone: "",
  email: ""
});

async function onRegister() {
  const { username, password, confirmPassword, phone, email } = form;

  if (!username || !password || !confirmPassword || !phone || !email) {
    showFailToast("请填写完整信息");
    return;
  }

  if (password !== confirmPassword) {
    showFailToast("两次密码不一致");
    return;
  }

  const result = await register(form)
  // 这里应该调用注册接口
  showSuccessToast(`注册成功: ${username}`);
  router.replace("/login");
  
}
</script>

<template>
  <GridPatternDashed />

  <div class="px-[24px] pt-[60px] pb-[40px]">
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
      <h2 class="text-center text-[20px] font-bold mb-[24px]">注册账号</h2>

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
      <van-field
        v-model="form.confirmPassword"
        label="确认密码"
        type="password"
        placeholder="请再次输入密码"
        clearable
        class="mb-[12px]"
      />
      <van-field
        v-model="form.phone"
        label="手机号"
        placeholder="请输入手机号"
        clearable
        class="mb-[12px]"
      />
      <van-field
        v-model="form.email"
        label="邮箱"
        placeholder="请输入邮箱"
        clearable
        class="mb-[12px]"
      />

      <van-button
        type="primary"
        block
        class="rounded-[8px] mt-[12px]"
        @click="onRegister"
      >
        注册
      </van-button>
    </div>
  </div>
</template>

<style scoped></style>
