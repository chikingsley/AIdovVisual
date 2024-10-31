import { create } from 'zustand'
import { type Message } from '@/lib/types/chat'

interface ChatStore {
  messages: Message[]
  isTyping: boolean
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setTyping: (isTyping: boolean) => void
}

export const useStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),
  setTyping: (isTyping) => set({ isTyping }),
}))