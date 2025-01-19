import {memo, useEffect} from 'react'
import { ChatWindow } from '../components/ChatWindow'
import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar'
import { useSidebarStore } from '../store/useStore';
// import axios from 'axios';
import withAuthCheck from '../Wrapper/AuthApp';
// import { useNavigate } from 'react-router-dom';
const MemoizedNavbar:any = memo(Navbar);
const MemoizedSidebar = memo(Sidebar);
const MemoizedChatWindow:any = memo(ChatWindow);

// 
const Page1 = () => {
// const useNavigatee = useNavigate()
  const {isSidebarOpen} = useSidebarStore(); 
  // const Authfunction = async()=>{
  //   const response = await axios.get("http://localhost:3000/userAuth",{withCredentials:true})
  //   console.log(response)
  //   if(!response.data.authenticated) useNavigatee("/Login")
  // }
  // useEffect(()=>{
  //   Authfunction()

  // },[])

  return (
    <div className="min-h-screen bg-[#212121] text-white flex md:justify-center justify-end overflow-hidden">
            {/* <Navbar toggleSidebar={toggleSidebar} /> */}
            <MemoizedNavbar />
            <div className="pt-16 flex w-full">
           { isSidebarOpen && <MemoizedSidebar  />}
                <MemoizedChatWindow />
            </div>
          </div>
  )
}

export default withAuthCheck(Page1)