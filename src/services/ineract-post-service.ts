/**
 * @typedef {Object} InteractBeforePost
 * @property {number} max_post_interact_per_batch
 */

import { get, patch } from "@/utils/api-request";

export interface InteractBeforePost {
  max_post_interact_per_batch: number;
}

const interactBeforePostService = {
  async getMaxPostInteractPerBatch(): Promise<number> {
    try {
      const res = await get(
        "/interact-before-posts/max-post-interact-per-batch",
      );
      return Number(res.data);
    } catch (error) {
      throw error;
    }
  },

  async saveMaxPostInteractPerBatch(max_post_interact_per_batch: number) {
    try {
      const res = await patch("/interact-before-posts", {
        max_post_interact_per_batch,
      });
      return res.data as InteractBeforePost;
    } catch (error) {
      throw error;
    }
  },
};

export default interactBeforePostService;
