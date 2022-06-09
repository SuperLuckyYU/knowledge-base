import { Modal, message } from 'ant-design-vue';
import { h } from 'vue';
import { copyText } from '@/plugins/clipboard';

export default function useShare() {
  const share = () => {
    Modal.info({
      title: '分享',
      okText: '确认',
      maskClosable: true,
      content: h('div', {}, [
        h('p', { class: 'mt15' }, [
          h('span', '标题：'),
          h(
            'span',
            { class: 'link' },
            '北京市海淀区人民政府关于公布本区征收农用地区片综合地价比例的通知',
          ),
        ]),
        h('p', { class: 'mt15' }, '类型：法律法规     有效期：永久有效'),
      ]),
      onOk() {
        copyText('http://localhost:3000/#/myKnowledge/knowledge')
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
