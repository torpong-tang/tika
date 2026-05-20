import { Translations } from "./en";

const th: Translations = {
  // General
  appName: "TIKA ระบบติดตามข้อบกพร่อง",
  language: "ภาษา",
  english: "English",
  thai: "ไทย",
  search: "ค้นหา...",
  save: "บันทึก",
  cancel: "ยกเลิก",
  delete: "ลบ",
  edit: "แก้ไข",
  create: "สร้าง",
  close: "ปิด",
  confirm: "ยืนยัน",
  actions: "การดำเนินการ",
  noData: "ไม่มีข้อมูล",
  loading: "กำลังโหลด...",

  // Navigation
  nav: {
    dashboard: "แดชบอร์ด",
    issues: "ปัญหา",
    projects: "โปรเจกต์",
    board: "บอร์ด",
    settings: "ตั้งค่า",
  },

  // Dashboard
  dashboard: {
    title: "แดชบอร์ด",
    totalIssues: "ปัญหาทั้งหมด",
    openIssues: "ปัญหาที่เปิดอยู่",
    inProgress: "กำลังดำเนินการ",
    resolved: "แก้ไขแล้ว",
    criticalIssues: "ปัญหาวิกฤต",
    recentIssues: "ปัญหาล่าสุด",
    issuesByStatus: "ปัญหาตามสถานะ",
    issuesByPriority: "ปัญหาตามความสำคัญ",
    issuesByType: "ปัญหาตามประเภท",
    overview: "ภาพรวม",
  },

  // Issues
  issues: {
    title: "ปัญหา",
    createIssue: "สร้างปัญหา",
    editIssue: "แก้ไขปัญหา",
    issueDetail: "รายละเอียดปัญหา",
    issueKey: "รหัสปัญหา",
    issueTitle: "หัวข้อ",
    description: "รายละเอียด",
    type: "ประเภท",
    status: "สถานะ",
    priority: "ความสำคัญ",
    assignee: "ผู้รับผิดชอบ",
    reporter: "ผู้รายงาน",
    project: "โปรเจกต์",
    created: "สร้างเมื่อ",
    updated: "อัปเดตเมื่อ",
    comments: "ความคิดเห็น",
    addComment: "เพิ่มความคิดเห็น",
    writeComment: "เขียนความคิดเห็น...",
    noIssues: "ไม่พบปัญหา",
    filterByStatus: "กรองตามสถานะ",
    filterByPriority: "กรองตามความสำคัญ",
    filterByType: "กรองตามประเภท",
    filterByProject: "กรองตามโปรเจกต์",
    allStatuses: "ทุกสถานะ",
    allPriorities: "ทุกความสำคัญ",
    allTypes: "ทุกประเภท",
    allProjects: "ทุกโปรเจกต์",
    unassigned: "ไม่ได้มอบหมาย",
    selectAssignee: "เลือกผู้รับผิดชอบ",
    selectProject: "เลือกโปรเจกต์",
    listView: "มุมมองรายการ",
    boardView: "มุมมองบอร์ด",
    allAssignees: "ผู้รับผิดชอบทั้งหมด",
    dateFrom: "จากวันที่",
    dateTo: "ถึงวันที่",
    attachments: "ไฟล์แนบ",
    uploadAttachment: "อัปโหลดภาพหน้าจอ",
    attachmentLimitHint: "รองรับเฉพาะรูปภาพ และไฟล์แนบรวมต่อปัญหาต้องไม่เกิน 20 MB",
    attachmentLimitError: "ไฟล์แนบรวมของปัญหานี้ต้องไม่เกิน 20 MB",
    uploadAttachmentError: "อัปโหลดไฟล์แนบไม่สำเร็จ",
    createIssueError: "สร้างปัญหาไม่สำเร็จ",
    activity: "ประวัติการเปลี่ยนแปลง",
  },

  // Issue Types
  issueTypes: {
    bug: "บัก",
    task: "งาน",
    story: "สตอรี่",
    epic: "อีพิค",
  },

  // Statuses
  statuses: {
    open: "เปิด",
    in_progress: "กำลังดำเนินการ",
    in_review: "กำลังตรวจสอบ",
    testing: "กำลังทดสอบ",
    done: "เสร็จสิ้น",
    closed: "ปิดแล้ว",
  },

  // Priorities
  priorities: {
    critical: "วิกฤต",
    high: "สูง",
    medium: "ปานกลาง",
    low: "ต่ำ",
  },

  // Projects
  projects: {
    title: "โปรเจกต์",
    createProject: "สร้างโปรเจกต์",
    editProject: "แก้ไขโปรเจกต์",
    projectName: "ชื่อโปรเจกต์",
    projectKey: "รหัสโปรเจกต์",
    description: "รายละเอียด",
    issueCount: "จำนวนปัญหา",
    noProjects: "ไม่พบโปรเจกต์",
  },

  // Roles
  roles: {
    admin: "ผู้ดูแลระบบ",
    developer: "นักพัฒนา",
    tester: "ผู้ทดสอบ",
    manager: "ผู้จัดการ",
    readonly: "ดูอย่างเดียว",
  },
};

export default th;
