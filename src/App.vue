<template>
  <div class="dsy-demo">
    <header class="dsy-demo-header"><strong>培训</strong><span><button class="dsy-reset-button" title="重新载入虚构测试数据" @click="resetDemoData">重置测试数据</button>演示用户 <span class="top-avatar">演</span></span></header>
    <div class="dsy-demo-nav"><span class="dsy-demo-nav-active">培训</span></div>

    <div class="dsy-filter-top">
      <div class="dsy-filter-time">
        <div class="dsy-years"><button v-for="year in years" :key="year" :class="{ active: activeYear === year }" @click="activeYear = year">{{ year }}年度</button></div>
        <div class="dsy-date-range"><input v-model="startDate" type="date" aria-label="开始日期" /><span>至</span><input v-model="endDate" type="date" aria-label="结束日期" /></div>
        <div class="dsy-months"><button v-for="month in months" :key="month" :class="{ active: activeMonth === month }" @click="activeMonth = month">{{ month === 0 ? '全部' : `${month}月` }}</button></div>
      </div>
      <nav class="dsy-function-menu" aria-label="培训功能">
        <span class="dsy-menu-label">功能</span>
        <button v-for="item in userNav" :key="item.key" :class="{ active: view === item.key }" @click="navigate(item.key)">{{ item.label }}</button>
        <button v-for="item in adminNav" :key="item.key" :class="{ active: view === item.key }" @click="navigate(item.key)">{{ item.label }}</button>
      </nav>
    </div>

    <div class="dsy-people-filter">
      <div class="dsy-filter-line"><span class="dsy-line-label">公司</span><button :class="{ active: companyFilter === 'all' }" @click="companyFilter = 'all'">全部</button><button v-for="company in data.companies" :key="company.id" :class="{ active: companyFilter === company.id }" @click="companyFilter = company.id">{{ company.name }}</button></div>
      <div class="dsy-filter-line"><span class="dsy-line-label">部门</span><button :class="{ active: departmentFilter === 'all' }" @click="departmentFilter = 'all'">全部</button><button v-for="department in availableDepartments" :key="department" :class="{ active: departmentFilter === department }" @click="departmentFilter = department">{{ department }}</button></div>
      <div class="dsy-filter-line"><span class="dsy-line-label">人员</span><button :class="{ active: personFilter === 'all' }" @click="personFilter = 'all'">全部</button><button v-for="person in availablePeople" :key="person.id" :class="{ active: personFilter === person.id }" @click="personFilter = person.id">{{ person.name }}</button></div>
      <div v-if="view === 'manage'" class="dsy-filter-line"><span class="dsy-line-label">功能</span><button v-for="tab in manageTabs" :key="tab.key" :class="{ active: manageTab === tab.key }" @click="manageTab = tab.key">{{ tab.label }}</button></div>
      <div v-if="view === 'reports'" class="dsy-filter-line"><span class="dsy-line-label">功能</span><button v-for="tab in reportTabs" :key="tab.key" :class="{ active: reportTab === tab.key }" @click="reportTab = tab.key">{{ tab.label }}</button></div>
      <div v-if="view !== 'learning' && view !== 'realtime' && view !== 'wrong' && view !== 'notices' && view !== 'reports'" class="dsy-filter-line"><span class="dsy-line-label">名称</span><input v-model="search" :placeholder="`搜索${view === 'manage' ? manageTitle : currentTitle}`" />
        <template v-if="view === 'courses' || view === 'manage' && manageTab === 'course'"><span class="dsy-inline-label">类型</span><button v-for="type in courseTypes" :key="type" :class="{ active: categoryFilter === type }" @click="categoryFilter = type">{{ type || '全部' }}</button></template>
        <template v-if="view === 'plans' || view === 'manage' && manageTab === 'plan'"><span class="dsy-inline-label">类型</span><button v-for="type in planTypes" :key="type" :class="{ active: categoryFilter === type }" @click="categoryFilter = type">{{ type || '全部' }}</button></template>
        <template v-if="view === 'courses' || view === 'exams' || view === 'plans'"><span class="dsy-inline-label">学习要求</span><button v-for="option in assignmentOptions" :key="option.value" :class="{ active: assignmentFilter === option.value }" @click="assignmentFilter = option.value">{{ option.label }}</button></template>
        <span class="dsy-inline-label">状态</span><button v-for="option in statusOptions" :key="option.value" :class="{ active: statusFilter === option.value }" @click="statusFilter = option.value">{{ option.label }}</button>
      </div>
    </div>

    <main class="dsy-content">

        <template v-if="view === 'learning'">
          <div class="metric-row">
            <button v-for="metric in learningMetrics" :key="metric.label" class="metric" @click="navigate(metric.view)"><strong>{{ metric.value }}</strong><span>{{ metric.label }}</span></button>
          </div>
          <div class="two-column">
            <section class="section"><div class="section-head"><h2>我的课程</h2><div><button class="primary-button" @click="showCoursePicker = true">添加课程</button><button class="text-button" @click="navigate('courses')">查看全部 ({{ assignedCourses.length }})</button></div></div>
              <div class="learning-tabbar"><button :class="{ active: courseTab === 'pending' }" @click="courseTab = 'pending'">需学习（{{ assignedCourses.filter(item => !item.completed).length }}）</button><button :class="{ active: courseTab === 'completed' }" @click="courseTab = 'completed'">已完成（{{ assignedCourses.filter(item => item.completed).length }}）</button></div>
              <div v-if="visibleLearningCourses.length" class="learning-list"><div v-for="item in visibleLearningCourses.slice(0, 3)" :key="item.id" class="learning-item"><span>{{ item.title }}</span><div class="mini-progress"><i :style="{ width: item.completed ? '100%' : '0%' }"></i></div><small>{{ item.completed ? '100%' : '0%' }}</small><span :class="['status', item.completed ? 'success' : 'pending']">{{ item.completed ? '已完成' : '进行中' }}</span><button v-if="!item.completed" class="primary-button" @click="navigate('courses')">去学习</button></div></div><div v-else class="inline-empty">{{ courseTab === 'pending' ? '暂无待学习课程' : '暂无已完成课程' }}</div>
            </section>
            <section class="section"><div class="section-head"><h2>我的计划</h2><button class="text-button" @click="navigate('plans')">查看全部 ({{ assignedPlans.length }})</button></div>
              <div class="learning-tabbar"><button :class="{ active: planTab === 'pending' }" @click="planTab = 'pending'">需完成（{{ assignedPlans.filter(item => !item.accepted).length }}）</button><button :class="{ active: planTab === 'completed' }" @click="planTab = 'completed'">已完成（{{ assignedPlans.filter(item => item.accepted).length }}）</button></div>
              <div v-if="visibleLearningPlans.length" class="learning-list"><div v-for="item in visibleLearningPlans.slice(0, 3)" :key="item.id" class="learning-item"><span>{{ item.title }}</span><div class="mini-progress"><i :style="{ width: item.completed ? '100%' : '0%' }"></i></div><small>{{ item.completed ? '100%' : '0%' }}</small><button class="primary-button" @click="navigate('plans')">去查看</button></div></div><div v-else class="inline-empty">{{ planTab === 'pending' ? '暂无待完成计划' : '暂无已完成计划' }}</div>
            </section>
          </div>
          <section class="section"><div class="section-head"><h2>我的考试</h2><button class="text-button" @click="navigate('exams')">查看全部 ({{ assignedExams.length }})</button></div><div class="learning-tabbar"><button :class="{ active: examTab === 'pending' }" @click="examTab = 'pending'">需参加（{{ assignedExams.filter(item => !item.completed).length }}）</button><button :class="{ active: examTab === 'completed' }" @click="examTab = 'completed'">已通过（{{ assignedExams.filter(item => item.completed).length }}）</button></div><div v-if="visibleLearningExams.length" class="table-scroll"><table><thead><tr><th>考试名称</th><th>状态</th><th class="align-right">操作</th></tr></thead><tbody><tr v-for="item in visibleLearningExams.slice(0, 3)" :key="item.id"><td>{{ item.title }}</td><td>{{ item.completed ? '已通过' : '需参加' }}</td><td class="align-right"><button class="table-action" @click="navigate('exams')">{{ item.completed ? '查看' : '去考试' }}</button></td></tr></tbody></table></div><div v-else class="inline-empty">{{ examTab === 'pending' ? '暂无待参加考试' : '暂无已通过考试' }}</div></section>
          <div class="two-column"><section class="section"><div class="section-head"><h2>我的错题</h2><button class="text-button" @click="navigate('wrong')">查看全部 ({{ assignedWrongQuestions.length }})</button></div><div v-if="assignedWrongQuestions.length" class="learning-list"><div v-for="item in assignedWrongQuestions.slice(0, 3)" :key="item.id" class="learning-item"><span>{{ item.title }}</span><span class="status pending">{{ item.category }}</span></div></div><div v-else class="inline-empty">暂无错题记录</div></section><section class="section"><div class="section-head"><h2>我的复盘</h2></div><div class="inline-empty">暂无可复盘的考试</div></section></div>
          <section class="section"><div class="section-head"><h2>我的证书</h2></div><div class="inline-empty">{{ assignedCertificates.length ? `已获得 ${assignedCertificates.length} 张证书` : '暂无证书' }}</div></section>
        </template>

        <template v-else-if="view === 'manage'">
          <div class="page-actions"><button v-if="isCreatable" class="primary-button" @click="openEditor()"><Plus :size="16" />添加{{ entityLabel }}</button></div>
          <section class="section table-section"><div class="section-head"><div><h2>{{ manageTitle }}</h2><span>共 {{ filteredItems.length }} 条</span></div></div>
            <div v-if="filteredItems.length" class="table-scroll"><table><thead><tr><th>名称</th><th>类型</th><th>对象</th><th>状态</th><th>创建日期</th><th class="align-right">操作</th></tr></thead><tbody><tr v-for="item in filteredItems" :key="item.id"><td class="cell-title">{{ item.title }}</td><td>{{ item.category || '通用' }}</td><td>{{ targetLabel(item) }}</td><td><span :class="['status', isDone(item) ? 'success' : 'pending']">{{ itemStatus(item) }}</span></td><td>{{ item.createdAt }}</td><td class="align-right"><button v-if="manageTab === 'plan' && item.applied && !item.accepted" class="table-action" @click="acceptPlan(item)">验收</button><button class="table-action" @click="openEditor(item)">编辑</button><button class="table-action danger" @click="removeItem(item)">删除</button></td></tr></tbody></table></div>
            <EmptyState v-else :title="search ? '没有符合条件的内容' : `暂无${manageTitle}内容`" :description="search ? '试试其他关键词或筛选条件。' : isCreatable ? `点击右上角添加${entityLabel}。` : '此功能暂未接入演示数据。'" icon="file" />
          </section>
        </template>

        <template v-else-if="view === 'reports'">
          <div class="metric-row report-metrics"><div v-for="metric in reportMetrics" :key="metric.label" class="metric"><span class="metric-icon" :class="metric.tone"><component :is="metric.icon" :size="19" /></span><span class="metric-copy"><small>{{ metric.label }}</small><strong>{{ metric.value }}</strong></span></div></div>
          <section class="section"><div class="section-head"><div><h2>{{ reportTitle }}统计</h2><span>演示用户</span></div></div><EmptyState title="暂无图表数据" description="当前演示项目提供基础数量统计。" icon="chart" /></section>
        </template>

        <template v-else-if="view === 'realtime'"><div class="metric-row report-metrics"><div v-for="metric in reportMetrics" :key="metric.label" class="metric"><span class="metric-icon" :class="metric.tone"><component :is="metric.icon" :size="19" /></span><span class="metric-copy"><small>{{ metric.label }}</small><strong>{{ metric.value }}</strong></span></div></div><section class="section"><div class="section-head"><h2>今日学习记录</h2></div><div class="inline-empty">今日暂无学习记录</div></section></template>

        <template v-else>
          <section class="section table-section"><div class="section-head"><div><h2>{{ currentTitle }}</h2><span>共 {{ filteredItems.length }} 条</span></div></div>
            <template v-if="view === 'courses' && filteredItems.length"><div class="item-grid"><article v-for="course in filteredItems" :key="course.id" class="course-card"><div class="course-cover"><span>暂无封面</span></div><div class="course-body"><div class="card-meta"><span>{{ course.assigned ? '必须学习' : '自主学习' }}</span><span :class="['status', course.completed ? 'success' : 'pending']">{{ course.completed ? '已完成' : '进行中' }}</span></div><h3>{{ course.title }}</h3><p>{{ course.teacher || '未指定讲师' }} · {{ course.category || '未分类' }}</p><button class="small-action" @click="completeItem('courses', course)">{{ course.completed ? '已完成' : '完成学习' }} <Check :size="14" /></button></div></article></div></template>
            <div v-else-if="filteredItems.length" class="table-scroll"><table><thead><tr><th>名称</th><th>类型</th><th>学习要求</th><th>状态</th><th>日期</th><th class="align-right">操作</th></tr></thead><tbody><tr v-for="item in filteredItems" :key="item.id"><td class="cell-title">{{ item.title }}</td><td>{{ item.category || '通用' }}</td><td>{{ item.assigned ? '必须学习' : '自主学习' }}</td><td><span :class="['status', isDone(item) ? 'success' : 'pending']">{{ itemStatus(item) }}</span></td><td>{{ item.endDate || item.createdAt }}</td><td class="align-right"><button v-if="view === 'plans' && item.completed && !item.accepted" class="table-action" @click="applyAcceptance(item)">{{ item.applied ? '待验收' : '申请验收' }}</button><button v-else-if="view === 'exams' && !item.completed" class="table-action" @click="completeItem('exams', item)">模拟考试完成</button><button v-else-if="view === 'plans' && !item.completed" class="table-action" @click="completeItem('plans', item)">完成计划</button><span v-else class="muted">{{ item.accepted ? '已验收' : '—' }}</span></td></tr></tbody></table></div>
            <EmptyState v-else :title="search ? '没有符合条件的内容' : `暂无${currentTitle}内容`" :description="search ? '试试其他关键词或筛选条件。' : emptyDescription" :icon="emptyIcon" />
          </section>
        </template>
    </main>

    <div v-if="showCoursePicker" class="modal-backdrop" @click.self="showCoursePicker = false"><div class="modal" role="dialog" aria-modal="true" aria-label="添加课程到学习路径"><div class="modal-head"><h2>添加课程到学习路径</h2><button class="icon-button" title="关闭" @click="showCoursePicker = false"><X :size="19" /></button></div><div class="course-picker"><div v-if="unassignedCourses.length"><div v-for="item in unassignedCourses" :key="item.id" class="picker-row"><span>{{ item.title }}</span><button class="primary-button" @click="assignCourse(item)">加入</button></div></div><div v-else class="inline-empty">暂无可添加课程</div></div></div></div>
    <div v-if="editorOpen" class="modal-backdrop" @click.self="editorOpen = false">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="editor.id ? `编辑${entityLabel}` : `添加${entityLabel}`">
        <div class="modal-head"><h2>{{ editor.id ? '编辑' : '添加' }}{{ entityLabel }}</h2><button class="icon-button" title="关闭" @click="editorOpen = false"><X :size="19" /></button></div>
        <form @submit.prevent="saveItem">
          <label>名称 <span>*</span><input v-model.trim="editor.title" required maxlength="80" :placeholder="`请输入${entityLabel}名称`" /></label>
          <label v-if="manageTab === 'course'">讲师<input v-model.trim="editor.teacher" maxlength="40" placeholder="请输入虚构讲师名称" /></label>
          <label>类型<input v-model.trim="editor.category" maxlength="30" placeholder="例如：通用" /></label>
          <label v-if="manageTab === 'course'">课程简介<textarea v-model.trim="editor.description" rows="3" maxlength="300" placeholder="请输入课程简介"></textarea></label>
          <label v-if="manageTab === 'plan'">截止日期<input v-model="editor.endDate" type="date" /></label>
          <label v-if="manageTab === 'question'">参考答案<textarea v-model.trim="editor.description" rows="2" maxlength="300" placeholder="请输入参考答案"></textarea></label>
          <label v-if="manageTab === 'bill'">金额<input v-model="editor.amount" type="number" min="0" step="0.01" placeholder="请输入金额" /></label>
          <label v-if="manageTab === 'certificate'">证书编号<input v-model.trim="editor.code" maxlength="40" placeholder="请输入证书编号" /></label>
          <label>所属公司<select v-model="editor.companyId" @change="editor.targetPersonIds = []"><option v-for="company in data.companies" :key="company.id" :value="company.id">{{ company.name }}</option></select></label>
          <div class="target-selector"><span>目标人员</span><div><label v-for="person in editorPeople" :key="person.id"><input v-model="editor.targetPersonIds" type="checkbox" :value="person.id" />{{ person.name }}</label></div></div>
          <div class="modal-actions"><button type="button" class="ghost-button" @click="editorOpen = false">取消</button><button type="submit" class="primary-button">保存</button></div>
        </form>
      </div>
    </div>
    <div v-if="toast" class="toast" role="status"><CheckCircle2 :size="17" />{{ toast }}</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { GraduationCap, X, Menu, ChevronRight, Circle, BookOpen, CalendarDays, ClipboardCheck, ArrowRight, ArrowUpRight, Search, Plus, Check, CheckCircle2, LayoutDashboard, LibraryBig, ListChecks, History, BookX, ReceiptText, Bell, Settings2, ChartNoAxesCombined, FileText, Award, Files, HelpCircle } from 'lucide-vue-next';
import EmptyState from './components/EmptyState.vue';
import { createDemoData, demoUserId } from './demoData.js';

const userNav = [
  { key: 'learning', label: '我的学习', icon: LayoutDashboard },
  { key: 'plans', label: '培训计划', icon: CalendarDays },
  { key: 'courses', label: '课程中心', icon: LibraryBig },
  { key: 'exams', label: '考试中心', icon: ClipboardCheck },
  { key: 'records', label: '学习记录', icon: History },
  { key: 'wrong', label: '错题本', icon: BookX },
  { key: 'bills', label: '支付账单', icon: ReceiptText },
  { key: 'notices', label: '通知中心', icon: Bell },
];
const adminNav = [{ key: 'realtime', label: '实时呈现', icon: ChartNoAxesCombined }, { key: 'reports', label: '数据报表', icon: ChartNoAxesCombined }, { key: 'manage', label: '功能管理', icon: Settings2 }];
const manageTabs = [{ key: 'question', label: '题库管理' }, { key: 'certificate', label: '证书管理' }, { key: 'course', label: '课程管理' }, { key: 'exam', label: '考试管理' }, { key: 'plan', label: '计划管理' }, { key: 'bill', label: '账单管理' }];
const reportTabs = [{ key: 'overview', label: '总览' }, { key: 'course', label: '课程' }, { key: 'exam', label: '考试' }, { key: 'plan', label: '计划' }, { key: 'bill', label: '账单' }];
const storageKey = 'peixun-standalone-demo-v2';
function readData() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const raw = JSON.parse(saved);
      if (raw && Array.isArray(raw.companies) && Array.isArray(raw.people)) return raw;
    }
    const fixtures = createDemoData();
    const old = JSON.parse(localStorage.getItem('peixun-standalone-demo-v1'));
    if (!old) return fixtures;
    for (const key of ['courses', 'exams', 'plans', 'questions', 'certificates', 'bills']) {
      const fixtureIds = new Set(fixtures[key].map(item => item.id));
      fixtures[key].push(...(Array.isArray(old[key]) ? old[key].filter(item => !fixtureIds.has(item.id)) : []));
    }
    return fixtures;
  } catch { return createDemoData(); }
}
const data = ref(readData());
watch(data, value => localStorage.setItem(storageKey, JSON.stringify(value)), { deep: true });
const years = [new Date().getFullYear() - 2, new Date().getFullYear() - 1, new Date().getFullYear()];
const months = Array.from({ length: 12 }, (_, index) => index + 1);
months.unshift(0);
const activeYear = ref(new Date().getFullYear());
const activeMonth = ref(0);
const startDate = ref('');
const endDate = ref('');
const companyFilter = ref('all');
const departmentFilter = ref('all');
const personFilter = ref('all');
watch(companyFilter, () => { departmentFilter.value = 'all'; personFilter.value = 'all'; });
watch(departmentFilter, () => { personFilter.value = 'all'; });
const categoryFilter = ref('');
const courseTypes = ['', '岗位必修', '技术体系', '软技能', '行业认证'];
const planTypes = ['', '岗位学习地图', '专项训练营'];
const assignmentOptions = [{ value: 'all', label: '全部' }, { value: 'required', label: '必须学习' }, { value: 'optional', label: '自主学习' }];
const statusOptions = [{ value: 'all', label: '全部' }, { value: 'active', label: '进行中' }, { value: 'done', label: '已完成' }];
const view = ref('learning');
const manageTab = ref('question');
watch(manageTab, () => { search.value = ''; categoryFilter.value = ''; statusFilter.value = 'all'; });
const reportTab = ref('overview');
const search = ref('');
const statusFilter = ref('all');
const assignmentFilter = ref('all');
const courseTab = ref('pending');
const planTab = ref('pending');
const examTab = ref('pending');
const showCoursePicker = ref(false);
const mobileOpen = ref(false);
const editorOpen = ref(false);
const editor = ref({});
const toast = ref('');
let toastTimer;
const availableDepartments = computed(() => [...new Set(data.value.people.filter(person => companyFilter.value === 'all' || person.companyId === companyFilter.value).map(person => person.department))]);
const availablePeople = computed(() => data.value.people.filter(person => (companyFilter.value === 'all' || person.companyId === companyFilter.value) && (departmentFilter.value === 'all' || person.department === departmentFilter.value)));
const editorPeople = computed(() => data.value.people.filter(person => person.companyId === editor.value.companyId));
const currentTitle = computed(() => [...userNav, ...adminNav].find(item => item.key === view.value)?.label || '培训');
const manageTitle = computed(() => manageTabs.find(item => item.key === manageTab.value)?.label || '管理');
const reportTitle = computed(() => reportTabs.find(item => item.key === reportTab.value)?.label || '总览');
const entityLabel = computed(() => ({ course: '课程', exam: '考试', plan: '计划', question: '题目', certificate: '证书', bill: '账单' })[manageTab.value] || '内容');
const isCreatable = computed(() => true);
const manageCollection = computed(() => ({ course: 'courses', exam: 'exams', plan: 'plans', question: 'questions', certificate: 'certificates', bill: 'bills' })[manageTab.value]);
const activePersonId = computed(() => personFilter.value === 'all' ? demoUserId : personFilter.value);
const activePersonCompanyId = computed(() => data.value.people.find(person => person.id === activePersonId.value)?.companyId);
const assignedCourses = computed(() => data.value.courses.filter(isAssignedToActivePerson));
const assignedExams = computed(() => data.value.exams.filter(isAssignedToActivePerson));
const assignedPlans = computed(() => data.value.plans.filter(isAssignedToActivePerson));
const assignedWrongQuestions = computed(() => data.value.wrongQuestions.filter(isAssignedToActivePerson));
const assignedCertificates = computed(() => data.value.certificates.filter(isAssignedToActivePerson));
const unassignedCourses = computed(() => data.value.courses.filter(item => item.companyId === activePersonCompanyId.value && !isAssignedToActivePerson(item)));
const visibleLearningCourses = computed(() => assignedCourses.value.filter(item => courseTab.value === 'completed' ? item.completed : !item.completed));
const visibleLearningPlans = computed(() => assignedPlans.value.filter(item => planTab.value === 'completed' ? item.accepted : !item.accepted));
const visibleLearningExams = computed(() => assignedExams.value.filter(item => examTab.value === 'completed' ? item.completed : !item.completed));
const completedRecords = computed(() => assignedCourses.value.filter(item => item.completed));
const learningMetrics = computed(() => [
  { label: '待学习课程', value: assignedCourses.value.filter(item => !item.completed).length, view: 'courses' },
  { label: '待完成计划', value: assignedPlans.value.filter(item => !item.accepted).length, view: 'plans' },
  { label: '我的考试', value: assignedExams.value.length, view: 'exams' },
]);
const reportMetrics = computed(() => [
  { label: '课程总数', value: data.value.courses.length, icon: BookOpen, tone: 'blue' },
  { label: '考试总数', value: data.value.exams.length, icon: ClipboardCheck, tone: 'orange' },
  { label: '计划总数', value: data.value.plans.length, icon: CalendarDays, tone: 'green' },
  { label: '账单总数', value: data.value.bills.length, icon: ReceiptText, tone: 'violet' },
]);
const rawItems = computed(() => {
  if (view.value === 'manage') return data.value[manageCollection.value] || [];
  if (view.value === 'courses' || view.value === 'exams' || view.value === 'plans') return data.value[view.value];
  if (view.value === 'records') return companyFilter.value === 'all' && personFilter.value === 'all' ? completedRecords.value : data.value.courses.filter(item => item.completed);
  if (view.value === 'bills' || view.value === 'notices') return companyFilter.value === 'all' && personFilter.value === 'all' ? data.value[view.value].filter(isDemoAssigned) : data.value[view.value];
  if (view.value === 'wrong') return companyFilter.value === 'all' && personFilter.value === 'all' ? data.value.wrongQuestions.filter(isDemoAssigned) : data.value.wrongQuestions;
  return [];
});
const filteredItems = computed(() => rawItems.value.filter(item => {
  if (search.value && !`${item.title} ${item.category || ''}`.toLowerCase().includes(search.value.toLowerCase())) return false;
  if (categoryFilter.value && item.category !== categoryFilter.value) return false;
  if (companyFilter.value !== 'all' && item.companyId !== companyFilter.value) return false;
  if (departmentFilter.value !== 'all' && !matchesDepartment(item, departmentFilter.value)) return false;
  if (personFilter.value !== 'all' && !matchesPerson(item, personFilter.value)) return false;
  const date = new Date(item.createdAt);
  if (!Number.isNaN(date.getTime())) {
    if (date.getFullYear() !== activeYear.value) return false;
    if (activeMonth.value && date.getMonth() + 1 !== activeMonth.value) return false;
    if (startDate.value && date < new Date(startDate.value)) return false;
    if (endDate.value && date > new Date(`${endDate.value}T23:59:59`)) return false;
  }
  if (statusFilter.value === 'done' && !isDone(item)) return false;
  if (statusFilter.value === 'active' && isDone(item)) return false;
  const required = personFilter.value === 'all' ? isDemoAssigned(item) : item.targetPersonIds?.includes(personFilter.value);
  if (view.value !== 'manage' && assignmentFilter.value === 'required' && !required) return false;
  if (view.value !== 'manage' && assignmentFilter.value === 'optional' && required) return false;
  return true;
}));
const emptyDescription = computed(() => ({ courses: '课程由功能管理创建，创建后可在这里查看。', exams: '考试由功能管理创建，创建后可在这里查看。', plans: '计划由功能管理创建，创建后可在这里查看。', records: '完成课程后，学习记录会显示在这里。', wrong: '暂无错题记录。', bills: '暂无账单记录。', notices: '暂无通知。' })[view.value] || '暂无内容。');
const emptyIcon = computed(() => ({ courses: 'book', exams: 'exam', plans: 'calendar', records: 'file', wrong: 'book', bills: 'file', notices: 'file' })[view.value] || 'file');

function navigate(key) { view.value = key; search.value = ''; categoryFilter.value = ''; statusFilter.value = 'all'; assignmentFilter.value = 'all'; window.scrollTo({ top: 0 }); }
function isDemoAssigned(item) { return Array.isArray(item.targetPersonIds) ? item.targetPersonIds.includes(demoUserId) : !!item.assigned; }
function isAssignedToActivePerson(item) {
  return (!item.companyId || companyFilter.value === 'all' || item.companyId === companyFilter.value) &&
    (activePersonId.value === demoUserId ? isDemoAssigned(item) : item.targetPersonIds?.includes(activePersonId.value));
}
function matchesPerson(item, personId) {
  const person = data.value.people.find(entry => entry.id === personId);
  if (!person || item.companyId && item.companyId !== person.companyId) return false;
  return Array.isArray(item.targetPersonIds) ? item.targetPersonIds.length === 0 || item.targetPersonIds.includes(personId) : !!item.assigned && personId === demoUserId;
}
function matchesDepartment(item, department) {
  const targets = item.targetPersonIds || [];
  return targets.length === 0 || targets.some(id => data.value.people.some(person => person.id === id && person.department === department));
}
function targetLabel(item) {
  if (!item.targetPersonIds?.length) return '自主参与';
  return item.targetPersonIds.map(id => data.value.people.find(person => person.id === id)?.name).filter(Boolean).join('、');
}
function isPlanView() { return view.value === 'plans' || (view.value === 'manage' && manageTab.value === 'plan'); }
function isDone(item) { return isPlanView() ? !!item.accepted : !!item.completed; }
function itemStatus(item) { if (isPlanView()) return item.accepted ? '已验收' : item.applied ? '待验收' : item.completed ? '待申请验收' : '进行中'; return item.completed ? '已完成' : '进行中'; }
function flash(message) { toast.value = message; clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.value = '', 2500); }
function openEditor(item) { editor.value = item ? { ...item, targetPersonIds: [...(item.targetPersonIds || (item.assigned ? [demoUserId] : []))] } : { title: '', category: '', description: '', endDate: '', companyId: 'company-a', targetPersonIds: [] }; editorOpen.value = true; }
function saveItem() {
  if (!editor.value.title?.trim() || !manageCollection.value) return;
  const key = manageCollection.value;
  const item = { ...editor.value, title: editor.value.title.trim(), category: editor.value.category?.trim() || '', assigned: editor.value.targetPersonIds.includes(demoUserId), id: editor.value.id || crypto.randomUUID(), createdAt: editor.value.createdAt || new Date().toISOString().slice(0, 10), completed: editor.value.completed || false };
  const index = data.value[key].findIndex(entry => entry.id === item.id);
  if (index === -1) data.value[key].unshift(item); else data.value[key][index] = item;
  editorOpen.value = false; flash(index === -1 ? '已添加' : '已保存');
}
function removeItem(item) { if (!manageCollection.value || !window.confirm(`确定删除“${item.title}”吗？`)) return; data.value[manageCollection.value] = data.value[manageCollection.value].filter(entry => entry.id !== item.id); flash('已删除'); }
function completeItem(key, item) { if (item.completed) return; item.completed = true; flash(key === 'exams' ? '演示考试已完成' : '已标记完成'); }
function applyAcceptance(item) { if (item.applied) return; item.applied = true; flash('已提交验收申请'); }
function acceptPlan(item) { item.accepted = true; flash('计划已验收'); }
function assignCourse(item) { item.targetPersonIds = [...new Set([...(item.targetPersonIds || []), activePersonId.value])]; item.assigned = item.targetPersonIds.includes(demoUserId); showCoursePicker.value = false; flash('已加入学习路径'); }
function resetDemoData() { if (!window.confirm('重新载入测试数据会清除当前浏览器中的演示修改，确定继续吗？')) return; data.value = createDemoData(); companyFilter.value = 'all'; personFilter.value = 'all'; departmentFilter.value = 'all'; flash('测试数据已重置'); }
</script>
