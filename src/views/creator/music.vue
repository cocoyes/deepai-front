<script setup lang="ts">
import { ref } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import MusicList from "@/components/musicList.vue";
defineOptions({ name: "TextToMusic" });

const activeTab = ref(0); // 0: AI模型，1: 自定义模型
const prompt = ref("");
const selectedModel = ref(""); // 自定义模型选项
const showModelSelector = ref(false);
const customModels = ["模型A", "模型B", "模型C"]; // 假数据，可替换为接口请求数据
const musicGroupId = ref<string | null>(null);
function generateMusic() {
  if (!prompt.value) {
    showFailToast("请输入提示词");
    return;
  }

  if (activeTab.value === 1 && !selectedModel.value) {
    showFailToast("请选择自定义模型");
    return;
  }
  musicGroupId.value=prompt.value;
  // 发起请求逻辑
  showSuccessToast(`正在生成音乐`);
}
function onSelectModel({ name, index }: { name: string; index: number }) {
  console.log("choose", name, index);
  selectedModel.value = customModels[index];
  showModelSelector.value = false;
}
</script>

<template>
  <div class="px-[10px] py-[10px]">
    <van-tabs v-model:active="activeTab">
      <van-tab title="AI模型">
        <van-field
          v-model="prompt"
          label="提示词"
          placeholder="请输入生成音乐的提示语"
          clearable
          type="textarea"
          rows="6"
          class="my-[10px]"
        />
        
        <van-button type="primary" block @click="generateMusic">
          生成音乐
        </van-button>
      </van-tab>

      <van-tab title="自定义模型">
        <van-field
          v-model="selectedModel"
          label="选择模型"
          is-link
          readonly
          placeholder="请选择训练好的声音模型"
          @click="showModelSelector = true"
          class="my-[10px]"
        />
        <!-- 弹出 ActionSheet 选择模型 -->
        <van-action-sheet
          v-model:show="showModelSelector"
          :actions="customModels.map((name, index) => ({ name, index }))"
          @select="onSelectModel"
          cancel-text="取消"
        />
        <van-field
          v-model="prompt"
          label="提示词"
          placeholder="请输入生成音乐的提示语"
          clearable
          type="textarea"
          rows="6"
          class="my-[16px]"
        />

        <van-button type="primary" block @click="generateMusic">
          生成音乐
        </van-button>
      </van-tab>
    </van-tabs>
    <MusicList v-if="musicGroupId" :id="musicGroupId" class="mt-[20px]" />
  </div>
</template>
