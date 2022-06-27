<template>
  <a-select
    v-model:value="labelId"
    :options="labelOptions"
    placeholder="请选择标签"
    style="width: 200px"
    show-search
    allow-clear
    :filter-option="false"
    @search="searchLabel"
    @change="handleChange"
  ></a-select>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted } from 'vue';
import { getLabelList } from '@/services/systemSetter/label';
import { debounce, cloneDeep } from 'lodash-es';

interface Props {
  value: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:value']);

const { value } = toRefs(props);
const labelOptions = ref<{ label: string; value: string }[]>([]);
const labelId = ref(cloneDeep(value.value));

const fetchData = async (searchName?: string) => {
  const params: { labelName?: string } = {};
  if (searchName) {
    params.labelName = searchName;
  }
  const { records } = await getLabelList(params);
  labelOptions.value = records.map((item) => ({ value: item.id, label: item.labelName }));
};

const searchLabel = debounce((value) => {
  fetchData(value);
}, 300);

onMounted(() => {
  fetchData();
});

const handleChange = (value: string) => {
  labelId.value = value;
  emit('update:value', labelId);
};
</script>
