// src/types/user.ts
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  websites: Website[];
}

export interface Session {
  user: User;
  expires: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// src/types/website.ts
export interface Website {
  id: string;
  name: string;
  domain: string;
  modules: Module[];
  isActive: boolean;
  settings?: Record<string, any>;
}

// src/types/module.ts
export interface Module {
  id: string;
  name: string;
  slug: string;
  websiteId: string;
  isActive: boolean;
  settings?: Record<string, any>;
}