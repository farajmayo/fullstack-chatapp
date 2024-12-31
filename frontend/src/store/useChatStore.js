import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../libs/axios"
import { useAuthStore } from "./store"

export const useChatStore = create((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagingLoading: false,


    getUser: async () => {
        set({ isUserLoading: true })
        try {
            const response = await axiosInstance.get('/message/users')
            set({ users: response.data })
        } catch (error) {
            toast.error("Failed to fetch users")
            console.error(error.message)
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagingLoading: true })
        try {
            const response = await axiosInstance.get(`/message/${userId}`)
            set({ messages: response.data })
        } catch (error) {
            toast.error("Failed to fetch messages")
            console.error(error.message)
        } finally {
            set({ isMessagingLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        try {
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, response.data] })



        } catch (error) {
            toast.error("Failed to send messages")
            console.error(error.message)
        }
    },


    subsribeToMessages: () => {
        const { selectedUser } = get()

        if (!selectedUser) return

        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id

            if (!isMessageSentFromSelectedUser) return
            set({ messages: [...get().messages, newMessage] })
        })
    },

    unSubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket

        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))