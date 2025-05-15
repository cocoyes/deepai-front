<script setup lang="ts">
import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useUserStore } from "../../store/user";
import { showFailToast, showSuccessToast } from "vant";
import { getProfile, getMySongs, UserSong,updateRelease } from "@/api/user";

const router = useRouter();
const userStore = useUserStore();
const nickName = ref("");
const signature = ref("");
const point = ref(0);
const musicCount = ref(0);
const modelCount = ref(0);

const songList = ref<UserSong[]>([]);
const hasMore = ref(true);
const loading = ref(false);

const loadSongs = async (isInit = false) => {
  console.log("call load")
  if (!hasMore.value || loading.value) return;
  loading.value = true;
  console.log("call load2")
  try {
    const ts =
      isInit || songList.value.length === 0
        ? undefined
        : songList.value[songList.value.length - 1].createTimeStamp;
    const songs = await getMySongs(ts ? { ts } : {});
    if (songs.length === 0) {
      hasMore.value = false;
    } else {
      if (isInit) {
        songList.value=songs;
      }else{
        songList.value.push(...songs);
      }
      
    }
  } catch (err) {
    showFailToast("加载失败");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (!userStore.isLogin) {
    router.replace("/login");
  } else {
    const res = await getProfile();
    nickName.value = res.nickName;
    signature.value = res.signature;
    musicCount.value = res.musicCount;
    point.value = res.point;
    modelCount.value = res.modelCount;
    await loadSongs(true);
  }

  window.addEventListener("scroll", handleScroll);
});

onBeforeRouteLeave(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  const scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight + 100 >= documentHeight) {
    loadSongs();
  }
};

defineOptions({ name: "ProfilePage" });

const tabs = ref(["作品", "模型"]);
const active = ref(0);

function goToRedeem() {
  router.push("/redeem");
}

function goToDetail(id: string) {
  router.push(`/play/${id}`);
}

function sharePost(id: string) {
  const url = `${window.location.origin}/play/${id}`;

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  const selectedRange = document.getSelection()?.rangeCount
    ? document.getSelection()?.getRangeAt(0)
    : null;

  textarea.select();

  try {
    const success = document.execCommand("copy");
    if (success) {
      showSuccessToast("链接已复制到剪贴板");
    } else {
      showFailToast("复制失败");
    }
  } catch (e) {
    showFailToast("复制失败");
  }

  document.body.removeChild(textarea);

  if (selectedRange) {
    const selection = document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(selectedRange);
  }
}

function downloadMusic(url: string, filename: string = "music.mp3") {
  if (!url) {
    showFailToast("暂无音频可下载");
    return;
  }

  const encodedFilename = encodeURIComponent(filename);
  const separator = url.includes("?") ? "&" : "?";
  const downloadUrl = `${url}${separator}attname=${encodedFilename}`;

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


const toggleRelease = async (post: UserSong) => {
  const newStatus = post.releaseStatus === 1 ? 0 : 1;
  try {
    await updateRelease({ "id": post.id, "releaseStatus": newStatus });
    showSuccessToast(newStatus === 1 ? "已公开" : "已隐藏");
    const songs = await getMySongs( {});
    songList.value=songs;
  } catch (e) {
    showFailToast("操作失败");
  }
};

function logout() {
  userStore.logout(); // 清空用户信息
  router.replace("/login");
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-page-background)]">
    <!-- 顶部背景图 + 头像 -->
    <div class="relative">
      <img src="https://static.deeptok.top/user_ba.jpg" class="w-full h-[160px] object-cover" />
    </div>

    <!-- 用户卡片 -->
    <div
      class="bg-[var(--color-block-background)] rounded-[12px] mx-[12px] p-[16px] shadow -mt-[40px] relative z-10"
    >
            <div style="float:right">
          <van-icon
  name="revoke"
  class=" top-[12px] right-[12px] text-gray-500"
  size="15"
  @click="logout"
/>
          </div>
      <div class="flex items-center space-x-[12px]">
        <img
          src="https://static.deeptok.top/user_ba.jpg"
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

      <!-- 音乐列表 -->
      <div v-if="active === 0" class="mt-[12px] space-y-[12px] pb-[20px]">
        <div
          v-for="(post, i) in songList"
          :key="post.id"
          class="bg-[var(--color-block-background)] rounded-[12px] p-[12px]"
        >
          <div
            @click="goToDetail(post.id)"
            class="flex items-center space-x-[8px] mb-[8px]"
          >
          
            <img :src="post.imageUrl" class="w-[32px] h-[32px] rounded-full" />
            
            <!-- 中间：标题 + 时间 -->
  <div class="flex-1">
    <div class="flex items-center">
      <span class="text-[14px] font-medium mr-[6px]">{{ post.title }}</span>
      <span
        :class="[
          'w-[8px] h-[8px] rounded-full',
          post.releaseStatus === 1 ? 'bg-green-500' : 'bg-red-500'
        ]"
      ></span>
    </div>
    <div class="text-[12px] text-gray-400">
      {{ new Date(post.createTime).toLocaleString() }} 创作
    </div>
  </div>
          </div>

          <div
            @click="goToDetail(post.id)"
            class="text-[13px] text-gray-600 line-clamp-2"
          >
            {{ post.prompt }}
          </div>

          <div class="flex justify-around text-[13px] text-gray-500 mt-[8px]">
            <div
    @click.stop="toggleRelease(post)"
    class="flex items-center space-x-1"
  >
    <van-icon :name="post.releaseStatus === 1 ? 'closed-eye' : 'guide-o'" />
    <span>{{ post.releaseStatus === 1 ? '隐藏' : '公开' }}</span>
  </div>
            <div
              @click.stop="sharePost(post.id)"
              class="flex items-center space-x-1"
            >
              <van-icon name="share-o" />
              <span>分享</span>
            </div>
            <div
              @click.stop="downloadMusic(post.musicUrl, post.title + '.mp3')"
              class="flex items-center space-x-1"
            >
              <van-icon name="down" />
              <span>下载</span>
            </div>
          </div>
        </div>
        <div
          v-if="loading"
          class="text-center text-gray-400 text-[13px] mt-[12px]"
        >
          正在加载更多...
        </div>
        <div
          v-if="!hasMore && songList.length > 0"
          class="text-center text-gray-400 text-[13px] mt-[12px]"
        >
          没有更多作品了
        </div>
      </div>

      <!-- 模型 tab -->
      <div v-else class="text-center text-gray-400 text-[14px] mt-[24px]">
        暂无模型
      </div>
    </div>
  </div>
</template>
