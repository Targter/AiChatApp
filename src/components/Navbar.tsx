// import React from 'react';
import { Bot,  User,Menu } from 'lucide-react';
import { useSidebarStore} from '../store/useStore';
export function Navbar() {
  // const { user } = useStore();
console.log("NAVBAR CALLING")
const toggleSidebar = useSidebarStore((state)=>state.toggleSidebar)
  return (
    <nav className="bg-[#414141] border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex ">
          <div className='mr-11 flex items-center'  onClick={toggleSidebar} ><Menu /></div>
            <div className="flex-shrink-0 flex items-center">
              <Bot className="h-8 w-8 text-gray-900" />
              <span className="ml-2 text-xl font-bold text-gray-300">Ab Bot</span>
            </div>
          </div>
          {/* <div><PremiumBanner /></div> */}
          <div className="flex items-center">
        
            <div className="flex items-center">
              <User className="h-6 w-6 text-gray-400 hover:text-gray-200 " />
              <span className="ml-2 text-gray-400 hover:text-gray-200">Abhay</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}