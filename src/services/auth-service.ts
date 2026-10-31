import { post } from "@/utils/api-request";
import type { UserRole, UserStatus } from "./user-service";

type LoginResponse = {
  token: string;
  user_id: string;
  username: string;
  role: UserRole;
  status: UserStatus;
};

const authService = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<LoginResponse> => {
    try {
      const res = await post("/auth/login", {
        username,
        password,
        login_location: "WEB",
      });
      return res.data as LoginResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  register: async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await post("/auth/register", {
        username,
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default authService;
