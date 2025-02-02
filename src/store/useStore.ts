

import { create } from 'zustand';
import { Chat, Message, User } from '../types';
import axios from 'axios';

import { toast } from "react-toastify";



// userData:
interface UserState {
  userId: string | null;
  username: string | null;
  email: string | null;
  subscriptionEndDate: null,
  subscriptionType: string;
  setUserData: (userData: { userId: string; username: string; email: string; subscriptionType: string ,subscriptionEndDate:Date}) => void;
  clearUserData: () => void;
}

// Create a Zustand store
export const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: null,
  subscriptionEndDate:null,
  email: null,
  subscriptionType: null,
  setUserData: (userData) => set({ ...userData }), // Set user data in store
  clearUserData: () => set({ userId: null, username: null, email: null, subscriptionType: null ,subscriptionEndDate:null}), // Clear user data
}));


interface State {
  chats: Chat[];

  currentChat: string | null;
  user: User;
  // image: string | null; // State for the image
  setUser: (user: User) => void;
  // addChat: (chat: Chat) => void; // Action to add a new chat
  setCurrentChat: (id: string | null) => void;
  addMessage: (
    chatId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  chats: [],
  currentChat: null,
  user: {
    id: '1',
    name: 'Abhay Bansal',
    isPremium: false,
  },
  setUser: (user) => set({ user }),

  // it initialize the chat with id . 
  createChat: (id: string, title: string) => {
    set((state) => ({
      chats: [...state.chats, { id, title, messages: [] }],
    }));
  },

  setCurrentChat: (id) => set({ currentChat: id }),
  // addMessage: async (chatId, message) => {

  //   // check user  is on trial subscription 
  //   const {subscriptionEndDate, subscriptionType } = useUserStore.getState();
  //   const isSubscriptionExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();

  //   // Check if the user is on a trial subscription
  //   if (subscriptionType === "trial" || isSubscriptionExpired) {
  //     toast.warn("Trial users cannot store chats. Please upgrade your subscription.", {
  //       position: "bottom-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //     // return; // Exit the function and prevent further execution
  //   }

  //   const { setTypingState } = useTypingEffect.getState(); // Access the typing effect store
  // setTypingState();
  // // message Updated

  //   set((state) => {
  //     let chat = state.chats.find((chat) => chat.id === chatId);
  //     if (!chat) {
  //       chat = { id: chatId, title: 'New Chat', messages: [] };
  //       state.chats.push(chat);
  //     }
  //     chat.messages.push({
  //       id: crypto.randomUUID(),
  //       content: message.content,
  //       role: message.role || 'user',
  //       timestamp: Date.now(),
  //     });
  //     return { chats: [...state.chats] };
  //   });

  //   try {
  //     const response = await fetch("https://llmchatwithimg-1073743898611.us-central1.run.app/chat", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         query: message.content,
  //         history: [], // Pass chat history if available
  //       }),
  //     });
  //     if (!response.ok) {
  //       console.error("API request failed:", response.status, response.statusText);
  //       return;
  //     }
  
  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();
      
  //     const assistantMessage = {
  //       id: crypto.randomUUID(),
  //       // content: response.data,
  //       content: "message from ai ",
  //       role: 'assistant',
  //       timestamp: Date.now(),
  //     };
  //     set((state) => {
  //       const chat = state.chats.find((chat) => chat.id === chatId);
  //       if (chat) {
  //         chat.messages.push(assistantMessage);
  //       }
  //       return { chats: [...state.chats] };
  //     });
  //     const userId = useUserStore.getState().userId;

  //     // Ensure the userId exists before proceeding with the request
  //     if (!userId) {
  //       console.error("User not authenticated, no userId found.");
  //       return;
  //     }
  //     const messagesToSend = [message, assistantMessage];
    
  //     if (subscriptionType !== "trial" && !isSubscriptionExpired) {
   
  //     const response = await axios.post(
  //       "http://localhost:3000/api/updateData",
  //       {
  //         userId,
  //         chatId: chatId,
  //         messages: messagesToSend,
  //       },
  //       {
  //         withCredentials: true, // Include cookies
  //       }
  //     );
  
  //     console.log("updatedResponse:", response);
  //   }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // },
  addMessage: async (chatId, message) => {
    console.log("📩 Sending Message...");
  
    const { subscriptionEndDate, subscriptionType, userId } = useUserStore.getState();
    const isSubscriptionExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();
  
    // Restrict chat updates for trial & expired users
    if (subscriptionType === "trial" || isSubscriptionExpired) {
      toast.warn("Trial users cannot store chats. Please upgrade your subscription.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
  
    const { setTypingState } = useTypingEffect.getState();
    setTypingState();
  
    // chatHistory:
    let chatHistory = [];

    // Add user message to chat
    set((state) => {
      let chat = state.chats.find((chat) => chat.id === chatId);
      if (!chat) {
        chat = { id: chatId, title: "New Chat", messages: [] };
        state.chats.push(chat);
      }
      chat.messages.push({
        id: crypto.randomUUID(),
        content: message.content,
        role: "user",
        timestamp: Date.now(),
      });
      return { chats: [...state.chats] };
    });
  
    try {
      // Call the streaming API
      const response = await fetch("https://llmchatwithimg-1073743898611.us-central1.run.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message.content,
          history: chatHistory, // Pass chat history if available
          top_k:3,
        }),
      });
  
      if (!response.ok) {
        console.error("API request failed:", response.status, response.statusText);
        return;
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      let assistantMessageId = crypto.randomUUID();
      let assistantMessageContent = "";
      let buffer = "";
  
      // Initialize assistant message in chat
      set((state) => {
        const chat = state.chats.find((chat) => chat.id === chatId);
        if (chat) {
          chat.messages.push({
            id: assistantMessageId,
            content: "",
            role: "assistant",
            timestamp: Date.now(),
          });
        }
        return { chats: [...state.chats] };
      });
  
      // Read streaming response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value);
        const lines = buffer.split("\n"); // Split multiple JSON objects
  
        buffer = lines.pop(); // Keep the last incomplete JSON
  
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const packet = JSON.parse(line);
  
            if (packet.type === "chunk") {
              assistantMessageContent += packet.content;
              set((state) => {
                const chat = state.chats.find((chat) => chat.id === chatId);
                if (chat) {
                  const assistantMessage = chat.messages.find((msg) => msg.id === assistantMessageId);
                  if (assistantMessage) {
                    assistantMessage.content = assistantMessageContent;
                  }
                }
                return { chats: [...state.chats] };
              });
            } else if (packet.type === "final") {
              console.log("✅ Final metadata received:", packet);
              chatHistory = packet.history; // Update history from response
            }
          } catch (error) {
            console.error("⚠️ Error parsing JSON:", error);
          }
        }
      }
  
      // Store message in database (if not trial/expired)
      if (subscriptionType !== "trial" && !isSubscriptionExpired) {
        const messagesToSend = [
          { role: "user", content: message.content },
          { role: "assistant", content: assistantMessageContent },
        ];
  
        await axios.post(
          "http://localhost:3000/api/updateData",
          { userId, chatId, messages: messagesToSend },
          { withCredentials: true }
        );
      }

      
    } catch (error) {
      console.error("🚨 Error:", error);
      toast.error("Failed to send message. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  },
  
  fetchChatHistory: async (chatId: string) => {
    const { userId, subscriptionType } = useUserStore.getState();

    // If user is on a trial, show upgrade popup and stop fetching
    if (subscriptionType === "trial") {
      console.log("fetchChatHistory")
      useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
      return;
    }
      // Ensure the userId exists before proceeding with the request
      if (!userId) {
        console.error("User not authenticated, no userId found.");
        return;
      }
    try {
      const response = await axios.get(`http://localhost:3000/api/chatHistory/${chatId}`, {
        params: { userId},
        withCredentials:true // Replace with the actual user ID
      });

      const chatHistory = response.data.messages;
      console.log("chatHistory:",chatHistory)
      set((state) => {
        const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIndex === -1) {
          state.chats.push({ id: chatId, messages: chatHistory });
        } else {
          state.chats[chatIndex].messages = chatHistory;
        }
        return { chats: [...state.chats] };
      });
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  },
}));

interface SidebarState {
  titles: { id: string; title: string }[];
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  addChat: () => Promise<string>;
  deleteChat: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  fetchTitles: () => Promise<void>; // New function to fetch titles
}

export const useSidebarStore = create<SidebarState>((set) => ({
  titles: [],
  isSidebarOpen: false, // Initial state: Sidebar is closed
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })), // Toggle the sidebar state
  fetchTitles: async () => {
    const { userId, subscriptionType } = useUserStore.getState();
  
    if (subscriptionType === "trial") {
      console.log("fetchTitles")
      useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
      return;
    }
  
      // Ensure the userId exists before proceeding with the request
      if (!userId) {
        console.error("User not authenticated, no userId found.");
        return;
      }
    try {
      const response = await axios.get('http://localhost:3000/api/titles', {
        params: { userId }, 
        withCredentials:true,// Replace with the actual user ID
      });
      const reversedTitles = response.data.titles.reverse();

      // Update the state with the reversed titles
      set({ titles: reversedTitles });
    } catch (error) {
      console.error('Error fetching chat titles:', error);
    }
  },
  addChat: async () => {
    // const newChatId = crypto.randomUUID(); 
    console.log("title add3ed")
    const { subscriptionType ,subscriptionEndDate } = useUserStore.getState();
  const { titles } = useSidebarStore.getState(); // Get the current chat titles

  const isSubscriptionExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();
  
  // Trial users can only have one chat
  if (subscriptionType === "trial" && titles.length >= 1) {
    console.log("Trial users can only have one chat.");
    useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
    return; // Prevent further execution
  }

  // Block expired users from creating new chats
  if (isSubscriptionExpired) {
    console.log("Your subscription has expired. Please upgrade.");
    useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
    return; // Prevent further execution
  }
    const newChatId = crypto.randomUUID(); // Generate unique ID
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      createdAt: Date.now(),
    };
    
    // Update the local state immediately
    set((state) => ({
      titles: [...state.titles, newChat]
    }));

     // Sync with the chats store
     useStore.getState().createChat(newChatId, newChat.title);

    // try {
    //   // Send the new chat to the backend
    //   await axios.post('/api/chats', newChat); // Adjust endpoint as needed
    // } catch (error) {
    //   console.error('Failed to save new chat to backend:', error);
    // }
    useStore.getState().setCurrentChat(newChatId);

    return newChatId;
  },

  deleteChat:async (id) => {
    const { subscriptionType, subscriptionEndDate } = useUserStore.getState();

  // Check if the user is a trial user or if their subscription has expired
  const isSubscriptionExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();

  // Block trial and expired users from deleting chats
  if (subscriptionType === "trial" || isSubscriptionExpired) {
    useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
    return; // Prevent further execution
  }
    set((state) => ({
      titles: state.titles.filter((chat) => chat.id !== id),
    }));
    
    // Remove the chat from useStore
    useStore.setState((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
    }));
    const userId = useUserStore.getState().userId;

    // Ensure the userId exists before proceeding with the request
    if (!userId) {
      console.error("User not authenticated, no userId found.");
      return;
    }
    console.log("delete button called ")
    try {
      const response = await axios.delete('http://localhost:3000/api/deleteChat', {
        data: {
          userId, // Replace with actual user ID
          chatId:id,
        },
        withCredentials:true
      });

      console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  },

  updateChatTitle: (id, title) => {
    set((state) => ({
      titles: state.titles.map((chat) =>
        chat.id === id ? { ...chat, title } : chat
      ),
    }));
  
    // Update the chat title in useStore
    useStore.setState((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, title } : chat
      ),
    }));


    
  }

}));


export const useProcessingStore = create((set,get) => ({
  chatsProcessing: {}, // Holds the processing state for each chat by ID

  // Get processing state for a specific chat
  getIsProcessing: (chatId) => {
    const state = get(); // Get the entire store state
    return state.chatsProcessing[chatId] || false; // Return the processing state for a specific chatId
  },

  setIsProcessing: (chatId, processing) => set((state) => ({
    chatsProcessing: {
      ...state.chatsProcessing,
      [chatId]: processing,
    },
  })),
}));


export const useTypingStore = create((set) => ({
  chatsTypingComplete: {}, // Holds typing completion state for each chat by ID

  // Get typingComplete state for a specific chat
  getTypingComplete: (chatId) => (chatId) => {
    return set((state) => state.chatsTypingComplete[chatId] || false);
  },

  // Set typingComplete state for a specific chat
  setTypingComplete: (chatId, typingStatus) => set((state) => ({
    chatsTypingComplete: {
      ...state.chatsTypingComplete,
      [chatId]: typingStatus,
    },

  })),
}));

export const useTypingEffect = create((set) => ({
  initial: false,
  setTypingState: () => set((state) => ({ initial: !state.initial })),
}));


// 

// for input placeholder
export const useUIStore = create((set) => ({
  chatStarted: false, // Initially false
  setChatStarted: (started) => set({ chatStarted: started }),
}));

export const useSubscriptionPopup = create((set) => ({
  showUpgradePopup: false,
  setShowUpgradePopup: (value) => set({ showUpgradePopup: value }),
}));
