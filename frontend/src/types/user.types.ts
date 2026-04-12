// src/types/user.types.ts
export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  createdAt: string;
}
