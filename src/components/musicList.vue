<!-- components/MusicList.vue -->
<template>
  <div>
    <van-divider>音乐列表</van-divider>
    <van-cell-group v-if="musicList.length > 0">
      <van-cell
        v-for="item in musicList"
        :key="item.id"
        :title="item.title"
        is-link
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
          <van-icon
            name="play-circle-o"
            size="24"
            @click.stop="playMusic(item)"
          />
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty v-else description="暂无音乐数据" />
  </div>
  <audio ref="audioRef" :src="currentMusicUrl" @ended="onMusicEnded" />
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { showToast } from "vant";
import { queryMusicProgress } from "@/api/music";

interface Props {
  id: string | number;
}
const props = defineProps<Props>();

// 模拟接口返回的音乐数据
const musicList = ref<
  { id: number; title: string; logo: string; musicUrl: string }[]
>([]);

interface QueryMusic {
  orderId: string;
}
async function fetchMusicList(id: string | number) {
  // TODO: 替换成你的实际接口请求逻辑
  const queryRes = await queryMusicProgress({ orderId: id });
  console.log("queryRes=", queryRes);
  // 将 queryRes（UserOrderDetailVo[]）转换为页面所需结构
  // 将 musics 转换为适用于 UI 的格式
  musicList.value = (queryRes.musics || []).map((item, index) => ({
    id: index, // 没有唯一 ID 的话用 index 占位
    title: item.title,
    logo: item.imageUrl,
    musicUrl: item.musicUrl
  }));
}

const currentMusicUrl = ref("");
const audioRef = ref<HTMLAudioElement | null>(null);

function playMusic(item: {
  id: number;
  title: string;
  musicUrl: string;
  logo: string;
}) {
  currentMusicUrl.value = item.musicUrl;
  nextTick(() => {
    audioRef.value
      ?.play()
      .then(() => {
        showToast(`正在播放：${item.title}`);
      })
      .catch(err => {
        console.error("播放失败", err);
        showToast("播放失败，请重试");
      });
  });
}

function onMusicEnded() {
  showToast("播放结束");
}

// 监听 props.id 变化并加载数据
watch(
  () => props.id,
  newId => {
    fetchMusicList(newId);
  },
  { immediate: true }
);
</script>
