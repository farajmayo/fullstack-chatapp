import ChatContainer from "../Components/ChatContainer"
import NoChatSelected from "../Components/NoChatSelected"
import Sidebar from "../Components/Sidebar"
import { useChatStore } from "../store/useChatStore"

const HomePage = () => {
  const { selectedUser } = useChatStore()


  return (
    <div className="h-full-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg max-w-6xl w-full  h-[calc(100vh-5rem)]">
          <div className="flex h-full overflow-hidden rounded-lg">
            <Sidebar />

            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>

        </div>
      </div>


    </div>
  )
}

export default HomePage
