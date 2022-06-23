import { createApp } from 'vue'
export type MessageType = 'success' | 'error' | 'default'
import Message from '../components/Message.vue'

const createMessage = (type: string, message: string, timeout = 2000) => {
  const messageInstance = createApp(Message, {
    type,
    message
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount()
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage