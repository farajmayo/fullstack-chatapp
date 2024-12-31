import { useState } from "react"
import { useAuthStore } from "../store/store"
import { Camera, Mail, User } from "lucide-react"
const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [selectedImg, setSelectedImg] = useState(null)


  const handleImageUpload = async (e) => {

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image)
      await updateProfile({ profilePic: base64Image })
    }
  }

  return (
    <div className="h-full-screen pt-20">
      <div className="mx-auto max-w-2xl p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your Profile Information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.svg"}
                alt="profile"
                className="size-32 rounded-full object-cover borer-4"
              />
              <label htmlFor="avatar-upload"
                className={`
                absolute bottom-0 right-0 
                cursor-pointer bg-base-content hover:scale-105
                p-2 rounded-full transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}>
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Updating Profile" : "Click The Camera Icon To Update Profile"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1 5">
              <div className="flex items-center text-sm gap-2 text-zinc-400">
                <User className="w-4 -4" />
                Full Name
              </div>
              <p className="px-4 py-2 5 bg-base-200 rounded-lg border cursor-not-allowed">
                {authUser.fullName}
              </p>
            </div>
            <div className="space-y-1 5">
              <div className="flex items-center text-sm gap-2 text-zinc-400">
                <Mail className="w-4 -4" />
                Email Address
              </div>
              <p className="px-4 py-2 5 bg-base-200 rounded-lg border cursor-not-allowed">
                {authUser.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information            </h2>
            <div className="text-sm space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py2">
                <span>Account Status </span>
                <span className="text-green-500 cursor-not-allowed">Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ProfilePage
