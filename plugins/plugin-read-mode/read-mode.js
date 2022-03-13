import {useStorage} from '@vueuse/core';
import {computed, inject, onMounted, onUnmounted, provide, watch} from 'vue';
import {defineClientAppSetup} from '@vuepress/client';

export const readModeSymbol = Symbol('readMode');

export const useReadMode = () => {
  const isReadMode = inject(readModeSymbol);
  console.log(isReadMode, readModeSymbol);
  return isReadMode;
};

export default defineClientAppSetup(() => {
  const readStorage = useStorage('vuepress-plus-read-mode', false);
  const isReadMode = computed({
    get() {
      return readStorage.value;
    },
    set(value) {
      readStorage.value = value;
    },
  });
  provide(readModeSymbol, isReadMode);
  updateHtmlReadClass(isReadMode);
});

export const updateHtmlReadClass = isReadMode => {
  const update = (value = isReadMode.value) => {
    const htmlEl = window.document.querySelector('html');
    htmlEl.classList.toggle('read-mode', value);
  };
  onMounted(() => {
    watch(isReadMode, update, {immediate: true});
  });
  onUnmounted(() => update());
};
