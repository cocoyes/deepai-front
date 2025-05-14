<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { showFailToast } from "vant";
import { getMusicDetail } from "@/api/music";

const route = useRoute();
const musicId = route.params.id as string;

const musicTitle = ref("");
const artist = ref("");
const lyrics = ref("");
const audioUrl = ref("");
const coverUrl = ref("");
const audioRef = ref<HTMLAudioElement | null>(null);

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

// 加载音乐详情
onMounted(async () => {
  try {
    console.log("songId=", musicId);
    const res = await getMusicDetail({ songId: musicId });
    musicTitle.value = res.title;
    artist.value = res.creatorNickName;
    lyrics.value = res.lyrics;
    audioUrl.value = res.musicUrl;
    coverUrl.value = res.imageUrl;
  } catch (e) {
    showFailToast("加载音乐失败");
  }
});

// 播放 / 暂停切换
function togglePlay() {
  const audio = audioRef.value;
  if (!audio) return;
  if (isPlaying.value) {
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying.value = !isPlaying.value;
}

// 监听播放进度
function onTimeUpdate() {
  currentTime.value = audioRef.value?.currentTime || 0;
  duration.value = audioRef.value?.duration || 0;
}

// 拖动进度条
function onSeek(event: Event) {
  const value = +(event.target as HTMLInputElement).value;
  if (audioRef.value) {
    audioRef.value.currentTime = value;
    currentTime.value = value;
  }
}

const formatTime = (time: number) => {
  const m = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

function copyLyrics() {
  if (!lyrics.value) return;

  const textarea = document.createElement("textarea");
  textarea.value = lyrics.value;

  // 设置样式防止页面跳动
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  textarea.style.top = "0"; // 固定顶部可防止部分浏览器跳动
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  const selectedRange = document.getSelection()?.rangeCount
    ? document.getSelection()?.getRangeAt(0)
    : null;

  textarea.select();

  try {
    const success = document.execCommand("copy");
    if (success) {
      showFailToast("歌词已复制");
    } else {
      showFailToast("复制失败");
    }
  } catch (e) {
    showFailToast("复制失败");
  }

  document.body.removeChild(textarea);

  // 恢复原有选区（可选，防止影响用户正在选中的内容）
  if (selectedRange) {
    const selection = document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(selectedRange);
  }
}

// 下载歌曲
function downloadSong() {
  if (!audioUrl.value) {
    showFailToast("暂无音频可下载");
    return;
  }

  // 拼接 attname 参数让浏览器触发下载行为
  const encodedFilename = encodeURIComponent(
    `${musicTitle.value || "audio"}.mp3`
  );

  // 判断是否已有参数
  const separator = audioUrl.value.includes("?") ? "&" : "?";

  // 构造七牛云专用下载链接
  const downloadUrl = `${audioUrl.value}${separator}attname=${encodedFilename}`;

  // 触发下载
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${musicTitle.value || "audio"}.mp3`;
  document.body.appendChild(link); // Safari兼容性
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div
    class="relative min-h-screen bg-cover bg-center text-white"
    :style="{ backgroundImage: `url(${coverUrl})` }"
  >
    <!-- 背景遮罩层 -->
    <div class="absolute inset-0 bg-black bg-opacity-60"></div>

    <!-- 顶部固定内容 -->
    <div
      class="fixed top-0 left-0 right-0 z-20 p-6 bg-black bg-opacity-60 backdrop-blur"
    >
      <h2 class="text-2xl font-bold mb-1">{{ musicTitle }}</h2>
      <p class="text-gray-300 text-sm">创作人：{{ artist }}</p>

      <audio
        ref="audioRef"
        :src="audioUrl"
        @timeupdate="onTimeUpdate"
        @ended="isPlaying = false"
      />

      <div class="flex items-center justify-between my-4">
        <van-icon
          :name="isPlaying ? 'pause-circle-o' : 'play-circle-o'"
          size="36"
          color="#ffffff"
          @click="togglePlay"
        />
        <span class="text-sm"
          >{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span
        >
      </div>

      <!-- 自定义科技感进度条 -->
      <div
        class="relative w-full h-3 mt-2 rounded-full bg-gray-600 overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all duration-200"
          :style="{ width: `${(currentTime / duration) * 100}%` }"
        ></div>
        <input
          type="range"
          min="0"
          :max="duration"
          step="0.1"
          v-model="currentTime"
          @input="onSeek"
          class="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer"
        />
      </div>
      <!-- 文字按钮 -->
      <!-- <div class="flex justify-center gap-4 mt-6">
  <button
    @click="copyLyrics"
    class="px-4 py-1 text-sm font-semibold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300"
  >
    复制歌词
  </button>
  <button
    @click="downloadSong"
    class="px-4 py-1 text-sm font-semibold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300"
  >
    下载歌曲
  </button>
</div> -->
    </div>

    <!-- 歌词滚动区域，添加 padding-top 以避免被顶部内容遮挡 -->
    <div
      class="relative z-10 px-6 overflow-y-auto"
      :style="{ height: 'calc(100vh - 200px - 60px)', paddingTop: '200px' }"
    >
      <div>
        <h3 class="text-lg font-semibold mb-2">歌词</h3>
        <pre class="whitespace-pre-wrap text-white">{{ lyrics }}</pre>
      </div>
    </div>
  </div>
</template>
