const STORAGE_KEY = 'edubill_pro_v2';

const defaultState = {
  settings: {
    schoolName: 'EduBill Pro Academy',
    currentTerm: '2026 Academic Year',
    schoolPhone: '+254 700 000 000',
    schoolEmail: 'accounts@edubillpro.test',
    currency: 'KES',
    schoolAddress: 'P.O. Box 100, Nairobi',
    footerNote: 'This is a browser-based demo. Customize before production deployment.'
  },
  auth: {
    users: [{ username: 'admin', password: 'admin123', role: 'Administrator' }],
    currentUser: null
  },
  students: [],
  invoices: [],
  payments: [],
  activities: [],
  lastSavedAt: null
};

const state = loadState();

const els = {
  authScreen: document.getElementById('authScreen'),
  appShell: document.getElementById('appShell'),
  loginForm: document.getElementById('loginForm'),
  loginUsername: document.getElementById('loginUsername'),
  loginPassword: document.getElementById('loginPassword'),
  navLinks: document.querySelectorAll('.nav-link'),
  sections: document.querySelectorAll('.section'),
  pageTitle: document.getElementById('pageTitle'),
  pageSubtitle: document.getElementById('pageSubtitle'),
  signedInUser: document.getElementById('signedInUser'),
  brandSchoolName: document.getElementById('brandSchoolName'),
  brandTerm: document.getElementById('brandTerm'),
  lastSavedLabel: document.getElementById('lastSavedLabel'),

  statStudents: document.getElementById('statStudents'),
  statInvoiced: document.getElementById('statInvoiced'),
  statCollected: document.getElementById('statCollected'),
  statOutstanding: document.getElementById('statOutstanding'),
  collectionPeakLabel: document.getElementById('collectionPeakLabel'),
  outstandingList: document.getElementById('outstandingList'),
  activityList: document.getElementById('activityList'),
  chart: document.getElementById('collectionsChart'),

  studentForm: document.getElementById('studentForm'),
  studentId: document.getElementById('studentId'),
  admissionNo: document.getElementById('admissionNo'),
  studentName: document.getElementById('studentName'),
  programme: document.getElementById('programme'),
  yearOfStudy: document.getElementById('yearOfStudy'),
  phone: document.getElementById('phone'),
  studentEmail: document.getElementById('studentEmail'),
  studentStatus: document.getElementById('studentStatus'),
  guardianName: document.getElementById('guardianName'),
  studentNotes: document.getElementById('studentNotes'),
  clearStudentBtn: document.getElementById('clearStudentBtn'),
  studentSearch: document.getElementById('studentSearch'),
  studentsTableBody: document.getElementById('studentsTableBody'),
  studentProfilePanel: document.getElementById('studentProfilePanel'),

  invoiceForm: document.getElementById('invoiceForm'),
  invoiceStudent: document.getElementById('invoiceStudent'),
  invoiceNumber: document.getElementById('invoiceNumber'),
  invoiceDescription: document.getElementById('invoiceDescription'),
  invoiceTerm: document.getElementById('invoiceTerm'),
  invoiceAmount: document.getElementById('invoiceAmount'),
  invoiceDueDate: document.getElementById('invoiceDueDate'),
  invoiceNotes: document.getElementById('invoiceNotes'),
  invoiceSearch: document.getElementById('invoiceSearch'),
  invoicesTableBody: document.getElementById('invoicesTableBody'),

  paymentForm: document.getElementById('paymentForm'),
  paymentStudent: document.getElementById('paymentStudent'),
  paymentInvoice: document.getElementById('paymentInvoice'),
  receiptNumber: document.getElementById('receiptNumber'),
  paymentMethod: document.getElementById('paymentMethod'),
  paymentAmount: document.getElementById('paymentAmount'),
  paymentDate: document.getElementById('paymentDate'),
  paymentReference: document.getElementById('paymentReference'),
  paymentSearch: document.getElementById('paymentSearch'),
  paymentsTableBody: document.getElementById('paymentsTableBody'),

  clearanceSummary: document.getElementById('clearanceSummary'),
  clearanceTableBody: document.getElementById('clearanceTableBody'),

  dailyCollections: document.getElementById('dailyCollections'),
  reportTotalInvoices: document.getElementById('reportTotalInvoices'),
  reportOutstanding: document.getElementById('reportOutstanding'),
  reportCleared: document.getElementById('reportCleared'),
  reportHighlights: document.getElementById('reportHighlights'),
  exportStudentsBtn: document.getElementById('exportStudentsBtn'),
  exportPaymentsBtn: document.getElementById('exportPaymentsBtn'),
  exportInvoicesBtn: document.getElementById('exportInvoicesBtn'),
  statementStudent: document.getElementById('statementStudent'),
  statementDate: document.getElementById('statementDate'),
  generateStatementBtn: document.getElementById('generateStatementBtn'),
  statementPreview: document.getElementById('statementPreview'),

  settingsForm: document.getElementById('settingsForm'),
  schoolName: document.getElementById('schoolName'),
  currentTerm: document.getElementById('currentTerm'),
  schoolPhone: document.getElementById('schoolPhone'),
  schoolEmail: document.getElementById('schoolEmail'),
  currency: document.getElementById('currency'),
  schoolAddress: document.getElementById('schoolAddress'),
  footerNote: document.getElementById('footerNote'),

  loadSampleBtn: document.getElementById('loadSampleBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  backupBtn: document.getElementById('backupBtn'),
  importBackupInput: document.getElementById('importBackupInput'),
  resetBtn: document.getElementById('resetBtn'),
  quickActions: document.querySelectorAll('.quick-action'),

  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  printModalBtn: document.getElementById('printModalBtn'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  toast: document.getElementById('toast')
};

init();

function init() {
  bindEvents();
  syncAuthUI();
  syncBranding();
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

  els.invoiceForm.addEventListener('submit', saveInvoice);
  els.invoiceSearch.addEventListener('input', renderInvoices);

  els.paymentForm.addEventListener('submit', savePayment);
  els.paymentStudent.addEventListener('change', () => {
    fillInvoiceOptions(els.paymentStudent.value);
    suggestPaymentAmount();
  });
  els.paymentInvoice.addEventListener('change', suggestPaymentAmount);
  els.paymentSearch.addEventListener('input', renderPayments);

  els.exportStudentsBtn.addEventListener('click', () => exportCSV('students'));
  els.exportPaymentsBtn.addEventListener('click', () => exportCSV('payments'));
  els.exportInvoicesBtn.addEventListener('click', () => exportCSV('invoices'));
  els.generateStatementBtn.addEventListener('click', generateStatementPreview);

  els.settingsForm.addEventListener('submit', saveSettings);
  els.loadSampleBtn.addEventListener('click', seedSampleData);
  els.backupBtn.addEventListener('click', exportBackup);
  els.importBackupInput.addEventListener('change', importBackup);
  els.resetBtn.addEventListener('click', resetSystem);

  els.closeModalBtn.addEventListener('click', closeModal);
  els.printModalBtn.addEventListener('click', () => window.print());
  els.modal.addEventListener('click', e => {
    if (e.target === els.modal) closeModal();
  });
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
      students: parsed.students || [],
      invoices: parsed.invoices || [],
      payments: parsed.payments || [],
      activities: parsed.activities || []
    };
  } catch {
    return structuredClone(defaultState);
  }
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
  els.signedInUser.textContent = user ? `${user.username} • ${user.role}` : 'Administrator';
}

function handleLogin(event) {
  event.preventDefault();
  const username = els.loginUsername.value.trim();
  const password = els.loginPassword.value;
  const user = state.auth.users.find(entry => entry.username === username && entry.password === password);

  if (!user) {
    showToast('Invalid login details. Use admin / admin123.');
    return;
  }

  state.auth.currentUser = { username: user.username, role: user.role };
  addActivity('User login', `${user.username} signed into the system.`);
  persist('Welcome back.');
  syncAuthUI();
  renderAll();
}

function handleLogout() {
  if (!state.auth.currentUser) return;
  addActivity('User logout', `${state.auth.currentUser.username} signed out.`);
  state.auth.currentUser = null;
  persist('Logged out successfully.');
  syncAuthUI();
}

function switchSection(id) {
  const subtitles = {
    dashboard: 'A polished web-based billing demo ready for use and customization.',
    students: 'Capture, update and inspect student records.',
    invoices: 'Create and manage invoices with printable output.',
    payments: 'Record fees paid and reprint official receipts.',
    clearance: 'Check balances and generate clearance letters.',
    reports: 'Generate summaries, exports and student statements.',
    settings: 'Customize institution branding and defaults.'
  };

  els.sections.forEach(section => section.classList.toggle('active', section.id === id));
  els.navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === id));
  els.pageTitle.textContent = titleCase(id);
  els.pageSubtitle.textContent = subtitles[id] || 'Manage data';
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function setDefaultDates() {
  els.invoiceDueDate.value = todayISO();
  els.paymentDate.value = todayISO();
  els.statementDate.value = todayISO();
  els.invoiceNumber.value = nextNumber('INV');
  els.receiptNumber.value = nextNumber('RCPT');
}

function syncBranding() {
  els.brandSchoolName.textContent = state.settings.schoolName;
  els.brandTerm.textContent = state.settings.currentTerm;
  els.schoolName.value = state.settings.schoolName;
  els.currentTerm.value = state.settings.currentTerm;
  els.schoolPhone.value = state.settings.schoolPhone;
  els.schoolEmail.value = state.settings.schoolEmail;
  els.currency.value = state.settings.currency;
  els.schoolAddress.value = state.settings.schoolAddress;
  els.footerNote.value = state.settings.footerNote;
}

function syncSaveStatus() {
  els.lastSavedLabel.textContent = state.lastSavedAt ? `Saved ${new Date(state.lastSavedAt).toLocaleString()}` : 'Not saved yet';
}

function renderAll() {
  syncBranding();
  syncSaveStatus();
  fillStudentOptions();
  fillInvoiceOptions(els.paymentStudent.value);
  renderDashboard();
  renderStudents();
  renderInvoices();
  renderPayments();
  renderClearance();
  renderReports();
}

function saveStudent(event) {
  event.preventDefault();
  const payload = {
    id: els.studentId.value || uid('STD'),
    admissionNo: els.admissionNo.value.trim(),
    name: els.studentName.value.trim(),
    programme: els.programme.value.trim(),
    yearOfStudy: els.yearOfStudy.value,
    phone: els.phone.value.trim(),
    email: els.studentEmail.value.trim(),
    status: els.studentStatus.value,
    guardianName: els.guardianName.value.trim(),
    notes: els.studentNotes.value.trim(),
    createdAt: els.studentId.value ? getStudentById(els.studentId.value)?.createdAt || new Date().toISOString() : new Date().toISOString()
  };

  if (!payload.admissionNo || !payload.name || !payload.programme || !payload.yearOfStudy) {
    showToast('Complete required student fields.');
    return;
  }

  const duplicate = state.students.find(student => student.admissionNo.toLowerCase() === payload.admissionNo.toLowerCase() && student.id !== payload.id);
  if (duplicate) {
    showToast('Admission number already exists.');
    return;
  }

  const existingIndex = state.students.findIndex(student => student.id === payload.id);
  if (existingIndex >= 0) {
    state.students[existingIndex] = payload;
    addActivity('Student updated', `${payload.name} (${payload.admissionNo}) record updated.`);
    persist('Student record updated.');
  } else {
    state.students.push(payload);
    addActivity('Student added', `${payload.name} (${payload.admissionNo}) registered.`);
    persist('Student saved.');
  }

  resetStudentForm();
  renderAll();
  showStudentProfile(payload.id);
}

function resetStudentForm() {
  els.studentForm.reset();
  els.studentId.value = '';
}

function editStudent(studentId) {
  const student = getStudentById(studentId);
  if (!student) return;
  els.studentId.value = student.id;
  els.admissionNo.value = student.admissionNo;
  els.studentName.value = student.name;
  els.programme.value = student.programme;
  els.yearOfStudy.value = student.yearOfStudy;
  els.phone.value = student.phone || '';
  els.studentEmail.value = student.email || '';
  els.studentStatus.value = student.status || 'Active';
  els.guardianName.value = student.guardianName || '';
  els.studentNotes.value = student.notes || '';
  switchSection('students');
  showToast(`Editing ${student.name}.`);
}
window.editStudent = editStudent;

function showStudentProfile(studentId) {
  const student = getStudentById(studentId);
  if (!student) {
    els.studentProfilePanel.innerHTML = 'Select a student to view billing profile.';
    return;
  }
  const invoiced = getStudentTotalInvoiced(studentId);
  const paid = getStudentTotalPaid(studentId);
  const balance = invoiced - paid;
  const invoices = getStudentInvoices(studentId);
  const payments = getPaymentsForStudent(studentId);
  const statusBadge = balance <= 0 && invoiced > 0 ? '<span class="badge success">Cleared</span>' : balance > 0 ? '<span class="badge warning">Pending Balance</span>' : '<span class="badge danger">No Invoice</span>';

  const recentLines = invoices.slice().reverse().slice(0, 3).map(inv => `<div class="list-item"><div><strong>${inv.invoiceNumber}</strong><small>${inv.description}</small></div><div>${fmtMoney(inv.amount)}</div></div>`).join('') || '<div class="muted">No invoices for this student yet.</div>';

  els.studentProfilePanel.innerHTML = `
    <div>
      <div class="inline-between wrap-gap">
        <div>
          <h3>${student.name}</h3>
          <p class="muted">${student.admissionNo} • ${student.programme} • Year ${student.yearOfStudy}</p>
        </div>
        ${statusBadge}
      </div>
      <div class="profile-kpis">
        <div class="mini-metric"><span>Total Invoiced</span><strong>${fmtMoney(invoiced)}</strong></div>
        <div class="mini-metric"><span>Total Paid</span><strong>${fmtMoney(paid)}</strong></div>
        <div class="mini-metric"><span>Balance</span><strong>${fmtMoney(balance)}</strong></div>
      </div>
      <div class="m-top">
        <p><strong>Contacts:</strong> ${student.phone || '-'} ${student.email ? `• ${student.email}` : ''}</p>
        <p><strong>Guardian:</strong> ${student.guardianName || '-'}</p>
        <p><strong>Status:</strong> ${student.status}</p>
        <p><strong>Notes:</strong> ${student.notes || '-'}</p>
      </div>
      <div class="m-top">
        <h4>Recent Invoices</h4>
        <div class="list-stack compact">${recentLines}</div>
      </div>
      <div class="m-top">
        <button class="btn secondary" onclick="previewStatement('${student.id}')">Preview Statement</button>
        ${balance <= 0 && invoiced > 0 ? `<button class="btn ghost" onclick="previewClearance('${student.id}')">Preview Clearance</button>` : ''}
      </div>
      <div class="m-top muted">Payments recorded: ${payments.length}</div>
    </div>
  `;
}
window.showStudentProfile = showStudentProfile;

function saveInvoice(event) {
  event.preventDefault();
  const studentId = els.invoiceStudent.value;
  const amount = Number(els.invoiceAmount.value || 0);
  if (!studentId || amount <= 0) {
    showToast('Select a student and enter a valid amount.');
    return;
  }

  const invoice = {
    id: uid('INV'),
    studentId,
    invoiceNumber: els.invoiceNumber.value,
    description: els.invoiceDescription.value.trim(),
    term: els.invoiceTerm.value.trim(),
    amount,
    dueDate: els.invoiceDueDate.value,
    notes: els.invoiceNotes.value.trim(),
    createdAt: new Date().toISOString()
  };

  state.invoices.push(invoice);
  addActivity('Invoice created', `${invoice.invoiceNumber} issued for ${getStudentById(studentId)?.name || 'student'}.`);
  persist('Invoice created.');
  els.invoiceForm.reset();
  els.invoiceNumber.value = nextNumber('INV');
  els.invoiceDueDate.value = todayISO();
  renderAll();
  showStudentProfile(studentId);
}

function savePayment(event) {
  event.preventDefault();
  const studentId = els.paymentStudent.value;
  const invoiceId = els.paymentInvoice.value;
  const amount = Number(els.paymentAmount.value || 0);
  const invoice = getInvoiceById(invoiceId);
  if (!studentId || !invoiceId || !invoice || amount <= 0) {
    showToast('Select valid payment details.');
    return;
  }

  const balance = getInvoiceBalance(invoiceId);
  if (amount > balance) {
    showToast(`Amount exceeds invoice balance of ${fmtMoney(balance)}.`);
    return;
  }

  const payment = {
    id: uid('PAY'),
    studentId,
    invoiceId,
    receiptNumber: els.receiptNumber.value,
    method: els.paymentMethod.value,
    amount,
    date: els.paymentDate.value,
    reference: els.paymentReference.value.trim(),
    createdAt: new Date().toISOString()
  };

  state.payments.push(payment);
  addActivity('Payment recorded', `${payment.receiptNumber} for ${getStudentById(studentId)?.name || 'student'} captured.`);
  persist('Payment saved.');
  els.paymentForm.reset();
  els.receiptNumber.value = nextNumber('RCPT');
  els.paymentDate.value = todayISO();
  fillInvoiceOptions('');
  renderAll();
  previewReceipt(payment.id);
}

function fillStudentOptions() {
  const options = ['<option value="">Select student</option>']
    .concat(state.students.map(student => `<option value="${student.id}">${escapeHtml(student.admissionNo)} - ${escapeHtml(student.name)}</option>`))
    .join('');
  els.invoiceStudent.innerHTML = options;
  els.paymentStudent.innerHTML = options;
  els.statementStudent.innerHTML = options;
}

function fillInvoiceOptions(studentId = '') {
  const invoices = studentId
    ? getStudentInvoices(studentId).filter(invoice => getInvoiceBalance(invoice.id) > 0)
    : [];
  const options = ['<option value="">Select invoice</option>']
    .concat(invoices.map(invoice => `<option value="${invoice.id}">${escapeHtml(invoice.invoiceNumber)} • ${escapeHtml(invoice.description)} • ${fmtMoney(getInvoiceBalance(invoice.id))}</option>`))
    .join('');
  els.paymentInvoice.innerHTML = options;
}

function suggestPaymentAmount() {
  const invoiceId = els.paymentInvoice.value;
  els.paymentAmount.value = invoiceId ? getInvoiceBalance(invoiceId).toFixed(2) : '';
}

function renderStudents() {
  const query = els.studentSearch.value.trim().toLowerCase();
  const rows = state.students
    .filter(student => !query || `${student.admissionNo} ${student.name} ${student.programme}`.toLowerCase().includes(query))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(student => `
      <tr>
        <td>${escapeHtml(student.admissionNo)}</td>
        <td><button class="link-btn" onclick="showStudentProfile('${student.id}')">${escapeHtml(student.name)}</button></td>
        <td>${escapeHtml(student.programme)}</td>
        <td>${escapeHtml(student.yearOfStudy)}</td>
        <td>${fmtMoney(getStudentBalance(student.id))}</td>
        <td><button class="link-btn" onclick="editStudent('${student.id}')">Edit</button></td>
      </tr>
    `)
    .join('');

  els.studentsTableBody.innerHTML = rows || '<tr><td colspan="6" class="muted">No student records found.</td></tr>';
}

function renderInvoices() {
  const query = els.invoiceSearch.value.trim().toLowerCase();
  const rows = state.invoices
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(invoice => {
      const student = getStudentById(invoice.studentId);
      return !query || `${invoice.invoiceNumber} ${invoice.description} ${student?.name || ''}`.toLowerCase().includes(query);
    })
    .map(invoice => {
      const student = getStudentById(invoice.studentId);
      const balance = getInvoiceBalance(invoice.id);
      const paid = getInvoicePaid(invoice.id);
      const status = balance <= 0 ? '<span class="badge success">Paid</span>' : paid > 0 ? '<span class="badge warning">Part Paid</span>' : '<span class="badge danger">Unpaid</span>';
      return `
        <tr>
          <td>${escapeHtml(invoice.invoiceNumber)}</td>
          <td><button class="link-btn" onclick="showStudentProfile('${invoice.studentId}')">${escapeHtml(student?.name || 'Unknown')}</button></td>
          <td>${fmtMoney(invoice.amount)}</td>
          <td>${fmtMoney(paid)}</td>
          <td>${fmtMoney(balance)}</td>
          <td>${status}</td>
          <td><button class="link-btn" onclick="previewInvoice('${invoice.id}')">Print</button></td>
        </tr>
      `;
    })
    .join('');

  els.invoicesTableBody.innerHTML = rows || '<tr><td colspan="7" class="muted">No invoices yet.</td></tr>';
}

function renderPayments() {
  const query = els.paymentSearch.value.trim().toLowerCase();
  const rows = state.payments
    .slice()
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
    .filter(payment => {
      const student = getStudentById(payment.studentId);
      const invoice = getInvoiceById(payment.invoiceId);
      return !query || `${payment.receiptNumber} ${student?.name || ''} ${invoice?.invoiceNumber || ''} ${payment.method}`.toLowerCase().includes(query);
    })
    .map(payment => {
      const student = getStudentById(payment.studentId);
      const invoice = getInvoiceById(payment.invoiceId);
      return `
        <tr>
          <td>${escapeHtml(payment.receiptNumber)}</td>
          <td><button class="link-btn" onclick="showStudentProfile('${payment.studentId}')">${escapeHtml(student?.name || 'Unknown')}</button></td>
          <td>${escapeHtml(invoice?.invoiceNumber || 'Unknown')}</td>
          <td>${escapeHtml(payment.method)}</td>
          <td>${fmtMoney(payment.amount)}</td>
          <td>${escapeHtml(payment.date)}</td>
          <td><button class="link-btn" onclick="previewReceipt('${payment.id}')">Print</button></td>
        </tr>
      `;
    })
    .join('');

  els.paymentsTableBody.innerHTML = rows || '<tr><td colspan="7" class="muted">No payments recorded.</td></tr>';
}

function renderDashboard() {
  const totalInvoiced = state.invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const totalCollected = state.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const outstanding = totalInvoiced - totalCollected;

  els.statStudents.textContent = state.students.length;
  els.statInvoiced.textContent = fmtMoney(totalInvoiced);
  els.statCollected.textContent = fmtMoney(totalCollected);
  els.statOutstanding.textContent = fmtMoney(outstanding);

  const outstandingStudents = state.students
    .map(student => ({ student, balance: getStudentBalance(student.id) }))
    .filter(entry => entry.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5)
    .map(entry => `
      <div class="list-item">
        <div>
          <strong>${escapeHtml(entry.student.name)}</strong>
          <small>${escapeHtml(entry.student.admissionNo)} • ${escapeHtml(entry.student.programme)}</small>
        </div>
        <div><strong>${fmtMoney(entry.balance)}</strong></div>
      </div>
    `)
    .join('');
  els.outstandingList.innerHTML = outstandingStudents || '<div class="muted">No balances yet.</div>';

  const activities = state.activities.slice(0, 6).map(activity => `
    <div class="list-item">
      <div>
        <strong>${escapeHtml(activity.title)}</strong>
        <small>${escapeHtml(activity.description)}</small>
      </div>
      <div><small>${new Date(activity.time).toLocaleString()}</small></div>
    </div>
  `).join('');
  els.activityList.innerHTML = activities || '<div class="muted">No activity yet.</div>';

  drawCollectionsChart();
}

function renderClearance() {
  const clearedCount = state.students.filter(student => {
    const invoiced = getStudentTotalInvoiced(student.id);
    return invoiced > 0 && getStudentBalance(student.id) <= 0;
  }).length;

  els.clearanceSummary.innerHTML = `
    <strong>${clearedCount}</strong> cleared students out of <strong>${state.students.length}</strong> records.
    Students are considered cleared when their balance is zero or less after invoicing.
  `;

  const rows = state.students
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(student => {
      const invoiced = getStudentTotalInvoiced(student.id);
      const paid = getStudentTotalPaid(student.id);
      const balance = invoiced - paid;
      const status = balance <= 0 && invoiced > 0 ? '<span class="badge success">Cleared</span>' : balance > 0 ? '<span class="badge warning">Pending</span>' : '<span class="badge danger">No Invoice</span>';
      const action = balance <= 0 && invoiced > 0
        ? `<button class="link-btn" onclick="previewClearance('${student.id}')">Print</button>`
        : `<button class="link-btn" onclick="showStudentProfile('${student.id}')">View</button>`;
      return `
        <tr>
          <td><button class="link-btn" onclick="showStudentProfile('${student.id}')">${escapeHtml(student.name)}</button></td>
          <td>${fmtMoney(invoiced)}</td>
          <td>${fmtMoney(paid)}</td>
          <td>${fmtMoney(balance)}</td>
          <td>${status}</td>
          <td>${action}</td>
        </tr>
      `;
    })
    .join('');

  els.clearanceTableBody.innerHTML = rows || '<tr><td colspan="6" class="muted">No students available.</td></tr>';
}

function renderReports() {
  const totalOutstanding = state.invoices.reduce((sum, invoice) => sum + getInvoiceBalance(invoice.id), 0);
  const dailyTotal = state.payments
    .filter(payment => payment.date === todayISO())
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const cleared = state.students.filter(student => getStudentTotalInvoiced(student.id) > 0 && getStudentBalance(student.id) <= 0).length;

  els.dailyCollections.textContent = fmtMoney(dailyTotal);
  els.reportTotalInvoices.textContent = state.invoices.length;
  els.reportOutstanding.textContent = fmtMoney(totalOutstanding);
  els.reportCleared.textContent = cleared;

  const highestPayment = state.payments.slice().sort((a, b) => b.amount - a.amount)[0];
  const mostRecentInvoice = state.invoices.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const highlights = [];

  if (highestPayment) {
    highlights.push(`<div class="list-item"><div><strong>Highest payment</strong><small>${escapeHtml(getStudentById(highestPayment.studentId)?.name || '')}</small></div><div><strong>${fmtMoney(highestPayment.amount)}</strong></div></div>`);
  }
  if (mostRecentInvoice) {
    highlights.push(`<div class="list-item"><div><strong>Latest invoice</strong><small>${escapeHtml(mostRecentInvoice.invoiceNumber)} • ${escapeHtml(getStudentById(mostRecentInvoice.studentId)?.name || '')}</small></div><div>${fmtMoney(mostRecentInvoice.amount)}</div></div>`);
  }
  highlights.push(`<div class="list-item"><div><strong>Average invoice value</strong><small>Based on all invoices</small></div><div>${fmtMoney(state.invoices.length ? state.invoices.reduce((sum, invoice) => sum + invoice.amount, 0) / state.invoices.length : 0)}</div></div>`);
  els.reportHighlights.innerHTML = highlights.join('');
}

function generateStatementPreview() {
  const studentId = els.statementStudent.value;
  if (!studentId) {
    showToast('Choose a student first.');
    return;
  }
  const html = buildStatementHTML(studentId, els.statementDate.value || todayISO());
  els.statementPreview.innerHTML = html;
}

function previewStatement(studentId) {
  openModal('Student Statement', buildStatementHTML(studentId, todayISO()));
}
window.previewStatement = previewStatement;

function previewInvoice(invoiceId) {
  const invoice = getInvoiceById(invoiceId);
  if (!invoice) return;
  const student = getStudentById(invoice.studentId);
  const paid = getInvoicePaid(invoice.id);
  const balance = getInvoiceBalance(invoice.id);
  const html = `
    <div class="document">
      <div class="document-header">
        <div>
          <h2>${escapeHtml(state.settings.schoolName)}</h2>
          <p>${escapeHtml(state.settings.schoolAddress)}</p>
          <p>${escapeHtml(state.settings.schoolPhone)} • ${escapeHtml(state.settings.schoolEmail)}</p>
        </div>
        <div class="document-meta">
          <strong>INVOICE</strong>
          <span>${escapeHtml(invoice.invoiceNumber)}</span>
          <span>Term: ${escapeHtml(invoice.term)}</span>
          <span>Due Date: ${escapeHtml(invoice.dueDate)}</span>
        </div>
      </div>
      <p><strong>Student:</strong> ${escapeHtml(student?.name || '')}</p>
      <p><strong>Admission No:</strong> ${escapeHtml(student?.admissionNo || '')}</p>
      <p><strong>Programme:</strong> ${escapeHtml(student?.programme || '')}</p>
      <table>
        <thead>
          <tr><th>Description</th><th>Amount</th><th>Paid</th><th>Balance</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>${escapeHtml(invoice.description)}</td>
            <td>${fmtMoney(invoice.amount)}</td>
            <td>${fmtMoney(paid)}</td>
            <td>${fmtMoney(balance)}</td>
          </tr>
        </tbody>
      </table>
      <div class="m-top"><strong>Notes:</strong> ${escapeHtml(invoice.notes || 'None')}</div>
      <div class="document-footer">${escapeHtml(state.settings.footerNote)}</div>
    </div>
  `;
  openModal(`Invoice ${invoice.invoiceNumber}`, html);
}
window.previewInvoice = previewInvoice;

function previewReceipt(paymentId) {
  const payment = getPaymentById(paymentId);
  if (!payment) return;
  const student = getStudentById(payment.studentId);
  const invoice = getInvoiceById(payment.invoiceId);
  const html = `
    <div class="document">
      <div class="document-header">
        <div>
          <h2>${escapeHtml(state.settings.schoolName)}</h2>
          <p>${escapeHtml(state.settings.schoolAddress)}</p>
          <p>${escapeHtml(state.settings.schoolPhone)} • ${escapeHtml(state.settings.schoolEmail)}</p>
        </div>
        <div class="document-meta">
          <strong>OFFICIAL RECEIPT</strong>
          <span>${escapeHtml(payment.receiptNumber)}</span>
          <span>Date: ${escapeHtml(payment.date)}</span>
          <span>Method: ${escapeHtml(payment.method)}</span>
        </div>
      </div>
      <p><strong>Received From:</strong> ${escapeHtml(student?.name || '')}</p>
      <p><strong>Admission No:</strong> ${escapeHtml(student?.admissionNo || '')}</p>
      <p><strong>Invoice Ref:</strong> ${escapeHtml(invoice?.invoiceNumber || '')}</p>
      <table>
        <thead><tr><th>Description</th><th>Reference</th><th>Amount</th></tr></thead>
        <tbody><tr><td>${escapeHtml(invoice?.description || 'Fee payment')}</td><td>${escapeHtml(payment.reference || '-')}</td><td>${fmtMoney(payment.amount)}</td></tr></tbody>
      </table>
      <div class="document-footer">${escapeHtml(state.settings.footerNote)}</div>
    </div>
  `;
  openModal(`Receipt ${payment.receiptNumber}`, html);
}
window.previewReceipt = previewReceipt;

function previewClearance(studentId) {
  const student = getStudentById(studentId);
  if (!student) return;
  const html = `
    <div class="document">
      <div class="document-header">
        <div>
          <h2>${escapeHtml(state.settings.schoolName)}</h2>
          <p>${escapeHtml(state.settings.schoolAddress)}</p>
        </div>
        <div class="document-meta">
          <strong>CLEARANCE LETTER</strong>
          <span>Date: ${todayISO()}</span>
        </div>
      </div>
      <p>This is to certify that <strong>${escapeHtml(student.name)}</strong> (${escapeHtml(student.admissionNo)}) has cleared all billed financial obligations as at ${todayISO()}.</p>
      <p><strong>Programme:</strong> ${escapeHtml(student.programme)}</p>
      <p><strong>Total Invoiced:</strong> ${fmtMoney(getStudentTotalInvoiced(studentId))}</p>
      <p><strong>Total Paid:</strong> ${fmtMoney(getStudentTotalPaid(studentId))}</p>
      <p><strong>Outstanding Balance:</strong> ${fmtMoney(getStudentBalance(studentId))}</p>
      <div class="document-footer">${escapeHtml(state.settings.footerNote)}</div>
    </div>
  `;
  openModal(`Clearance - ${student.name}`, html);
}
window.previewClearance = previewClearance;

function buildStatementHTML(studentId, asAtDate) {
  const student = getStudentById(studentId);
  if (!student) return 'Student not found.';
  const invoices = getStudentInvoices(studentId).filter(invoice => invoice.dueDate <= asAtDate || invoice.createdAt.slice(0, 10) <= asAtDate);
  const payments = getPaymentsForStudent(studentId).filter(payment => payment.date <= asAtDate);
  const rows = [];

  invoices.forEach(invoice => {
    rows.push({ date: invoice.createdAt.slice(0, 10), ref: invoice.invoiceNumber, type: 'Invoice', description: invoice.description, debit: invoice.amount, credit: 0 });
  });
  payments.forEach(payment => {
    const invoice = getInvoiceById(payment.invoiceId);
    rows.push({ date: payment.date, ref: payment.receiptNumber, type: 'Payment', description: `Against ${invoice?.invoiceNumber || 'invoice'}`, debit: 0, credit: payment.amount });
  });
  rows.sort((a, b) => new Date(a.date) - new Date(b.date));

  let running = 0;
  const body = rows.map(row => {
    running += Number(row.debit) - Number(row.credit);
    return `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.ref)}</td><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.description)}</td><td>${fmtMoney(row.debit)}</td><td>${fmtMoney(row.credit)}</td><td>${fmtMoney(running)}</td></tr>`;
  }).join('') || '<tr><td colspan="7" class="muted">No statement entries yet.</td></tr>';

  return `
    <div class="document">
      <div class="document-header">
        <div>
          <h2>${escapeHtml(state.settings.schoolName)}</h2>
          <p>Student Account Statement</p>
        </div>
        <div class="document-meta">
          <span><strong>As At:</strong> ${escapeHtml(asAtDate)}</span>
          <span><strong>Term:</strong> ${escapeHtml(state.settings.currentTerm)}</span>
        </div>
      </div>
      <p><strong>Student:</strong> ${escapeHtml(student.name)}</p>
      <p><strong>Admission No:</strong> ${escapeHtml(student.admissionNo)}</p>
      <p><strong>Programme:</strong> ${escapeHtml(student.programme)}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Reference</th><th>Type</th><th>Description</th><th>Debit</th><th>Credit</th><th>Running Balance</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
      <div class="m-top"><strong>Total Balance:</strong> ${fmtMoney(getStudentBalance(studentId))}</div>
      <div class="document-footer">${escapeHtml(state.settings.footerNote)}</div>
    </div>
  `;
}

function saveSettings(event) {
  event.preventDefault();
  state.settings.schoolName = els.schoolName.value.trim();
  state.settings.currentTerm = els.currentTerm.value.trim();
  state.settings.schoolPhone = els.schoolPhone.value.trim();
  state.settings.schoolEmail = els.schoolEmail.value.trim();
  state.settings.currency = (els.currency.value.trim() || 'KES').toUpperCase();
  state.settings.schoolAddress = els.schoolAddress.value.trim();
  state.settings.footerNote = els.footerNote.value.trim();
  addActivity('Settings updated', 'Institution branding and billing defaults updated.');
  persist('Settings saved.');
  renderAll();
}

function seedSampleData() {
  state.students = [
    { id: uid('STD'), admissionNo: 'EDU/2026/001', name: 'Amina Yusuf', programme: 'BSc Computer Science', yearOfStudy: '2', phone: '0712345678', email: 'amina@example.com', status: 'Active', guardianName: 'Mr. Yusuf', notes: 'On campus', createdAt: new Date('2026-01-12').toISOString() },
    { id: uid('STD'), admissionNo: 'EDU/2026/002', name: 'Brian Otieno', programme: 'Diploma in Business', yearOfStudy: '1', phone: '0722000111', email: 'brian@example.com', status: 'Active', guardianName: 'Mrs. Otieno', notes: 'Day scholar', createdAt: new Date('2026-01-18').toISOString() },
    { id: uid('STD'), admissionNo: 'EDU/2026/003', name: 'Caroline Njeri', programme: 'BA Education', yearOfStudy: '3', phone: '0733555777', email: 'caroline@example.com', status: 'Active', guardianName: 'Mr. Njeri', notes: 'Returning student', createdAt: new Date('2026-01-20').toISOString() }
  ];

  state.invoices = [
    { id: uid('INV'), studentId: state.students[0].id, invoiceNumber: nextNumber('INV', 1001), description: 'Tuition Fees', term: 'Term 1', amount: 52000, dueDate: '2026-02-15', notes: 'Semester fees', createdAt: new Date('2026-02-01').toISOString() },
    { id: uid('INV'), studentId: state.students[1].id, invoiceNumber: nextNumber('INV', 1002), description: 'Tuition Fees', term: 'Term 1', amount: 40000, dueDate: '2026-02-15', notes: 'Semester fees', createdAt: new Date('2026-02-02').toISOString() },
    { id: uid('INV'), studentId: state.students[2].id, invoiceNumber: nextNumber('INV', 1003), description: 'Tuition + Exams', term: 'Term 1', amount: 61500, dueDate: '2026-02-18', notes: 'Fees and exam card', createdAt: new Date('2026-02-03').toISOString() }
  ];

  state.payments = [
    { id: uid('PAY'), studentId: state.students[0].id, invoiceId: state.invoices[0].id, receiptNumber: nextNumber('RCPT', 2001), method: 'Bank', amount: 30000, date: '2026-02-10', reference: 'BNK44551', createdAt: new Date('2026-02-10').toISOString() },
    { id: uid('PAY'), studentId: state.students[1].id, invoiceId: state.invoices[1].id, receiptNumber: nextNumber('RCPT', 2002), method: 'Mobile Money', amount: 40000, date: '2026-02-11', reference: 'MMP90012', createdAt: new Date('2026-02-11').toISOString() },
    { id: uid('PAY'), studentId: state.students[2].id, invoiceId: state.invoices[2].id, receiptNumber: nextNumber('RCPT', 2003), method: 'Cash', amount: 20000, date: '2026-02-12', reference: 'CSH102', createdAt: new Date('2026-02-12').toISOString() }
  ];

  state.activities = [];
  addActivity('Sample data loaded', 'Demo students, invoices and receipts were added.');
  persist('Sample data loaded.');
  renderAll();
  showStudentProfile(state.students[0].id);
}

function resetSystem() {
  const confirmed = window.confirm('This will clear students, invoices, payments and activity logs. Continue?');
  if (!confirmed) return;
  const currentUser = state.auth.currentUser;
  const settings = { ...state.settings };
  const users = state.auth.users;
  Object.assign(state, structuredClone(defaultState));
  state.auth.currentUser = currentUser;
  state.auth.users = users;
  state.settings = settings;
  persist('System data reset.');
  renderAll();
  showStudentProfile('');
  setDefaultDates();
}

function exportCSV(type) {
  let rows = [];
  if (type === 'students') {
    rows = [['Admission No', 'Name', 'Programme', 'Year', 'Phone', 'Email', 'Status', 'Balance']].concat(
      state.students.map(student => [student.admissionNo, student.name, student.programme, student.yearOfStudy, student.phone || '', student.email || '', student.status || '', getStudentBalance(student.id)])
    );
  }
  if (type === 'invoices') {
    rows = [['Invoice No', 'Student', 'Description', 'Term', 'Amount', 'Paid', 'Balance', 'Due Date']].concat(
      state.invoices.map(invoice => [invoice.invoiceNumber, getStudentById(invoice.studentId)?.name || '', invoice.description, invoice.term, invoice.amount, getInvoicePaid(invoice.id), getInvoiceBalance(invoice.id), invoice.dueDate])
    );
  }
  if (type === 'payments') {
    rows = [['Receipt No', 'Student', 'Invoice', 'Method', 'Amount', 'Date', 'Reference']].concat(
      state.payments.map(payment => [payment.receiptNumber, getStudentById(payment.studentId)?.name || '', getInvoiceById(payment.invoiceId)?.invoiceNumber || '', payment.method, payment.amount, payment.date, payment.reference || ''])
    );
  }

  const csv = rows.map(row => row.map(csvEscape).join(',')).join('\n');
  downloadFile(csv, `${type}_${todayISO()}.csv`, 'text/csv;charset=utf-8;');
}

function exportBackup() {
  downloadFile(JSON.stringify(state, null, 2), `edubill_backup_${todayISO()}.json`, 'application/json');
}

function importBackup(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      const merged = {
        ...structuredClone(defaultState),
        ...parsed,
        settings: { ...structuredClone(defaultState).settings, ...(parsed.settings || {}) },
        auth: { ...structuredClone(defaultState).auth, ...(parsed.auth || {}) }
      };
      Object.assign(state, merged);
      if (!state.auth.currentUser) state.auth.currentUser = { username: 'admin', role: 'Administrator' };
      addActivity('Backup imported', 'A saved system snapshot was restored.');
      persist('Backup imported.');
      renderAll();
    } catch {
      showToast('Invalid backup file.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function drawCollectionsChart() {
  const canvas = els.chart;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const series = getMonthlyCollections();
  const values = series.map(item => item.total);
  const max = Math.max(...values, 1);
  const padding = { top: 28, right: 24, bottom: 36, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.fillStyle = '#f8fbff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#dbe4f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  ctx.beginPath();

  series.forEach((item, index) => {
    const x = padding.left + (chartWidth / (series.length - 1 || 1)) * index;
    const y = padding.top + chartHeight - (item.total / max) * chartHeight;
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  series.forEach((item, index) => {
    const x = padding.left + (chartWidth / (series.length - 1 || 1)) * index;
    const y = padding.top + chartHeight - (item.total / max) * chartHeight;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x, height - 12);

    ctx.fillStyle = '#102033';
    ctx.font = '12px sans-serif';
    ctx.fillText(shortMoney(item.total), x, Math.max(y - 12, 16));
  });

  const peak = series.slice().sort((a, b) => b.total - a.total)[0];
  els.collectionPeakLabel.textContent = peak && peak.total > 0 ? `Peak: ${peak.label} ${fmtMoney(peak.total)}` : 'No collections yet';
}

function getMonthlyCollections() {
  const months = [];
  const base = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(base.getFullYear(), base.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleString(undefined, { month: 'short' });
    const total = state.payments
      .filter(payment => payment.date?.startsWith(key))
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    months.push({ key, label, total });
  }
  return months;
}

function openModal(title, html) {
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = html;
  els.modal.classList.remove('hidden');
}

function closeModal() {
  els.modal.classList.add('hidden');
}

function addActivity(title, description) {
  state.activities.unshift({ id: uid('ACT'), title, description, time: new Date().toISOString() });
  state.activities = state.activities.slice(0, 30);
}

function getStudentById(id) {
  return state.students.find(student => student.id === id);
}

function getInvoiceById(id) {
  return state.invoices.find(invoice => invoice.id === id);
}

function getPaymentById(id) {
  return state.payments.find(payment => payment.id === id);
}

function getStudentInvoices(studentId) {
  return state.invoices.filter(invoice => invoice.studentId === studentId);
}

function getPaymentsForStudent(studentId) {
  return state.payments.filter(payment => payment.studentId === studentId);
}

function getStudentTotalInvoiced(studentId) {
  return getStudentInvoices(studentId).reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
}

function getStudentTotalPaid(studentId) {
  return getPaymentsForStudent(studentId).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function getStudentBalance(studentId) {
  return getStudentTotalInvoiced(studentId) - getStudentTotalPaid(studentId);
}

function getInvoicePaid(invoiceId) {
  return state.payments.filter(payment => payment.invoiceId === invoiceId).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function getInvoiceBalance(invoiceId) {
  const invoice = getInvoiceById(invoiceId);
  if (!invoice) return 0;
  return Number(invoice.amount || 0) - getInvoicePaid(invoiceId);
}

function nextNumber(prefix, seed = null) {
  if (seed !== null) return `${prefix}-${seed}`;
  const source = prefix === 'INV' ? state.invoices : prefix === 'RCPT' ? state.payments : [];
  const numbers = source.map(item => Number(String(prefix === 'INV' ? item.invoiceNumber : item.receiptNumber).split('-').pop())).filter(num => !Number.isNaN(num));
  const next = (numbers.length ? Math.max(...numbers) : prefix === 'INV' ? 1000 : 2000) + 1;
  return `${prefix}-${next}`;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function fmtMoney(value) {
  return `${state.settings.currency || 'KES'} ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function shortMoney(value) {
  const num = Number(value || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return `${num.toFixed(0)}`;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove('show'), 2400);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function csvEscape(value) {
  const string = String(value ?? '');
  return `"${string.replace(/"/g, '""')}"`;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
