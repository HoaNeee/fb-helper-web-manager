export interface DataGroupPost {
  id: string;
  title: string;
  name: string;
  contents: string[];
  files: string[];
  priority: number;
  from_member: number;
  to_member: number;
}

const DEFAULT_LIST_DATA_GROUP_POST: Partial<DataGroupPost>[] = [
  {
    id: "1",
    title: "Data 1",
    name: "Data 1",
    priority: 1,
    contents: [
      '<p><strong>CĂN HỘ MINI STUDIO FULL ĐỒ CÓ BAN CÔNG - GIÁ 4TRX MỄ TRÌ</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Cho thuê phòng tại 50 Mễ Trì Thượng.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Studio khép kín, thang máy, phòng trống dọn vào luôn.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Thiết kế ban công thoáng, bếp tách ngủ, sẵn full nội thất.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Giờ giấc tự do, ra vào thoải mái, không chung chủ.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Nhà xe rộng, để xe miễn phí hàng tháng.</li></ol><p>Ib hoặc liên hệ hotline để xem phòng: 0339 005 642</p>',
      "<p>aaaaaa</p>",
    ],
    files: [],
  },
  {
    id: "2",
    title: "Data 2",
    name: "Data 2",
    priority: 2,
    contents: ["<p>aaaaaa</p>", "<p>bbbb</p>"],
    files: [],
  },
  {
    id: "3",
    title: "Data 3",
    name: "Data 3",
    priority: 3,
    contents: ["<p>ddddd</p>"],
    files: [],
  },
];

/**
 * @typedef {Object} InteractBeforePost
 * @property {number} max_post_interact_per_batch
 */

export { DEFAULT_LIST_DATA_GROUP_POST };
