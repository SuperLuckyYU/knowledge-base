import { ref } from 'vue';
import { knowledgeFlag } from '@/constants/index';
import { getRanking } from '@/services/myKnowledge/knowledge';

const useHotRanking = () => {
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      customRender: ({ index }: { index: number }) => {
        return index + 1;
      },
    },
    {
      title: '条目',
      dataIndex: 'knowledgeName',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'knowledgeFlag',
      key: 'knowledgeFlag',
      align: 'center',
      customRender: ({ text }: { text: number }) => {
        return knowledgeFlag[text as keyof typeof knowledgeFlag];
      },
    },
    {
      title: '分类',
      dataIndex: 'knowledgeTypeName',
      key: 'knowledgeTypeName',
      align: 'center',
      customRender: ({ text }: { text: string }) => {
        if (text) {
          return text.split(', ').join('-');
        }
        return '';
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      align: 'center',
    },
    {
      title: '评价',
      dataIndex: 'evaluate',
      align: 'center',
    },
    {
      title: '浏览量',
      dataIndex: 'browseNum',
      align: 'center',
    },
  ];

  const topData = ref<{ knowledgeName: string }[]>([]);

  const fetchTopData = async () => {
    const { records } = await getRanking();
    topData.value = records;
  };

  return {
    columns,
    topData,
    fetchTopData,
  };
};

export default useHotRanking;
