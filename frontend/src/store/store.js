import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8002" : "/";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,

    onlineUsers: [],

    authError: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data, authError: null });
            get().connectSocket()

        } catch (error) {
            console.error(error.message);
            set({ authUser: null, authError: error.response?.data?.message || "Failed to authenticate." });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true, authError: null });
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data, authError: null });
            toast.success("Account Created Successfully");
            get().connectSocket()

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Signup failed.";
            console.error(errorMsg);
            set({ authUser: null, authError: errorMsg });
            toast.error(errorMsg);
        } finally {
            set({ isSigningUp: false });
        }
    },

    signout: async () => {
        set({ isSigningUp: true, authError: null });
        try {
            await axiosInstance.get("/auth/signout");
            set({ authUser: null, authError: null });
            toast.success("Signed Out Successfully");
            get().disconnectSocket()
        } catch (error) {
            console.error(error.message);
            set({ authUser: null, authError: error.response?.data?.message || "Failed to sign out." });
            toast.error("Failed to sign out");
        } finally {
            set({ isSigningIn: false });
        }
    },

    signin: async (data) => {
        set({ isSigningIn: true, authError: null });
        try {
            const response = await axiosInstance.post("/auth/signin", data);
            set({ authUser: response.data, authError: null });
            toast.success("Signed In Successfully");
            get().connectSocket()
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Signin failed.";
            console.error(errorMsg);
            set({ authUser: null, authError: errorMsg });
            toast.error(errorMsg);
        } finally {
            set({ isSigningIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true, authError: null });
        try {
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: response.data, authError: null });
            toast.success("Profile Updated Successfully");
        } catch (error) {
            console.error(error.message || "Failed to update profile.");
            set({ authUser: null, authError: error.message });
            toast.error("Failed to update profile.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },


    connectSocket: () => {
        const { authUser } = get()

        if (!authUser || get().socket?.connected) return
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            },
        });


        socket.connect()
        set({ socket: socket })


        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connect) get().socket.disconnect()
    },
}));
