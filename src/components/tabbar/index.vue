<template>
  <van-tabbar v-model="active" :placeholder="true" :route="true" fixed>
    <van-tabbar-item
      v-for="(item, index) in tabbarData"
      :key="index"
      :icon="item.icon"
      :to="item.to"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const active = ref(0);
const tabbarData = reactive([
  {
    icon: "wap-home-o",
    title: "主页",
    to: {
      name: "Index"
    }
  },
  {
    icon: "fire-o",
    title: "创作",
    to: {
      name: "Music"
    }
  },
  {
    icon: "user-o",
    title: "我的",
    to: {
      name: "Profile"
    }
  }
]);
</script>
