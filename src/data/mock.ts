export type Role = "system_admin" | "posts_admin" | "library_admin";
export type Tier = "Standard" | "Premium" | "VVIP";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | "member";
  tier: Tier;
  active: boolean;
  joined: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Tier;
  price: number;
  pages: number;
  uploadedAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  uploadedAt: string;
}

export interface Post {
  id: string;
  caption: string;
  mediaType: "image" | "video" | "audio";
  mediaUrl: string;
  createdAt: number; // ms epoch
}

export interface Plan {
  id: Tier;
  price: number;
  features: string[];
  subscribers: number;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Apostle John Doe", email: "john@fif.org", role: "system_admin", tier: "VVIP", active: true, joined: "2023-01-12" },
  { id: "u2", name: "Sarah Mensah", email: "sarah@fif.org", role: "posts_admin", tier: "Premium", active: true, joined: "2023-04-02" },
  { id: "u3", name: "Daniel Owusu", email: "daniel@fif.org", role: "library_admin", tier: "Premium", active: true, joined: "2023-06-21" },
  { id: "u4", name: "Grace Boateng", email: "grace@gmail.com", role: "member", tier: "Standard", active: true, joined: "2024-02-10" },
  { id: "u5", name: "Michael Asare", email: "michael@gmail.com", role: "member", tier: "VVIP", active: true, joined: "2024-03-05" },
  { id: "u6", name: "Akua Adjei", email: "akua@gmail.com", role: "member", tier: "Premium", active: false, joined: "2024-05-18" },
  { id: "u7", name: "Kojo Mensa", email: "kojo@gmail.com", role: "member", tier: "Standard", active: true, joined: "2024-07-01" },
  { id: "u8", name: "Esi Quaye", email: "esi@gmail.com", role: "member", tier: "Standard", active: true, joined: "2024-08-14" },
];

export const mockBooks: Book[] = [
  { id: "b1", title: "Foundations of Faith", author: "Apostle John Doe", category: "Standard", price: 0, pages: 142, uploadedAt: "2024-09-12" },
  { id: "b2", title: "The Anointing", author: "Apostle John Doe", category: "Premium", price: 12.99, pages: 220, uploadedAt: "2024-10-03" },
  { id: "b3", title: "Kingdom Mandate", author: "Pastor Sarah", category: "VVIP", price: 29.99, pages: 310, uploadedAt: "2025-01-20" },
  { id: "b4", title: "Walking in Power", author: "Apostle John Doe", category: "Premium", price: 14.99, pages: 188, uploadedAt: "2025-02-15" },
];

export const mockSermons: Sermon[] = [
  { id: "s1", title: "The Power of Prayer", description: "A deep dive into intercession.", duration: "48:12", url: "https://example.com/v1", uploadedAt: "2025-03-01" },
  { id: "s2", title: "Faith That Moves Mountains", description: "Living by faith daily.", duration: "55:42", url: "https://example.com/v2", uploadedAt: "2025-03-10" },
  { id: "s3", title: "The Holy Spirit Today", description: "Walking in the Spirit.", duration: "62:18", url: "https://example.com/v3", uploadedAt: "2025-04-02" },
];

const now = Date.now();
export const mockPosts: Post[] = [
  { id: "p1", caption: "Sunday glory! 🙌", mediaType: "image", mediaUrl: "", createdAt: now - 1000 * 60 * 60 * 3 },
  { id: "p2", caption: "Midweek encouragement.", mediaType: "video", mediaUrl: "", createdAt: now - 1000 * 60 * 60 * 10 },
  { id: "p3", caption: "Word of the day audio.", mediaType: "audio", mediaUrl: "", createdAt: now - 1000 * 60 * 60 * 18 },
];

export const mockPlans: Plan[] = [
  { id: "Standard", price: 0, features: ["Free books", "Limited sermons", "Apostles updates"], subscribers: 1240 },
  { id: "Premium", price: 9.99, features: ["All books", "All sermons", "Early access"], subscribers: 412 },
  { id: "VVIP", price: 24.99, features: ["Everything in Premium", "Private prayer room", "1:1 sessions"], subscribers: 96 },
];

export const userGrowth = [
  { month: "Nov", users: 820 },
  { month: "Dec", users: 940 },
  { month: "Jan", users: 1080 },
  { month: "Feb", users: 1240 },
  { month: "Mar", users: 1430 },
  { month: "Apr", users: 1748 },
];

export const subscriptionDistribution = [
  { name: "Standard", value: 1240 },
  { name: "Premium", value: 412 },
  { name: "VVIP", value: 96 },
];
