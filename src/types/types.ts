export type TypeBase64 = {
  name: string;
  base64Data: string;
  type: string;
};

export type DeviceStatus = "ONLINE" | "OFFLINE" | "SPAMMED" | "RUNNING";

export interface Device {
  id: string;
  device_name: string;
  device_type: string;
  device_setting?: DeviceSetting | null;
  created_at: string;
}

export interface PostConfig {
  max_group_per_batch: number;
  is_shuffle_group_need_post: boolean;
  time_delay_click_to_post: number;
  time_delay_fill_content: number;
  time_delay_fill_file: number;
  time_delay_post: number;
  time_delay_open_new_tab: number;
  last_time_post: number;
}

export interface PriorityTask {
  priority_task_post: number;
  priority_task_comment_walk: number;
}

export interface CommentWalkConfig {
  is_comment_walk: boolean;
  max_comment_walk_per_batch: number;
  is_spammed_comment_walk: boolean;
  time_delay_fill_content_comment_walk_min: number;
  time_delay_fill_content_comment_walk_max: number;
  time_delay_fill_file_comment_walk: number;
  time_delay_submit_comment_walk: number;
  content_query_includes_common_comment_walk: Array<string>;
  content_query_excludes_common_comment_walk: Array<string>;
  match_rate_value_content_query_includes_common_comment_walk: number;
  last_time_comment_walk: number;
  is_interact_before_comment_walk: boolean;

  comment_walk_area: string;
  keywords_certain_choice_comment_walk: Array<string>; // just active for area home
  comment_walk_speed: string;
  is_skip_post_not_in_group: boolean;
  is_combine_keywords_title_group: boolean;
  is_ai_help_comment_walk: boolean;
}

export interface DeviceSetting {
  device_id: string;

  strictly_title_match_groups: string[];

  is_fix_steal_focus: boolean;
  is_fix_steal_all_focus: boolean;
  is_random_break_batch: boolean;
  is_random_time_task: boolean;
  is_special_frame_hours: boolean;
  is_scheduler: boolean;
  is_spammed: boolean;
  is_comment_when_post: boolean;
  is_interact_batch: boolean;
  is_remote_control: boolean;
  time_break_when_spammed: number;
  is_stop_task: boolean;

  priority_task: PriorityTask;
  post_config: PostConfig;
  comment_walk_config: CommentWalkConfig;
}

export interface CommentWalk {
  id: string;
  name: string;
  files: string[];
  title_query_searchs: string[];
  contents: string[];
  keyword_query_includes: string[];
  keyword_query_excludes: string[];
  keywords_certain_choice: string[];
  match_rate_value_content_query_includes: number;
  description_for_ai: string;
  is_active?: boolean;
}

export interface IError {
  error: {
    message: string;
  };
}
