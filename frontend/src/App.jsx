import Navbar from "./Components/Navbar"
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"
import SignInPage from "./Pages/SignInPage"
import SettingPage from "./Pages/SettingPage"
import ProfilePage from "./Pages/ProfilePage"
import { useAuthStore } from "./store/store"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useThemeStore } from "./store/useThemeStore"
const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  console.log("Online Users : ", onlineUsers)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])


  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" exact element={authUser ? <HomePage /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/signin" element={!authUser ? <SignInPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/signin" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
