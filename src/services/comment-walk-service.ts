import { del, get, patch, post } from "@/utils/api-request";
import type { CommentWalk } from "@/types/types";

const DEFAULT_LIST_COMMENT_WALK: Partial<CommentWalk>[] = [
  {
    id: "1",
    name: "Comment Walk Cho Thuê Phòng Trọ",
    title_query_searchs: [
      "cho thuê phòng",
      "căn hộ mini",
      "chung cư mini",
      " phòng trọ",
    ],
    contents: [
      "<p>Phòng đẹp quá ạ, ib mình xin thêm thông tin và giá phòng với ạ!</p>",
      "<p>Bên mình còn phòng trống không bạn ơi? Cho mình xin giá và địa chỉ cụ thể nhé!</p>",
    ],
    files: [],
    keyword_query_includes: ["phòng trọ", "cho thuê", "căn hộ", "chung cư"],
    keyword_query_excludes: ["tìm người ở ghép", "pass đồ"],
    keywords_certain_choice: ["cầu giấy", "mễ trì", "mỹ đình"],
    match_rate_value_content_query_includes: 1,
    description_for_ai:
      "Đóng vai khách hàng tiềm năng muốn thuê phòng, hỏi lịch sự về giá cả và tiện ích phòng.",
    is_active: true,
  },
  {
    id: "2",
    name: "Comment Walk Mua Bán BĐS",
    title_query_searchs: [
      "bán nhà",
      "đất thổ cư",
      "chung cư cao cấp",
      "bán đất",
      "bán chung cư",
    ],
    contents: [
      "<p>Quan tâm, cho mình xin thông tin sổ đỏ và vị trí chính xác với ạ!</p>",
      "<p>Giá này có thương lượng không chủ nhà ơi? Ib mình nhé.</p>",
    ],
    files: [],
    keyword_query_includes: ["chính chủ", "sổ đỏ", "bán gấp"],
    keyword_query_excludes: ["môi giới", "quảng cáo"],
    keywords_certain_choice: ["hà nội", "hồ chí minh"],
    match_rate_value_content_query_includes: 2,
    description_for_ai:
      "Đóng vai người có nhu cầu mua nhà thực sự, hỏi về giấy tờ pháp lý và vị trí.",
    is_active: false,
  },
];

const commentWalkService = {
  async getAllCommentWalkByUser(): Promise<Array<CommentWalk>> {
    try {
      const res = await get("/comment-walks");
      return (res.data as CommentWalk[]) || [];
    } catch (error) {
      throw error;
    }
  },

  async getListCommentWalkByUser(): Promise<Array<CommentWalk>> {
    return this.getAllCommentWalkByUser();
  },

  async getAllCommentWalkByDevice(
    device_id: string,
  ): Promise<Array<CommentWalk>> {
    try {
      const res = await get(`/comment-walks/device/${device_id}`);
      return (res.data as CommentWalk[]) || [];
    } catch (error) {
      throw error;
    }
  },

  async addNewCommentWalk(
    comment_walk: Partial<CommentWalk>,
  ): Promise<CommentWalk> {
    try {
      const res = await post("/comment-walks", comment_walk);
      return res.data as CommentWalk;
    } catch (error) {
      throw error;
    }
  },

  async updateCommentWalk(
    id: string,
    comment_walk: Partial<CommentWalk>,
  ): Promise<CommentWalk> {
    try {
      const res = await patch(`/comment-walks/${id}`, comment_walk);
      return res.data as CommentWalk;
    } catch (error) {
      throw error;
    }
  },

  async updateChecked(
    comment_walk_id: string,
    device_id: string,
    checked: boolean,
  ): Promise<boolean> {
    try {
      const payload = {
        is_active: checked,
        comment_walk_id,
        device_id,
      };
      await patch("/comment-walks/details", payload);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async deleteCommentWalk(id: string): Promise<boolean> {
    try {
      await del(`/comment-walks/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async importData(
    data: CommentWalk[],
    device_id?: string,
  ): Promise<CommentWalk[]> {
    try {
      const payload: Record<string, unknown> = {
        list_comment_walk: data,
      };
      if (device_id) {
        payload["device_id"] = device_id;
      }
      const res = await post("/comment-walks/import-data", payload);
      return (res.data as CommentWalk[]) || [];
    } catch (error) {
      throw error;
    }
  },

  async clearAllCommentWalk(): Promise<boolean> {
    try {
      await del("/comment-walks/delete-all-comment-walks");
      return true;
    } catch (error) {
      throw error;
    }
  },

  async updateStatusAllDevice(
    comment_walk_id: string,
    is_active: boolean,
  ): Promise<unknown> {
    try {
      const res = await patch(
        `/comment-walks/update-status-all-device/${comment_walk_id}`,
        {
          is_active,
        },
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async syncDeviceCommentWalk(
    current_device_id: string,
    target_device_id: string,
  ): Promise<Boolean> {
    try {
      const payload = {
        current_device_id,
        target_device_id,
      };
      const res = await post(
        "/comment-walks/sync-device-comment-walk",
        payload,
      );
      return Boolean(res.data);
    } catch (error) {
      throw error;
    }
  },
};

export { DEFAULT_LIST_COMMENT_WALK, commentWalkService };
