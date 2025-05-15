<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getOpenReleaseSongs, type UserSongWithNickName } from "@/api/music";

const songs = ref<UserSongWithNickName[]>([]);
const router = useRouter();

const fetchSongs = async () => {
  try {
    const res = await getOpenReleaseSongs();
    songs.value = res;
  } catch (err) {
    console.error("获取推荐音乐失败", err);
  }
};

onMounted(fetchSongs);

const goToDetail = (id: string) => {
  router.push(`/play/${id}`);
};
</script>

<template>
  <div class="p-4 sm:p-6 md:p-10">
  <!-- 页面标题 -->
<h2
  class="text-3xl md:text-4xl font-extrabold text-center mb-8
         text-gray-900 dark:text-gray-100 tracking-wide"
>
  <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-[-12px] mb-6">
  Discover the sound that moves you
</p>
</h2>

    <!-- 网格音乐展示 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
      <div
        v-for="song in songs"
        :key="song.id"
        class="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1e1e1e] cursor-pointer group"
        @click="goToDetail(song.id)"
      >
        <!-- 封面图 -->
        <div class="relative">
          <img
            :src="song.imageUrl || '/default-cover.jpg'"
            alt="封面"
            class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <!-- 播放图标 -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300"
          >
            <svg
              class="w-10 h-10 text-white opacity-0 group-hover:opacity-100"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <!-- 音乐信息 -->
        <div class="p-3">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {{ song.title }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            by {{ song.nickName }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
