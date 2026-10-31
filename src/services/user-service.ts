import { get, patch } from "@/utils/api-request";

export type UserRole = "admin" | "user";
export type UserStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "LOCKED";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  is_premium: Boolean;
  avatar: string;
  status: UserStatus;
  create_at: string;
}

export type UpdateUserPayload = Partial<
  Pick<User, "username" | "email" | "name" | "avatar">
>;

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
};

const userService = {
  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await patch("/users/change-password", payload);
  },
  updateMe: async (payload: UpdateUserPayload): Promise<Partial<User>> => {
    const res = await patch("/users/me", payload);
    return (res.data ?? {}) as Partial<User>;
  },
  getMe: async (): Promise<User> => {
    try {
      const res = await get("/users/me");
      return res.data as User;
    } catch (error) {
      throw error;
    }
  },

  async checkPremium(): Promise<Boolean> {
    try {
      const res = await get("/users/is-premium");
      return res.data as Boolean;
    } catch (error) {
      return false;
    }
  },
};

export default userService;
