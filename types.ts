export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  collegeId: string;
  points: number;
  rank: 'Starter' | 'Learner' | 'Pro-Accountant' | 'The Legend';
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isFile?: boolean;
}

export interface ChatSession {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  unreadCount: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export interface Tutorial {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string; // YouTube embed URL
  duration: string;
}

export interface TutorialCategory {
  id: string;
  name: string;
  icon: string; // We'll use lucide icon names conceptually or render mapping
  description: string;
  tutorials: Tutorial[];
}

export enum ViewState {
  FEED = 'FEED',
  CHAT = 'CHAT',
  LEARN = 'LEARN',
  BIZ = 'BIZ',
  PROFILE = 'PROFILE'
}