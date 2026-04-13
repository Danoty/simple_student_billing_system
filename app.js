const STORAGE_KEY = 'edubill_school_erp_v6';
const PRIVILEGES = ['dashboard','students','attendance','finance','exams','staff','communication','reports','users','settings'];

const defaultState = {
  settings: {
    schoolName: 'EduBill School ERP v6',
    schoolTerm: 'Term 1 2026',
    schoolPhone: '+254 700 000000',
    schoolEmail: 'info@school.ac.ke',
    schoolAddress: 'Main Campus',
    currency: 'KES',
    footerNote: 'Simple school ERP demo.'
  },
  auth: {
    users: [
      { id: uid('USR'), fullName: 'System Administrator', username: 'admin', password: 'admin123', role: 'Administrator', status: 'Active', approvalLimit: 999999999, privileges: ['*'] },
      { id: uid('USR'), fullName: 'Chief Executive Officer', username: 'ceo', password: 'ceo123', role: 'CEO', status: 'Active', approvalLimit: 500000, privileges: ['dashboard','reports','users','settings','finance','students'] },
      { id: uid('USR'), fullName: 'Finance Officer', username: 'finance', password: 'finance123', role: 'Finance Officer', status: 'Active', approvalLimit: 100000, privileges: ['dashboard','finance','reports','students','communication'] },
      { id: uid('USR'), fullName: 'Lead Teacher', username: 'teacher', password: 'teacher123', role: 'Teacher', status: 'Active', approvalLimit: 0, privileges: ['dashboard','students','attendance','exams','communication','reports'] }
    ],
    currentUser: null
  },
  students: [],
  attendance: [],
  banks: [],
  invoices: [],
  payments: [],
  refunds: [],
  exams: [],
  staff: [],
  messages: [],
  activities: [],
  lastSavedAt: null
};

const state = loadState();
const $ = id => document.getElementById(id);
const els = {
  authScreen: $('authScreen'), appShell: $('appShell'), loginForm: $('loginForm'), loginUsername: $('loginUsername'), loginPassword: $('loginPassword'),
  navLinks: [...document.querySelectorAll('.nav-link')], sections: [...document.querySelectorAll('.section')], pageTitle: $('pageTitle'), pageSubtitle: $('pageSubtitle'), signedInUser: $('signedInUser'),
  brandSchoolName: $('brandSchoolName'), brandSchoolTerm: $('brandSchoolTerm'), lastSavedAt: $('lastSavedAt'),
  loadSampleBtn: $('loadSampleBtn'), exportBackupBtn: $('exportBackupBtn'), importBackupInput: $('importBackupInput'), logoutBtn: $('logoutBtn'), printPageBtn: $('printPageBtn'),
  statStudents: $('statStudents'), statStaff: $('statStaff'), statAttendance: $('statAttendance'), statInvoiced: $('statInvoiced'), statCollected: $('statCollected'), statOutstanding: $('statOutstanding'),
  dashboardHighlights: $('dashboardHighlights'), recentActivity: $('recentActivity'), outstandingStudents: $('outstandingStudents'),
  studentForm: $('studentForm'), studentId: $('studentId'), admissionNo: $('admissionNo'), studentName: $('studentName'), studentClass: $('studentClass'), parentContact: $('parentContact'), studentGender: $('studentGender'), studentStatus: $('studentStatus'), parentName: $('parentName'), studentNotes: $('studentNotes'), studentSearch: $('studentSearch'), studentsTableBody: $('studentsTableBody'), clearStudentBtn: $('clearStudentBtn'), promoteClassBtn: $('promoteClassBtn'),
  attendanceForm: $('attendanceForm'), attendanceDate: $('attendanceDate'), attendanceClass: $('attendanceClass'), attendanceStudent: $('attendanceStudent'), attendanceStatus: $('attendanceStatus'), attendanceRemarks: $('attendanceRemarks'), attendanceSearch: $('attendanceSearch'), attendanceSummary: $('attendanceSummary'), attendanceTableBody: $('attendanceTableBody'),
  bankForm: $('bankForm'), bankId: $('bankId'), bankName: $('bankName'), bankAccount: $('bankAccount'), bankOpeningBalance: $('bankOpeningBalance'),
  invoiceForm: $('invoiceForm'), invoiceStudent: $('invoiceStudent'), invoiceNumber: $('invoiceNumber'), invoiceDescription: $('invoiceDescription'), invoiceAmount: $('invoiceAmount'), invoiceDueDate: $('invoiceDueDate'),
  paymentForm: $('paymentForm'), paymentStudent: $('paymentStudent'), paymentBank: $('paymentBank'), receiptNumber: $('receiptNumber'), paymentAmount: $('paymentAmount'), paymentDate: $('paymentDate'), paymentReference: $('paymentReference'),
  refundForm: $('refundForm'), refundStudent: $('refundStudent'), refundBank: $('refundBank'), refundNumber: $('refundNumber'), refundAmount: $('refundAmount'), refundDate: $('refundDate'), refundReason: $('refundReason'),
  financeSearch: $('financeSearch'), financeTableBody: $('financeTableBody'), ledgerForm: $('ledgerForm'), ledgerStudent: $('ledgerStudent'), ledgerDate: $('ledgerDate'), ledgerSummary: $('ledgerSummary'), ledgerTableBody: $('ledgerTableBody'),
  examForm: $('examForm'), examStudent: $('examStudent'), examClass: $('examClass'), examTerm: $('examTerm'), examSubject: $('examSubject'), catMark: $('catMark'), examMark: $('examMark'), examSearch: $('examSearch'), examSummary: $('examSummary'), examTableBody: $('examTableBody'),
  staffForm: $('staffForm'), staffId: $('staffId'), staffNo: $('staffNo'), staffName: $('staffName'), staffRole: $('staffRole'), staffDepartment: $('staffDepartment'), staffPhone: $('staffPhone'), staffStatus: $('staffStatus'), staffSearch: $('staffSearch'), staffTableBody: $('staffTableBody'),
  messageForm: $('messageForm'), messageType: $('messageType'), messageAudience: $('messageAudience'), messageBody: $('messageBody'), messageSearch: $('messageSearch'), messageTableBody: $('messageTableBody'),
  reportsHighlights: $('reportsHighlights'), auditTrail: $('auditTrail'),
  exportStudentsCsvBtn: $('exportStudentsCsvBtn'), exportFinanceCsvBtn: $('exportFinanceCsvBtn'), exportResultsCsvBtn: $('exportResultsCsvBtn'),
  userForm: $('userForm'), userId: $('userId'), userFullName: $('userFullName'), userUsername: $('userUsername'), userPassword: $('userPassword'), userRole: $('userRole'), userStatus: $('userStatus'), approvalLimit: $('approvalLimit'), privilegesGrid: $('privilegesGrid'), clearUserBtn: $('clearUserBtn'), userSearch: $('userSearch'), workflowSummary: $('workflowSummary'), usersTableBody: $('usersTableBody'),
  settingsForm: $('settingsForm'), schoolName: $('schoolName'), schoolTerm: $('schoolTerm'), schoolPhone: $('schoolPhone'), schoolEmail: $('schoolEmail'), currency: $('currency'), schoolAddress: $('schoolAddress'), footerNote: $('footerNote')
};

init();

function init() {
  bindEvents();
  renderPrivilegeGrid();
  setDefaultDates();
  syncBranding();
  syncAuthUI();
  renderAll();
}

function bindEvents() {
  els.loginForm.addEventListener('submit', handleLogin);
  els.logoutBtn.addEventListener('click', handleLogout);
  els.printPageBtn.addEventListener('click', () => window.print());
  els.loadSampleBtn.addEventListener('click', seedSampleData);
  els.exportBackupBtn.addEventListener('click', exportBackup);
  els.importBackupInput.addEventListener('change', importBackup);
  els.navLinks.forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.section)));
  document.querySelectorAll('.quick-action').forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.jump)));

  els.studentForm.addEventListener('submit', saveStudent);
  els.clearStudentBtn.addEventListener('click', resetStudentForm);
  els.promoteClassBtn.addEventListener('click', promoteClass);
  els.studentSearch.addEventListener('input', renderStudents);

  els.attendanceForm.addEventListener('submit', saveAttendance);
  els.attendanceSearch.addEventListener('input', renderAttendance);
  els.attendanceClass.addEventListener('input', syncAttendanceStudentFilter);

  els.bankForm.addEventListener('submit', saveBank);
  els.invoiceForm.addEventListener('submit', saveInvoice);
  els.paymentForm.addEventListener('submit', savePayment);
  els.refundForm.addEventListener('submit', saveRefund);
  els.financeSearch.addEventListener('input', renderFinance);
  els.ledgerForm.addEventListener('submit', renderLedger);

  els.examForm.addEventListener('submit', saveExam);
  els.examSearch.addEventListener('input', renderExams);

  els.staffForm.addEventListener('submit', saveStaff);
  els.staffSearch.addEventListener('input', renderStaff);

  els.messageForm.addEventListener('submit', saveMessage);
  els.messageSearch.addEventListener('input', renderMessages);

  els.userForm.addEventListener('submit', saveUser);
  els.clearUserBtn.addEventListener('click', resetUserForm);
  els.userSearch.addEventListener('input', renderUsers);
  els.userRole.addEventListener('change', applyRolePresetToForm);

  els.settingsForm.addEventListener('submit', saveSettings);
  els.exportStudentsCsvBtn.addEventListener('click', () => exportCSV('students'));
  els.exportFinanceCsvBtn.addEventListener('click', () => exportCSV('finance'));
  els.exportResultsCsvBtn.addEventListener('click', () => exportCSV('results'));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      settings: { ...structuredClone(defaultState).settings, ...(parsed.settings || {}) },
      auth: { ...structuredClone(defaultState).auth, ...(parsed.auth || {}) },
      students: parsed.students || [], attendance: parsed.attendance || [], banks: parsed.banks || [], invoices: parsed.invoices || [], payments: parsed.payments || [], refunds: parsed.refunds || [], exams: parsed.exams || [], staff: parsed.staff || [], messages: parsed.messages || [], activities: parsed.activities || []
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function persist(activity) {
  state.lastSavedAt = new Date().toISOString();
  if (activity) addActivity(activity);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  els.lastSavedAt.textContent = new Date(state.lastSavedAt).toLocaleString();
}

function addActivity(text) {
  state.activities.unshift({ id: uid('ACT'), text, at: new Date().toISOString(), by: state.auth.currentUser?.fullName || 'System' });
  state.activities = state.activities.slice(0, 40);
}

function handleLogin(e) {
  e.preventDefault();
  const user = state.auth.users.find(u => u.username === els.loginUsername.value.trim() && u.password === els.loginPassword.value && u.status === 'Active');
  if (!user) return alert('Invalid credentials or inactive account.');
  state.auth.currentUser = { id: user.id, fullName: user.fullName, username: user.username, role: user.role, privileges: user.privileges };
  persist(`Logged in as ${user.role}`);
  syncAuthUI();
  renderAll();
}

function handleLogout() {
  state.auth.currentUser = null;
  persist('Logged out');
  syncAuthUI();
}

function syncAuthUI() {
  const loggedIn = !!state.auth.currentUser;
  els.authScreen.classList.toggle('hidden', loggedIn);
  els.appShell.classList.toggle('hidden', !loggedIn);
  els.signedInUser.textContent = loggedIn ? `${state.auth.currentUser.fullName} • ${state.auth.currentUser.role}` : 'Not signed in';
  applyAccessControl();
}

function applyAccessControl() {
  const privileges = state.auth.currentUser?.privileges || [];
  const all = privileges.includes('*');
  els.navLinks.forEach(btn => {
    const allowed = all || privileges.includes(btn.dataset.section);
    btn.style.display = allowed ? '' : 'none';
  });
  const active = document.querySelector('.nav-link.active');
  if (active && active.style.display === 'none') {
    const firstAllowed = els.navLinks.find(btn => btn.style.display !== 'none');
    if (firstAllowed) switchSection(firstAllowed.dataset.section);
  }
}

function switchSection(id) {
  const userPrivs = state.auth.currentUser?.privileges || [];
  if (!(userPrivs.includes('*') || userPrivs.includes(id))) return;
  els.navLinks.forEach(btn => btn.classList.toggle('active', btn.dataset.section === id));
  els.sections.forEach(sec => sec.classList.toggle('active', sec.id === id));
  els.pageTitle.textContent = document.querySelector(`.nav-link[data-section="${id}"]`)?.textContent || 'Dashboard';
  const subtitles = {
    dashboard: 'Overview of students, attendance, finance and school operations.',
    students: 'Admission, student profile updates and promotion management.',
    attendance: 'Daily attendance and summary tracking.',
    finance: 'Banks, invoices, receipts, refunds, reversals and ledger.',
    exams: 'Enter CATs and exam marks with automatic grading.',
    staff: 'Teacher and staff record maintenance.',
    communication: 'Announcements, fee reminders and message logs.',
    reports: 'Simple fee balance, performance and attendance reports.',
    users: 'Admin user creation, privileges and approval workflow access.',
    settings: 'School branding and system configuration.'
  };
  els.pageSubtitle.textContent = subtitles[id] || '';
}

function syncBranding() {
  const s = state.settings;
  els.brandSchoolName.textContent = s.schoolName;
  els.brandSchoolTerm.textContent = s.schoolTerm;
  els.schoolName.value = s.schoolName;
  els.schoolTerm.value = s.schoolTerm;
  els.schoolPhone.value = s.schoolPhone;
  els.schoolEmail.value = s.schoolEmail;
  els.currency.value = s.currency;
  els.schoolAddress.value = s.schoolAddress;
  els.footerNote.value = s.footerNote;
  if (state.lastSavedAt) els.lastSavedAt.textContent = new Date(state.lastSavedAt).toLocaleString();
}

function saveSettings(e) {
  e.preventDefault();
  state.settings = {
    schoolName: els.schoolName.value.trim(), schoolTerm: els.schoolTerm.value.trim(), schoolPhone: els.schoolPhone.value.trim(), schoolEmail: els.schoolEmail.value.trim(), schoolAddress: els.schoolAddress.value.trim(), currency: els.currency.value.trim() || 'KES', footerNote: els.footerNote.value.trim()
  };
  persist('Updated institution settings');
  syncBranding();
}

function setDefaultDates() {
  const today = new Date().toISOString().slice(0,10);
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0,10);
  els.attendanceDate.value = today;
  els.paymentDate.value = today;
  els.refundDate.value = today;
  els.ledgerDate.value = today;
  els.invoiceDueDate.value = due;
}

function renderAll() {
  populateSelectors();
  renderDashboard();
  renderStudents();
  renderAttendance();
  renderFinance();
  renderLedger();
  renderExams();
  renderStaff();
  renderMessages();
  renderReports();
  renderUsers();
}

function populateSelectors() {
  const studentOptions = ['<option value="">Select student</option>'].concat(state.students.map(s => `<option value="${s.id}">${escapeHtml(s.fullName)} (${escapeHtml(s.admissionNo)})</option>`)).join('');
  ['attendanceStudent','invoiceStudent','paymentStudent','refundStudent','ledgerStudent','examStudent'].forEach(id => { const el = $(id); if (el) el.innerHTML = studentOptions; });
  const bankOptions = ['<option value="">Select bank</option>'].concat(state.banks.map(b => `<option value="${b.id}">${escapeHtml(b.name)} - ${escapeHtml(b.accountNo)}</option>`)).join('');
  ['paymentBank','refundBank'].forEach(id => { const el = $(id); if (el) el.innerHTML = bankOptions; });
  syncAttendanceStudentFilter();
}

function saveStudent(e) {
  e.preventDefault();
  const payload = {
    id: els.studentId.value || uid('STD'), admissionNo: els.admissionNo.value.trim(), fullName: els.studentName.value.trim(), className: els.studentClass.value.trim(), parentContact: els.parentContact.value.trim(), gender: els.studentGender.value, status: els.studentStatus.value, parentName: els.parentName.value.trim(), notes: els.studentNotes.value.trim(), createdAt: new Date().toISOString()
  };
  upsert(state.students, payload);
  persist(`Saved student ${payload.fullName}`);
  resetStudentForm();
  populateSelectors();
  renderAll();
}

function resetStudentForm() { els.studentForm.reset(); els.studentId.value = ''; els.studentStatus.value = 'Active'; }

function editStudent(id) {
  const s = state.students.find(x => x.id === id); if (!s) return;
  els.studentId.value = s.id; els.admissionNo.value = s.admissionNo; els.studentName.value = s.fullName; els.studentClass.value = s.className; els.parentContact.value = s.parentContact; els.studentGender.value = s.gender; els.studentStatus.value = s.status; els.parentName.value = s.parentName; els.studentNotes.value = s.notes || '';
  switchSection('students');
}

function promoteClass() {
  const currentClass = prompt('Enter current class to promote, e.g. Grade 7');
  if (!currentClass) return;
  const nextClass = prompt('Enter next class, e.g. Grade 8');
  if (!nextClass) return;
  let count = 0;
  state.students.forEach(s => { if (s.className.toLowerCase() === currentClass.toLowerCase() && s.status === 'Active') { s.className = nextClass; count++; } });
  persist(`Promoted ${count} students from ${currentClass} to ${nextClass}`);
  renderAll();
}

function renderStudents() {
  const q = els.studentSearch.value.trim().toLowerCase();
  const rows = state.students.filter(s => [s.admissionNo,s.fullName,s.className,s.parentContact,s.status].join(' ').toLowerCase().includes(q)).sort((a,b)=>a.fullName.localeCompare(b.fullName));
  els.studentsTableBody.innerHTML = rows.length ? rows.map(s => `
    <tr>
      <td>${escapeHtml(s.admissionNo)}</td>
      <td>${escapeHtml(s.fullName)}</td>
      <td>${escapeHtml(s.className)}</td>
      <td>${escapeHtml(s.parentContact || '-')}</td>
      <td>${statusTag(s.status)}</td>
      <td><div class="action-row"><button onclick="editStudent('${s.id}')">Edit</button></div></td>
    </tr>`).join('') : `<tr><td colspan="6" class="muted">No students found.</td></tr>`;
}

function syncAttendanceStudentFilter() {
  const classVal = els.attendanceClass.value.trim().toLowerCase();
  const filtered = state.students.filter(s => !classVal || s.className.toLowerCase().includes(classVal));
  els.attendanceStudent.innerHTML = ['<option value="">Select student</option>'].concat(filtered.map(s => `<option value="${s.id}">${escapeHtml(s.fullName)} (${escapeHtml(s.className)})</option>`)).join('');
}

function saveAttendance(e) {
  e.preventDefault();
  const student = byId(state.students, els.attendanceStudent.value);
  if (!student) return alert('Select student.');
  const payload = { id: uid('ATT'), date: els.attendanceDate.value, className: els.attendanceClass.value.trim(), studentId: student.id, studentName: student.fullName, status: els.attendanceStatus.value, remarks: els.attendanceRemarks.value.trim() };
  state.attendance.push(payload);
  persist(`Marked ${payload.status.toLowerCase()} attendance for ${student.fullName}`);
  els.attendanceForm.reset();
  setDefaultDates();
  renderAttendance();
  renderDashboard();
}

function renderAttendance() {
  const q = els.attendanceSearch.value.trim().toLowerCase();
  const rows = state.attendance.filter(a => [a.date,a.className,a.studentName,a.status,a.remarks].join(' ').toLowerCase().includes(q)).sort((a,b)=>(b.date+a.studentName).localeCompare(a.date+b.studentName));
  els.attendanceTableBody.innerHTML = rows.length ? rows.map(a => `<tr><td>${a.date}</td><td>${escapeHtml(a.studentName)}</td><td>${escapeHtml(a.className)}</td><td>${statusTag(a.status)}</td><td>${escapeHtml(a.remarks || '-')}</td></tr>`).join('') : `<tr><td colspan="5" class="muted">No attendance records found.</td></tr>`;
  const total = state.attendance.length;
  const present = state.attendance.filter(a => a.status === 'Present').length;
  const absent = state.attendance.filter(a => a.status === 'Absent').length;
  const late = state.attendance.filter(a => a.status === 'Late').length;
  els.attendanceSummary.innerHTML = summaryCard('Total Entries', total) + summaryCard('Present', present) + summaryCard('Absent', absent) + summaryCard('Late', late);
}

function saveBank(e) {
  e.preventDefault();
  const payload = { id: els.bankId.value || uid('BNK'), name: els.bankName.value.trim(), accountNo: els.bankAccount.value.trim(), openingBalance: num(els.bankOpeningBalance.value) };
  upsert(state.banks, payload);
  persist(`Saved bank ${payload.name}`);
  els.bankForm.reset();
  els.bankOpeningBalance.value = 0;
  populateSelectors();
  renderFinance();
}

function saveInvoice(e) {
  e.preventDefault();
  const student = byId(state.students, els.invoiceStudent.value);
  if (!student) return alert('Select student.');
  state.invoices.push({ id: uid('INV'), studentId: student.id, studentName: student.fullName, invoiceNo: els.invoiceNumber.value.trim(), description: els.invoiceDescription.value.trim(), amount: num(els.invoiceAmount.value), dueDate: els.invoiceDueDate.value, status: 'Draft', createdAt: todayIso() });
  persist(`Created draft invoice ${els.invoiceNumber.value.trim()}`);
  els.invoiceForm.reset(); setDefaultDates();
  renderFinance();
}

function savePayment(e) {
  e.preventDefault();
  const student = byId(state.students, els.paymentStudent.value);
  const bank = byId(state.banks, els.paymentBank.value);
  if (!student || !bank) return alert('Select student and bank.');
  state.payments.push({ id: uid('RCP'), studentId: student.id, studentName: student.fullName, bankId: bank.id, bankName: bank.name, receiptNo: els.receiptNumber.value.trim(), amount: num(els.paymentAmount.value), date: els.paymentDate.value, reference: els.paymentReference.value.trim(), status: 'Draft' });
  persist(`Created draft receipt ${els.receiptNumber.value.trim()}`);
  els.paymentForm.reset(); setDefaultDates();
  renderFinance();
}

function saveRefund(e) {
  e.preventDefault();
  const student = byId(state.students, els.refundStudent.value);
  const bank = byId(state.banks, els.refundBank.value);
  if (!student || !bank) return alert('Select student and bank.');
  state.refunds.push({ id: uid('RFD'), studentId: student.id, studentName: student.fullName, bankId: bank.id, bankName: bank.name, refundNo: els.refundNumber.value.trim(), amount: num(els.refundAmount.value), date: els.refundDate.value, reason: els.refundReason.value.trim(), status: 'Draft' });
  persist(`Created draft refund ${els.refundNumber.value.trim()}`);
  els.refundForm.reset(); setDefaultDates();
  renderFinance();
}

function renderFinance() {
  const q = els.financeSearch.value.trim().toLowerCase();
  const rows = [
    ...state.invoices.map(i => ({ type: 'Invoice', id: i.id, ref: i.invoiceNo, studentName: i.studentName, amount: i.amount, status: i.status, date: i.createdAt || i.dueDate, object: i })),
    ...state.payments.map(p => ({ type: 'Receipt', id: p.id, ref: p.receiptNo, studentName: p.studentName, amount: p.amount, status: p.status, date: p.date, object: p })),
    ...state.refunds.map(r => ({ type: 'Refund', id: r.id, ref: r.refundNo, studentName: r.studentName, amount: r.amount, status: r.status, date: r.date, object: r }))
  ].filter(r => [r.type, r.ref, r.studentName, r.status, r.amount].join(' ').toLowerCase().includes(q)).sort((a,b)=> String(b.date).localeCompare(String(a.date)));
  els.financeTableBody.innerHTML = rows.length ? rows.map(r => `<tr>
    <td>${statusTag(r.type)}</td><td>${escapeHtml(r.ref)}</td><td>${escapeHtml(r.studentName)}</td><td>${money(r.amount)}</td><td>${statusTag(r.status)}</td>
    <td><div class="action-row">${financeActions(r)}</div></td>
  </tr>`).join('') : `<tr><td colspan="6" class="muted">No finance records found.</td></tr>`;
}

function financeActions(row) {
  if (row.status === 'Draft') return `<button onclick="postFinance('${row.type}','${row.id}')">Post</button>`;
  if (row.status === 'Approved') return `<button onclick="postFinance('${row.type}','${row.id}')">Pay / Post</button>`;
  if (row.status === 'Posted' && row.type !== 'Refund') return `<button onclick="reverseFinance('${row.type}','${row.id}')">Reverse</button>`;
  if (row.status === 'Posted' && row.type === 'Refund') return `<button onclick="reverseFinance('${row.type}','${row.id}')">Reverse</button>`;
  if (row.status === 'Draft' && row.type === 'Refund') return `<button onclick="approveRefund('${row.id}')">Approve</button>`;
  return '-';
}

function postFinance(type, id) {
  let rec;
  if (type === 'Invoice') { rec = byId(state.invoices, id); if (!rec) return; rec.status = 'Posted'; persist(`Posted invoice ${rec.invoiceNo} (Dr Student Debtor, Cr Fee Revenue)`); }
  if (type === 'Receipt') { rec = byId(state.payments, id); if (!rec) return; rec.status = 'Posted'; persist(`Posted receipt ${rec.receiptNo} (Dr Bank, Cr Student)`); }
  if (type === 'Refund') { rec = byId(state.refunds, id); if (!rec) return; rec.status = 'Posted'; persist(`Paid refund ${rec.refundNo} (Cr Bank)`); }
  renderAll();
}

function approveRefund(id) {
  const rec = byId(state.refunds, id); if (!rec) return;
  rec.status = 'Approved';
  persist(`Approved refund ${rec.refundNo}`);
  renderFinance();
}

function reverseFinance(type, id) {
  const reason = prompt(`Enter reason to reverse this ${type.toLowerCase()}`);
  if (!reason) return;
  const list = type === 'Invoice' ? state.invoices : type === 'Receipt' ? state.payments : state.refunds;
  const rec = byId(list, id); if (!rec) return;
  rec.status = 'Reversed'; rec.reverseReason = reason; rec.reversedAt = todayIso();
  persist(`Reversed ${type.toLowerCase()} ${rec.invoiceNo || rec.receiptNo || rec.refundNo}: ${reason}`);
  renderAll();
}

function buildLedger(studentId, asAt = todayIso()) {
  const items = [];
  state.invoices.filter(i => i.studentId === studentId && i.status === 'Posted' && i.dueDate <= asAt).forEach(i => items.push({ date: i.dueDate, type: 'Invoice', ref: i.invoiceNo, debit: i.amount, credit: 0 }));
  state.payments.filter(p => p.studentId === studentId && p.status === 'Posted' && p.date <= asAt).forEach(p => items.push({ date: p.date, type: 'Receipt', ref: p.receiptNo, debit: 0, credit: p.amount }));
  state.refunds.filter(r => r.studentId === studentId && r.status === 'Posted' && r.date <= asAt).forEach(r => items.push({ date: r.date, type: 'Refund', ref: r.refundNo, debit: r.amount, credit: 0 }));
  items.sort((a,b) => a.date.localeCompare(b.date) || a.type.localeCompare(b.type));
  let balance = 0;
  return items.map(item => { balance += item.debit - item.credit; return { ...item, balance }; });
}

function renderLedger(e) {
  if (e) e.preventDefault();
  const studentId = els.ledgerStudent.value || state.students[0]?.id;
  const asAt = els.ledgerDate.value || todayIso();
  if (!studentId) {
    els.ledgerSummary.innerHTML = summaryCard('Status', 'No student');
    els.ledgerTableBody.innerHTML = `<tr><td colspan="6" class="muted">No ledger data.</td></tr>`;
    return;
  }
  els.ledgerStudent.value = studentId;
  const ledger = buildLedger(studentId, asAt);
  els.ledgerTableBody.innerHTML = ledger.length ? ledger.map(l => `<tr><td>${l.date}</td><td>${l.type}</td><td>${escapeHtml(l.ref)}</td><td>${money(l.debit)}</td><td>${money(l.credit)}</td><td>${money(l.balance)}</td></tr>`).join('') : `<tr><td colspan="6" class="muted">No ledger entries.</td></tr>`;
  const closing = ledger.at(-1)?.balance || 0;
  const student = byId(state.students, studentId);
  els.ledgerSummary.innerHTML = summaryCard('Student', escapeHtml(student?.fullName || '')) + summaryCard('Closing Balance', money(closing)) + summaryCard('Clearance', closing <= 0 ? 'Cleared' : 'Not Cleared');
}

function saveExam(e) {
  e.preventDefault();
  const student = byId(state.students, els.examStudent.value);
  if (!student) return alert('Select student.');
  const cat = num(els.catMark.value), exam = num(els.examMark.value), total = cat + exam, grade = gradeFor(total);
  state.exams.push({ id: uid('EXM'), studentId: student.id, studentName: student.fullName, className: els.examClass.value.trim(), term: els.examTerm.value.trim(), subject: els.examSubject.value.trim(), catMark: cat, examMark: exam, total, grade, date: todayIso() });
  persist(`Saved result for ${student.fullName} in ${els.examSubject.value.trim()}`);
  els.examForm.reset();
  renderExams();
  renderReports();
}

function renderExams() {
  const q = els.examSearch.value.trim().toLowerCase();
  const rows = state.exams.filter(r => [r.studentName,r.className,r.term,r.subject,r.grade,r.total].join(' ').toLowerCase().includes(q)).sort((a,b)=>b.total-a.total);
  els.examTableBody.innerHTML = rows.length ? rows.map(r => `<tr><td>${escapeHtml(r.studentName)}</td><td>${escapeHtml(r.subject)}</td><td>${r.catMark}</td><td>${r.examMark}</td><td>${r.total}</td><td>${statusTag(r.grade)}</td></tr>`).join('') : `<tr><td colspan="6" class="muted">No results found.</td></tr>`;
  const avg = rows.length ? (rows.reduce((sum,r)=>sum+r.total,0) / rows.length).toFixed(1) : '0.0';
  els.examSummary.innerHTML = summaryCard('Entries', state.exams.length) + summaryCard('Average Score', avg) + summaryCard('Top Grade', rows[0]?.grade || '-');
}

function saveStaff(e) {
  e.preventDefault();
  const payload = { id: els.staffId.value || uid('STF'), staffNo: els.staffNo.value.trim(), fullName: els.staffName.value.trim(), role: els.staffRole.value.trim(), department: els.staffDepartment.value.trim(), phone: els.staffPhone.value.trim(), status: els.staffStatus.value };
  upsert(state.staff, payload);
  persist(`Saved staff ${payload.fullName}`);
  els.staffForm.reset();
  renderStaff();
  renderDashboard();
}

function renderStaff() {
  const q = els.staffSearch.value.trim().toLowerCase();
  const rows = state.staff.filter(s => [s.staffNo,s.fullName,s.role,s.department,s.status].join(' ').toLowerCase().includes(q)).sort((a,b)=>a.fullName.localeCompare(b.fullName));
  els.staffTableBody.innerHTML = rows.length ? rows.map(s => `<tr><td>${escapeHtml(s.staffNo)}</td><td>${escapeHtml(s.fullName)}</td><td>${escapeHtml(s.role)}</td><td>${escapeHtml(s.department || '-')}</td><td>${statusTag(s.status)}</td><td><div class="action-row"><button onclick="editStaff('${s.id}')">Edit</button></div></td></tr>`).join('') : `<tr><td colspan="6" class="muted">No staff found.</td></tr>`;
}

function editStaff(id) {
  const s = byId(state.staff, id); if (!s) return;
  els.staffId.value = s.id; els.staffNo.value = s.staffNo; els.staffName.value = s.fullName; els.staffRole.value = s.role; els.staffDepartment.value = s.department; els.staffPhone.value = s.phone; els.staffStatus.value = s.status;
  switchSection('staff');
}

function saveMessage(e) {
  e.preventDefault();
  state.messages.push({ id: uid('MSG'), date: todayIso(), type: els.messageType.value, audience: els.messageAudience.value, body: els.messageBody.value.trim(), createdBy: state.auth.currentUser?.fullName || 'System' });
  persist(`Saved ${els.messageType.value.toLowerCase()} message`);
  els.messageForm.reset();
  renderMessages();
}

function renderMessages() {
  const q = els.messageSearch.value.trim().toLowerCase();
  const rows = state.messages.filter(m => [m.date,m.type,m.audience,m.body,m.createdBy].join(' ').toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date));
  els.messageTableBody.innerHTML = rows.length ? rows.map(m => `<tr><td>${m.date}</td><td>${escapeHtml(m.type)}</td><td>${escapeHtml(m.audience)}</td><td>${escapeHtml(m.body)}</td></tr>`).join('') : `<tr><td colspan="4" class="muted">No messages found.</td></tr>`;
}

function renderReports() {
  const postedInvoices = sum(state.invoices.filter(i=>i.status==='Posted').map(i=>i.amount));
  const postedReceipts = sum(state.payments.filter(p=>p.status==='Posted').map(p=>p.amount));
  const postedRefunds = sum(state.refunds.filter(r=>r.status==='Posted').map(r=>r.amount));
  const outstanding = postedInvoices + postedRefunds - postedReceipts;
  const avgAttendance = state.attendance.length ? (state.attendance.filter(a=>a.status==='Present').length / state.attendance.length * 100).toFixed(1) + '%' : '0%';
  const avgPerformance = state.exams.length ? (sum(state.exams.map(e=>e.total)) / state.exams.length).toFixed(1) : '0.0';
  els.reportsHighlights.innerHTML = [
    summaryCard('Fee Balance Report', money(outstanding)),
    summaryCard('Attendance Summary', avgAttendance),
    summaryCard('Class Performance', `${avgPerformance} average`),
    summaryCard('Refunds Paid', money(postedRefunds))
  ].join('');
  els.auditTrail.innerHTML = state.activities.length ? state.activities.map(a => `<div class="list-item"><strong>${escapeHtml(a.text)}</strong><div class="muted small">${new Date(a.at).toLocaleString()} • ${escapeHtml(a.by)}</div></div>`).join('') : 'No audit entries yet.';
}

function renderDashboard() {
  const students = state.students.filter(s=>s.status==='Active').length;
  const staff = state.staff.filter(s=>s.status==='Active').length;
  const today = todayIso();
  const todaysAttendance = state.attendance.filter(a => a.date === today);
  const attendanceRate = todaysAttendance.length ? ((todaysAttendance.filter(a=>a.status==='Present').length / todaysAttendance.length) * 100).toFixed(1) + '%' : '0%';
  const invoiced = sum(state.invoices.filter(i=>i.status==='Posted').map(i=>i.amount));
  const collected = sum(state.payments.filter(p=>p.status==='Posted').map(p=>p.amount));
  const refunds = sum(state.refunds.filter(r=>r.status==='Posted').map(r=>r.amount));
  const outstanding = invoiced + refunds - collected;
  els.statStudents.textContent = students;
  els.statStaff.textContent = staff;
  els.statAttendance.textContent = attendanceRate;
  els.statInvoiced.textContent = money(invoiced);
  els.statCollected.textContent = money(collected);
  els.statOutstanding.textContent = money(outstanding);

  const cleared = state.students.filter(s => getStudentBalance(s.id) <= 0).length;
  els.dashboardHighlights.innerHTML = [
    summaryCard('Cleared Students', cleared),
    summaryCard('Uncleared Students', Math.max(state.students.length - cleared, 0)),
    summaryCard('Messages Logged', state.messages.length),
    summaryCard('Results Entered', state.exams.length),
    summaryCard('Banks Set Up', state.banks.length),
    summaryCard('Approval Users', state.auth.users.filter(u => Number(u.approvalLimit) > 0).length)
  ].join('');

  els.recentActivity.innerHTML = state.activities.length ? state.activities.slice(0,8).map(a => `<div class="list-item"><strong>${escapeHtml(a.text)}</strong><div class="muted small">${new Date(a.at).toLocaleString()}</div></div>`).join('') : 'No activity yet.';
  const topOutstanding = [...state.students].map(s => ({ name: s.fullName, balance: getStudentBalance(s.id) })).filter(x => x.balance > 0).sort((a,b)=>b.balance-a.balance).slice(0,6);
  els.outstandingStudents.innerHTML = topOutstanding.length ? topOutstanding.map(o => `<div class="list-item"><strong>${escapeHtml(o.name)}</strong><div class="muted small">Outstanding ${money(o.balance)}</div></div>`).join('') : 'No balances yet.';
}

function getStudentBalance(studentId) {
  const debit = sum(state.invoices.filter(i=>i.studentId===studentId && i.status==='Posted').map(i=>i.amount)) + sum(state.refunds.filter(r=>r.studentId===studentId && r.status==='Posted').map(r=>r.amount));
  const credit = sum(state.payments.filter(p=>p.studentId===studentId && p.status==='Posted').map(p=>p.amount));
  return debit - credit;
}

function renderPrivilegeGrid(selected = []) {
  els.privilegesGrid.innerHTML = PRIVILEGES.map(p => `<label><input type="checkbox" value="${p}" ${selected.includes(p) ? 'checked' : ''}/> ${pretty(p)}</label>`).join('');
}

function applyRolePresetToForm() {
  const map = {
    'Administrator': ['*'],
    'CEO': ['dashboard','reports','users','settings','finance','students'],
    'Finance Officer': ['dashboard','finance','reports','students','communication'],
    'Bursar': ['dashboard','finance','reports','students'],
    'Teacher': ['dashboard','students','attendance','exams','communication','reports'],
    'Cashier': ['dashboard','finance','students'],
    'Approver': ['dashboard','finance','reports'],
    'Custom': []
  };
  const selected = map[els.userRole.value] || [];
  renderPrivilegeGrid(selected.includes('*') ? PRIVILEGES : selected);
}

function saveUser(e) {
  e.preventDefault();
  const privileges = els.userRole.value === 'Administrator' ? ['*'] : [...els.privilegesGrid.querySelectorAll('input:checked')].map(i => i.value);
  const payload = { id: els.userId.value || uid('USR'), fullName: els.userFullName.value.trim(), username: els.userUsername.value.trim(), password: els.userPassword.value, role: els.userRole.value, status: els.userStatus.value, approvalLimit: num(els.approvalLimit.value), privileges };
  upsert(state.auth.users, payload);
  persist(`Saved user ${payload.fullName}`);
  resetUserForm();
  renderUsers();
}

function resetUserForm() { els.userForm.reset(); els.userId.value=''; els.userStatus.value='Active'; els.approvalLimit.value = 0; renderPrivilegeGrid([]); }

function editUser(id) {
  const u = byId(state.auth.users, id); if (!u) return;
  els.userId.value=u.id; els.userFullName.value=u.fullName; els.userUsername.value=u.username; els.userPassword.value=u.password; els.userRole.value=u.role; els.userStatus.value=u.status; els.approvalLimit.value=u.approvalLimit; renderPrivilegeGrid(u.privileges.includes('*') ? PRIVILEGES : u.privileges);
  switchSection('users');
}

function renderUsers() {
  const q = els.userSearch.value.trim().toLowerCase();
  const rows = state.auth.users.filter(u => [u.fullName,u.username,u.role,u.status,u.approvalLimit].join(' ').toLowerCase().includes(q));
  els.usersTableBody.innerHTML = rows.length ? rows.map(u => `<tr><td>${escapeHtml(u.fullName)}</td><td>${escapeHtml(u.username)}</td><td>${escapeHtml(u.role)}</td><td>${statusTag(u.status)}</td><td>${money(u.approvalLimit)}</td><td><div class="action-row"><button onclick="editUser('${u.id}')">Edit</button></div></td></tr>`).join('') : `<tr><td colspan="6" class="muted">No users found.</td></tr>`;
  els.workflowSummary.innerHTML = summaryCard('Total Users', state.auth.users.length) + summaryCard('Active Users', state.auth.users.filter(u=>u.status==='Active').length) + summaryCard('Approvers', state.auth.users.filter(u=>u.approvalLimit>0).length);
}

function seedSampleData() {
  if (state.students.length || state.staff.length || state.invoices.length) {
    if (!confirm('Load sample data and merge with current data?')) return;
  }
  const students = [
    { id: uid('STD'), admissionNo: 'ADM/2026/001', fullName: 'Achieng Atieno', className: 'Grade 7', parentContact: '+254700100200', gender: 'Female', status: 'Active', parentName: 'Mary Achieng', notes: '' },
    { id: uid('STD'), admissionNo: 'ADM/2026/002', fullName: 'Brian Odhiambo', className: 'Grade 7', parentContact: '+254700100201', gender: 'Male', status: 'Active', parentName: 'Peter Odhiambo', notes: '' },
    { id: uid('STD'), admissionNo: 'ADM/2026/003', fullName: 'Cynthia Wanjiku', className: 'Grade 8', parentContact: '+254700100202', gender: 'Female', status: 'Active', parentName: 'Lucy Wanjiku', notes: '' }
  ];
  const staff = [
    { id: uid('STF'), staffNo: 'STF/001', fullName: 'Jane Njeri', role: 'Teacher', department: 'Academics', phone: '+254711111111', status: 'Active' },
    { id: uid('STF'), staffNo: 'STF/002', fullName: 'Mark Otieno', role: 'Finance Clerk', department: 'Finance', phone: '+254722222222', status: 'Active' }
  ];
  const bank = { id: uid('BNK'), name: 'KCB Bank', accountNo: '1234567890', openingBalance: 50000 };
  state.students.push(...students);
  state.staff.push(...staff);
  state.banks.push(bank);
  state.attendance.push(
    { id: uid('ATT'), date: todayIso(), className: 'Grade 7', studentId: students[0].id, studentName: students[0].fullName, status: 'Present', remarks: '' },
    { id: uid('ATT'), date: todayIso(), className: 'Grade 7', studentId: students[1].id, studentName: students[1].fullName, status: 'Late', remarks: 'Traffic' },
    { id: uid('ATT'), date: todayIso(), className: 'Grade 8', studentId: students[2].id, studentName: students[2].fullName, status: 'Present', remarks: '' }
  );
  const inv1 = { id: uid('INV'), studentId: students[0].id, studentName: students[0].fullName, invoiceNo: 'INV-001', description: 'Tuition Fees', amount: 25000, dueDate: todayIso(), status: 'Posted', createdAt: todayIso() };
  const inv2 = { id: uid('INV'), studentId: students[1].id, studentName: students[1].fullName, invoiceNo: 'INV-002', description: 'Tuition Fees', amount: 25000, dueDate: todayIso(), status: 'Posted', createdAt: todayIso() };
  const rcp1 = { id: uid('RCP'), studentId: students[0].id, studentName: students[0].fullName, bankId: bank.id, bankName: bank.name, receiptNo: 'RCP-001', amount: 15000, date: todayIso(), reference: 'MPESA123', status: 'Posted' };
  const rfd1 = { id: uid('RFD'), studentId: students[0].id, studentName: students[0].fullName, bankId: bank.id, bankName: bank.name, refundNo: 'RFD-001', amount: 1000, date: todayIso(), reason: 'Overpayment adjustment', status: 'Approved' };
  state.invoices.push(inv1, inv2);
  state.payments.push(rcp1);
  state.refunds.push(rfd1);
  state.exams.push(
    { id: uid('EXM'), studentId: students[0].id, studentName: students[0].fullName, className: 'Grade 7', term: 'Term 1 2026', subject: 'Mathematics', catMark: 32, examMark: 54, total: 86, grade: 'A', date: todayIso() },
    { id: uid('EXM'), studentId: students[1].id, studentName: students[1].fullName, className: 'Grade 7', term: 'Term 1 2026', subject: 'English', catMark: 28, examMark: 41, total: 69, grade: 'B', date: todayIso() }
  );
  state.messages.push({ id: uid('MSG'), date: todayIso(), type: 'Fees Reminder', audience: 'Finance Defaulters', body: 'Kindly clear fee balance by Friday. Thank you.', createdBy: 'System Administrator' });
  persist('Loaded sample school data');
  populateSelectors();
  renderAll();
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'edubill_school_erp_v6_backup.json');
}

function importBackup(e) {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
      location.reload();
    } catch {
      alert('Invalid backup file.');
    }
  };
  reader.readAsText(file);
}

function exportCSV(type) {
  let rows = [];
  if (type === 'students') rows = state.students.map(s => ({ admissionNo: s.admissionNo, fullName: s.fullName, className: s.className, parentContact: s.parentContact, status: s.status }));
  if (type === 'finance') rows = [
    ...state.invoices.map(i => ({ type: 'Invoice', ref: i.invoiceNo, student: i.studentName, amount: i.amount, status: i.status, date: i.dueDate })),
    ...state.payments.map(p => ({ type: 'Receipt', ref: p.receiptNo, student: p.studentName, amount: p.amount, status: p.status, date: p.date })),
    ...state.refunds.map(r => ({ type: 'Refund', ref: r.refundNo, student: r.studentName, amount: r.amount, status: r.status, date: r.date }))
  ];
  if (type === 'results') rows = state.exams.map(r => ({ student: r.studentName, className: r.className, term: r.term, subject: r.subject, total: r.total, grade: r.grade }));
  if (!rows.length) return alert('No data available for export.');
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => csvSafe(r[h])).join(','))].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${type}_export.csv`);
}

function byId(list, id) { return list.find(item => item.id === id); }
function upsert(list, payload) { const i = list.findIndex(x => x.id === payload.id); i >= 0 ? list.splice(i, 1, payload) : list.push(payload); }
function money(v) { return `${state.settings.currency || 'KES'} ${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function num(v) { return Number(v || 0); }
function sum(arr) { return arr.reduce((a,b)=>a + Number(b || 0), 0); }
function uid(prefix) { return `${prefix}-${Math.random().toString(36).slice(2,8)}${Date.now().toString(36).slice(-4)}`; }
function todayIso() { return new Date().toISOString().slice(0,10); }
function summaryCard(label, value) { return `<div><div class="muted small">${label}</div><strong>${value}</strong></div>`; }
function pretty(v) { return v.replace(/(^|\b)([a-z])/g, s => s.toUpperCase()); }
function gradeFor(total) { if (total >= 80) return 'A'; if (total >= 70) return 'B'; if (total >= 60) return 'C'; if (total >= 50) return 'D'; return 'E'; }
function statusTag(value) {
  const str = String(value || '');
  const lower = str.toLowerCase();
  const cls = lower.includes('post') || lower.includes('active') || lower === 'present' || lower === 'a' ? 'green' : lower.includes('draft') || lower.includes('late') || lower === 'b' || lower === 'c' ? 'blue' : lower.includes('approve') || lower.includes('due') || lower.includes('transferred') ? 'amber' : 'red';
  return `<span class="tag ${cls}">${escapeHtml(str)}</span>`;
}
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s])); }
function csvSafe(value) { const s = String(value ?? '').replace(/"/g, '""'); return /[",\n]/.test(s) ? `"${s}"` : s; }
function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

window.editStudent = editStudent;
window.editStaff = editStaff;
window.editUser = editUser;
window.postFinance = postFinance;
window.reverseFinance = reverseFinance;
window.approveRefund = approveRefund;
