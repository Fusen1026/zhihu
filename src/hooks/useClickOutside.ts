import { ref, onMounted, onUnmounted, Ref } from 'vue'

const useClickOutside = (ElementRef: Ref<HTMLElement | null>) => {
  const isClickOutside = ref(false)
  const clickOutside = (e: MouseEvent) => {
    if(ElementRef.value) {
      if(!ElementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = true
      }else {
        isClickOutside.value = false
      }
    }
  }
  onMounted(() => {
    document.body.addEventListener('click', clickOutside)
  })
  onUnmounted(() => {
    document.body.removeEventListener('click', clickOutside)
  })
  return isClickOutside
}

export default useClickOutside