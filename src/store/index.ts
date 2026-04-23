import { create } from "zustand";
import { type Role, type User, type Book, type Sermon, type Post, type Plan, type Tier } from "@/data/mock";
import { getStats } from "@/api/admin";
import { getUsers, updateUser, deleteUser } from "@/api/users";
import { getBooks, createBook, deleteBook } from "@/api/books";
import { getStories, createStory, deleteStory } from "@/api/stories";
import { getSermons, createSermon } from "@/api/sermons";
import { getPricing, updatePricing as updatePricingApi } from "@/api/pricing";
import client from "@/api/client";

interface AuthState {
  currentRole: Role | null;
  currentUser: { name: string; email: string; avatar?: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (r: Role) => void;
}

export const useAuth = create<AuthState>((set) => ({
  currentRole: null,
  currentUser: null,
  isAuthenticated: !!localStorage.getItem('token'),
  login: async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    set({ 
      currentUser: { name: user.name, email: user.email },
      currentRole: user.role,
      isAuthenticated: true 
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ currentUser: null, currentRole: null, isAuthenticated: false });
  },
  setRole: (r) => set({ currentRole: r }),
}));

interface DataState {
  users: User[];
  books: Book[];
  sermons: Sermon[];
  stories: Post[];
  stats: any;
  plans: Plan[];
  loading: boolean;
  
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchBooks: () => Promise<void>;
  fetchSermons: () => Promise<void>;
  fetchStories: () => Promise<void>;
  
  updatePlanPrice: (id: Tier, price: number) => void;
  
  // user actions
  updateUserStatus: (id: string, data: any) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  
  // book actions
  addNewBook: (formData: FormData) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
  
  // story actions
  addNewStory: (formData: FormData) => Promise<void>;
  removeStory: (id: string) => Promise<void>;
  
  // sermon actions
  addNewSermon: (data: any) => Promise<void>;
  
  // pricing actions
  fetchPlans: () => Promise<void>;
  savePlanPrice: (id: Tier, price: number) => Promise<void>;
}

export const useData = create<DataState>((set, get) => ({
  users: [],
  books: [],
  sermons: [],
  stories: [],
  stats: null,
  plans: [
    { id: "Standard", price: 12, subscribers: 1240, features: ["Apostles Update", "Standard Library", "Monthly Sermons"] },
    { id: "Premium", price: 29, subscribers: 840, features: ["All Standard", "Full Library Access", "Live Streams"] },
    { id: "VVIP", price: 99, subscribers: 120, features: ["All Premium", "Personal Counsel", "VVIP Seating"] },
  ],
  loading: false,

  fetchStats: async () => {
    try {
      const response = await getStats();
      set({ stats: response.data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await getUsers();
      set({ users: response.data });
    } finally {
      set({ loading: false });
    }
  },
  fetchBooks: async () => {
    const response = await getBooks();
    set({ books: response.data });
  },
  fetchSermons: async () => {
    const response = await getSermons();
    set({ sermons: response.data });
  },
  fetchStories: async () => {
    const response = await getStories();
    set({ stories: response.data });
  },

  updateUserStatus: async (id, data) => {
    await updateUser(id, data);
    await get().fetchUsers();
  },
  removeUser: async (id) => {
    await deleteUser(id);
    await get().fetchUsers();
  },
  
  addNewBook: async (formData) => {
    await createBook(formData);
    await get().fetchBooks();
  },
  removeBook: async (id) => {
    await deleteBook(id);
    await get().fetchBooks();
  },
  
  addNewStory: async (formData) => {
    await createStory(formData);
    await get().fetchStories();
  },
  removeStory: async (id) => {
    await deleteStory(id);
    await get().fetchStories();
  },
  
  addNewSermon: async (data) => {
    await createSermon(data);
    await get().fetchSermons();
  },
  updatePlanPrice: (id, price) => {
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, price } : p)),
    }));
  },
  fetchPlans: async () => {
    try {
      const response = await getPricing();
      const pricing = response.data;
      if (pricing.length > 0) {
        set((state) => ({
          plans: state.plans.map(p => {
            const dbPrice = pricing.find((dp: any) => dp.id.toLowerCase() === p.id.toLowerCase());
            return dbPrice ? { ...p, price: dbPrice.price } : p;
          })
        }));
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    }
  },
  savePlanPrice: async (id, price) => {
    await updatePricingApi(id, price);
    await get().fetchPlans();
  }
}));

export const ROLE_ACCESS: Record<Role, string[]> = {
  system_admin: ["overview", "posts", "library", "users", "subscriptions", "settings"],
  posts_admin: ["overview", "posts", "settings"],
  library_admin: ["overview", "library", "settings"],
};
