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
          <van-icon name="play-circle-o" size="24" @click.stop="playMusic(item)" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty v-else description="暂无音乐数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { showToast } from "vant";

interface Props {
  id: string | number;
}
const props = defineProps<Props>();

// 模拟接口返回的音乐数据
const musicList = ref<{ id: number; title: string; logo: string }[]>([]);

function fetchMusicList(id: string | number) {
  // TODO: 替换成你的实际接口请求逻辑
  console.log("Fetching music list for id:", id);
  if (id) {
    // 假设返回的是与 id 有关的音乐数据
    musicList.value = [
      { id: 1, title: `音乐1 - ${id}`, logo: "https://img.yzcdn.cn/vant/logo.png" },
      { id: 2, title: `音乐2 - ${id}`, logo: "https://img.yzcdn.cn/vant/logo.png" },
    ];
  } else {
    musicList.value = [];
  }
}

function playMusic(item: { id: number; title: string }) {
  showToast(`播放音乐：${item.title}`);
}

// 监听 props.id 变化并加载数据
watch(
  () => props.id,
  (newId) => {
    fetchMusicList(newId);
  },
  { immediate: true }
);
</script>
