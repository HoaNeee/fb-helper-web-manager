import { get } from "@/utils/api-request";

export type UserRole = "admin" | "user";
export type UserStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "LOCKED";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar: string;
  status: UserStatus;
  create_at: string;
}

const userService = {
  getMe: async (): Promise<User> => {
    try {
      const res = await get("/users/me");
      return res.data as User;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
