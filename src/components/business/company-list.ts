import { defineComponent, createVNode } from 'vue';
import { Popup } from 'vant';

export const comList = defineComponent({
  name: 'robot-company-listx',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup(props: iKeyString, {
    emit,
    attrs,
    slots
  }) {
    const updateShow = (show: boolean) => emit('update:show', show);

    const renderCompanyList = () => {
      return createVNode('div', {}, ['xxx']);
    };
    
    return () => createVNode(Popup, {
      show: props.show,
      'onUpdate:show': updateShow
    },{
      default: () => [renderCompanyList()]
    });
  }
});