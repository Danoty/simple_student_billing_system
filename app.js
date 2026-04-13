const STORAGE_KEY = 'edubill_pro_v6_full_school_system';
const PRIVILEGES = [
  { key:'students_manage', label:'Students', description:'Create and update student records' },
  { key:'attendance_manage', label:'Attendance', description:'Mark and review attendance' },
  { key:'finance_manage', label:'Finance', description:'Create finance documents' },
  { key:'finance_post', label:'Post Transactions', description:'Post invoices, receipts and refunds' },
  { key:'finance_reverse', label:'Reverse Transactions', description:'Reverse posted transactions' },
  { key:'exams_manage', label:'Exams', description:'Enter marks and results' },
  { key:'staff_manage', label:'Staff', description:'Manage staff records' },
  { key:'communication_manage', label:'Communication', description:'Announcements and SMS alerts' },
  { key:'reports_view', label:'Reports', description:'View reports and insights' },
  { key:'users_manage', label:'Users & Access', description:'Create users and control access' },
  { key:'settings_manage', label:'Settings', description:'Edit institution settings' }
];

const ROLE_PRESETS = {
  'Administrator':['*'],
  'CEO':['reports_view','finance_manage','finance_post','communication_manage'],
  'Finance Officer':['finance_manage','finance_post','reports_view'],
  'Bursar':['finance_manage','finance_post','finance_reverse','reports_view'],
  'Cashier':['finance_manage','finance_post'],
  'Teacher':['students_manage','attendance_manage','exams_manage','reports_view','communication_manage'],
  'Approver':['finance_post','reports_view'],
  'Custom':[]
};

const defaultState = {
  settings: {
    schoolName:'EduBill Pro v6',
    currentTerm:'Academic Year 2026/2027',
    schoolPhone:'+254 700 000000',
    schoolEmail:'info@school.ac.ke',
    schoolAddress:'Main Campus',
    currency:'KES',
    footerNote:'Full school system demo.'
  },
  auth: {
    users: [
      { id:'USR_ADMIN', fullName:'System Administrator', username:'admin', password:'admin123', role:'Administrator', active:true, approvalLimit:0, privileges:['*'] },
      { id:'USR_CEO', fullName:'Chief Executive Officer', username:'ceo', password:'ceo123', role:'CEO', active:true, approvalLimit:500000, privileges:ROLE_PRESETS['CEO'] },
      { id:'USR_FIN', fullName:'Finance Officer', username:'finance', password:'finance123', role:'Finance Officer', active:true, approvalLimit:150000, privileges:ROLE_PRESETS['Finance Officer'] },
      { id:'USR_TEACH', fullName:'Senior Teacher', username:'teacher', password:'teacher123', role:'Teacher', active:true, approvalLimit:0, privileges:ROLE_PRESETS['Teacher'] }
    ],
    currentUser:null
  },
  students:[],
  attendance:[],
  banks:[],
  invoices:[],
  payments:[],
  refunds:[],
  exams:[],
  staff:[],
  communications:[],
  activities:[],
  audit:[],
  lastSavedAt:null
};

const state = loadState();
const $ = id => document.getElementById(id);
const els = {
  authScreen:$('authScreen'), appShell:$('appShell'), loginForm:$('loginForm'), loginUsername:$('loginUsername'), loginPassword:$('loginPassword'),
  navLinks:document.querySelectorAll('.nav-link'), sections:document.querySelectorAll('.section'), pageTitle:$('pageTitle'), pageSubtitle:$('pageSubtitle'),
  signedInUser:$('signedInUser'), brandSchoolName:$('brandSchoolName'), brandTerm:$('brandTerm'), lastSavedLabel:$('lastSavedLabel'), toast:$('toast'),
  dashboardSummary:$('dashboardSummary'), outstandingList:$('outstandingList'), activityList:$('activityList'), auditTrailList:$('auditTrailList'),
  statStudents:$('statStudents'), statStaff:$('statStaff'), statInvoiced:$('statInvoiced'), statCollected:$('statCollected'), statOutstanding:$('statOutstanding'), statAttendanceToday:$('statAttendanceToday'),
  studentForm:$('studentForm'), studentId:$('studentId'), admissionNo:$('admissionNo'), studentName:$('studentName'), studentClass:$('studentClass'), studentParent:$('studentParent'), studentPhone:$('studentPhone'), studentStatus:$('studentStatus'), studentNotes:$('studentNotes'), studentSearch:$('studentSearch'), studentsTableBody:$('studentsTableBody'), promoteStudentBtn:$('promoteStudentBtn'), clearStudentBtn:$('clearStudentBtn'),
  attendanceForm:$('attendanceForm'), attendanceDate:$('attendanceDate'), attendanceStudentId:$('attendanceStudentId'), attendanceStatus:$('attendanceStatus'), attendanceRemarks:$('attendanceRemarks'), attendanceSearch:$('attendanceSearch'), attendanceTableBody:$('attendanceTableBody'), attendanceSummaryText:$('attendanceSummaryText'),
  bankForm:$('bankForm'), bankId:$('bankId'), bankName:$('bankName'), bankAccountNo:$('bankAccountNo'), bankBranch:$('bankBranch'), bankStatus:$('bankStatus'), banksTableBody:$('banksTableBody'),
  invoiceForm:$('invoiceForm'), invoiceId:$('invoiceId'), invoiceDate:$('invoiceDate'), invoiceStudentId:$('invoiceStudentId'), invoiceTerm:$('invoiceTerm'), invoiceAmount:$('invoiceAmount'), invoiceDescription:$('invoiceDescription'), invoicesTableBody:$('invoicesTableBody'),
  paymentForm:$('paymentForm'), paymentId:$('paymentId'), paymentDate:$('paymentDate'), paymentStudentId:$('paymentStudentId'), paymentInvoiceId:$('paymentInvoiceId'), paymentBankId:$('paymentBankId'), paymentAmount:$('paymentAmount'), paymentMethod:$('paymentMethod'), paymentsTableBody:$('paymentsTableBody'),
  refundForm:$('refundForm'), refundId:$('refundId'), refundDate:$('refundDate'), refundStudentId:$('refundStudentId'), refundBankId:$('refundBankId'), refundAmount:$('refundAmount'), refundReason:$('refundReason'), refundsTableBody:$('refundsTableBody'),
  bankCount:$('bankCount'), draftInvoiceCount:$('draftInvoiceCount'), postedReceiptCount:$('postedReceiptCount'), paidRefundCount:$('paidRefundCount'),
  examForm:$('examForm'), examId:$('examId'), examDate:$('examDate'), examStudentId:$('examStudentId'), examSubject:$('examSubject'), examAssessment:$('examAssessment'), examMarks:$('examMarks'), examOutOf:$('examOutOf'), examsTableBody:$('examsTableBody'), examSearch:$('examSearch'),
  staffForm:$('staffForm'), staffId:$('staffId'), staffNo:$('staffNo'), staffName:$('staffName'), staffRole:$('staffRole'), staffDepartment:$('staffDepartment'), staffPhone:$('staffPhone'), staffStatus:$('staffStatus'), staffTableBody:$('staffTableBody'), staffSearch:$('staffSearch'),
  announcementForm:$('announcementForm'), announcementTitle:$('announcementTitle'), announcementAudience:$('announcementAudience'), announcementMessage:$('announcementMessage'), smsForm:$('smsForm'), smsStudentId:$('smsStudentId'), smsType:$('smsType'), smsMessage:$('smsMessage'), communicationLog:$('communicationLog'),
  reportBalance:$('reportBalance'), reportPerformance:$('reportPerformance'), reportAttendance:$('reportAttendance'), reportMessages:$('reportMessages'), reportBalancesTableBody:$('reportBalancesTableBody'), reportInsightList:$('reportInsightList'),
  userForm:$('userForm'), userId:$('userId'), userFullName:$('userFullName'), userUsername:$('userUsername'), userPassword:$('userPassword'), userRole:$('userRole'), userStatus:$('userStatus'), approvalLimit:$('approvalLimit'), userPrivilegesGrid:$('userPrivilegesGrid'), usersTableBody:$('usersTableBody'), userSearch:$('userSearch'),
  settingsForm:$('settingsForm'), schoolName:$('schoolName'), currentTerm:$('currentTerm'), schoolPhone:$('schoolPhone'), schoolEmail:$('schoolEmail'), schoolAddress:$('schoolAddress'), currency:$('currency'), footerNote:$('footerNote'),
  loadSampleBtn:$('loadSampleBtn'), logoutBtn:$('logoutBtn'), backupBtn:$('backupBtn'), importBackupInput:$('importBackupInput'), resetBtn:$('resetBtn')
};

init();

function init(){
  setTodayDefaults();
  bindEvents();
  renderPrivilegeMatrix();
  syncAuthUI();
  renderAll();
}

function bindEvents(){
  els.loginForm.addEventListener('submit', onLogin);
  els.navLinks.forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.section)));
  document.querySelectorAll('.quick-action').forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.jump)));

  els.studentForm.addEventListener('submit', saveStudent);
  els.clearStudentBtn.addEventListener('click', clearStudentForm);
  els.promoteStudentBtn.addEventListener('click', promoteSelectedStudent);
  els.studentSearch.addEventListener('input', renderStudents);

  els.attendanceForm.addEventListener('submit', saveAttendance);
  els.attendanceSearch.addEventListener('input', renderAttendance);

  els.bankForm.addEventListener('submit', saveBank);
  els.invoiceForm.addEventListener('submit', saveInvoice);
  els.paymentForm.addEventListener('submit', savePayment);
  els.refundForm.addEventListener('submit', saveRefund);
  els.paymentStudentId.addEventListener('change', populateInvoiceOptions);

  els.examForm.addEventListener('submit', saveExam);
  els.examSearch.addEventListener('input', renderExams);

  els.staffForm.addEventListener('submit', saveStaff);
  els.staffSearch.addEventListener('input', renderStaff);

  els.announcementForm.addEventListener('submit', saveAnnouncement);
  els.smsForm.addEventListener('submit', saveSms);

  els.userForm.addEventListener('submit', saveUser);
  els.userRole.addEventListener('change', onRoleChange);
  els.userSearch.addEventListener('input', renderUsers);

  els.settingsForm.addEventListener('submit', saveSettings);
  els.loadSampleBtn.addEventListener('click', loadSampleData);
  els.logoutBtn.addEventListener('click', logout);
  els.backupBtn.addEventListener('click', exportBackup);
  els.importBackupInput.addEventListener('change', importBackup);
  els.resetBtn.addEventListener('click', resetAll);
}

function loadState(){ try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? { ...structuredClone(defaultState), ...JSON.parse(raw) } : structuredClone(defaultState); } catch { return structuredClone(defaultState);} }
function persist(msg='Saved'){ state.lastSavedAt = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); els.lastSavedLabel.textContent = formatDateTime(state.lastSavedAt); if(msg) showToast(msg); }
function uid(prefix='ID'){ return `${prefix}_${Math.random().toString(36).slice(2,8)}${Date.now().toString().slice(-4)}`; }
function currentUser(){ return state.auth.currentUser; }
function currentUsername(){ return currentUser()?.username || 'system'; }
function roleOfCurrentUser(){ return currentUser()?.role || 'Guest'; }
function money(v){ return `${state.settings.currency || 'KES'} ${Number(v||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function formatDate(d){ if(!d) return ''; const x = new Date(d); return Number.isNaN(x.getTime()) ? d : x.toLocaleDateString(); }
function formatDateTime(d){ if(!d) return 'Not saved yet'; const x = new Date(d); return Number.isNaN(x.getTime()) ? d : x.toLocaleString(); }
function setTodayDefaults(){ const t = new Date().toISOString().slice(0,10); ['attendanceDate','invoiceDate','paymentDate','refundDate','examDate'].forEach(id => { if($(id)) $(id).value = t; }); }
function showToast(message){ els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(showToast._t); showToast._t = setTimeout(()=>els.toast.classList.remove('show'), 2200); }
function switchSection(id){ els.sections.forEach(s=>s.classList.toggle('active', s.id===id)); els.navLinks.forEach(n=>n.classList.toggle('active', n.dataset.section===id)); els.pageTitle.textContent = document.querySelector(`.nav-link[data-section="${id}"]`)?.textContent || 'Dashboard'; const sub = {
  dashboard:'Full school overview and workflow controls.', students:'Admission, profiles and balances.', attendance:'Daily and monthly attendance tracking.', finance:'Banks, invoices, receipts, refunds and reversals.', exams:'Marks entry with auto grading.', staff:'Teachers and support staff records.', communication:'Announcements and SMS alerts.', reports:'Finance, attendance and academic summaries.', users:'Roles, privileges and approval workflow.', settings:'Institution setup and audit trail.'
 }; els.pageSubtitle.textContent = sub[id] || ''; }

function hasPrivilege(key){ const u = currentUser(); if(!u) return false; const p = u.privileges || ROLE_PRESETS[u.role] || []; return p.includes('*') || p.includes(key); }
function requirePermission(key, msg='Access denied'){ if(hasPrivilege(key)) return true; showToast(msg); return false; }

function syncAuthUI(){
  const logged = !!currentUser();
  els.authScreen.classList.toggle('hidden', logged);
  els.appShell.classList.toggle('hidden', !logged);
  els.signedInUser.textContent = currentUser()?.fullName || 'Guest';
  els.brandSchoolName.textContent = state.settings.schoolName;
  els.brandTerm.textContent = state.settings.currentTerm;
  els.lastSavedLabel.textContent = formatDateTime(state.lastSavedAt);
  fillSettingsForm();
}

function onLogin(e){
  e.preventDefault();
  const user = state.auth.users.find(u => u.username === els.loginUsername.value.trim() && u.password === els.loginPassword.value && u.active !== false);
  if(!user) return showToast('Invalid login credentials');
  state.auth.currentUser = { ...user };
  addAudit('Login', `${user.fullName} signed in.`);
  logActivity('User login', `${user.fullName} signed in as ${user.role}.`);
  persist('Login successful.');
  syncAuthUI();
  renderAll();
}
function logout(){ if(!currentUser()) return; addAudit('Logout', `${currentUser().fullName} signed out.`); state.auth.currentUser = null; persist('Logged out.'); syncAuthUI(); }

function addAudit(title, detail){ state.audit.unshift({ id:uid('AUD'), title, detail, by:currentUsername(), at:new Date().toISOString() }); state.audit = state.audit.slice(0,150); }
function logActivity(title, detail){ state.activities.unshift({ id:uid('ACT'), title, detail, at:new Date().toISOString() }); state.activities = state.activities.slice(0,50); }

function renderAll(){
  if(!currentUser()) return;
  populateSelectors();
  renderDashboard(); renderStudents(); renderAttendance(); renderFinance(); renderExams(); renderStaff(); renderCommunication(); renderReports(); renderUsers(); renderAuditTrail();
}

function populateSelectors(){
  const studentOptions = `<option value="">Select student</option>` + state.students.map(s=>`<option value="${s.id}">${escapeHtml(s.admissionNo)} - ${escapeHtml(s.name)}</option>`).join('');
  ['attendanceStudentId','invoiceStudentId','paymentStudentId','refundStudentId','examStudentId'].forEach(id=> { if($(id)) $(id).innerHTML = studentOptions; });
  const bankOptions = `<option value="">Select bank</option>` + state.banks.filter(b=>b.status==='Active').map(b=>`<option value="${b.id}">${escapeHtml(b.name)}</option>`).join('');
  ['paymentBankId','refundBankId'].forEach(id=> { if($(id)) $(id).innerHTML = bankOptions; });
  els.smsStudentId.innerHTML = `<option value="ALL">All students</option>` + state.students.map(s=>`<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
  populateInvoiceOptions();
}

function saveStudent(e){ e.preventDefault(); if(!requirePermission('students_manage','You cannot manage students.')) return; const id = els.studentId.value || uid('STD'); const existing = state.students.find(s=>s.id===id); const student = { id, admissionNo:els.admissionNo.value.trim(), name:els.studentName.value.trim(), className:els.studentClass.value.trim(), parent:els.studentParent.value.trim(), phone:els.studentPhone.value.trim(), status:els.studentStatus.value, notes:els.studentNotes.value.trim(), createdAt: existing?.createdAt || new Date().toISOString(), updatedAt:new Date().toISOString() };
  if(existing) Object.assign(existing, student); else state.students.push(student);
  addAudit(existing?'Student updated':'Student created', `${student.name} (${student.admissionNo}) saved.`); logActivity(existing?'Student updated':'Student added', `${student.name} profile saved.`); persist('Student saved.'); clearStudentForm(); renderAll(); }
function clearStudentForm(){ els.studentForm.reset(); els.studentId.value=''; els.studentStatus.value='Active'; }
function promoteSelectedStudent(){ if(!requirePermission('students_manage','You cannot promote students.')) return; const id = els.studentId.value; const s = state.students.find(x=>x.id===id); if(!s) return showToast('Select a student first from the table.'); s.className = promoteClassName(s.className); s.updatedAt = new Date().toISOString(); addAudit('Student promoted', `${s.name} promoted to ${s.className}.`); logActivity('Promotion', `${s.name} moved to ${s.className}.`); persist('Student promoted.'); renderAll(); }
function promoteClassName(text){ const m = String(text).match(/(\d+)/); if(!m) return `${text} Next`; const next = Number(m[1])+1; return text.replace(m[1], String(next)); }
function renderStudents(){ const q = els.studentSearch.value.trim().toLowerCase(); const rows = state.students.filter(s => [s.admissionNo,s.name,s.className,s.status].join(' ').toLowerCase().includes(q)).map(s=>{ const bal = studentBalance(s.id); return `<tr><td>${escapeHtml(s.admissionNo)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.className)}</td><td><span class="badge ${s.status==='Active'?'success':'warn'}">${escapeHtml(s.status)}</span></td><td>${money(bal)}</td><td><button class="table-btn" onclick="editStudent('${s.id}')">Edit</button></td></tr>`; }).join(''); els.studentsTableBody.innerHTML = rows || `<tr><td colspan="6" class="muted">No students found.</td></tr>`; }
window.editStudent = function(id){ const s = state.students.find(x=>x.id===id); if(!s) return; els.studentId.value=s.id; els.admissionNo.value=s.admissionNo; els.studentName.value=s.name; els.studentClass.value=s.className; els.studentParent.value=s.parent; els.studentPhone.value=s.phone; els.studentStatus.value=s.status; els.studentNotes.value=s.notes || ''; switchSection('students'); };

function saveAttendance(e){ e.preventDefault(); if(!requirePermission('attendance_manage','You cannot manage attendance.')) return; const studentId = els.attendanceStudentId.value; if(!studentId) return showToast('Select a student.'); const key = `${studentId}_${els.attendanceDate.value}`; const existing = state.attendance.find(a => `${a.studentId}_${a.date}` === key); const record = { id: existing?.id || uid('ATT'), date:els.attendanceDate.value, studentId, status:els.attendanceStatus.value, remarks:els.attendanceRemarks.value.trim(), by:currentUsername() };
  if(existing) Object.assign(existing, record); else state.attendance.push(record);
  addAudit(existing?'Attendance updated':'Attendance recorded', `${studentName(studentId)} marked ${record.status} on ${record.date}.`); logActivity('Attendance', `${studentName(studentId)} marked ${record.status}.`); persist('Attendance saved.'); els.attendanceForm.reset(); setTodayDefaults(); renderAll(); }
function renderAttendance(){ const q = els.attendanceSearch.value.trim().toLowerCase(); const rows = state.attendance.filter(a => [a.date,studentName(a.studentId),studentClass(a.studentId),a.status].join(' ').toLowerCase().includes(q)).sort((a,b)=> b.date.localeCompare(a.date)).map(a=>`<tr><td>${formatDate(a.date)}</td><td>${escapeHtml(studentName(a.studentId))}</td><td>${escapeHtml(studentClass(a.studentId))}</td><td><span class="badge ${attendanceBadge(a.status)}">${escapeHtml(a.status)}</span></td><td>${escapeHtml(a.by||'')}</td></tr>`).join('');
  els.attendanceTableBody.innerHTML = rows || `<tr><td colspan="5" class="muted">No attendance records.</td></tr>`;
  const month = new Date().toISOString().slice(0,7); const monthData = state.attendance.filter(a=>String(a.date).startsWith(month)); const present = monthData.filter(a=>a.status==='Present').length; const absent = monthData.filter(a=>a.status==='Absent').length; const late = monthData.filter(a=>a.status==='Late').length; els.attendanceSummaryText.textContent = `This month: ${present} present, ${absent} absent, ${late} late.`;
}
function attendanceBadge(s){ return s==='Present'?'success':s==='Late'?'warn':'danger'; }

function saveBank(e){ e.preventDefault(); if(!requirePermission('finance_manage','You cannot manage banks.')) return; const id = els.bankId.value || uid('BNK'); const existing = state.banks.find(b=>b.id===id); const bank = { id, name:els.bankName.value.trim(), accountNo:els.bankAccountNo.value.trim(), branch:els.bankBranch.value.trim(), status:els.bankStatus.value };
  if(existing) Object.assign(existing, bank); else state.banks.push(bank);
  addAudit(existing?'Bank updated':'Bank created', `${bank.name} saved.`); logActivity('Bank saved', `${bank.name} is available for receipting.`); persist('Bank saved.'); els.bankForm.reset(); els.bankId.value=''; renderAll(); }
window.editBank = function(id){ const b = state.banks.find(x=>x.id===id); if(!b) return; els.bankId.value=b.id; els.bankName.value=b.name; els.bankAccountNo.value=b.accountNo; els.bankBranch.value=b.branch; els.bankStatus.value=b.status; switchSection('finance'); };

function saveInvoice(e){ e.preventDefault(); if(!requirePermission('finance_manage','You cannot manage invoices.')) return; const id = els.invoiceId.value || uid('INV'); const existing = state.invoices.find(x=>x.id===id); const inv = { id, number: existing?.number || autoNumber('INV', state.invoices.length+1), date:els.invoiceDate.value, studentId:els.invoiceStudentId.value, term:els.invoiceTerm.value.trim(), amount:Number(els.invoiceAmount.value), description:els.invoiceDescription.value.trim(), status: existing?.status || 'Draft', createdBy: existing?.createdBy || currentUsername() };
  if(!inv.studentId) return showToast('Select a student.');
  if(existing) Object.assign(existing, inv); else state.invoices.push(inv);
  addAudit(existing?'Invoice updated':'Invoice created', `${inv.number} saved for ${studentName(inv.studentId)}.`); logActivity('Invoice saved', `${inv.number} prepared.`); persist('Invoice saved.'); els.invoiceForm.reset(); els.invoiceId.value=''; setTodayDefaults(); renderAll(); }
window.postInvoice = function(id){ if(!requirePermission('finance_post','You cannot post invoices.')) return; const inv = state.invoices.find(x=>x.id===id); if(!inv || inv.status!=='Draft') return; inv.status='Posted'; inv.postedAt=new Date().toISOString(); inv.postedBy=currentUsername(); addAudit('Invoice posted', `${inv.number} posted. Dr Student Debtor ${money(inv.amount)} | Cr Fee Revenue ${money(inv.amount)}.`); logActivity('Invoice posted', `${inv.number} now affects student balance.`); persist('Invoice posted.'); renderAll(); };
window.reverseInvoice = function(id){ if(!requirePermission('finance_reverse','You cannot reverse invoices.')) return; const inv = state.invoices.find(x=>x.id===id); if(!inv || inv.status!=='Posted') return; if(invoicePaidAmount(id)>0) return showToast('Reverse related receipts first.'); const reason = prompt('Invoice reversal reason'); if(!reason) return; inv.status='Reversed'; inv.reversalReason=reason; inv.reversedBy=currentUsername(); inv.reversedAt=new Date().toISOString(); addAudit('Invoice reversed', `${inv.number} reversed. ${reason}`); logActivity('Invoice reversed', `${inv.number} reversed.`); persist('Invoice reversed.'); renderAll(); };

function savePayment(e){ e.preventDefault(); if(!requirePermission('finance_manage','You cannot manage receipts.')) return; const id = els.paymentId.value || uid('PAY'); const existing = state.payments.find(x=>x.id===id); const pay = { id, number: existing?.number || autoNumber('RCPT', state.payments.length+1), date:els.paymentDate.value, studentId:els.paymentStudentId.value, invoiceId:els.paymentInvoiceId.value, bankId:els.paymentBankId.value, amount:Number(els.paymentAmount.value), method:els.paymentMethod.value, status: existing?.status || 'Draft', createdBy: existing?.createdBy || currentUsername() };
  if(!pay.studentId || !pay.invoiceId || !pay.bankId) return showToast('Complete receipt fields.');
  if(existing) Object.assign(existing, pay); else state.payments.push(pay);
  addAudit(existing?'Receipt updated':'Receipt created', `${pay.number} saved for ${studentName(pay.studentId)}.`); logActivity('Receipt saved', `${pay.number} prepared.`); persist('Receipt saved.'); els.paymentForm.reset(); els.paymentId.value=''; setTodayDefaults(); renderAll(); };
window.postReceipt = function(id){ if(!requirePermission('finance_post','You cannot post receipts.')) return; const p = state.payments.find(x=>x.id===id); if(!p || p.status!=='Draft') return; const inv = state.invoices.find(x=>x.id===p.invoiceId); if(!inv || inv.status!=='Posted') return showToast('Invoice must be posted first.'); if(p.amount > invoiceBalance(inv.id)) return showToast('Receipt exceeds invoice balance.'); p.status='Posted'; p.postedAt=new Date().toISOString(); p.postedBy=currentUsername(); addAudit('Receipt posted', `${p.number} posted. Dr ${bankName(p.bankId)} ${money(p.amount)} | Cr Student ${money(p.amount)}.`); logActivity('Receipt posted', `${p.number} reduced outstanding balance.`); persist('Receipt posted.'); renderAll(); };
window.reverseReceipt = function(id){ if(!requirePermission('finance_reverse','You cannot reverse receipts.')) return; const p = state.payments.find(x=>x.id===id); if(!p || p.status!=='Posted') return; const reason = prompt('Receipt reversal reason'); if(!reason) return; p.status='Reversed'; p.reversalReason=reason; p.reversedAt=new Date().toISOString(); p.reversedBy=currentUsername(); addAudit('Receipt reversed', `${p.number} reversed. ${reason}`); logActivity('Receipt reversed', `${p.number} reversed.`); persist('Receipt reversed.'); renderAll(); };

function saveRefund(e){ e.preventDefault(); if(!requirePermission('finance_manage','You cannot manage refunds.')) return; const id = els.refundId.value || uid('REF'); const existing = state.refunds.find(x=>x.id===id); const r = { id, number: existing?.number || autoNumber('RFD', state.refunds.length+1), date:els.refundDate.value, studentId:els.refundStudentId.value, bankId:els.refundBankId.value, amount:Number(els.refundAmount.value), reason:els.refundReason.value.trim(), status: existing?.status || 'Draft', createdBy: existing?.createdBy || currentUsername() };
  if(!r.studentId || !r.bankId) return showToast('Complete refund fields.');
  if(existing) Object.assign(existing, r); else state.refunds.push(r);
  addAudit(existing?'Refund updated':'Refund created', `${r.number} saved for ${studentName(r.studentId)}.`); logActivity('Refund saved', `${r.number} prepared.`); persist('Refund saved.'); els.refundForm.reset(); els.refundId.value=''; setTodayDefaults(); renderAll(); };
window.approveRefund = function(id){ if(!requirePermission('finance_post','You cannot approve refunds.')) return; const r = state.refunds.find(x=>x.id===id); if(!r || r.status!=='Draft') return; r.status='Approved'; r.approvedBy=currentUsername(); r.approvedAt=new Date().toISOString(); addAudit('Refund approved', `${r.number} approved for ${money(r.amount)}.`); logActivity('Refund approved', `${r.number} awaiting payment.`); persist('Refund approved.'); renderAll(); };
window.payRefund = function(id){ if(!requirePermission('finance_post','You cannot pay refunds.')) return; const r = state.refunds.find(x=>x.id===id); if(!r || r.status!=='Approved') return; if(r.amount > studentCredit(r.studentId)) return showToast('Refund exceeds current student credit.'); if(r.amount > bankBalance(r.bankId)) return showToast('Bank balance too low.'); r.status='Paid'; r.paidBy=currentUsername(); r.paidAt=new Date().toISOString(); addAudit('Refund paid', `${r.number} paid. Dr Student/Refund Control ${money(r.amount)} | Cr ${bankName(r.bankId)} ${money(r.amount)}.`); logActivity('Refund paid', `${r.number} paid out.`); persist('Refund paid.'); renderAll(); };
window.reverseRefund = function(id){ if(!requirePermission('finance_reverse','You cannot reverse refunds.')) return; const r = state.refunds.find(x=>x.id===id); if(!r || r.status!=='Paid') return; const reason = prompt('Refund reversal reason'); if(!reason) return; r.status='Reversed'; r.reversalReason=reason; r.reversedAt=new Date().toISOString(); r.reversedBy=currentUsername(); addAudit('Refund reversed', `${r.number} reversed. ${reason}`); logActivity('Refund reversed', `${r.number} reversed.`); persist('Refund reversed.'); renderAll(); };

function renderFinance(){
  els.bankCount.textContent = state.banks.length;
  els.draftInvoiceCount.textContent = state.invoices.filter(x=>x.status==='Draft').length;
  els.postedReceiptCount.textContent = state.payments.filter(x=>x.status==='Posted').length;
  els.paidRefundCount.textContent = state.refunds.filter(x=>x.status==='Paid').length;
  els.banksTableBody.innerHTML = state.banks.map(b=>`<tr><td>${escapeHtml(b.name)}</td><td>${escapeHtml(b.accountNo||'')}</td><td>${escapeHtml(b.branch||'')}</td><td>${money(bankBalance(b.id))}</td><td><button class="table-btn" onclick="editBank('${b.id}')">Edit</button></td></tr>`).join('') || `<tr><td colspan="5" class="muted">No banks yet.</td></tr>`;
  els.invoicesTableBody.innerHTML = state.invoices.slice().reverse().map(i=>`<tr><td>${escapeHtml(i.number)}</td><td>${formatDate(i.date)}</td><td>${escapeHtml(studentName(i.studentId))}</td><td>${money(i.amount)}</td><td>${statusBadge(i.status)}</td><td>${invoiceActions(i)}</td></tr>`).join('') || `<tr><td colspan="6" class="muted">No invoices yet.</td></tr>`;
  els.paymentsTableBody.innerHTML = state.payments.slice().reverse().map(p=>`<tr><td>${escapeHtml(p.number)}</td><td>${formatDate(p.date)}</td><td>${escapeHtml(studentName(p.studentId))}</td><td>${money(p.amount)}</td><td>${statusBadge(p.status)}</td><td>${paymentActions(p)}</td></tr>`).join('') || `<tr><td colspan="6" class="muted">No receipts yet.</td></tr>`;
  els.refundsTableBody.innerHTML = state.refunds.slice().reverse().map(r=>`<tr><td>${escapeHtml(r.number)}</td><td>${formatDate(r.date)}</td><td>${escapeHtml(studentName(r.studentId))}</td><td>${money(r.amount)}</td><td>${statusBadge(r.status)}</td><td>${refundActions(r)}</td></tr>`).join('') || `<tr><td colspan="6" class="muted">No refunds yet.</td></tr>`;
}
function invoiceActions(i){ let out=''; if(i.status==='Draft') out += `<button class="table-btn primary-lite" onclick="postInvoice('${i.id}')">Post</button>`; if(i.status==='Posted') out += ` <button class="table-btn danger-lite" onclick="reverseInvoice('${i.id}')">Reverse</button>`; return out || '-'; }
function paymentActions(p){ let out=''; if(p.status==='Draft') out += `<button class="table-btn primary-lite" onclick="postReceipt('${p.id}')">Post</button>`; if(p.status==='Posted') out += ` <button class="table-btn danger-lite" onclick="reverseReceipt('${p.id}')">Reverse</button>`; return out || '-'; }
function refundActions(r){ let out=''; if(r.status==='Draft') out += `<button class="table-btn warn-lite" onclick="approveRefund('${r.id}')">Approve</button>`; if(r.status==='Approved') out += ` <button class="table-btn primary-lite" onclick="payRefund('${r.id}')">Pay</button>`; if(r.status==='Paid') out += ` <button class="table-btn danger-lite" onclick="reverseRefund('${r.id}')">Reverse</button>`; return out || '-'; }
function statusBadge(status){ const cls = status==='Posted' || status==='Paid' || status==='Active' || status==='Approved' ? 'success' : status==='Draft' ? 'warn' : status==='Reversed' || status==='Inactive' ? 'danger' : 'info'; return `<span class="badge ${cls}">${escapeHtml(status)}</span>`; }
function populateInvoiceOptions(){
  const sid = els.paymentStudentId.value; const options = `<option value="">Select invoice</option>` + state.invoices.filter(i => i.studentId===sid && i.status==='Posted' && invoiceBalance(i.id) > 0).map(i=>`<option value="${i.id}">${escapeHtml(i.number)} - ${money(invoiceBalance(i.id))}</option>`).join('');
  els.paymentInvoiceId.innerHTML = options;
}

function saveExam(e){ e.preventDefault(); if(!requirePermission('exams_manage','You cannot manage exams.')) return; const id = els.examId.value || uid('EXM'); const existing = state.exams.find(x=>x.id===id); const marks = Number(els.examMarks.value); const outOf = Number(els.examOutOf.value); const percentage = outOf ? (marks / outOf) * 100 : 0; const exam = { id, date:els.examDate.value, studentId:els.examStudentId.value, subject:els.examSubject.value.trim(), assessment:els.examAssessment.value, marks, outOf, grade:gradeFromPercent(percentage), percentage };
  if(!exam.studentId) return showToast('Select a student.');
  if(existing) Object.assign(existing, exam); else state.exams.push(exam);
  addAudit(existing?'Result updated':'Result saved', `${studentName(exam.studentId)} ${exam.subject} ${exam.grade}.`); logActivity('Exam result', `${studentName(exam.studentId)} scored ${exam.grade} in ${exam.subject}.`); persist('Marks saved.'); els.examForm.reset(); els.examId.value=''; setTodayDefaults(); renderAll(); }
function renderExams(){ const q = els.examSearch.value.trim().toLowerCase(); const rows = state.exams.filter(x => [x.subject,x.assessment,studentName(x.studentId)].join(' ').toLowerCase().includes(q)).sort((a,b)=> (b.date||'').localeCompare(a.date||'')).map(x=>`<tr><td>${formatDate(x.date)}</td><td>${escapeHtml(studentName(x.studentId))}</td><td>${escapeHtml(x.subject)}</td><td>${escapeHtml(x.assessment)}</td><td>${x.marks}/${x.outOf}</td><td><span class="badge info">${x.grade}</span></td></tr>`).join(''); els.examsTableBody.innerHTML = rows || `<tr><td colspan="6" class="muted">No marks yet.</td></tr>`; }
function gradeFromPercent(p){ return p >= 80 ? 'A' : p >= 70 ? 'B' : p >= 60 ? 'C' : p >= 50 ? 'D' : 'E'; }

function saveStaff(e){ e.preventDefault(); if(!requirePermission('staff_manage','You cannot manage staff.')) return; const id = els.staffId.value || uid('STF'); const existing = state.staff.find(x=>x.id===id); const item = { id, staffNo:els.staffNo.value.trim(), name:els.staffName.value.trim(), role:els.staffRole.value.trim(), department:els.staffDepartment.value.trim(), phone:els.staffPhone.value.trim(), status:els.staffStatus.value };
  if(existing) Object.assign(existing, item); else state.staff.push(item);
  addAudit(existing?'Staff updated':'Staff created', `${item.name} saved.`); logActivity('Staff saved', `${item.name} added to staff records.`); persist('Staff saved.'); els.staffForm.reset(); els.staffId.value=''; renderAll(); }
function renderStaff(){ const q = els.staffSearch.value.trim().toLowerCase(); const rows = state.staff.filter(s => [s.staffNo,s.name,s.role,s.department].join(' ').toLowerCase().includes(q)).map(s=>`<tr><td>${escapeHtml(s.staffNo)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.role)}</td><td>${escapeHtml(s.department||'')}</td><td>${statusBadge(s.status)}</td><td><button class="table-btn" onclick="editStaff('${s.id}')">Edit</button></td></tr>`).join(''); els.staffTableBody.innerHTML = rows || `<tr><td colspan="6" class="muted">No staff records.</td></tr>`; }
window.editStaff = function(id){ const s = state.staff.find(x=>x.id===id); if(!s) return; els.staffId.value=s.id; els.staffNo.value=s.staffNo; els.staffName.value=s.name; els.staffRole.value=s.role; els.staffDepartment.value=s.department; els.staffPhone.value=s.phone; els.staffStatus.value=s.status; switchSection('staff'); };

function saveAnnouncement(e){ e.preventDefault(); if(!requirePermission('communication_manage','You cannot manage communication.')) return; state.communications.unshift({ id:uid('COM'), type:'Announcement', audience:els.announcementAudience.value, title:els.announcementTitle.value.trim(), message:els.announcementMessage.value.trim(), by:currentUsername(), at:new Date().toISOString() }); addAudit('Announcement saved', `${els.announcementTitle.value.trim()} published.`); logActivity('Announcement', `${els.announcementTitle.value.trim()} saved.`); persist('Announcement saved.'); els.announcementForm.reset(); renderAll(); }
function saveSms(e){ e.preventDefault(); if(!requirePermission('communication_manage','You cannot manage SMS.')) return; const target = els.smsStudentId.value === 'ALL' ? 'All students' : studentName(els.smsStudentId.value); state.communications.unshift({ id:uid('SMS'), type:'SMS', audience:target, title:els.smsType.value, message:els.smsMessage.value.trim(), by:currentUsername(), at:new Date().toISOString() }); addAudit('SMS alert logged', `${els.smsType.value} prepared for ${target}.`); logActivity('SMS log', `${els.smsType.value} sent to ${target}.`); persist('SMS alert logged.'); els.smsForm.reset(); renderAll(); }
function renderCommunication(){ const items = state.communications.slice(0,20).map(c=>`<div class="list-item"><div><strong>${escapeHtml(c.type)} · ${escapeHtml(c.title)}</strong><small>${escapeHtml(c.audience)} · ${formatDateTime(c.at)} · by ${escapeHtml(c.by)}</small></div><div class="muted">${escapeHtml(c.message)}</div></div>`).join(''); els.communicationLog.innerHTML = items || 'No communication yet.'; }

function saveUser(e){ e.preventDefault(); if(!requirePermission('users_manage','Only administrator can manage users.')) return; const role = els.userRole.value; const id = els.userId.value || uid('USR'); const existing = state.auth.users.find(x=>x.id===id); const privileges = role === 'Administrator' ? ['*'] : Array.from(document.querySelectorAll('.privilege-check:checked')).map(x=>x.value);
  const user = { id, fullName:els.userFullName.value.trim(), username:els.userUsername.value.trim(), password:els.userPassword.value, role, active:els.userStatus.value==='Active', approvalLimit:Number(els.approvalLimit.value||0), privileges };
  if(existing) Object.assign(existing, user); else state.auth.users.push(user);
  addAudit(existing?'User updated':'User created', `${user.fullName} (${user.role}) saved.`); logActivity('User saved', `${user.username} account updated.`); persist('User saved.'); els.userForm.reset(); els.userId.value=''; renderPrivilegeMatrix(); renderAll(); }
function onRoleChange(){ const role = els.userRole.value; renderPrivilegeMatrix(role === 'Custom' ? [] : (ROLE_PRESETS[role] || [])); }
function renderPrivilegeMatrix(selected=[]){ if(els.userRole.value === 'Administrator'){ els.userPrivilegesGrid.innerHTML = `<div class="permission-note">Administrator has full system rights.</div>`; return; } els.userPrivilegesGrid.innerHTML = PRIVILEGES.map(p=>`<label class="privilege-item"><input class="privilege-check" type="checkbox" value="${p.key}" ${selected.includes(p.key)?'checked':''}><div><strong>${p.label}</strong><span>${p.description}</span></div></label>`).join(''); }
function renderUsers(){ const q = els.userSearch.value.trim().toLowerCase(); const rows = state.auth.users.filter(u => [u.fullName,u.username,u.role].join(' ').toLowerCase().includes(q)).map(u=>`<tr><td>${escapeHtml(u.fullName)}</td><td>${escapeHtml(u.username)}</td><td>${escapeHtml(u.role)}</td><td>${statusBadge(u.active!==false?'Active':'Inactive')}</td><td>${money(u.approvalLimit||0)}</td><td><button class="table-btn" onclick="editUser('${u.id}')">Edit</button> <button class="table-btn danger-lite" onclick="toggleUserStatus('${u.id}')">${u.active!==false?'Deactivate':'Activate'}</button></td></tr>`).join(''); els.usersTableBody.innerHTML = rows || `<tr><td colspan="6" class="muted">No users.</td></tr>`; }
window.editUser = function(id){ if(!requirePermission('users_manage','Only administrator can manage users.')) return; const u = state.auth.users.find(x=>x.id===id); if(!u) return; els.userId.value=u.id; els.userFullName.value=u.fullName; els.userUsername.value=u.username; els.userPassword.value=u.password; els.userRole.value=u.role; els.userStatus.value=u.active!==false?'Active':'Inactive'; els.approvalLimit.value=u.approvalLimit||0; renderPrivilegeMatrix(u.role==='Administrator'?['*']:(u.privileges||[])); Array.from(document.querySelectorAll('.privilege-check')).forEach(chk=> chk.checked = (u.privileges||[]).includes(chk.value)); switchSection('users'); };
window.toggleUserStatus = function(id){ if(!requirePermission('users_manage','Only administrator can manage users.')) return; const u = state.auth.users.find(x=>x.id===id); if(!u) return; u.active = !(u.active!==false); addAudit('User status changed', `${u.username} is now ${u.active?'Active':'Inactive'}.`); if(currentUser()?.id===id && !u.active) { state.auth.currentUser = null; } persist('User status updated.'); syncAuthUI(); renderAll(); };

function saveSettings(e){ e.preventDefault(); if(!requirePermission('settings_manage','You cannot change settings.')) return; state.settings.schoolName=els.schoolName.value.trim(); state.settings.currentTerm=els.currentTerm.value.trim(); state.settings.schoolPhone=els.schoolPhone.value.trim(); state.settings.schoolEmail=els.schoolEmail.value.trim(); state.settings.schoolAddress=els.schoolAddress.value.trim(); state.settings.currency=els.currency.value.trim() || 'KES'; state.settings.footerNote=els.footerNote.value.trim(); addAudit('Settings updated', 'Institution settings updated.'); persist('Settings saved.'); syncAuthUI(); renderAll(); }
function fillSettingsForm(){ els.schoolName.value=state.settings.schoolName; els.currentTerm.value=state.settings.currentTerm; els.schoolPhone.value=state.settings.schoolPhone; els.schoolEmail.value=state.settings.schoolEmail; els.schoolAddress.value=state.settings.schoolAddress; els.currency.value=state.settings.currency; els.footerNote.value=state.settings.footerNote; }

function renderDashboard(){
  els.statStudents.textContent = state.students.filter(s=>s.status==='Active').length;
  els.statStaff.textContent = state.staff.filter(s=>s.status==='Active').length;
  els.statInvoiced.textContent = money(totalPostedInvoices());
  els.statCollected.textContent = money(totalPostedReceipts());
  els.statOutstanding.textContent = money(totalOutstanding());
  const today = new Date().toISOString().slice(0,10); els.statAttendanceToday.textContent = state.attendance.filter(a=>a.date===today).length;

  const summaries = [
    ['Active classes', [...new Set(state.students.map(s=>s.className).filter(Boolean))].length],
    ['Average exam score', averageExamPercent().toFixed(2) + '%'],
    ['Attendance rate', attendanceRate().toFixed(2) + '%'],
    ['Messages logged', state.communications.length]
  ];
  els.dashboardSummary.innerHTML = summaries.map(([a,b])=>`<div class="list-item"><div><strong>${a}</strong><small>Current snapshot</small></div><span>${b}</span></div>`).join('');
  const outstanding = state.students.map(s=>({name:s.name,balance:studentBalance(s.id),className:s.className})).filter(x=>x.balance>0).sort((a,b)=>b.balance-a.balance).slice(0,5);
  els.outstandingList.innerHTML = outstanding.length ? outstanding.map(x=>`<div class="list-item"><div><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.className)}</small></div><span>${money(x.balance)}</span></div>`).join('') : 'No balances yet.';
  els.activityList.innerHTML = state.activities.slice(0,8).map(a=>`<div class="list-item"><div><strong>${escapeHtml(a.title)}</strong><small>${formatDateTime(a.at)}</small></div><span>${escapeHtml(a.detail)}</span></div>`).join('') || 'No activity yet.';
}

function renderReports(){
  els.reportBalance.textContent = money(totalOutstanding());
  els.reportPerformance.textContent = `${averageExamPercent().toFixed(2)}%`;
  els.reportAttendance.textContent = `${attendanceRate().toFixed(2)}%`;
  els.reportMessages.textContent = state.communications.length;
  els.reportBalancesTableBody.innerHTML = state.students.map(s=>{ const invoiced = postedInvoicesForStudent(s.id); const paid = postedPaymentsForStudent(s.id); return `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.className)}</td><td>${money(invoiced)}</td><td>${money(paid)}</td><td>${money(studentBalance(s.id))}</td></tr>`; }).join('') || `<tr><td colspan="5" class="muted">No report data.</td></tr>`;
  const insights = [];
  const topStudent = topAcademicStudent(); if(topStudent) insights.push(`<div class="list-item"><div><strong>Top academic student</strong><small>Best average score</small></div><span>${escapeHtml(topStudent.name)} · ${topStudent.avg.toFixed(2)}%</span></div>`);
  const lowBalances = state.students.filter(s=>studentBalance(s.id)<=0).length; insights.push(`<div class="list-item"><div><strong>Cleared students</strong><small>Students with zero or credit balance</small></div><span>${lowBalances}</span></div>`);
  insights.push(`<div class="list-item"><div><strong>Attendance records</strong><small>Total entries captured</small></div><span>${state.attendance.length}</span></div>`);
  els.reportInsightList.innerHTML = insights.join('') || 'No report data yet.';
}

function renderAuditTrail(){ els.auditTrailList.innerHTML = state.audit.slice(0,18).map(a=>`<div class="list-item"><div><strong>${escapeHtml(a.title)}</strong><small>${formatDateTime(a.at)} · by ${escapeHtml(a.by)}</small></div><span>${escapeHtml(a.detail)}</span></div>`).join('') || 'No audit logs yet.'; }

function studentName(id){ return state.students.find(s=>s.id===id)?.name || 'Unknown Student'; }
function studentClass(id){ return state.students.find(s=>s.id===id)?.className || ''; }
function bankName(id){ return state.banks.find(b=>b.id===id)?.name || 'Bank'; }
function postedInvoicesForStudent(id){ return state.invoices.filter(i=>i.studentId===id && i.status==='Posted').reduce((a,b)=>a+Number(b.amount||0),0); }
function postedPaymentsForStudent(id){ return state.payments.filter(p=>p.studentId===id && p.status==='Posted').reduce((a,b)=>a+Number(b.amount||0),0); }
function paidRefundsForStudent(id){ return state.refunds.filter(r=>r.studentId===id && r.status==='Paid').reduce((a,b)=>a+Number(b.amount||0),0); }
function reversedRefundsForStudent(id){ return state.refunds.filter(r=>r.studentId===id && r.status==='Reversed').reduce((a,b)=>a+Number(b.amount||0),0); }
function studentBalance(id){ return postedInvoicesForStudent(id) - postedPaymentsForStudent(id) + paidRefundsForStudent(id) - reversedRefundsForStudent(id); }
function studentCredit(id){ return Math.max(0, postedPaymentsForStudent(id) - postedInvoicesForStudent(id) - paidRefundsForStudent(id) + reversedRefundsForStudent(id)); }
function totalPostedInvoices(){ return state.invoices.filter(i=>i.status==='Posted').reduce((a,b)=>a+Number(b.amount||0),0); }
function totalPostedReceipts(){ return state.payments.filter(p=>p.status==='Posted').reduce((a,b)=>a+Number(b.amount||0),0); }
function totalOutstanding(){ return state.students.reduce((sum,s)=>sum + Math.max(0, studentBalance(s.id)), 0); }
function invoicePaidAmount(id){ return state.payments.filter(p=>p.invoiceId===id && p.status==='Posted').reduce((a,b)=>a+Number(b.amount||0),0); }
function invoiceBalance(id){ const inv = state.invoices.find(i=>i.id===id); if(!inv || inv.status!=='Posted') return 0; return Number(inv.amount||0) - invoicePaidAmount(id); }
function bankBalance(id){ const receipts = state.payments.filter(p=>p.bankId===id && p.status==='Posted').reduce((a,b)=>a+Number(b.amount||0),0); const refunds = state.refunds.filter(r=>r.bankId===id && r.status==='Paid').reduce((a,b)=>a+Number(b.amount||0),0); const reversedRefunds = state.refunds.filter(r=>r.bankId===id && r.status==='Reversed').reduce((a,b)=>a+Number(b.amount||0),0); return receipts - refunds + reversedRefunds; }
function attendanceRate(){ if(!state.attendance.length) return 0; const presentish = state.attendance.filter(a=>a.status==='Present' || a.status==='Late').length; return (presentish / state.attendance.length) * 100; }
function averageExamPercent(){ if(!state.exams.length) return 0; return state.exams.reduce((a,b)=>a+Number(b.percentage||0),0) / state.exams.length; }
function topAcademicStudent(){ if(!state.exams.length) return null; const byStudent = {}; state.exams.forEach(x=>{ if(!byStudent[x.studentId]) byStudent[x.studentId] = []; byStudent[x.studentId].push(Number(x.percentage||0)); }); const ranked = Object.entries(byStudent).map(([id,arr])=>({ id, name:studentName(id), avg:arr.reduce((a,b)=>a+b,0)/arr.length })).sort((a,b)=>b.avg-a.avg); return ranked[0] || null; }
function autoNumber(prefix, n){ return `${prefix}-${String(n).padStart(4,'0')}`; }
function escapeHtml(v){ return String(v ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m])); }

function exportBackup(){ const blob = new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'edubill_pro_v6_backup.json'; a.click(); URL.revokeObjectURL(a.href); }
function importBackup(e){ const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = () => { try{ const data = JSON.parse(reader.result); Object.keys(defaultState).forEach(k => state[k] = data[k] ?? structuredClone(defaultState[k])); persist('Backup imported.'); syncAuthUI(); renderAll(); } catch { showToast('Invalid backup file.'); } }; reader.readAsText(file); e.target.value=''; }
function resetAll(){ if(!confirm('Reset all demo data?')) return; const fresh = structuredClone(defaultState); Object.keys(fresh).forEach(k=> state[k] = fresh[k]); localStorage.removeItem(STORAGE_KEY); setTodayDefaults(); syncAuthUI(); renderPrivilegeMatrix(); showToast('System reset.'); }

function loadSampleData(){
  if(!confirm('Load sample school data?')) return;
  state.students = [
    { id:'STD1', admissionNo:'ADM/2026/001', name:'Achieng Atieno', className:'Grade 7', parent:'Mary Atieno', phone:'+254700111111', status:'Active', notes:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
    { id:'STD2', admissionNo:'ADM/2026/002', name:'Brian Otieno', className:'Grade 7', parent:'James Otieno', phone:'+254700222222', status:'Active', notes:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
    { id:'STD3', admissionNo:'ADM/2026/003', name:'Cynthia Auma', className:'Grade 8', parent:'Agnes Auma', phone:'+254700333333', status:'Active', notes:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() }
  ];
  state.staff = [
    { id:'ST1', staffNo:'STF001', name:'Peter Oloo', role:'Principal', department:'Administration', phone:'+254711000001', status:'Active' },
    { id:'ST2', staffNo:'STF002', name:'Jane Anyango', role:'Teacher', department:'Academics', phone:'+254711000002', status:'Active' },
    { id:'ST3', staffNo:'STF003', name:'Mercy Adhiambo', role:'Bursar', department:'Finance', phone:'+254711000003', status:'Active' }
  ];
  state.banks = [
    { id:'BNK1', name:'KCB Main Account', accountNo:'00123456789', branch:'Bondo', status:'Active' },
    { id:'BNK2', name:'Equity Collection Account', accountNo:'9988776655', branch:'Bondo', status:'Active' }
  ];
  state.invoices = [
    { id:'INV1', number:'INV-0001', date:new Date().toISOString().slice(0,10), studentId:'STD1', term:'Term 1 2026', amount:12000, description:'School fees', status:'Posted', createdBy:'finance', postedBy:'finance', postedAt:new Date().toISOString() },
    { id:'INV2', number:'INV-0002', date:new Date().toISOString().slice(0,10), studentId:'STD2', term:'Term 1 2026', amount:15000, description:'School fees', status:'Posted', createdBy:'finance', postedBy:'finance', postedAt:new Date().toISOString() },
    { id:'INV3', number:'INV-0003', date:new Date().toISOString().slice(0,10), studentId:'STD3', term:'Term 1 2026', amount:14000, description:'School fees', status:'Draft', createdBy:'finance' }
  ];
  state.payments = [
    { id:'PAY1', number:'RCPT-0001', date:new Date().toISOString().slice(0,10), studentId:'STD1', invoiceId:'INV1', bankId:'BNK1', amount:7000, method:'Bank', status:'Posted', createdBy:'finance', postedBy:'finance', postedAt:new Date().toISOString() },
    { id:'PAY2', number:'RCPT-0002', date:new Date().toISOString().slice(0,10), studentId:'STD2', invoiceId:'INV2', bankId:'BNK2', amount:15000, method:'M-Pesa', status:'Posted', createdBy:'finance', postedBy:'finance', postedAt:new Date().toISOString() }
  ];
  state.refunds = [
    { id:'REF1', number:'RFD-0001', date:new Date().toISOString().slice(0,10), studentId:'STD2', bankId:'BNK2', amount:1000, reason:'Overpayment', status:'Draft', createdBy:'finance' }
  ];
  state.attendance = [
    { id:'ATT1', date:new Date().toISOString().slice(0,10), studentId:'STD1', status:'Present', remarks:'', by:'teacher' },
    { id:'ATT2', date:new Date().toISOString().slice(0,10), studentId:'STD2', status:'Late', remarks:'Traffic', by:'teacher' },
    { id:'ATT3', date:new Date().toISOString().slice(0,10), studentId:'STD3', status:'Absent', remarks:'Sick', by:'teacher' }
  ];
  state.exams = [
    { id:'EX1', date:new Date().toISOString().slice(0,10), studentId:'STD1', subject:'Mathematics', assessment:'CAT', marks:84, outOf:100, percentage:84, grade:'A' },
    { id:'EX2', date:new Date().toISOString().slice(0,10), studentId:'STD2', subject:'English', assessment:'CAT', marks:72, outOf:100, percentage:72, grade:'B' },
    { id:'EX3', date:new Date().toISOString().slice(0,10), studentId:'STD3', subject:'Science', assessment:'CAT', marks:61, outOf:100, percentage:61, grade:'C' }
  ];
  state.communications = [
    { id:'COM1', type:'Announcement', audience:'All', title:'Parents Meeting', message:'Parents meeting on Friday at 9:00 AM.', by:'admin', at:new Date().toISOString() },
    { id:'SMS1', type:'SMS', audience:'All students', title:'Fees Reminder', message:'Kindly clear outstanding balances.', by:'finance', at:new Date().toISOString() }
  ];
  state.activities = []; state.audit = [];
  addAudit('Sample data loaded', 'Demo school data loaded.');
  logActivity('Sample data', 'System populated with demo school data.');
  persist('Sample data loaded.');
  renderAll();
}
