<script setup lang="ts">
import { ref } from "vue";
import { showFailToast, showSuccessToast } from "vant";
import MusicList from "@/components/musicList.vue";
import { createMusic } from "@/api/music";
defineOptions({ name: "TextToMusic" });

const activeTab = ref(0); // 0: AI模型，1: 自定义模型
const prompt = ref("");

const showModelSelector = ref(false);
const musicGroupId = ref<string | null>(null);

interface CreateMusic {
  prompt: string;
  modelId: string;
}
async function generateMusic() {
  console.log("click")
  if (!prompt.value) {
     console.log("click2")
    showFailToast("请输入提示词");
    return;
  }

  if (activeTab.value === 1 && !selectedModel.value) {
    showFailToast("请选择自定义模型");
    return;
  }

  const params: CreateMusic = {
    prompt: prompt.value,
    modelId:
      activeTab.value === 0
        ? "" // 默认AI模型的ID
        : selectedModel.value!.id
  };
  const orderId = await createMusic(params);
  //313079579228540928
  //const orderId ="313079579228540928" ;
  musicGroupId.value = orderId.toString();
   console.log("click3")
}

const selectedModel = ref<{ id: string; modelName: string } | null>(null);
const selectedModelName = ref(""); // 用于显示在字段中
const customModels = [

];
function onSelectModel({ name, index }: { name: string; index: number }) {
  const model = customModels[index];
  selectedModel.value = model;
  selectedModelName.value = model.modelName;
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
          v-model="selectedModelName"
          label="选择模型"
          is-link
          readonly
          placeholder="请选择训练好的声音模型"
          @click="showModelSelector = true"
          class="my-[10px]"
        />

        <van-action-sheet
          v-model:show="showModelSelector"
          :actions="
            customModels.map((item, index) => ({
              name: item.modelName,
              index
            }))
          "
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
