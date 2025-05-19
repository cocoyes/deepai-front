<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { showSuccessToast, showFailToast } from "vant";
import { uploadModel, getUserModelDetail } from "@/api/train";
import Recorder from "recorder-core";
import "recorder-core/src/engine/wav";
import "recorder-core/src/extensions/waveview";

// Component options
defineOptions({ name: "TrainModel" });

// State
const modelName = ref("");
const file = ref<File | null>(null);
const recordingMode = ref<number>(0); // 0 表示上传音频，1 表示录音
const recordStatus = ref("idle"); // idle | recording | done
const recordingBlob = ref<Blob | null>(null);
const trainingId = ref<string | null>(null);
const trainingResult = ref("");
const timer = ref<ReturnType<typeof setInterval> | null>(null);
const recwave = ref(null);

// Recording variables
let rec: any = null;
let wave: any = null;

// File upload handler
function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) file.value = files[0];
}

// Recording functions
const recOpen = () => {
  rec = Recorder({
    type: "wav",
    sampleRate: 16000,
    bitRate: 16,
    onProcess: (buffers: any[], powerLevel: number, bufferSampleRate: number) => {
      if (wave) wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
    },
  });

  rec.open(
    () => {
      recordStatus.value = "idle";
      if (recwave.value) {
        wave = Recorder.WaveView({ elem: recwave.value });
      }
    },
    (msg: string, isUserNotAllow: boolean) => {
      showFailToast(isUserNotAllow ? "未授权麦克风" : `无法录音: ${msg}`);
    }
  );
};

const startRecording = () => {
  if (!rec) {
    recOpen();
    setTimeout(startRecording, 100); // Wait for recorder to initialize
    return;
  }
  rec.start();
  recordStatus.value = "recording";
};

const stopRecording = () => {
  if (!rec) {
    showFailToast("录音未初始化");
    return;
  }
  rec.stop(
    (blob: Blob, duration: number) => {
      recordingBlob.value = blob;
      file.value = new File([blob], "record.wav", { type: "audio/wav" });
      recordStatus.value = "done";
      rec.close();
      rec = null;
    },
    (err: string) => {
      showFailToast(`录音失败: ${err}`);
      rec.close();
      rec = null;
    }
  );
};

// Training submission
async function submitTraining() {
  if (!modelName.value) {
    showFailToast("请输入模型名称");
    return;
  }
  if (!file.value) {
    showFailToast("请上传音频或录制音频");
    return;
  }

  const formData = new FormData();
  formData.append("modelName", modelName.value);
  formData.append("file", file.value);

  try {
    const res = await uploadModel(formData);
    showSuccessToast("上传成功，开始训练");
    trainingId.value = res;
    startPolling();
  } catch {
    showFailToast("上传失败");
  }
}

// Training status polling
async function checkTrainingStatus() {
  if (!trainingId.value) return;
  try {
    const res = await getUserModelDetail({ modelId: trainingId.value });
    trainingResult.value = res.status === 2 ? "训练完成 ✅" : "训练中... ⏳";
    if (res.status === 2 && timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  } catch {
    trainingResult.value = "查询失败";
  }
}

function startPolling() {
  trainingResult.value = "训练中... ⏳";
  timer.value = setInterval(checkTrainingStatus, 3000);
}

// Cleanup
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
  if (rec) {
    rec.close();
    rec = null;
  }
});
</script>

<template>
  <div class="px-[14px] py-[20px]">
    <van-field
      v-model="modelName"
      label="模型名称"
      placeholder="请输入模型名称"
      class="mb-[10px]"
    />

    <van-tabs v-model:active="recordingMode" :swipeable="false">
      <van-tab title="上传音频">
        <input type="file" accept=".mp3,.wav" @change="onFileChange" />
      </van-tab>
      <van-tab title="录制音频">
        <div class="text-center my-[10px]">
          <div
            class="wave-container"
            style="border: 1px solid #ccc; display: inline-block; vertical-align: bottom;"
          >
            <div style="height: 100px; width: 300px" ref="recwave"></div>
          </div>
          <div class="mt-[10px]">
            <van-button
              type="primary"
              @click="startRecording"
              v-if="recordStatus === 'idle'"
            >
              开始录音
            </van-button>
            <van-button
              type="danger"
              @click="stopRecording"
              v-if="recordStatus === 'recording'"
            >
              停止录音
            </van-button>
            <div v-if="recordStatus === 'done'" class="mt-[10px] text-green-600">
              录音完成 ✅
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <van-button class="mt-[20px]" type="primary" block @click="submitTraining">
      立即训练
    </van-button>

    <div class="mt-[20px] text-center text-sm text-[#1989fa]">
      {{ trainingResult }}
    </div>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: block;
  margin: 10px auto;
}
.wave-container {
  margin: 10px auto;
}
</style>