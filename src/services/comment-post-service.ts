import { get, patch } from "@/utils/api-request";

export interface CommentPost {
  id: number;
  contents: string[];
  max_comment_per_post: number;
}

const commentPostService = {
  async getCommentPost() {
    try {
      const res = await get("/comment-posts");
      return res.data as CommentPost;
    } catch (error) {
      throw error;
    }
  },

  async updateCommentPost(data: Partial<CommentPost>) {
    try {
      const res = await patch("/comment-posts", data);
      return res.data as CommentPost;
    } catch (error) {
      throw error;
    }
  },
};

export default commentPostService;
