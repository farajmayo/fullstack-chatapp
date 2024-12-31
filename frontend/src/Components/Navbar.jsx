import { useAuthStore } from '../store/store'
import { Link } from "react-router-dom"
import { LogOut, MessageSquare, Settings, User } from "lucide-react"

const Navbar = () => {
    const { authUser, signout } = useAuthStore()



    return <header
        className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'
    >
        <div className='container mx-auto h-16 px-4'>

            <div className="flex items-center justify-between h-full ">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                        <div className="size-9 rounded-lg flex items-center justify-center bg-primary/10">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-lg font-bold">Chatty</h1>
                    </Link>
                </div>

                <div className="flex item-center gap-2">
                    <Link to={"/settings"}
                        className={`btn btn-sm gap-2 transition-colors
                        `}
                    >
                        <Settings className='w-4 h-4' />
                        <span className='hidden sm:inline'>Setting</span>
                    </Link>

                    {authUser && (
                        <>
                            <Link to={"/profile"} className={`btn btn-sm gap-2`} >
                                <User className='size-5' />
                                <span className="hidden sm:inline">Profile</span>
                            </Link>

                            <button className={`flex gap-2 items-center`} onClick={signout} >
                                <LogOut className='size-5' />
                                <span className="hidden sm:inline">Logout</span>
                            </button>




                        </>

                    )}
                    {!authUser && (
                        <>
                            <Link to={"/signin"}
                                className={`btn btn-sm gap-2 transition-colors
                                `}
                            >
                                <User className='w-4 h-4' />
                                <span className='hidden sm:inline'>Sign In</span>
                            </Link>
                        </>
                    )}


                </div>
            </div>

        </div>

    </header>
}

export default Navbar
