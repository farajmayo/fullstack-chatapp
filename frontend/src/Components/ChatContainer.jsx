import { useEffect, useRef } from "react"
import { useChatStore } from "../store/useChatStore"
import MessageSkeleton from "./skeletons/MessageSkeleton"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import { useAuthStore } from "../store/store"
import { formatMessageTime } from "../libs/utils"

const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser, subsribeToMessages, unSubscribeFromMessages } = useChatStore()
    const { authUser } = useAuthStore()

    const messageEndRef = useRef()


    useEffect(() => {
        getMessages(selectedUser._id)

        subsribeToMessages()


        return () => unSubscribeFromMessages()
    }, [selectedUser._id, getMessages, unSubscribeFromMessages, subsribeToMessages])

    useEffect(() => {
        if (messageEndRef.current && messages) {

            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])


    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>)
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />


            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        ref={messageEndRef}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    src={
                                        message.senderId === authUser._id ?
                                            authUser.profilePic || "/avatar.svg" :
                                            selectedUser.profilePic || "/avatar.svg"
                                    }
                                    alt="profilePic" />
                            </div>
                        </div>
                        <div className="chat-header">
                            <time className="text-xs opacity-50">{formatMessageTime(message.createdAt)}</time>
                        </div>
                        <div className="chat-bubble">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}

            </div>

            <MessageInput />

        </div>
    )
}

export default ChatContainer
