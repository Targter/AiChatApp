import React from 'react';
import { Bot,  User,Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSidebarStore, useUserStore} from '../store/useStore';
export function Navbar() {
  // const { user } = useStore();
console.log("NAVBAR CALLING")
const toggleSidebar = useSidebarStore((state)=>state.toggleSidebar)
const user = useUserStore((state)=>({
  userId:state.userId,
   username: state.username,
  email: state.email,
  subscriptionType: state.subscriptionType,
  subscriptionEndDate:state.subscriptionEndDate
  

}))
const formattedEndDate = user.subscriptionEndDate
? new Date(user.subscriptionEndDate).toLocaleDateString()
: "N/A";
  return (
    <nav className="bg-[#414141] border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section: Sidebar Toggle & Logo */}
          <div className="flex">
            <div className="mr-11 flex items-center cursor-pointer" onClick={toggleSidebar}>
              <Menu />
            </div>
            
            <a href="/" className='flex items-center'><div className="flex-shrink-0 flex items-center">
              <Bot className="h-8 w-8 text-gray-900" />
             <span className="ml-2 text-xl font-bold text-gray-300">Ab Bot</span></div></a>
            
          </div>

          {/* Right Section: User Info */}
          <div className="flex items-center space-x-6">
            {/* Subscription Info */}
            <div className="text-gray-400 text-sm">
              <p>
                <span className="font-semibold text-white">Plan:</span> {user.subscriptionType || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-white">Expires:</span> {formattedEndDate}
              </p>
            </div>

            {/* User Info */}
            <div className="flex items-center">
              <User className="h-6 w-6 text-gray-400 hover:text-gray-200" />
              <span className="ml-2 text-gray-400 hover:text-gray-200">{user.username}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}