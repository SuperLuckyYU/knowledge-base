import { Modal, message } from 'ant-design-vue';
import { h } from 'vue';
import { copyText } from '@/plugins/clipboard';
import { knowledgeFlag } from '@/constants/index';

interface InfoType {
  id: string;
  title: string;
  type: string;
  endTime: string;
}

export default function useShare() {
  const share = (info: InfoType) => {
    const { id, title, type, endTime } = info;
    Modal.info({
      title: '分享',
      okText: '确认',
      maskClosable: true,
      content: h('div', {}, [
        h('p', { class: 'mt15' }, [h('span', '标题：'), h('span', { class: 'link' }, title)]),
        h(
          'p',
          { class: 'mt15' },
          `类型：${
            knowledgeFlag[type as unknown as keyof typeof knowledgeFlag]
          }     有效期：${endTime}`,
        ),
      ]),
      onOk() {
        copyText(`${window.location.protocol}${window.location.host}/${window.location.pathname}#/myKnowledge/article-detail?id=${id}`)
          .then(() => {
            message.success('文章链接也复制到您的剪切板!');
          })
          .catch(() => {
            message.error('复制失败');
          });
      },
    });
  };

  return {
    share,
  };
}
