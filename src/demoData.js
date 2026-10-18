const year = new Date().getFullYear();
const date = (month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const demoUserId = 'person-demo';

export function createDemoData() {
  const companies = [
    { id: 'company-a', name: '星桥演示科技', departments: ['技术部', '运营部'] },
    { id: 'company-b', name: '云帆演示服务', departments: ['客户服务部', '项目部'] },
  ];
  const people = [
    { id: demoUserId, name: '演示用户', companyId: 'company-a', department: '技术部' },
    { id: 'person-a1', name: '模拟员工甲', companyId: 'company-a', department: '技术部' },
    { id: 'person-a2', name: '模拟员工乙', companyId: 'company-a', department: '运营部' },
    { id: 'person-b1', name: '模拟员工丙', companyId: 'company-b', department: '客户服务部' },
    { id: 'person-b2', name: '模拟员工丁', companyId: 'company-b', department: '项目部' },
  ];
  const courses = [
    { id: 'course-1', title: '新员工入职指引', category: '岗位必修', teacher: '演示讲师甲', description: '了解培训流程与基本工作规范。', companyId: 'company-a', targetPersonIds: [demoUserId, 'person-a1'], assigned: true, completed: false, createdAt: date(1, 12) },
    { id: 'course-2', title: '协作工具基础', category: '技术体系', teacher: '演示讲师乙', description: '学习日常协作工具的基础操作。', companyId: 'company-a', targetPersonIds: [demoUserId, 'person-a2'], assigned: true, completed: true, createdAt: date(3, 8) },
    { id: 'course-3', title: '项目沟通实践', category: '软技能', teacher: '演示讲师甲', description: '用模拟案例练习沟通和记录。', companyId: 'company-a', targetPersonIds: [demoUserId], assigned: true, completed: false, createdAt: date(5, 16) },
    { id: 'course-4', title: '服务接待入门', category: '岗位必修', teacher: '模拟讲师丙', description: '面向示例服务团队的入门课程。', companyId: 'company-b', targetPersonIds: ['person-b1', 'person-b2'], assigned: false, completed: false, createdAt: date(6, 11) },
    { id: 'course-5', title: '数据安全基础', category: '行业认证', teacher: '演示讲师乙', description: '可自主参与的基础知识课程。', companyId: 'company-a', targetPersonIds: [], assigned: false, completed: false, createdAt: date(8, 5) },
    { id: 'course-6', title: '服务流程演练', category: '软技能', teacher: '模拟讲师丙', description: '通过情景练习熟悉服务流程。', companyId: 'company-b', targetPersonIds: ['person-b1'], assigned: false, completed: true, createdAt: date(9, 13) },
  ];
  const exams = [
    { id: 'exam-1', title: '入职知识测验', category: '通用', companyId: 'company-a', targetPersonIds: [demoUserId, 'person-a1'], assigned: true, completed: false, createdAt: date(2, 4) },
    { id: 'exam-2', title: '协作规范测验', category: '技能考核', companyId: 'company-a', targetPersonIds: [demoUserId], assigned: true, completed: true, createdAt: date(4, 20) },
    { id: 'exam-3', title: '服务基础测验', category: '岗位考核', companyId: 'company-b', targetPersonIds: ['person-b1', 'person-b2'], assigned: false, completed: false, createdAt: date(7, 9) },
    { id: 'exam-4', title: '数据安全测验', category: '通用', companyId: 'company-a', targetPersonIds: [], assigned: false, completed: false, createdAt: date(9, 2) },
  ];
  const plans = [
    { id: 'plan-1', title: '新员工学习计划', category: '岗位学习地图', companyId: 'company-a', targetPersonIds: [demoUserId, 'person-a1'], courseIds: ['course-1', 'course-2'], examId: 'exam-1', assigned: true, completed: false, applied: false, accepted: false, createdAt: date(1, 15), endDate: date(12, 20) },
    { id: 'plan-2', title: '协作能力专项训练', category: '专项训练营', companyId: 'company-a', targetPersonIds: [demoUserId], courseIds: ['course-2', 'course-3'], examId: 'exam-2', assigned: true, completed: true, applied: true, accepted: false, createdAt: date(4, 6), endDate: date(11, 30) },
    { id: 'plan-3', title: '服务岗位学习地图', category: '岗位学习地图', companyId: 'company-b', targetPersonIds: ['person-b1', 'person-b2'], courseIds: ['course-4', 'course-6'], examId: 'exam-3', assigned: false, completed: false, applied: false, accepted: false, createdAt: date(6, 12), endDate: date(12, 26) },
    { id: 'plan-4', title: '安全意识专项训练', category: '专项训练营', companyId: 'company-a', targetPersonIds: ['person-a2'], courseIds: ['course-5'], examId: 'exam-4', assigned: false, completed: true, applied: true, accepted: true, createdAt: date(8, 8), endDate: date(10, 31) },
  ];
  const questions = [
    { id: 'question-1', title: '遇到信息安全问题应先做什么？', category: '单选题', description: '按流程上报并保留必要记录', examId: 'exam-4', companyId: 'company-a', targetPersonIds: [], assigned: false, completed: false, createdAt: date(8, 20) },
    { id: 'question-2', title: '协作任务完成后需要更新状态吗？', category: '判断题', description: '需要', examId: 'exam-2', companyId: 'company-a', targetPersonIds: [], assigned: false, completed: false, createdAt: date(4, 18) },
    { id: 'question-3', title: '接待前应确认哪些信息？', category: '多选题', description: '预约、需求、时间', examId: 'exam-3', companyId: 'company-b', targetPersonIds: [], assigned: false, completed: false, createdAt: date(7, 8) },
  ];
  const certificates = [
    { id: 'certificate-1', title: '协作基础结业证书', category: '培训证书', code: 'DEMO-CERT-001', companyId: 'company-a', targetPersonIds: [demoUserId], assigned: true, completed: true, createdAt: date(5, 2) },
    { id: 'certificate-2', title: '服务流程结业证书', category: '培训证书', code: 'DEMO-CERT-002', companyId: 'company-b', targetPersonIds: ['person-b1'], assigned: false, completed: true, createdAt: date(9, 22) },
  ];
  const bills = [
    { id: 'bill-1', title: '工具课程模拟账单', category: '外训费用', amount: 199, companyId: 'company-a', targetPersonIds: [demoUserId], assigned: true, completed: true, createdAt: date(3, 12) },
    { id: 'bill-2', title: '服务培训模拟账单', category: '外训费用', amount: 299, companyId: 'company-b', targetPersonIds: ['person-b1'], assigned: false, completed: false, createdAt: date(7, 15) },
  ];
  const notices = [
    { id: 'notice-1', title: '新员工学习计划已发布', category: '计划通知', companyId: 'company-a', targetPersonIds: [demoUserId], assigned: true, completed: false, createdAt: date(1, 15) },
    { id: 'notice-2', title: '入职知识测验待参加', category: '考试通知', companyId: 'company-a', targetPersonIds: [demoUserId], assigned: true, completed: false, createdAt: date(2, 4) },
  ];
  const wrongQuestions = [
    { id: 'wrong-1', title: '协作任务完成后需要更新状态吗？', category: '判断题', companyId: 'company-a', targetPersonIds: [demoUserId], assigned: true, completed: false, createdAt: date(4, 21) },
  ];
  return { companies, people, courses, exams, plans, questions, certificates, bills, notices, wrongQuestions };
}
