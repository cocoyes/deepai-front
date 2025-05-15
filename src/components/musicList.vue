<template>
  <div>
    <van-divider>音乐列表</van-divider>

    <!-- 加载中显示 -->
    <van-loading
      v-if="isLoading"
      type="spinner"
      color="#1989fa"
      size="24px"
      vertical
    >音乐生成中...</van-loading>

    <!-- 音乐列表 -->
    <van-cell-group v-else-if="musicList.length > 0">
      <van-cell
        v-for="item in musicList"
        :key="item.id"
        :title="item.title"
        is-link
        @click="openMusicDialog(item)"
      >
        <template #icon>
          <van-image
            :src="item.logo"
            width="40px"
            height="40px"
            round
            fit="cover"
            class="mr-[10px]"
          />
        </template>
        <template #right-icon>
          <van-icon name="play-circle-o" size="24" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-empty v-else description="暂无音乐数据" />

    <!-- 音乐播放弹窗 -->
    <van-dialog
      v-model:show="showDialog"
      :title="selectedMusic?.title"
      show-cancel-button
      confirm-button-text="关闭"
      close-on-click-overlay
      class="custom-music-dialog"
    >
      <!-- 歌词 -->
      <div class="p-4 max-h-[200px] overflow-y-auto whitespace-pre-line text-sm text-gray-700">
        {{ selectedMusic?.lyrics || "暂无歌词" }}
      </div>

      <!-- 播放控制 -->
      <div class="flex flex-col items-center mt-4 px-4">
        <!-- 播放进度 -->
        <div class="w-full text-center text-xs text-gray-500 mb-1">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
        <van-slider
          v-model="sliderValue"
          :max="duration"
          @change="onSliderChange"
        />
        <div class="mt-4">
          <van-icon
            :name="isPlaying ? 'pause-circle-o' : 'play-circle-o'"
            size="36"
            @click="togglePlay"
          />
        </div>
      </div>

      <!-- 音频元素 -->
      <audio
        ref="audioRef"
        :src="selectedMusic?.musicUrl"
        @ended="onMusicEnded"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
      />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch,nextTick, onBeforeUnmount } from "vue";
import { showToast } from "vant";
import { queryMusicProgress } from "@/api/music";

interface Props {
  id: string | number;
}
const props = defineProps<Props>();

const isLoading = ref(true);
const musicList = ref<{ id: number; title: string; logo: string; musicUrl: string; lyrics?: string }[]>([]);
const currentMusicUrl = ref("");
const audioRef = ref<HTMLAudioElement | null>(null);
const showDialog = ref(false);
const selectedMusic = ref<{ id: number; title: string; logo: string; musicUrl: string; lyrics?: string } | null>(null);

// 播放状态
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const sliderValue = ref(0);

let pollingTimer: NodeJS.Timeout | null = null;

function openMusicDialog(item: typeof musicList.value[0]) {
  selectedMusic.value = item;
  currentMusicUrl.value = item.musicUrl;
  showDialog.value = true;
  // 自动播放
  nextTick(() => {
    togglePlay();
  });
}

function togglePlay() {
  const audio = audioRef.value;
  if (!audio) return;

  if (isPlaying.value) {
    audio.pause();
    isPlaying.value = false;
  } else {
    audio.play().then(() => {
      isPlaying.value = true;
      showToast(`正在播放：${selectedMusic.value?.title}`);
    }).catch(err => {
      console.error("播放失败", err);
      showToast("播放失败，请重试");
    });
  }
}

function onTimeUpdate() {
  const audio = audioRef.value;
  if (audio) {
    currentTime.value = audio.currentTime;
    sliderValue.value = audio.currentTime;
  }
}

function onLoadedMetadata() {
  const audio = audioRef.value;
  if (audio) {
    duration.value = audio.duration;
  }
}

function onSliderChange(val: number) {
  const audio = audioRef.value;
  if (audio) {
    audio.currentTime = val;
    currentTime.value = val;
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function onMusicEnded() {
  isPlaying.value = false;
  currentTime.value = 0;
  sliderValue.value = 0;
  showToast("播放结束");
}

async function fetchMusicList(id: string | number) {
  const res = await queryMusicProgress({ orderId: id });

  if (res.status !== 6) {
    isLoading.value = true;
    return;
  }

  isLoading.value = false;
  musicList.value = (res.musics || []).map((item, index) => ({
    id: index,
    title: item.title,
    logo: item.imageUrl,
    musicUrl: item.musicUrl,
    lyrics: item.lyrics || "", // 假设返回包含 lyrics 字段
  }));

  stopPolling();
}

function startPolling(id: string | number) {
  stopPolling();
  pollingTimer = setInterval(() => {
    fetchMusicList(id);
  }, 5000);
  fetchMusicList(id);
}

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

watch(() => props.id, newId => {
  musicList.value = [];
  isLoading.value = true;
  startPolling(newId);
}, { immediate: true });

onBeforeUnmount(() => {
  stopPolling();
});
</script>

<style scoped>
.custom-music-dialog {
  max-width: 90%;
}
</style>
