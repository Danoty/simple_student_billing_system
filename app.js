const STORAGE_KEY = 'edubill_pro_finance_v5';

const defaultState = {
  settings: {
    schoolName: 'EduBill Pro Finance',
    currentTerm: 'Academic Year 2026/2027',
    schoolPhone: '+254 700 000000',
    schoolEmail: 'finance@institution.ac.ke',
    currency: 'KES',
    schoolAddress: 'Main Campus',
    footerNote: 'System demo for student finance workflow.'
  },
  auth: {
    users: [{ id:'USR_ADMIN', fullName:'System Administrator', username: 'admin', password: 'admin123', role: 'Administrator', active:true, approvalLimit:0, privileges:['*'] }],
    currentUser: null
  },
  students: [],
  banks: [],
  invoices: [],
  payments: [],
  refunds: [],
  activities: [],
  lastSavedAt: null
};

const state = loadState();
const $ = id => document.getElementById(id);
const els = {
  authScreen: $('authScreen'), appShell: $('appShell'), loginForm: $('loginForm'), loginUsername: $('loginUsername'), loginPassword: $('loginPassword'),
  navLinks: document.querySelectorAll('.nav-link'), sections: document.querySelectorAll('.section'),
  pageTitle: $('pageTitle'), pageSubtitle: $('pageSubtitle'), signedInUser: $('signedInUser'),
  brandSchoolName: $('brandSchoolName'), brandTerm: $('brandTerm'), lastSavedLabel: $('lastSavedLabel'),
  statStudents: $('statStudents'), statInvoiced: $('statInvoiced'), statCollected: $('statCollected'), statOutstanding: $('statOutstanding'), statBankBalance: $('statBankBalance'), statRefunds: $('statRefunds'),
  collectionPeakLabel: $('collectionPeakLabel'), outstandingList: $('outstandingList'), activityList: $('activityList'), chart: $('collectionsChart'),
  studentForm: $('studentForm'), studentId: $('studentId'), admissionNo: $('admissionNo'), studentName: $('studentName'), programme: $('programme'), yearOfStudy: $('yearOfStudy'), phone: $('phone'), studentEmail: $('studentEmail'), studentStatus: $('studentStatus'), guardianName: $('guardianName'), studentNotes: $('studentNotes'), clearStudentBtn: $('clearStudentBtn'), studentSearch: $('studentSearch'), studentsTableBody: $('studentsTableBody'),
  bankForm: $('bankForm'), bankId: $('bankId'), bankName: $('bankName'), bankAccount: $('bankAccount'), bankBranch: $('bankBranch'), bankType: $('bankType'), bankStatus: $('bankStatus'), bankOpeningBalance: $('bankOpeningBalance'), bankNotes: $('bankNotes'), clearBankBtn: $('clearBankBtn'), bankSearch: $('bankSearch'), banksTableBody: $('banksTableBody'),
  invoiceForm: $('invoiceForm'), invoiceStudent: $('invoiceStudent'), invoiceNumber: $('invoiceNumber'), invoiceDescription: $('invoiceDescription'), invoiceTerm: $('invoiceTerm'), invoiceAmount: $('invoiceAmount'), invoiceDueDate: $('invoiceDueDate'), invoiceNotes: $('invoiceNotes'), invoiceSearch: $('invoiceSearch'), invoicesTableBody: $('invoicesTableBody'),
  paymentForm: $('paymentForm'), paymentStudent: $('paymentStudent'), paymentInvoice: $('paymentInvoice'), receiptNumber: $('receiptNumber'), paymentBank: $('paymentBank'), paymentMethod: $('paymentMethod'), paymentAmount: $('paymentAmount'), paymentDate: $('paymentDate'), paymentReference: $('paymentReference'), paymentNarration: $('paymentNarration'), paymentSearch: $('paymentSearch'), paymentsTableBody: $('paymentsTableBody'),
  refundForm: $('refundForm'), refundStudent: $('refundStudent'), refundNumber: $('refundNumber'), refundBank: $('refundBank'), refundAmount: $('refundAmount'), refundDate: $('refundDate'), refundReason: $('refundReason'), refundNotes: $('refundNotes'), refundSearch: $('refundSearch'), refundsTableBody: $('refundsTableBody'),
  ledgerStudent: $('ledgerStudent'), ledgerDate: $('ledgerDate'), generateLedgerBtn: $('generateLedgerBtn'), ledgerSummary: $('ledgerSummary'), ledgerTableBody: $('ledgerTableBody'), auditTrailList: $('auditTrailList'),
  studentProfilePanel: $('studentProfilePanel'), clearanceSummary: $('clearanceSummary'), clearanceTableBody: $('clearanceTableBody'),
  dailyCollections: $('dailyCollections'), reportTotalInvoices: $('reportTotalInvoices'), reportOutstanding: $('reportOutstanding'), reportCleared: $('reportCleared'), reportHighlights: $('reportHighlights'),
  exportStudentsBtn: $('exportStudentsBtn'), exportPaymentsBtn: $('exportPaymentsBtn'), exportInvoicesBtn: $('exportInvoicesBtn'), exportRefundsBtn: $('exportRefundsBtn'),
  statementStudent: $('statementStudent'), statementDate: $('statementDate'), generateStatementBtn: $('generateStatementBtn'), statementPreview: $('statementPreview'),
  settingsForm: $('settingsForm'), schoolName: $('schoolName'), currentTerm: $('currentTerm'), schoolPhone: $('schoolPhone'), schoolEmail: $('schoolEmail'), currency: $('currency'), schoolAddress: $('schoolAddress'), footerNote: $('footerNote'),
  userForm: $('userForm'), userId: $('userId'), userFullName: $('userFullName'), userUsername: $('userUsername'), userPassword: $('userPassword'), userRole: $('userRole'), userStatus: $('userStatus'), approvalLimit: $('approvalLimit'), userPrivilegesGrid: $('userPrivilegesGrid'), clearUserBtn: $('clearUserBtn'), userSearch: $('userSearch'), usersTableBody: $('usersTableBody'), workflowSummary: $('workflowSummary'),
  loadSampleBtn: $('loadSampleBtn'), logoutBtn: $('logoutBtn'), backupBtn: $('backupBtn'), importBackupInput: $('importBackupInput'), resetBtn: $('resetBtn'), quickActions: document.querySelectorAll('.quick-action'),
  modal: $('modal'), modalTitle: $('modalTitle'), modalBody: $('modalBody'), printModalBtn: $('printModalBtn'), closeModalBtn: $('closeModalBtn'), toast: $('toast')
};

init();

function init() {
  bindEvents();
  syncAuthUI();
  syncBranding();
  renderPrivilegeMatrix();
  setDefaultDates();
  renderAll();
}

function bindEvents() {
  els.loginForm.addEventListener('submit', handleLogin);
  els.logoutBtn.addEventListener('click', handleLogout);
  els.navLinks.forEach(link => link.addEventListener('click', () => switchSection(link.dataset.section)));
  els.quickActions.forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.jump)));

  els.studentForm.addEventListener('submit', saveStudent);
  els.clearStudentBtn.addEventListener('click', resetStudentForm);
  els.studentSearch.addEventListener('input', renderStudents);

  els.bankForm.addEventListener('submit', saveBank);
  els.clearBankBtn.addEventListener('click', resetBankForm);
  els.bankSearch.addEventListener('input', renderBanks);

  els.invoiceForm.addEventListener('submit', saveInvoice);
  els.invoiceSearch.addEventListener('input', renderInvoices);

  els.paymentForm.addEventListener('submit', savePayment);
  els.paymentStudent.addEventListener('change', () => { fillInvoiceOptions(els.paymentStudent.value); suggestPaymentAmount(); });
  els.paymentInvoice.addEventListener('change', suggestPaymentAmount);
  els.paymentSearch.addEventListener('input', renderPayments);

  els.refundForm.addEventListener('submit', saveRefund);
  els.refundStudent.addEventListener('change', suggestRefundAmount);
  els.refundSearch.addEventListener('input', renderRefunds);

  els.generateLedgerBtn.addEventListener('click', renderLedger);
  els.generateStatementBtn.addEventListener('click', generateStatementPreview);

  els.exportStudentsBtn.addEventListener('click', () => exportCSV('students'));
  els.exportPaymentsBtn.addEventListener('click', () => exportCSV('payments'));
  els.exportInvoicesBtn.addEventListener('click', () => exportCSV('invoices'));
  els.exportRefundsBtn.addEventListener('click', () => exportCSV('refunds'));

  els.settingsForm.addEventListener('submit', saveSettings);
  els.userForm?.addEventListener('submit', saveUser);
  els.clearUserBtn?.addEventListener('click', resetUserForm);
  els.userSearch?.addEventListener('input', renderUsers);
  els.userRole?.addEventListener('change', handleRolePresetChange);
  els.loadSampleBtn.addEventListener('click', seedSampleData);
  els.backupBtn.addEventListener('click', exportBackup);
  els.importBackupInput.addEventListener('change', importBackup);
  els.resetBtn.addEventListener('click', resetSystem);

  els.closeModalBtn.addEventListener('click', closeModal);
  els.printModalBtn.addEventListener('click', () => window.print());
  els.modal.addEventListener('click', e => e.target === els.modal && closeModal());
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState), ...parsed,
      settings: { ...structuredClone(defaultState).settings, ...(parsed.settings || {}) },
      auth: { ...structuredClone(defaultState).auth, ...(parsed.auth || {}) },
      students: parsed.students || [], banks: parsed.banks || [], invoices: parsed.invoices || [], payments: parsed.payments || [], refunds: parsed.refunds || [], activities: parsed.activities || []
    };
    normalized.auth.users = normalizeUsers(normalized.auth.users || []);
    if (normalized.auth.currentUser) {
      const current = normalized.auth.users.find(u => u.username === normalized.auth.currentUser.username);
      normalized.auth.currentUser = current ? makeSessionUser(current) : null;
    }
    return normalized;
  } catch { return structuredClone(defaultState); }
}


function persist(message) {
  state.lastSavedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncSaveStatus();
  if (message) showToast(message);
}

function syncAuthUI() {
  const user = state.auth.currentUser;
  const loggedIn = Boolean(user);
  els.authScreen.classList.toggle('hidden', loggedIn);
  els.appShell.classList.toggle('hidden', !loggedIn);
  els.signedInUser.textContent = user ? `${user.fullName || user.username} • ${user.role}` : 'Administrator';
  applyAccessControl();
}


function handleLogin(e) {
  e.preventDefault();
  const username = els.loginUsername.value.trim();
  const password = els.loginPassword.value;
  const user = state.auth.users.find(u => u.username === username && u.password === password);
  if (!user) return showToast('Invalid login details. Use admin / admin123.');
  if (user.active === false) return showToast('This user is inactive. Contact administrator.');
  state.auth.currentUser = makeSessionUser(user);
  persist();
  syncAuthUI();
  logActivity('Signed in', `${user.username} logged into the system.`);
  renderAll();
}

function handleLogout() {
  state.auth.currentUser = null;
  persist();
  syncAuthUI();
}

function switchSection(sectionId) {
  if (!canAccessSection(sectionId)) { showToast('You do not have access to that section.'); return; }
  els.navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === sectionId));
  els.sections.forEach(section => section.classList.toggle('active', section.id === sectionId));
  const title = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  els.pageTitle.textContent = title;
  const subtitles = {
    dashboard: 'A premium web-based finance demo with posting, banks, refunds and reversals.',
    students: 'Manage student bio data and monitor balances.',
    banks: 'Maintain collection banks used in receipt posting and refunds.',
    invoices: 'Create draft invoices, post them, and reverse when necessary.',
    payments: 'Draft, post and reverse receipts with bank selection.',
    refunds: 'Approve, pay and reverse student refunds.',
    ledger: 'Student-by-student ledger and audit trail.',
    clearance: 'Balance-based clearance status and printable letters.',
    reports: 'Collections, exports and printable statements.',
    users: 'Create users, define privileges and control approvals.',
    settings: 'Institution branding and system notes.'
  };
  els.pageSubtitle.textContent = subtitles[sectionId] || '';
}

function syncBranding() {
  const s = state.settings;
  els.brandSchoolName.textContent = s.schoolName;
  els.brandTerm.textContent = s.currentTerm;
  els.schoolName.value = s.schoolName;
  els.currentTerm.value = s.currentTerm;
  els.schoolPhone.value = s.schoolPhone;
  els.schoolEmail.value = s.schoolEmail;
  els.currency.value = s.currency;
  els.schoolAddress.value = s.schoolAddress;
  els.footerNote.value = s.footerNote;
  syncSaveStatus();
}

function syncSaveStatus() {
  els.lastSavedLabel.textContent = state.lastSavedAt ? new Date(state.lastSavedAt).toLocaleString() : 'Not saved yet';
}

function setDefaultDates() {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  els.invoiceDueDate.value ||= due;
  els.paymentDate.value ||= today;
  els.refundDate.value ||= today;
  els.statementDate.value ||= today;
  els.ledgerDate.value ||= today;
}

function renderAll() {
  populateSelectors();
  renderDashboard();
  renderStudents();
  renderBanks();
  renderInvoices();
  renderPayments();
  renderRefunds();
  renderClearance();
  renderReports();
  renderActivity();
  renderAuditTrail();
  renderUsers();
  renderLedger(false);
  generateDocumentNumbers();
  applyAccessControl();
}

function populateSelectors() {
  const studentOptions = ['<option value="">Select student</option>'].concat(state.students.map(s => `<option value="${s.id}">${escapeHtml(s.admissionNo)} - ${escapeHtml(s.name)}</option>`)).join('');
  [els.invoiceStudent, els.paymentStudent, els.refundStudent, els.ledgerStudent, els.statementStudent].forEach(select => {
    const current = select.value;
    select.innerHTML = studentOptions;
    if ([...select.options].some(o => o.value === current)) select.value = current;
  });
  fillInvoiceOptions(els.paymentStudent.value);
  const bankOptions = ['<option value="">Select bank</option>'].concat(state.banks.filter(b => b.status === 'Active').map(b => `<option value="${b.id}">${escapeHtml(b.name)} - ${escapeHtml(b.accountNo)}</option>`)).join('');
  [els.paymentBank, els.refundBank].forEach(select => {
    const current = select.value;
    select.innerHTML = bankOptions;
    if ([...select.options].some(o => o.value === current)) select.value = current;
  });
}

function generateDocumentNumbers() {
  els.invoiceNumber.value = nextNumber('INV', state.invoices.length + 1);
  els.receiptNumber.value = nextNumber('RCT', state.payments.length + 1);
  els.refundNumber.value = nextNumber('RFD', state.refunds.length + 1);
}

function nextNumber(prefix, num) { return `${prefix}-${String(num).padStart(5, '0')}`; }
function uid(prefix='ID') { return `${prefix}_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36).slice(-4)}`; }
function currency(value) { return `${state.settings.currency} ${Number(value || 0).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})}`; }
function escapeHtml(str='') { return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
function askReason(label='reason') { const value = prompt(`Enter ${label}:`); return value ? value.trim() : ''; }

function studentById(id){ return state.students.find(s => s.id === id); }
function bankById(id){ return state.banks.find(b => b.id === id); }
function invoiceById(id){ return state.invoices.find(i => i.id === id); }
function paymentById(id){ return state.payments.find(p => p.id === id); }
function refundById(id){ return state.refunds.find(r => r.id === id); }

function getPostedStudentTotals(studentId) {
  const invoiced = state.invoices.filter(i => i.studentId === studentId && i.status === 'Posted').reduce((a,b)=>a+Number(b.amount),0);
  const receipts = state.payments.filter(p => p.studentId === studentId && p.status === 'Posted').reduce((a,b)=>a+Number(b.amount),0);
  const refunds = state.refunds.filter(r => r.studentId === studentId && r.status === 'Paid').reduce((a,b)=>a+Number(b.amount),0);
  return { invoiced, receipts, refunds, balance: invoiced - receipts + refunds, credit: Math.max(0, receipts - invoiced - refunds) };
}

function invoicePaidAmount(invoiceId) {
  return state.payments.filter(p => p.invoiceId === invoiceId && p.status === 'Posted').reduce((a,b)=>a+Number(b.amount),0);
}
function invoiceBalance(invoiceId) {
  const inv = invoiceById(invoiceId); if (!inv || inv.status !== 'Posted') return 0;
  return Number(inv.amount) - invoicePaidAmount(invoiceId);
}
function bankRunningBalance(bankId) {
  const bank = bankById(bankId); if (!bank) return 0;
  const receipts = state.payments.filter(p => p.bankId === bankId && p.status === 'Posted').reduce((a,b)=>a+Number(b.amount),0);
  const refunds = state.refunds.filter(r => r.bankId === bankId && r.status === 'Paid').reduce((a,b)=>a+Number(b.amount),0);
  return Number(bank.openingBalance || 0) + receipts - refunds;
}

function saveStudent(e) {
  e.preventDefault();
  if (!requirePermission('students_manage', 'You cannot create or edit students.')) return;
  const payload = {
    id: els.studentId.value || uid('STD'),
    admissionNo: els.admissionNo.value.trim(),
    name: els.studentName.value.trim(),
    programme: els.programme.value.trim(),
    year: els.yearOfStudy.value,
    phone: els.phone.value.trim(),
    email: els.studentEmail.value.trim(),
    status: els.studentStatus.value,
    guardian: els.guardianName.value.trim(),
    notes: els.studentNotes.value.trim(),
    createdAt: new Date().toISOString()
  };
  const index = state.students.findIndex(s => s.id === payload.id);
  if (index >= 0) { state.students[index] = { ...state.students[index], ...payload }; logActivity('Student updated', `${payload.name} profile was updated.`); }
  else { state.students.unshift(payload); logActivity('Student created', `${payload.name} was added.`); }
  persist('Student saved.');
  resetStudentForm();
  renderAll();
}
function resetStudentForm() { els.studentForm.reset(); els.studentId.value=''; }

function renderStudents() {
  const q = els.studentSearch.value.trim().toLowerCase();
  const rows = state.students.filter(s => !q || [s.admissionNo,s.name,s.programme,s.email].join(' ').toLowerCase().includes(q))
    .map(s => {
      const totals = getPostedStudentTotals(s.id);
      return `<tr>
        <td>${escapeHtml(s.admissionNo)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.programme)}</td><td>${escapeHtml(s.year)}</td><td>${currency(totals.balance)}</td>
        <td><div class="actions-row"><button class="table-btn" onclick="editStudent('${s.id}')">Edit</button><button class="table-btn" onclick="viewStudentProfile('${s.id}')">View</button></div></td>
      </tr>`;
    }).join('');
  els.studentsTableBody.innerHTML = rows || `<tr><td colspan="6" class="empty-row">No students found.</td></tr>`;
}
window.editStudent = function(id){ const s = studentById(id); if(!s) return; els.studentId.value=s.id; els.admissionNo.value=s.admissionNo; els.studentName.value=s.name; els.programme.value=s.programme; els.yearOfStudy.value=s.year; els.phone.value=s.phone; els.studentEmail.value=s.email; els.studentStatus.value=s.status; els.guardianName.value=s.guardian; els.studentNotes.value=s.notes; switchSection('students'); };
window.viewStudentProfile = function(id){ const s = studentById(id); if(!s) return; const t = getPostedStudentTotals(id); els.studentProfilePanel.classList.remove('empty'); els.studentProfilePanel.innerHTML = `<div class="profile-grid"><div><strong>${escapeHtml(s.name)}</strong><p class="muted small">${escapeHtml(s.admissionNo)} • ${escapeHtml(s.programme)} • Year ${escapeHtml(s.year)}</p></div><div class="profile-badges"><span class="badge info">${escapeHtml(s.status)}</span><span class="badge ${t.balance>0?'warn':'success'}">Balance ${currency(t.balance)}</span></div></div><div class="mini-metrics"><div><span>Posted Invoices</span><strong>${currency(t.invoiced)}</strong></div><div><span>Receipts</span><strong>${currency(t.receipts)}</strong></div><div><span>Refunds</span><strong>${currency(t.refunds)}</strong></div></div><div class="note-box"><strong>Contacts</strong><br>${escapeHtml(s.phone||'-')} • ${escapeHtml(s.email||'-')}<br>${escapeHtml(s.guardian||'-')}</div><div class="note-box"><strong>Notes</strong><br>${escapeHtml(s.notes||'No notes')}</div>`; switchSection('clearance'); };

function saveBank(e) {
  e.preventDefault();
  if (!requirePermission('banks_manage', 'You cannot maintain banks.')) return;
  const payload = { id: els.bankId.value || uid('BNK'), name: els.bankName.value.trim(), accountNo: els.bankAccount.value.trim(), branch: els.bankBranch.value.trim(), type: els.bankType.value, status: els.bankStatus.value, openingBalance: Number(els.bankOpeningBalance.value||0), notes: els.bankNotes.value.trim(), createdAt: new Date().toISOString() };
  const index = state.banks.findIndex(b => b.id === payload.id);
  if (index >= 0) { state.banks[index] = { ...state.banks[index], ...payload }; logActivity('Bank updated', `${payload.name} was updated.`); }
  else { state.banks.unshift(payload); logActivity('Bank created', `${payload.name} was added to bank setup.`); }
  persist('Bank saved.');
  resetBankForm();
  renderAll();
}
function resetBankForm(){ els.bankForm.reset(); els.bankId.value=''; els.bankOpeningBalance.value='0'; }
function renderBanks() {
  const q = els.bankSearch.value.trim().toLowerCase();
  const rows = state.banks.filter(b => !q || [b.name,b.accountNo,b.branch].join(' ').toLowerCase().includes(q))
    .map(b => `<tr><td>${escapeHtml(b.name)}</td><td>${escapeHtml(b.accountNo)}</td><td>${escapeHtml(b.branch)}</td><td><span class="badge ${b.status==='Active'?'success':'neutral'}">${escapeHtml(b.status)}</span></td><td>${currency(bankRunningBalance(b.id))}</td><td><div class="actions-row"><button class="table-btn" onclick="editBank('${b.id}')">Edit</button><button class="table-btn" onclick="previewBank('${b.id}')">View</button></div></td></tr>`).join('');
  els.banksTableBody.innerHTML = rows || `<tr><td colspan="6" class="empty-row">No banks found.</td></tr>`;
}
window.editBank = function(id){ const b = bankById(id); if(!b) return; els.bankId.value=b.id; els.bankName.value=b.name; els.bankAccount.value=b.accountNo; els.bankBranch.value=b.branch; els.bankType.value=b.type; els.bankStatus.value=b.status; els.bankOpeningBalance.value=b.openingBalance; els.bankNotes.value=b.notes; switchSection('banks'); };
window.previewBank = function(id){ const b = bankById(id); if(!b) return; openModal(`${b.name} Bank Profile`, `<div class="doc-shell"><h2>${escapeHtml(b.name)}</h2><p><strong>Account:</strong> ${escapeHtml(b.accountNo)}<br><strong>Branch:</strong> ${escapeHtml(b.branch)}<br><strong>Status:</strong> ${escapeHtml(b.status)}<br><strong>Balance:</strong> ${currency(bankRunningBalance(id))}</p><p>${escapeHtml(b.notes||'')}</p></div>`); };

function saveInvoice(e) {
  e.preventDefault();
  if (!requirePermission('invoices_create', 'You cannot create invoices.')) return;
  if (!els.invoiceStudent.value) return showToast('Select a student first.');
  const payload = { id: uid('INV'), number: els.invoiceNumber.value, studentId: els.invoiceStudent.value, description: els.invoiceDescription.value.trim(), term: els.invoiceTerm.value.trim(), amount: Number(els.invoiceAmount.value||0), dueDate: els.invoiceDueDate.value, notes: els.invoiceNotes.value.trim(), status: 'Draft', createdAt: new Date().toISOString(), postedAt: null, reversedAt: null, reversalReason: '' };
  state.invoices.unshift(payload);
  logActivity('Invoice drafted', `${payload.number} saved as draft.`);
  persist('Draft invoice saved.');
  els.invoiceForm.reset();
  setDefaultDates();
  generateDocumentNumbers();
  renderAll();
}
function fillInvoiceOptions(studentId) {
  const posted = state.invoices.filter(i => i.studentId === studentId && i.status === 'Posted' && invoiceBalance(i.id) > 0);
  els.paymentInvoice.innerHTML = ['<option value="">Select invoice</option>'].concat(posted.map(i => `<option value="${i.id}">${escapeHtml(i.number)} - ${currency(invoiceBalance(i.id))} balance</option>`)).join('');
}
function suggestPaymentAmount() {
  const invoiceId = els.paymentInvoice.value;
  if (!invoiceId) return;
  els.paymentAmount.value = String(invoiceBalance(invoiceId).toFixed(2));
}
function renderInvoices() {
  const q = els.invoiceSearch.value.trim().toLowerCase();
  const rows = state.invoices.filter(i => !q || [i.number, studentById(i.studentId)?.name, i.description, i.status].join(' ').toLowerCase().includes(q))
    .map(i => {
      const paid = invoicePaidAmount(i.id); const bal = i.status === 'Posted' ? Number(i.amount)-paid : 0; const s = studentById(i.studentId);
      const actions = [];
      actions.push(`<button class="table-btn" onclick="previewInvoice('${i.id}')">View</button>`);
      if (i.status === 'Draft') actions.push(`<button class="table-btn primary-lite" onclick="postInvoice('${i.id}')">Post</button>`);
      if (i.status === 'Posted' && paid === 0) actions.push(`<button class="table-btn danger-lite" onclick="reverseInvoice('${i.id}')">Reverse</button>`);
      return `<tr><td>${escapeHtml(i.number)}</td><td>${escapeHtml(s?.name||'')}</td><td>${currency(i.amount)}</td><td>${currency(paid)}</td><td>${currency(bal)}</td><td><span class="badge ${statusTone(i.status)}">${escapeHtml(i.status)}</span></td><td><div class="actions-row">${actions.join('')}</div></td></tr>`;
    }).join('');
  els.invoicesTableBody.innerHTML = rows || `<tr><td colspan="7" class="empty-row">No invoices found.</td></tr>`;
}
window.postInvoice = function(id){ if(!requirePermission('invoices_post', 'You cannot post invoices.')) return; const inv = invoiceById(id); if(!inv || inv.status!=='Draft') return; inv.status='Posted'; inv.postedAt=new Date().toISOString(); inv.postedBy=currentUsername(); addAudit('Invoice posted', `${inv.number} posted. Journal: Dr Student Debtor ${currency(inv.amount)} | Cr Fee Revenue ${currency(inv.amount)}.`); logActivity('Invoice posted', `${inv.number} is now official and affects student balance.`); persist('Invoice posted.'); renderAll(); };
window.reverseInvoice = function(id){ if(!requirePermission('reverse_transactions', 'You cannot reverse invoices.')) return; const inv=invoiceById(id); if(!inv || inv.status!=='Posted') return; if(invoicePaidAmount(id)>0) return showToast('Cannot reverse invoice with posted receipts. Reverse receipts first.'); const reason = askReason('invoice reversal reason'); if(!reason) return; inv.status='Reversed'; inv.reversedAt=new Date().toISOString(); inv.reversedBy=currentUsername(); inv.reversalReason=reason; addAudit('Invoice reversed', `${inv.number} reversed. Reason: ${reason}. Journal: Dr Fee Revenue ${currency(inv.amount)} | Cr Student Debtor ${currency(inv.amount)}.`); logActivity('Invoice reversed', `${inv.number} was reversed.`); persist('Invoice reversed.'); renderAll(); };
window.previewInvoice = function(id){ const inv = invoiceById(id); const s = studentById(inv.studentId); const paid = invoicePaidAmount(id); const bal = inv.status==='Posted' ? inv.amount-paid : inv.amount; openModal(`Invoice ${inv.number}`, `<div class="doc-shell"><h1>${escapeHtml(state.settings.schoolName)}</h1><h2>Student Invoice</h2><p><strong>Invoice No:</strong> ${escapeHtml(inv.number)}<br><strong>Status:</strong> ${escapeHtml(inv.status)}<br><strong>Student:</strong> ${escapeHtml(s?.name||'')} (${escapeHtml(s?.admissionNo||'')})<br><strong>Description:</strong> ${escapeHtml(inv.description)}<br><strong>Term:</strong> ${escapeHtml(inv.term)}<br><strong>Due Date:</strong> ${escapeHtml(inv.dueDate)}<br><strong>Amount:</strong> ${currency(inv.amount)}<br><strong>Paid:</strong> ${currency(paid)}<br><strong>Balance:</strong> ${currency(bal)}</p><div class="note-box"><strong>Posting impact</strong><br>${inv.status==='Posted'?'Dr Student Debtor / Cr Fee Revenue':'No ledger impact yet. Draft invoice.'}</div><p>${escapeHtml(inv.notes||'')}</p></div>`); };

function savePayment(e) {
  e.preventDefault();
  if (!requirePermission('receipts_create', 'You cannot create receipts.')) return;
  const invoice = invoiceById(els.paymentInvoice.value);
  if (!invoice || invoice.status !== 'Posted') return showToast('Select a posted invoice.');
  if (!els.paymentBank.value) return showToast('Select a bank.');
  const amount = Number(els.paymentAmount.value||0);
  const bal = invoiceBalance(invoice.id);
  if (amount <= 0) return showToast('Receipt amount must be greater than zero.');
  if (amount > bal) return showToast('Receipt amount cannot exceed invoice balance.');
  const payload = { id: uid('RCT'), number: els.receiptNumber.value, studentId: els.paymentStudent.value, invoiceId: invoice.id, bankId: els.paymentBank.value, method: els.paymentMethod.value, amount, date: els.paymentDate.value, reference: els.paymentReference.value.trim(), narration: els.paymentNarration.value.trim(), status: 'Draft', createdAt: new Date().toISOString() };
  state.payments.unshift(payload);
  logActivity('Receipt drafted', `${payload.number} saved as draft.`);
  persist('Draft receipt saved.');
  els.paymentForm.reset(); setDefaultDates(); renderAll();
}
function renderPayments() {
  const q = els.paymentSearch.value.trim().toLowerCase();
  const rows = state.payments.filter(p => !q || [p.number, studentById(p.studentId)?.name, invoiceById(p.invoiceId)?.number, bankById(p.bankId)?.name, p.status].join(' ').toLowerCase().includes(q))
    .map(p => {
      const actions = [`<button class="table-btn" onclick="previewReceipt('${p.id}')">View</button>`];
      if (p.status === 'Draft') actions.push(`<button class="table-btn primary-lite" onclick="postReceipt('${p.id}')">Post</button>`);
      if (p.status === 'Posted') actions.push(`<button class="table-btn danger-lite" onclick="reverseReceipt('${p.id}')">Reverse</button>`);
      return `<tr><td>${escapeHtml(p.number)}</td><td>${escapeHtml(studentById(p.studentId)?.name||'')}</td><td>${escapeHtml(invoiceById(p.invoiceId)?.number||'')}</td><td>${escapeHtml(bankById(p.bankId)?.name||'')}</td><td>${currency(p.amount)}</td><td><span class="badge ${statusTone(p.status)}">${escapeHtml(p.status)}</span></td><td><div class="actions-row">${actions.join('')}</div></td></tr>`;
    }).join('');
  els.paymentsTableBody.innerHTML = rows || `<tr><td colspan="7" class="empty-row">No receipts found.</td></tr>`;
}
window.postReceipt = function(id){ if(!requirePermission('receipts_post', 'You cannot post receipts.')) return; const p = paymentById(id); if(!p || p.status!=='Draft') return; const inv = invoiceById(p.invoiceId); if(!inv || inv.status!=='Posted') return showToast('Invoice is not posted.'); if(Number(p.amount) > invoiceBalance(inv.id)) return showToast('Receipt exceeds current invoice balance.'); p.status='Posted'; p.postedAt=new Date().toISOString(); p.postedBy=currentUsername(); addAudit('Receipt posted', `${p.number} posted. Journal: Dr ${bankById(p.bankId)?.name||'Bank'} ${currency(p.amount)} | Cr Student ${currency(p.amount)}.`); logActivity('Receipt posted', `${p.number} reduced the student balance.`); persist('Receipt posted.'); renderAll(); };
window.reverseReceipt = function(id){ if(!requirePermission('reverse_transactions', 'You cannot reverse receipts.')) return; const p=paymentById(id); if(!p || p.status!=='Posted') return; const reason = askReason('receipt reversal reason'); if(!reason) return; p.status='Reversed'; p.reversedAt=new Date().toISOString(); p.reversalReason=reason; p.reversedBy=currentUsername(); addAudit('Receipt reversed', `${p.number} reversed. Reason: ${reason}. Journal: Dr Student ${currency(p.amount)} | Cr ${bankById(p.bankId)?.name||'Bank'} ${currency(p.amount)}.`); logActivity('Receipt reversed', `${p.number} reversal increased the student balance.`); persist('Receipt reversed.'); renderAll(); };
window.previewReceipt = function(id){ const p = paymentById(id); const s = studentById(p.studentId); const inv = invoiceById(p.invoiceId); const b = bankById(p.bankId); openModal(`Receipt ${p.number}`, `<div class="doc-shell"><h1>${escapeHtml(state.settings.schoolName)}</h1><h2>Official Receipt</h2><p><strong>Receipt No:</strong> ${escapeHtml(p.number)}<br><strong>Status:</strong> ${escapeHtml(p.status)}<br><strong>Student:</strong> ${escapeHtml(s?.name||'')} (${escapeHtml(s?.admissionNo||'')})<br><strong>Invoice:</strong> ${escapeHtml(inv?.number||'')}<br><strong>Bank:</strong> ${escapeHtml(b?.name||'')}<br><strong>Method:</strong> ${escapeHtml(p.method)}<br><strong>Date:</strong> ${escapeHtml(p.date)}<br><strong>Amount:</strong> ${currency(p.amount)}<br><strong>Reference:</strong> ${escapeHtml(p.reference||'-')}</p><div class="note-box"><strong>Posting impact</strong><br>${p.status==='Posted'?'Dr Bank / Cr Student':'No ledger impact yet. Draft receipt.'}</div><p>${escapeHtml(p.narration||'')}</p></div>`); };

function suggestRefundAmount() {
  const studentId = els.refundStudent.value;
  if (!studentId) return;
  const t = getPostedStudentTotals(studentId);
  els.refundAmount.value = String(Math.max(0, t.credit).toFixed(2));
}
function saveRefund(e) {
  e.preventDefault();
  if (!requirePermission('refunds_create', 'You cannot create refunds.')) return;
  const studentId = els.refundStudent.value;
  if (!studentId) return showToast('Select a student first.');
  if (!els.refundBank.value) return showToast('Select refund bank.');
  const amount = Number(els.refundAmount.value||0);
  if (amount <= 0) return showToast('Refund amount must be greater than zero.');
  const credit = getPostedStudentTotals(studentId).credit;
  if (amount > credit) return showToast('Refund cannot exceed available student credit.');
  const payload = { id: uid('RFD'), number: els.refundNumber.value, studentId, bankId: els.refundBank.value, amount, date: els.refundDate.value, reason: els.refundReason.value.trim(), notes: els.refundNotes.value.trim(), status: 'Draft', createdAt: new Date().toISOString() };
  state.refunds.unshift(payload);
  logActivity('Refund drafted', `${payload.number} saved as draft.`);
  persist('Draft refund saved.');
  els.refundForm.reset(); setDefaultDates(); renderAll();
}
function renderRefunds() {
  const q = els.refundSearch.value.trim().toLowerCase();
  const rows = state.refunds.filter(r => !q || [r.number, studentById(r.studentId)?.name, bankById(r.bankId)?.name, r.status, r.reason].join(' ').toLowerCase().includes(q))
    .map(r => {
      const actions = [`<button class="table-btn" onclick="previewRefund('${r.id}')">View</button>`];
      if (r.status === 'Draft') actions.push(`<button class="table-btn primary-lite" onclick="approveRefund('${r.id}')">Approve</button>`);
      if (r.status === 'Approved') actions.push(`<button class="table-btn primary-lite" onclick="payRefund('${r.id}')">Pay</button>`);
      if (r.status === 'Paid') actions.push(`<button class="table-btn danger-lite" onclick="reverseRefund('${r.id}')">Reverse</button>`);
      return `<tr><td>${escapeHtml(r.number)}</td><td>${escapeHtml(studentById(r.studentId)?.name||'')}</td><td>${escapeHtml(bankById(r.bankId)?.name||'')}</td><td>${currency(r.amount)}</td><td><span class="badge ${statusTone(r.status)}">${escapeHtml(r.status)}</span></td><td><div class="actions-row">${actions.join('')}</div></td></tr>`;
    }).join('');
  els.refundsTableBody.innerHTML = rows || `<tr><td colspan="6" class="empty-row">No refunds found.</td></tr>`;
}
window.approveRefund = function(id){ if(!requirePermission('refunds_approve', 'You cannot approve refunds.')) return; const r = refundById(id); if(!r || r.status!=='Draft') return; r.status='Approved'; r.approvedAt=new Date().toISOString(); r.approvedBy=currentUsername(); addAudit('Refund approved', `${r.number} approved for ${currency(r.amount)}.`); logActivity('Refund approved', `${r.number} is awaiting payment.`); persist('Refund approved.'); renderAll(); };
window.payRefund = function(id){ if(!requirePermission('refunds_pay', 'You cannot pay refunds.')) return; const r = refundById(id); if(!r || r.status!=='Approved') return; const credit = getPostedStudentTotals(r.studentId).credit; if(r.amount > credit) return showToast('Current student credit is lower than refund amount.'); if(r.amount > bankRunningBalance(r.bankId)) return showToast('Selected bank does not have enough balance.'); r.status='Paid'; r.paidAt=new Date().toISOString(); r.paidBy=currentUsername(); addAudit('Refund paid', `${r.number} paid. Journal: Dr Student / Refund Control ${currency(r.amount)} | Cr ${bankById(r.bankId)?.name||'Bank'} ${currency(r.amount)}.`); logActivity('Refund paid', `${r.number} was paid out from bank.`); persist('Refund paid.'); renderAll(); };
window.reverseRefund = function(id){ if(!requirePermission('reverse_transactions', 'You cannot reverse refunds.')) return; const r = refundById(id); if(!r || r.status!=='Paid') return; const reason = askReason('refund reversal reason'); if(!reason) return; r.status='Reversed'; r.reversedAt=new Date().toISOString(); r.reversalReason=reason; r.reversedBy=currentUsername(); addAudit('Refund reversed', `${r.number} reversed. Reason: ${reason}. Journal: Dr ${bankById(r.bankId)?.name||'Bank'} ${currency(r.amount)} | Cr Student / Refund Control ${currency(r.amount)}.`); logActivity('Refund reversed', `${r.number} was reversed.`); persist('Refund reversed.'); renderAll(); };
window.previewRefund = function(id){ const r = refundById(id); const s = studentById(r.studentId); const b = bankById(r.bankId); openModal(`Refund ${r.number}`, `<div class="doc-shell"><h1>${escapeHtml(state.settings.schoolName)}</h1><h2>Refund Voucher</h2><p><strong>Refund No:</strong> ${escapeHtml(r.number)}<br><strong>Status:</strong> ${escapeHtml(r.status)}<br><strong>Student:</strong> ${escapeHtml(s?.name||'')} (${escapeHtml(s?.admissionNo||'')})<br><strong>Bank:</strong> ${escapeHtml(b?.name||'')}<br><strong>Date:</strong> ${escapeHtml(r.date)}<br><strong>Amount:</strong> ${currency(r.amount)}<br><strong>Reason:</strong> ${escapeHtml(r.reason)}</p><div class="note-box"><strong>Workflow</strong><br>Draft → Approved → Paid → Reversed if necessary.</div><p>${escapeHtml(r.notes||'')}</p></div>`); };

function renderLedger(updateSection=true) {
  const studentId = els.ledgerStudent.value;
  const asAt = els.ledgerDate.value || new Date().toISOString().slice(0,10);
  if (!studentId) {
    els.ledgerSummary.textContent = 'Choose a student to view the ledger.';
    els.ledgerTableBody.innerHTML = `<tr><td colspan="7" class="empty-row">No ledger generated yet.</td></tr>`;
    return;
  }
  const s = studentById(studentId);
  const entries = [];
  state.invoices.filter(i => i.studentId===studentId && ['Posted','Reversed'].includes(i.status) && dateOnly(i.postedAt||i.createdAt) <= asAt).forEach(i => {
    if (i.status === 'Posted') entries.push({ date: dateOnly(i.postedAt||i.createdAt), ref: i.number, type:'Invoice Post', debit:Number(i.amount), credit:0, details:`${i.description} | Dr Student Debtor / Cr Fee Revenue` });
    if (i.status === 'Reversed') entries.push({ date: dateOnly(i.reversedAt||i.createdAt), ref: i.number, type:'Invoice Reverse', debit:0, credit:Number(i.amount), details:`Reversal: ${i.reversalReason||'-'}` });
  });
  state.payments.filter(p => p.studentId===studentId && ['Posted','Reversed'].includes(p.status) && dateOnly((p.status==='Reversed'?p.reversedAt:p.postedAt)||p.createdAt) <= asAt).forEach(p => {
    if (p.status === 'Posted') entries.push({ date: dateOnly(p.postedAt||p.createdAt), ref: p.number, type:'Receipt Post', debit:0, credit:Number(p.amount), details:`${bankById(p.bankId)?.name||'Bank'} | Dr Bank / Cr Student` });
    if (p.status === 'Reversed') entries.push({ date: dateOnly(p.reversedAt||p.createdAt), ref: p.number, type:'Receipt Reverse', debit:Number(p.amount), credit:0, details:`Reversal: ${p.reversalReason||'-'}` });
  });
  state.refunds.filter(r => r.studentId===studentId && ['Paid','Reversed'].includes(r.status) && dateOnly((r.status==='Reversed'?r.reversedAt:r.paidAt)||r.createdAt) <= asAt).forEach(r => {
    if (r.status === 'Paid') entries.push({ date: dateOnly(r.paidAt||r.createdAt), ref: r.number, type:'Refund Paid', debit:Number(r.amount), credit:0, details:`${bankById(r.bankId)?.name||'Bank'} | Dr Student / Refund Control` });
    if (r.status === 'Reversed') entries.push({ date: dateOnly(r.reversedAt||r.createdAt), ref: r.number, type:'Refund Reverse', debit:0, credit:Number(r.amount), details:`Reversal: ${r.reversalReason||'-'}` });
  });
  entries.sort((a,b)=> a.date.localeCompare(b.date) || a.ref.localeCompare(b.ref));
  let running = 0;
  const rows = entries.map(e => { running += e.debit - e.credit; return `<tr><td>${escapeHtml(e.date)}</td><td>${escapeHtml(e.ref)}</td><td>${escapeHtml(e.type)}</td><td>${currency(e.debit)}</td><td>${currency(e.credit)}</td><td>${currency(running)}</td><td>${escapeHtml(e.details)}</td></tr>`; }).join('');
  els.ledgerSummary.innerHTML = `<strong>${escapeHtml(s.name)}</strong> • ${escapeHtml(s.admissionNo)}<br>Ledger as at ${escapeHtml(asAt)} • Current balance ${currency(running)}`;
  els.ledgerTableBody.innerHTML = rows || `<tr><td colspan="7" class="empty-row">No posted ledger entries.</td></tr>`;
  if (updateSection) switchSection('ledger');
}

function renderClearance() {
  let cleared = 0;
  const rows = state.students.map(s => {
    const t = getPostedStudentTotals(s.id);
    const status = t.balance <= 0 ? 'Cleared' : 'Pending';
    if (status === 'Cleared') cleared += 1;
    return `<tr><td>${escapeHtml(s.name)}</td><td>${currency(t.invoiced)}</td><td>${currency(t.receipts)}</td><td>${currency(t.refunds)}</td><td>${currency(t.balance)}</td><td><span class="badge ${status==='Cleared'?'success':'warn'}">${status}</span></td><td><div class="actions-row"><button class="table-btn" onclick="viewStudentProfile('${s.id}')">Profile</button>${status==='Cleared'?`<button class="table-btn primary-lite" onclick="printClearance('${s.id}')">Letter</button>`:''}</div></td></tr>`;
  }).join('');
  els.clearanceSummary.innerHTML = `Students cleared: <strong>${cleared}</strong> of <strong>${state.students.length}</strong>. A student clears only when posted balance is zero or less.`;
  els.clearanceTableBody.innerHTML = rows || `<tr><td colspan="7" class="empty-row">No students found.</td></tr>`;
}
window.printClearance = function(id){ const s = studentById(id); const t = getPostedStudentTotals(id); openModal('Clearance Letter', `<div class="doc-shell"><h1>${escapeHtml(state.settings.schoolName)}</h1><h2>Clearance Letter</h2><p>This is to certify that <strong>${escapeHtml(s.name)}</strong> (${escapeHtml(s.admissionNo)}) has no outstanding posted balance as at ${escapeHtml(new Date().toISOString().slice(0,10))}.</p><p><strong>Posted Invoices:</strong> ${currency(t.invoiced)}<br><strong>Receipts:</strong> ${currency(t.receipts)}<br><strong>Refunds:</strong> ${currency(t.refunds)}<br><strong>Balance:</strong> ${currency(t.balance)}</p><p>${escapeHtml(state.settings.footerNote)}</p></div>`); };

function renderReports() {
  const today = new Date().toISOString().slice(0,10);
  const postedInvoices = state.invoices.filter(i => i.status === 'Posted');
  const postedReceipts = state.payments.filter(p => p.status === 'Posted');
  const cleared = state.students.filter(s => getPostedStudentTotals(s.id).balance <= 0).length;
  const outstanding = state.students.reduce((sum,s)=>sum+Math.max(0,getPostedStudentTotals(s.id).balance),0);
  const todayCollections = postedReceipts.filter(p => p.date === today).reduce((a,b)=>a+Number(b.amount),0);
  els.dailyCollections.textContent = currency(todayCollections);
  els.reportTotalInvoices.textContent = String(postedInvoices.length);
  els.reportOutstanding.textContent = currency(outstanding);
  els.reportCleared.textContent = String(cleared);
  const highlights = [];
  const topBank = [...state.banks].sort((a,b)=>bankRunningBalance(b.id)-bankRunningBalance(a.id))[0];
  if (topBank) highlights.push(`<div class="list-item"><strong>Highest bank balance</strong><span>${escapeHtml(topBank.name)} • ${currency(bankRunningBalance(topBank.id))}</span></div>`);
  const topStudent = [...state.students].sort((a,b)=>getPostedStudentTotals(b.id).balance-getPostedStudentTotals(a.id).balance)[0];
  if (topStudent) highlights.push(`<div class="list-item"><strong>Largest balance</strong><span>${escapeHtml(topStudent.name)} • ${currency(getPostedStudentTotals(topStudent.id).balance)}</span></div>`);
  const refundsPaid = state.refunds.filter(r=>r.status==='Paid').reduce((a,b)=>a+Number(b.amount),0);
  highlights.push(`<div class="list-item"><strong>Refunds paid</strong><span>${currency(refundsPaid)}</span></div>`);
  highlights.push(`<div class="list-item"><strong>Posted receipts</strong><span>${postedReceipts.length} transactions</span></div>`);
  els.reportHighlights.innerHTML = highlights.join('') || 'No report highlights yet.';
}

function generateStatementPreview() {
  const studentId = els.statementStudent.value;
  if (!studentId) return showToast('Choose a student first.');
  const s = studentById(studentId);
  els.ledgerStudent.value = studentId;
  els.ledgerDate.value = els.statementDate.value;
  const entries = getStatementEntries(studentId, els.statementDate.value);
  const totals = getPostedStudentTotals(studentId);
  const rows = entries.map(e => `<tr><td>${escapeHtml(e.date)}</td><td>${escapeHtml(e.ref)}</td><td>${escapeHtml(e.type)}</td><td>${currency(e.debit)}</td><td>${currency(e.credit)}</td></tr>`).join('');
  els.statementPreview.classList.remove('empty');
  els.statementPreview.innerHTML = `<div class="doc-shell compact"><h2>Statement of Account</h2><p><strong>Student:</strong> ${escapeHtml(s.name)} (${escapeHtml(s.admissionNo)})<br><strong>Programme:</strong> ${escapeHtml(s.programme)}<br><strong>As at:</strong> ${escapeHtml(els.statementDate.value)}</p><table class="doc-table"><thead><tr><th>Date</th><th>Reference</th><th>Type</th><th>Debit</th><th>Credit</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No entries</td></tr>'}</tbody></table><p><strong>Current Balance:</strong> ${currency(totals.balance)}</p></div>`;
}

function getStatementEntries(studentId, asAt) {
  const out = [];
  state.invoices.filter(i => i.studentId===studentId && i.status==='Posted' && dateOnly(i.postedAt)<=asAt).forEach(i => out.push({date: dateOnly(i.postedAt), ref:i.number, type:'Invoice', debit:Number(i.amount), credit:0}));
  state.payments.filter(p => p.studentId===studentId && p.status==='Posted' && dateOnly(p.postedAt)<=asAt).forEach(p => out.push({date: dateOnly(p.postedAt), ref:p.number, type:'Receipt', debit:0, credit:Number(p.amount)}));
  state.refunds.filter(r => r.studentId===studentId && r.status==='Paid' && dateOnly(r.paidAt)<=asAt).forEach(r => out.push({date: dateOnly(r.paidAt), ref:r.number, type:'Refund', debit:Number(r.amount), credit:0}));
  return out.sort((a,b)=>a.date.localeCompare(b.date));
}

function renderDashboard() {
  const studentCount = state.students.length;
  const postedInvoices = state.invoices.filter(i=>i.status==='Posted').reduce((a,b)=>a+Number(b.amount),0);
  const postedReceipts = state.payments.filter(p=>p.status==='Posted').reduce((a,b)=>a+Number(b.amount),0);
  const paidRefunds = state.refunds.filter(r=>r.status==='Paid').reduce((a,b)=>a+Number(b.amount),0);
  const outstanding = state.students.reduce((sum,s)=>sum+Math.max(0,getPostedStudentTotals(s.id).balance),0);
  const bankBalance = state.banks.reduce((sum,b)=>sum+bankRunningBalance(b.id),0);
  els.statStudents.textContent = String(studentCount);
  els.statInvoiced.textContent = currency(postedInvoices);
  els.statCollected.textContent = currency(postedReceipts);
  els.statOutstanding.textContent = currency(outstanding);
  els.statBankBalance.textContent = currency(bankBalance);
  els.statRefunds.textContent = currency(paidRefunds);
  renderOutstandingList();
  renderChart();
}

function renderOutstandingList() {
  const top = [...state.students].map(s => ({ s, bal: getPostedStudentTotals(s.id).balance })).filter(x => x.bal > 0).sort((a,b)=>b.bal-a.bal).slice(0,6);
  els.outstandingList.innerHTML = top.length ? top.map(({s,bal}) => `<div class="list-item"><strong>${escapeHtml(s.name)}</strong><span>${currency(bal)}</span></div>`).join('') : 'No balances yet.';
}
function renderActivity() {
  const items = state.activities.slice(0,8);
  els.activityList.innerHTML = items.length ? items.map(a => `<div class="list-item"><strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(new Date(a.date).toLocaleString())} • ${escapeHtml(a.details)}</span></div>`).join('') : 'No activity yet.';
}
function renderAuditTrail() {
  const items = state.activities.filter(a => a.type === 'audit').slice(0,15);
  els.auditTrailList.innerHTML = items.length ? items.map(a => `<div class="list-item"><strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(new Date(a.date).toLocaleString())} • ${escapeHtml(a.details)}</span></div>`).join('') : 'No audit actions yet.';
}

function renderChart() {
  const ctx = els.chart.getContext('2d');
  const w = els.chart.width; const h = els.chart.height;
  ctx.clearRect(0,0,w,h);
  const months = getRecentMonths(6);
  const data = months.map(m => state.payments.filter(p => p.status==='Posted' && (p.postedAt||'').slice(0,7) === m).reduce((a,b)=>a+Number(b.amount),0));
  const max = Math.max(...data, 1);
  const peakIndex = data.indexOf(Math.max(...data));
  els.collectionPeakLabel.textContent = data.some(v => v>0) ? `${months[peakIndex]} peak ${currency(data[peakIndex])}` : 'No data';
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,w,h);
  const pad = 45; const base = h-40;
  ctx.strokeStyle = '#d5def3'; ctx.lineWidth = 1;
  for(let i=0;i<5;i++){ const y = 30 + i*((base-30)/4); ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(w-20,y); ctx.stroke(); }
  ctx.strokeStyle = '#2254f4'; ctx.lineWidth = 3; ctx.beginPath();
  data.forEach((v,i)=>{ const x = pad + i*((w-pad-35)/(data.length-1||1)); const y = base - (v/max)*(base-50); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke();
  ctx.fillStyle = '#2254f4'; data.forEach((v,i)=>{ const x = pad + i*((w-pad-35)/(data.length-1||1)); const y = base - (v/max)*(base-50); ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); ctx.fillText(months[i].slice(5), x-8, h-14); });
}

function saveSettings(e) {
  e.preventDefault();
  if (!requirePermission('settings_manage', 'You cannot change settings.')) return;
  state.settings = { schoolName: els.schoolName.value.trim(), currentTerm: els.currentTerm.value.trim(), schoolPhone: els.schoolPhone.value.trim(), schoolEmail: els.schoolEmail.value.trim(), currency: els.currency.value.trim() || 'KES', schoolAddress: els.schoolAddress.value.trim(), footerNote: els.footerNote.value.trim() };
  syncBranding();
  logActivity('Settings saved', 'Institution settings were updated.');
  persist('Settings updated.');
  renderAll();
}

function logActivity(title, details, type='activity') { state.activities.unshift({ id: uid('ACT'), title, details, type, date: new Date().toISOString() }); state.activities = state.activities.slice(0,200); }
function addAudit(title, details) { logActivity(title, details, 'audit'); }
function currentUsername(){ return state.auth.currentUser?.username || 'system'; }
function statusTone(status){ return ({Draft:'neutral', Posted:'success', Reversed:'danger', Approved:'info', Paid:'success', Active:'success', Inactive:'neutral'})[status] || 'neutral'; }
function dateOnly(v){ return (v||'').slice(0,10); }
function getRecentMonths(count){ const arr=[]; const d=new Date(); d.setDate(1); for(let i=count-1;i>=0;i--){ const x=new Date(d.getFullYear(), d.getMonth()-i, 1); arr.push(x.toISOString().slice(0,7)); } return arr; }

function exportCSV(type) {
  if (!requirePermission('reports_export', 'You cannot export reports.')) return;
  const map = {
    students: state.students.map(s => ({admissionNo:s.admissionNo,name:s.name,programme:s.programme,year:s.year,status:s.status,balance:getPostedStudentTotals(s.id).balance})),
    invoices: state.invoices.map(i => ({number:i.number,student:studentById(i.studentId)?.name,amount:i.amount,status:i.status,paid:invoicePaidAmount(i.id),balance:Math.max(0,invoiceBalance(i.id))})),
    payments: state.payments.map(p => ({number:p.number,student:studentById(p.studentId)?.name,invoice:invoiceById(p.invoiceId)?.number,bank:bankById(p.bankId)?.name,amount:p.amount,status:p.status,date:p.date})),
    refunds: state.refunds.map(r => ({number:r.number,student:studentById(r.studentId)?.name,bank:bankById(r.bankId)?.name,amount:r.amount,status:r.status,date:r.date,reason:r.reason}))
  };
  const rows = map[type] || [];
  if (!rows.length) return showToast(`No ${type} data to export.`);
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')].concat(rows.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))).join('\n');
  downloadBlob(csv, `${type}.csv`, 'text/csv;charset=utf-8;');
}
function exportBackup(){ if (!requirePermission('backup_manage', 'You cannot export backup.')) return; downloadBlob(JSON.stringify(state,null,2), 'edubill_pro_finance_backup.json', 'application/json'); }
function importBackup(e){ if (!requirePermission('backup_manage', 'You cannot import backup.')) return; const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ try { const parsed=JSON.parse(reader.result); localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...structuredClone(defaultState), ...parsed })); location.reload(); } catch { showToast('Invalid backup file.'); } }; reader.readAsText(file); }
function resetSystem(){ if (!requirePermission('system_reset', 'You cannot reset the system.')) return; if(!confirm('Reset all demo data?')) return; localStorage.removeItem(STORAGE_KEY); location.reload(); }
function downloadBlob(content, filename, type){ const blob = new Blob([content], {type}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

function openModal(title, html){ els.modalTitle.textContent = title; els.modalBody.innerHTML = html; els.modal.classList.remove('hidden'); }
function closeModal(){ els.modal.classList.add('hidden'); }
function showToast(message){ els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(showToast.t); showToast.t = setTimeout(()=>els.toast.classList.remove('show'), 2400); }


const PRIVILEGE_LABELS = {
  dashboard_access:'Dashboard access', students_access:'Students section', students_manage:'Create and edit students',
  banks_access:'Banks section', banks_manage:'Create and edit banks',
  invoices_access:'Invoices section', invoices_create:'Create draft invoices', invoices_post:'Post invoices',
  payments_access:'Receipts section', receipts_create:'Create draft receipts', receipts_post:'Post receipts',
  refunds_access:'Refunds section', refunds_create:'Create refunds', refunds_approve:'Approve refunds', refunds_pay:'Pay refunds',
  ledger_access:'Ledger section', clearance_access:'Clearance section', reports_access:'Reports section', reports_export:'Export reports',
  users_access:'Users & access section', users_manage:'Create users and roles', settings_access:'Settings section', settings_manage:'Change settings',
  reverse_transactions:'Reverse posted transactions', backup_manage:'Backup import/export', system_reset:'Reset system'
};

const ROLE_PRESETS = {
  'Administrator':['*'],
  'CEO':['dashboard_access','reports_access','ledger_access','clearance_access','refunds_access','refunds_approve','settings_access'],
  'Finance Officer':['dashboard_access','students_access','students_manage','banks_access','banks_manage','invoices_access','invoices_create','invoices_post','payments_access','receipts_create','receipts_post','refunds_access','refunds_create','ledger_access','clearance_access','reports_access','reports_export'],
  'Bursar':['dashboard_access','students_access','banks_access','invoices_access','invoices_post','payments_access','receipts_post','refunds_access','refunds_approve','refunds_pay','ledger_access','clearance_access','reports_access','reports_export','reverse_transactions'],
  'Cashier':['dashboard_access','payments_access','receipts_create','ledger_access','reports_access'],
  'Approver':['dashboard_access','refunds_access','refunds_approve','ledger_access','reports_access','reverse_transactions'],
  'Custom':[]
};

function normalizeUsers(users) {
  return (users.length ? users : structuredClone(defaultState.auth.users)).map((u, idx) => {
    const role = u.role || 'Custom';
    const privileges = Array.isArray(u.privileges) && u.privileges.length ? u.privileges : ((role === 'Administrator') ? ['*'] : [...(ROLE_PRESETS[role] || [])]);
    return { id: u.id || uid('USR'), fullName: u.fullName || u.name || (idx===0 ? 'System Administrator' : u.username), username: u.username, password: u.password || '123456', role, active: u.active !== false, approvalLimit: Number(u.approvalLimit || 0), privileges };
  });
}
function makeSessionUser(user) { return { id:user.id, username:user.username, fullName:user.fullName, role:user.role, active:user.active !== false, approvalLimit:Number(user.approvalLimit||0), privileges:[...(user.privileges||[])] }; }
function currentUserRecord(){ return state.auth.users.find(u => u.username === state.auth.currentUser?.username) || null; }
function getUserPrivileges(user){ if(!user) return []; if(user.role === 'Administrator' || (user.privileges||[]).includes('*')) return ['*']; return user.privileges || []; }
function hasPermission(key){ const user = state.auth.currentUser; if(!user) return false; const privs = getUserPrivileges(user); return privs.includes('*') || privs.includes(key); }
function requirePermission(key, msg='Access denied.') { if (hasPermission(key)) return true; showToast(msg); return false; }
function canAccessSection(sectionId){ const map = { dashboard:'dashboard_access', students:'students_access', banks:'banks_access', invoices:'invoices_access', payments:'payments_access', refunds:'refunds_access', ledger:'ledger_access', clearance:'clearance_access', reports:'reports_access', users:'users_access', settings:'settings_access' }; return !map[sectionId] || hasPermission(map[sectionId]); }
function applyAccessControl(){
  const currentSection = [...els.sections].find(s => s.classList.contains('active'))?.id || 'dashboard';
  els.navLinks.forEach(link => {
    const allowed = canAccessSection(link.dataset.section);
    link.classList.toggle('hidden-by-access', !allowed);
  });
  els.sections.forEach(section => section.classList.toggle('hidden-by-access', !canAccessSection(section.id)));
  const backupAllowed = hasPermission('backup_manage');
  if (els.backupBtn) els.backupBtn.classList.toggle('hidden-by-access', !backupAllowed);
  if (els.resetBtn) els.resetBtn.classList.toggle('hidden-by-access', !hasPermission('system_reset'));
  if (els.loadSampleBtn) els.loadSampleBtn.classList.toggle('hidden-by-access', !hasPermission('backup_manage'));
  if (!canAccessSection(currentSection)) {
    const fallback = ['dashboard','students','banks','invoices','payments','refunds','ledger','clearance','reports','users','settings'].find(canAccessSection) || 'dashboard';
    els.navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === fallback));
    els.sections.forEach(section => section.classList.toggle('active', section.id === fallback));
    els.pageTitle.textContent = fallback.charAt(0).toUpperCase() + fallback.slice(1).replace('&',' & ');
  }
}
function renderPrivilegeMatrix(selected) {
  if (!els.userPrivilegesGrid) return;
  const chosen = new Set(selected || []);
  els.userPrivilegesGrid.innerHTML = Object.entries(PRIVILEGE_LABELS).map(([key, label]) => `<label class="privilege-item"><input type="checkbox" value="${key}" ${chosen.has(key) ? 'checked' : ''} /><div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(key)}</span></div></label>`).join('');
}
function selectedPrivileges(){ return [...els.userPrivilegesGrid.querySelectorAll('input:checked')].map(input => input.value); }
function handleRolePresetChange(){
  const role = els.userRole.value;
  if (role === 'Administrator') { renderPrivilegeMatrix(['*']); els.userPrivilegesGrid.innerHTML = `<div class="permission-note">Administrator has full system rights.</div>`; return; }
  renderPrivilegeMatrix(ROLE_PRESETS[role] || []);
}
function resetUserForm(){ if(!els.userForm) return; els.userForm.reset(); els.userId.value=''; els.userStatus.value='Active'; els.approvalLimit.value=''; handleRolePresetChange(); }
function saveUser(e){
  e.preventDefault();
  if (!requirePermission('users_manage', 'Only administrator can manage users.')) return;
  const username = els.userUsername.value.trim();
  if (!username) return showToast('Username is required.');
  const existing = state.auth.users.find(u => u.username === username && u.id !== els.userId.value);
  if (existing) return showToast('That username already exists.');
  const role = els.userRole.value;
  const privileges = role === 'Administrator' ? ['*'] : selectedPrivileges();
  if (role !== 'Administrator' && !privileges.length) return showToast('Select at least one privilege.');
  const payload = { id: els.userId.value || uid('USR'), fullName: els.userFullName.value.trim(), username, password: els.userPassword.value, role, active: els.userStatus.value === 'Active', approvalLimit: Number(els.approvalLimit.value || 0), privileges };
  const idx = state.auth.users.findIndex(u => u.id === payload.id);
  if (idx >= 0) state.auth.users[idx] = { ...state.auth.users[idx], ...payload };
  else state.auth.users.unshift(payload);
  addAudit(idx >= 0 ? 'User updated' : 'User created', `${payload.username} saved with role ${payload.role}.`);
  persist('User saved.');
  resetUserForm();
  renderAll();
}
function renderUsers(){
  if (!els.usersTableBody) return;
  const q = (els.userSearch?.value || '').trim().toLowerCase();
  const users = state.auth.users.filter(u => !q || [u.fullName,u.username,u.role,u.active?'Active':'Inactive'].join(' ').toLowerCase().includes(q));
  els.usersTableBody.innerHTML = users.map(u => `<tr><td><strong>${escapeHtml(u.fullName)}</strong><br><span class="muted small">${escapeHtml(u.username)}</span></td><td>${escapeHtml(u.role)}</td><td><span class="badge ${u.active !== false ? 'success' : 'neutral'}">${u.active !== false ? 'Active' : 'Inactive'}</span></td><td>${(getUserPrivileges(u).includes('*') ? '<span class="badge info">All privileges</span>' : getUserPrivileges(u).slice(0,3).map(p => `<span class="badge neutral">${escapeHtml((PRIVILEGE_LABELS[p]||p).replace(' section',''))}</span>`).join(' ') + (getUserPrivileges(u).length > 3 ? ` <span class="badge info">+${getUserPrivileges(u).length-3}</span>` : ''))}</td><td><div class="actions-row"><button class="table-btn" onclick="editUser('${u.id}')">Edit</button>${u.username !== 'admin' ? `<button class="table-btn danger-lite" onclick="toggleUserStatus('${u.id}')">${u.active !== false ? 'Disable' : 'Activate'}</button>` : ''}</div></td></tr>`).join('') || `<tr><td colspan="5" class="empty-row">No users found.</td></tr>`;
  const pendingRefunds = state.refunds.filter(r => r.status === 'Draft').length;
  const approvedRefunds = state.refunds.filter(r => r.status === 'Approved').length;
  const draftInvoices = state.invoices.filter(i => i.status === 'Draft').length;
  const draftReceipts = state.payments.filter(p => p.status === 'Draft').length;
  els.workflowSummary.innerHTML = `<div class="workflow-card"><span>Pending refund approvals</span><strong>${pendingRefunds}</strong></div><div class="workflow-card"><span>Approved refunds awaiting payment</span><strong>${approvedRefunds}</strong></div><div class="workflow-card"><span>Draft invoices</span><strong>${draftInvoices}</strong></div><div class="workflow-card"><span>Draft receipts</span><strong>${draftReceipts}</strong></div><div class="permission-note">Recommended workflow: <strong>Finance Officer</strong> drafts/posts finance entries, <strong>CEO / Approver</strong> approves refunds, and <strong>Administrator</strong> manages users, privileges and system control.</div>`;
}
window.editUser = function(id){ if(!requirePermission('users_manage', 'Only administrator can manage users.')) return; const u = state.auth.users.find(x => x.id === id); if(!u) return; els.userId.value=u.id; els.userFullName.value=u.fullName; els.userUsername.value=u.username; els.userPassword.value=u.password; els.userRole.value=u.role; els.userStatus.value=u.active !== false ? 'Active' : 'Inactive'; els.approvalLimit.value = u.approvalLimit || ''; if (u.role === 'Administrator') { els.userPrivilegesGrid.innerHTML = `<div class="permission-note">Administrator has full system rights.</div>`; } else renderPrivilegeMatrix(getUserPrivileges(u)); switchSection('users'); };
window.toggleUserStatus = function(id){ if(!requirePermission('users_manage', 'Only administrator can manage users.')) return; const u = state.auth.users.find(x => x.id === id); if(!u) return; u.active = !(u.active !== false); addAudit('User status changed', `${u.username} is now ${u.active ? 'Active' : 'Inactive'}.`); if (state.auth.currentUser?.username === u.username && !u.active) state.auth.currentUser = null; persist('User status updated.'); syncAuthUI(); renderAll(); };

function seedSampleData() {
  if (state.students.length || state.invoices.length || state.banks.length) { if (!confirm('Sample data will be added to current data. Continue?')) return; }
  const s1 = { id: uid('STD'), admissionNo:'EDU/2026/001', name:'Achieng Odhiambo', programme:'BSc ICT', year:'2', phone:'0712345678', email:'achieng@example.com', status:'Active', guardian:'Odhiambo', notes:'Government sponsored', createdAt:new Date().toISOString() };
  const s2 = { id: uid('STD'), admissionNo:'EDU/2026/002', name:'Brian Otieno', programme:'BCom Finance', year:'3', phone:'0723456789', email:'brian@example.com', status:'Active', guardian:'Atieno', notes:'Evening programme', createdAt:new Date().toISOString() };
  const b1 = { id: uid('BNK'), name:'KCB Main Collection', accountNo:'1100223344', branch:'Bondo', type:'Collection', status:'Active', openingBalance:150000, notes:'Main tuition collection account', createdAt:new Date().toISOString() };
  const b2 = { id: uid('BNK'), name:'Equity Fees Account', accountNo:'5566778899', branch:'Siaya', type:'Collection', status:'Active', openingBalance:90000, notes:'Alternative collection account', createdAt:new Date().toISOString() };
  if (!state.auth.users.some(u => u.username === 'ceo')) state.auth.users.push({ id:uid('USR'), fullName:'Chief Executive Officer', username:'ceo', password:'ceo123', role:'CEO', active:true, approvalLimit:1000000, privileges:[...(ROLE_PRESETS['CEO']||[])] });
  if (!state.auth.users.some(u => u.username === 'finance')) state.auth.users.push({ id:uid('USR'), fullName:'Finance Officer', username:'finance', password:'finance123', role:'Finance Officer', active:true, approvalLimit:0, privileges:[...(ROLE_PRESETS['Finance Officer']||[])] });
  state.students.unshift(s1,s2); state.banks.unshift(b1,b2);
  const i1 = { id: uid('INV'), number: nextNumber('INV', state.invoices.length+1), studentId:s1.id, description:'Semester Fees', term:'Term 1', amount:30000, dueDate:new Date(Date.now()+10*86400000).toISOString().slice(0,10), notes:'Posted sample invoice', status:'Posted', createdAt:new Date().toISOString(), postedAt:new Date().toISOString() };
  const i2 = { id: uid('INV'), number: nextNumber('INV', state.invoices.length+2), studentId:s2.id, description:'Semester Fees', term:'Term 1', amount:28000, dueDate:new Date(Date.now()+10*86400000).toISOString().slice(0,10), notes:'Posted sample invoice', status:'Posted', createdAt:new Date().toISOString(), postedAt:new Date().toISOString() };
  state.invoices.unshift(i1,i2);
  const p1 = { id: uid('RCT'), number: nextNumber('RCT', state.payments.length+1), studentId:s1.id, invoiceId:i1.id, bankId:b1.id, method:'Bank', amount:20000, date:new Date().toISOString().slice(0,10), reference:'SLIP001', narration:'Initial payment', status:'Posted', createdAt:new Date().toISOString(), postedAt:new Date().toISOString() };
  const p2 = { id: uid('RCT'), number: nextNumber('RCT', state.payments.length+2), studentId:s2.id, invoiceId:i2.id, bankId:b2.id, method:'Bank', amount:30000, date:new Date().toISOString().slice(0,10), reference:'SLIP002', narration:'Overpayment sample', status:'Posted', createdAt:new Date().toISOString(), postedAt:new Date().toISOString() };
  state.payments.unshift(p1,p2);
  const r1 = { id: uid('RFD'), number: nextNumber('RFD', state.refunds.length+1), studentId:s2.id, bankId:b2.id, amount:2000, date:new Date().toISOString().slice(0,10), reason:'Approved overpayment refund', notes:'Sample refund', status:'Paid', createdAt:new Date().toISOString(), approvedAt:new Date().toISOString(), paidAt:new Date().toISOString() };
  state.refunds.unshift(r1);
  addAudit('Sample data loaded', 'Banks, invoices, receipts and refund workflow added.');
  logActivity('Sample data loaded', 'Demo data populated successfully.');
  persist('Sample data loaded.');
  renderAll();
}
