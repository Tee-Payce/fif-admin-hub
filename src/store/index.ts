import { create } from "zustand";
import {
  mockUsers,
  mockBooks,
  mockSermons,
  mockPosts,
  mockPlans,
  type User,
  type Book,
  type Sermon,
  type Post,
  type Plan,
  type Role,
  type Tier,
} from "@/data/mock";

interface AuthState {
  currentRole: Role;
  currentUser: { name: string; email: string; avatar?: string };
  setRole: (r: Role) => void;
}

export const useAuth = create<AuthState>((set) => ({
  currentRole: "system_admin",
  currentUser: { name: "Apostle John Doe", email: "john@fif.org" },
  setRole: (r) => set({ currentRole: r }),
}));

interface DataState {
  users: User[];
  books: Book[];
  sermons: Sermon[];
  posts: Post[];
  plans: Plan[];
  // users
  setUserRole: (id: string, role: User["role"]) => void;
  setUserTier: (id: string, tier: Tier) => void;
  toggleUserActive: (id: string) => void;
  // books
  addBook: (b: Omit<Book, "id" | "uploadedAt">) => void;
  updateBook: (id: string, b: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  // sermons
  addSermon: (s: Omit<Sermon, "id" | "uploadedAt">) => void;
  updateSermon: (id: string, s: Partial<Sermon>) => void;
  deleteSermon: (id: string) => void;
  // posts
  addPost: (p: Omit<Post, "id" | "createdAt">) => void;
  deletePost: (id: string) => void;
  // plans
  updatePlanPrice: (id: Tier, price: number) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useData = create<DataState>((set) => ({
  users: mockUsers,
  books: mockBooks,
  sermons: mockSermons,
  posts: mockPosts,
  plans: mockPlans,
  setUserRole: (id, role) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, role } : u)) })),
  setUserTier: (id, tier) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, tier } : u)) })),
  toggleUserActive: (id) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)) })),
  addBook: (b) =>
    set((s) => ({
      books: [{ ...b, id: uid(), uploadedAt: new Date().toISOString().slice(0, 10) }, ...s.books],
    })),
  updateBook: (id, b) =>
    set((s) => ({ books: s.books.map((x) => (x.id === id ? { ...x, ...b } : x)) })),
  deleteBook: (id) => set((s) => ({ books: s.books.filter((x) => x.id !== id) })),
  addSermon: (s2) =>
    set((s) => ({
      sermons: [
        { ...s2, id: uid(), uploadedAt: new Date().toISOString().slice(0, 10) },
        ...s.sermons,
      ],
    })),
  updateSermon: (id, s2) =>
    set((s) => ({ sermons: s.sermons.map((x) => (x.id === id ? { ...x, ...s2 } : x)) })),
  deleteSermon: (id) => set((s) => ({ sermons: s.sermons.filter((x) => x.id !== id) })),
  addPost: (p) =>
    set((s) => ({
      posts: [{ ...p, id: uid(), createdAt: Date.now() }, ...s.posts],
    })),
  deletePost: (id) => set((s) => ({ posts: s.posts.filter((x) => x.id !== id) })),
  updatePlanPrice: (id, price) =>
    set((s) => ({ plans: s.plans.map((p) => (p.id === id ? { ...p, price } : p)) })),
}));

export const ROLE_ACCESS: Record<Role, string[]> = {
  system_admin: ["overview", "posts", "library", "users", "subscriptions", "settings"],
  posts_admin: ["overview", "posts", "settings"],
  library_admin: ["overview", "library", "settings"],
};
