<template>
  <a-select
    v-model:value="projectId"
    :options="projectOptions"
    placeholder="请选择项目"
    style="width: 200px"
    show-search
    allow-clear
    :filter-option="false"
    @search="searchProject"
    @change="handleChange"
  ></a-select>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted } from 'vue';
import { getProjectList } from '@/services/systemSetter/project';
import { debounce, cloneDeep } from 'lodash-es';

interface Props {
  value: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:value']);

const { value } = toRefs(props);
const projectOptions = ref<{ label: string; value: string }[]>([]);
const projectId = ref(cloneDeep(value.value));

const fetchData = async (searchName?: string) => {
  const params: { itemName?: string } = {};
  if (searchName) {
    params.itemName = searchName;
  }
  const { records } = await getProjectList(params);
  projectOptions.value = records.map((item) => ({ value: item.id, label: item.itemName }));
};

const searchProject = debounce((value) => {
  fetchData(value);
}, 300);

onMounted(() => {
  fetchData();
});

const handleChange = (value: string) => {
  projectId.value = value;
  emit('update:value', projectId);
};
</script>
