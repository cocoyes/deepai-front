<script setup lang="ts">
import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user";
import { getProfile } from "@/api/user";
const router = useRouter();
const userStore = useUserStore();
const nickName = ref("");
const signature = ref("");
const point = ref(0);
const musicCount = ref(0);
const modelCount = ref(0);
onMounted(async () => {
  if (!userStore.isLogin) {
    router.replace({
      path: "/login",
      query: { redirect: "/profile" }
    });
  } else {
    const res = await getProfile();
    nickName.value = res.nickName;
    signature.value = res.signature;
    musicCount.value = res.musicCount;
    point.value = res.point;
    modelCount.value = res.modelCount;
  }
});

defineOptions({ name: "ProfilePage" });

const tabs = ref(["作品", "模型"]);
const active = ref(0);

function goToRedeem() {
  router.push("/redeem");
}

const posts = [
  {
    user: "weizhanzhan",
    time: "12-11",
    text: "冬天总是爱犯困 🥱",
    images: ["~@/assets/user_ba.jpg", "~@/assets/user_ba.jpg"],
    likes: 79,
    comments: 12,
    stars: 10
  }
];
</script>

<template>
  <div class="min-h-screen bg-[var(--color-page-background)]">
    <!-- 顶部背景图 + 头像 -->
    <div class="relative">
      <img src="~@/assets/user_ba.jpg" class="w-full h-[160px] object-cover" />
    </div>

    <!-- 用户卡片 -->
    <div
      class="bg-[var(--color-block-background)] rounded-[12px] mx-[12px] p-[16px] shadow -mt-[40px] relative z-10"
    >
      <div class="flex items-center space-x-[12px]">
        <img
          src="~@/assets/user_ba.jpg"
          class="w-[64px] h-[64px] rounded-full border border-[var(--color-border)]"
        />
        <div class="flex-1">
          <div class="font-bold text-[18px]">{{ nickName }}</div>
          <div class="text-[12px] text-gray-500">
            {{ signature }}
          </div>
        </div>
      </div>

      <div class="flex justify-around mt-[16px] text-center text-[12px]">
        <div>
          <div class="font-bold text-[16px]">{{ point }}</div>
          <div class="text-gray-500">积分</div>
        </div>
        <div>
          <div class="font-bold text-[16px]">{{ musicCount }}</div>
          <div class="text-gray-500">作品</div>
        </div>
        <div>
          <div class="font-bold text-[16px]">{{ modelCount }}</div>
          <div class="text-gray-500">模型</div>
        </div>
      </div>

      <div class="flex space-x-[12px] mt-[16px]">
        <van-button type="primary" @click="goToRedeem" block
          >兑换积分</van-button
        >
        <van-button type="default" block>购买积分</van-button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mt-[16px] px-[12px]">
      <div
        class="flex bg-[var(--color-block-background)] rounded-[8px] overflow-hidden"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="flex-1 text-center py-[10px] text-[14px]"
          :class="[
            active === index
              ? 'text-primary font-bold bg-[var(--color-primary-light)]'
              : 'text-gray-500'
          ]"
          @click="active = index"
        >
          {{ tab }}
        </div>
      </div>

      <!-- 动态列表 -->
      <div v-if="active === 0" class="mt-[12px] space-y-[12px] pb-[20px]">
        <div
          v-for="(post, i) in posts"
          :key="i"
          class="bg-[var(--color-block-background)] rounded-[12px] p-[12px]"
        >
          <div class="flex items-center space-x-[8px] mb-[8px]">
            <img
              src="~@/assets/user_ba.jpg"
              class="w-[32px] h-[32px] rounded-full"
            />
            <div>
              <div class="text-[14px] font-medium">{{ post.user }}</div>
              <div class="text-[12px] text-gray-400">{{ post.time }} 发布</div>
            </div>
          </div>

          <div class="text-[14px] mb-[8px] leading-[20px]">{{ post.text }}</div>

          <div class="grid grid-cols-2 gap-[8px] mb-[8px]">
            <img
              v-for="(img, idx) in post.images"
              :key="idx"
              :src="img"
              class="rounded-[8px]"
            />
          </div>

          <div class="flex justify-around text-[13px] text-gray-500">
            <div>
              <svg-icon name="like" class="text-[16px] mr-[4px]" />
              {{ post.likes }}
            </div>
            <div>
              <svg-icon name="comment" class="text-[16px] mr-[4px]" />
              {{ post.comments }}
            </div>
            <div>
              <svg-icon name="star" class="text-[16px] mr-[4px]" />
              {{ post.stars }}
            </div>
          </div>
        </div>
      </div>

      <!-- 话题 tab -->
      <div v-else class="text-center text-gray-400 text-[14px] mt-[24px]">
        暂无话题
      </div>
    </div>
  </div>
</template>
