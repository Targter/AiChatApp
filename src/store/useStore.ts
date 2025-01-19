

import { create } from 'zustand';
import { Chat, Message, User } from '../types';
import axios from 'axios';



// userData:
interface UserState {
  userId: string | null;
  username: string | null;
  email: string | null;
  subscriptionType: string | null;
  setUserData: (userData: { userId: string; username: string; email: string; subscriptionType: string }) => void;
  clearUserData: () => void;
}

// Create a Zustand store
export const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: null,
  email: null,
  subscriptionType: null,
  setUserData: (userData) => set({ ...userData }), // Set user data in store
  clearUserData: () => set({ userId: null, username: null, email: null, subscriptionType: null }), // Clear user data
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
  addMessage: async (chatId, message) => {

    const { setTypingState } = useTypingEffect.getState(); // Access the typing effect store
  setTypingState();
  // message Updated

    set((state) => {
      let chat = state.chats.find((chat) => chat.id === chatId);
      if (!chat) {
        chat = { id: chatId, title: 'New Chat', messages: [] };
        state.chats.push(chat);
      }
      chat.messages.push({
        id: crypto.randomUUID(),
        content: message.content,
        role: message.role || 'user',
        timestamp: Date.now(),
      });
      return { chats: [...state.chats] };
    });

    try {
      // const response = await axios.get(`https://rag-tx-al1k.vercel.app/stream/${message.content}`);
      const assistantMessage = {
        id: crypto.randomUUID(),
        // content: response.data,
        content: "message from ai ",
        role: 'assistant',
        timestamp: Date.now(),
      };
      set((state) => {
        const chat = state.chats.find((chat) => chat.id === chatId);
        if (chat) {
          chat.messages.push(assistantMessage);
        }
        return { chats: [...state.chats] };
      });
      const userId = useUserStore.getState().userId;

      // Ensure the userId exists before proceeding with the request
      if (!userId) {
        console.error("User not authenticated, no userId found.");
        return;
      }
      const messagesToSend = [message, assistantMessage];
      const response = await axios.post(
        "http://localhost:3000/api/updateData",
        {
          userId,
          chatId: chatId,
          messages: messagesToSend,
        },
        {
          withCredentials: true, // Include cookies
        }
      );
  
      console.log("updatedResponse:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  },

  fetchChatHistory: async (chatId: string) => {
    const userId = useUserStore.getState().userId;

      // Ensure the userId exists before proceeding with the request
      if (!userId) {
        console.error("User not authenticated, no userId found.");
        return;
      }
    try {
      const response = await axios.get(`http://localhost:3000/api/chatHistory/${chatId}`, {
        params: { userId}, // Replace with the actual user ID
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
    const userId = useUserStore.getState().userId;

      // Ensure the userId exists before proceeding with the request
      if (!userId) {
        console.error("User not authenticated, no userId found.");
        return;
      }
    try {
      const response = await axios.get('http://localhost:3000/api/titles', {
        params: { userId }, // Replace with the actual user ID
      });
      set({ titles: response.data.titles });
    } catch (error) {
      console.error('Error fetching chat titles:', error);
    }
  },
  addChat: async () => {
    // const newChatId = crypto.randomUUID(); 
    console.log("title add3ed")
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

    try {
      const response = await axios.delete('http://localhost:3000/api/deleteChat', {
        data: {
          userId, // Replace with actual user ID
          chatId:id,
        },
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