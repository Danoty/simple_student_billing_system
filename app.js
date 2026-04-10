const STORAGE_KEY = 'simpleStudentBillingSystem_v1';

const state = loadState();

const els = {
  navLinks: document.querySelectorAll('.nav-link'),
  sections: document.querySelectorAll('.section'),
  pageTitle: document.getElementById('pageTitle'),
  toast: document.getElementById('toast'),

  studentForm: document.getElementById('studentForm'),
  studentId: document.getElementById('studentId'),
  admissionNo: document.getElementById('admissionNo'),
  studentName: document.getElementById('studentName'),
  programme: document.getElementById('programme'),
  yearOfStudy: document.getElementById('yearOfStudy'),
  phone: document.getElementById('phone'),
  studentStatus: document.getElementById('studentStatus'),
  clearStudentForm: document.getElementById('clearStudentForm'),
  studentsTableBody: document.getElementById('studentsTableBody'),
  studentSearch: document.getElementById('studentSearch'),

  invoiceForm: document.getElementById('invoiceForm'),
  invoiceStudent: document.getElementById('invoiceStudent'),
  invoiceNumber: document.getElementById('invoiceNumber'),
  invoiceDescription: document.getElementById('invoiceDescription'),
  invoiceTerm: document.getElementById('invoiceTerm'),
  invoiceAmount: document.getElementById('invoiceAmount'),
  invoiceDueDate: document.getElementById('invoiceDueDate'),
  invoicesTableBody: document.getElementById('invoicesTableBody'),

  paymentForm: document.getElementById('paymentForm'),
  paymentStudent: document.getElementById('paymentStudent'),
  paymentInvoice: document.getElementById('paymentInvoice'),
  receiptNumber: document.getElementById('receiptNumber'),
  paymentMethod: document.getElementById('paymentMethod'),
  paymentAmount: document.getElementById('paymentAmount'),
  paymentDate: document.getElementById('paymentDate'),
  paymentsTableBody: document.getElementById('paymentsTableBody'),

  clearanceTableBody: document.getElementById('clearanceTableBody'),
  clearanceSummary: document.getElementById('clearanceSummary'),

  statStudents: document.getElementById('statStudents'),
  statInvoices: document.getElementById('statInvoices'),
  statPayments: document.getElementById('statPayments'),
  statOutstanding: document.getElementById('statOutstanding'),
  recentStudents: document.getElementById('recentStudents'),
  recentPayments: document.getElementById('recentPayments'),

  dailyCollections: document.getElementById('dailyCollections'),
  totalInvoiced: document.getElementById('totalInvoiced'),
  totalOutstandingReport: document.getElementById('totalOutstandingReport'),
  studentsCleared: document.getElementById('studentsCleared'),

  seedDataBtn: document.getElementById('seedDataBtn'),
  resetDataBtn: document.getElementById('resetDataBtn'),
  exportStudentsBtn: document.getElementById('exportStudentsBtn'),
  exportPaymentsBtn: document.getElementById('exportPaymentsBtn')
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { students: [], invoices: [], payments: [] };
  try {
    return JSON.parse(raw);
  } catch {
    return { students: [], invoices: [], payments: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix = 'ID') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function fmtMoney(value) {
  return `KES ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => els.toast.classList.remove('show'), 2500);
}

function sectionTitle(id) {
  return {
    dashboard: 'Dashboard',
    students: 'Students',
    invoices: 'Invoicing',
    payments: 'Receipting',
    clearance: 'Clearance',
    reports: 'Reports'
  }[id] || 'Billing System';
}

function switchSection(id) {
  els.sections.forEach(sec => sec.classList.toggle('active', sec.id === id));
  els.navLinks.forEach(btn => btn.classList.toggle('active', btn.dataset.section === id));
  els.pageTitle.textContent = sectionTitle(id);
}

function getStudentById(id) {
  return state.students.find(s => s.id === id);
}

function getInvoiceById(id) {
  return state.invoices.find(i => i.id === id);
}

function getStudentInvoices(studentId) {
  return state.invoices.filter(inv => inv.studentId === studentId);
}

function getInvoicePayments(invoiceId) {
  return state.payments.filter(p => p.invoiceId === invoiceId);
}

function getStudentTotalInvoiced(studentId) {
  return getStudentInvoices(studentId).reduce((sum, inv) => sum + Number(inv.amount), 0);
}

function getStudentTotalPaid(studentId) {
  const invoiceIds = getStudentInvoices(studentId).map(inv => inv.id);
  return state.payments
    .filter(p => invoiceIds.includes(p.invoiceId))
    .reduce((sum, p) => sum + Number(p.amount), 0);
}

function getInvoiceTotalPaid(invoiceId) {
  return getInvoicePayments(invoiceId).reduce((sum, p) => sum + Number(p.amount), 0);
}

function getStudentBalance(studentId) {
  return getStudentTotalInvoiced(studentId) - getStudentTotalPaid(studentId);
}

function fillStudentOptions() {
  const options = ['<option value="">Select student</option>']
    .concat(state.students.map(s => `<option value="${s.id}">${s.admissionNo} - ${s.name}</option>`))
    .join('');
  els.invoiceStudent.innerHTML = options;
  els.paymentStudent.innerHTML = options;
}

function fillInvoiceOptions(studentId = '') {
  const filtered = studentId ? state.invoices.filter(inv => inv.studentId === studentId && (Number(inv.amount) - getInvoiceTotalPaid(inv.id)) > 0) : [];
  const options = ['<option value="">Select invoice</option>']
    .concat(filtered.map(inv => `<option value="${inv.id}">${inv.invoiceNumber} - ${inv.description} (${fmtMoney(Number(inv.amount) - getInvoiceTotalPaid(inv.id))})</option>`))
    .join('');
  els.paymentInvoice.innerHTML = options;
}

function resetStudentForm() {
  els.studentForm.reset();
  els.studentId.value = '';
}

function renderStudents() {
  const q = els.studentSearch.value.trim().toLowerCase();
  const rows = state.students
    .filter(s => !q || [s.admissionNo, s.name, s.programme].join(' ').toLowerCase().includes(q))
    .map(s => `
      <tr>
        <td>${s.admissionNo}</td>
        <td>${s.name}</td>
        <td>${s.programme}</td>
        <td>${s.yearOfStudy}</td>
        <td>${fmtMoney(getStudentBalance(s.id))}</td>
        <td>
          <button class="link-btn" onclick="editStudent('${s.id}')">Edit</button>
        </td>
      </tr>
    `)
    .join('');

  els.studentsTableBody.innerHTML = rows || `<tr><td colspan="6" class="muted">No student records found.</td></tr>`;
}

function renderInvoices() {
  const rows = state.invoices
    .slice()
    .reverse()
    .map(inv => {
      const student = getStudentById(inv.studentId);
      const paid = getInvoiceTotalPaid(inv.id);
      const balance = Number(inv.amount) - paid;
      return `
        <tr>
          <td>${inv.invoiceNumber}</td>
          <td>${student ? student.name : 'Unknown'}</td>
          <td>${inv.description}</td>
          <td>${fmtMoney(inv.amount)}</td>
          <td>${fmtMoney(paid)}</td>
          <td>${fmtMoney(balance)}</td>
        </tr>
      `;
    })
    .join('');

  els.invoicesTableBody.innerHTML = rows || `<tr><td colspan="6" class="muted">No invoices yet.</td></tr>`;
}

function renderPayments() {
  const rows = state.payments
    .slice()
    .reverse()
    .map(payment => {
      const student = getStudentById(payment.studentId);
      const invoice = getInvoiceById(payment.invoiceId);
      return `
        <tr>
          <td>${payment.receiptNumber}</td>
          <td>${student ? student.name : 'Unknown'}</td>
          <td>${invoice ? invoice.invoiceNumber : 'Unknown'}</td>
          <td>${payment.method}</td>
          <td>${fmtMoney(payment.amount)}</td>
          <td>${payment.date}</td>
        </tr>
      `;
    })
    .join('');

  els.paymentsTableBody.innerHTML = rows || `<tr><td colspan="6" class="muted">No payments recorded.</td></tr>`;
}

function renderClearance() {
  const rows = state.students.map(student => {
    const invoiced = getStudentTotalInvoiced(student.id);
    const paid = getStudentTotalPaid(student.id);
    const balance = invoiced - paid;
    const statusClass = balance <= 0 && invoiced > 0 ? 'success' : balance > 0 ? 'warning' : 'danger';
    const statusText = balance <= 0 && invoiced > 0 ? 'Cleared' : balance > 0 ? 'Pending Balance' : 'No Invoice';

    return `
      <tr>
        <td><button class="link-btn" onclick="showClearance('${student.id}')">${student.name}</button></td>
        <td>${fmtMoney(invoiced)}</td>
        <td>${fmtMoney(paid)}</td>
        <td>${fmtMoney(balance)}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');

  els.clearanceTableBody.innerHTML = rows || `<tr><td colspan="5" class="muted">No student records available.</td></tr>`;
}

function renderDashboard() {
  const totalStudents = state.students.length;
  const totalInvoices = state.invoices.length;
  const totalPayments = state.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOutstanding = state.students.reduce((sum, s) => sum + getStudentBalance(s.id), 0);

  els.statStudents.textContent = totalStudents;
  els.statInvoices.textContent = totalInvoices;
  els.statPayments.textContent = fmtMoney(totalPayments);
  els.statOutstanding.textContent = fmtMoney(totalOutstanding);

  const recentStudents = state.students.slice(-5).reverse();
  els.recentStudents.innerHTML = recentStudents.length
    ? recentStudents.map(s => `<div class="simple-list-item"><strong>${s.name}</strong><br><span class="muted">${s.admissionNo} · ${s.programme}</span></div>`).join('')
    : 'No student records yet.';

  const recentPayments = state.payments.slice(-5).reverse();
  els.recentPayments.innerHTML = recentPayments.length
    ? recentPayments.map(p => {
        const student = getStudentById(p.studentId);
        return `<div class="simple-list-item"><strong>${p.receiptNumber}</strong><br><span class="muted">${student ? student.name : 'Unknown'} · ${fmtMoney(p.amount)} · ${p.date}</span></div>`;
      }).join('')
    : 'No payments recorded yet.';
}

function renderReports() {
  const today = todayISO();
  const dailyCollections = state.payments
    .filter(p => p.date === today)
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalInvoiced = state.invoices.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalOutstanding = state.students.reduce((sum, s) => sum + getStudentBalance(s.id), 0);
  const studentsCleared = state.students.filter(s => getStudentTotalInvoiced(s.id) > 0 && getStudentBalance(s.id) <= 0).length;

  els.dailyCollections.textContent = fmtMoney(dailyCollections);
  els.totalInvoiced.textContent = fmtMoney(totalInvoiced);
  els.totalOutstandingReport.textContent = fmtMoney(totalOutstanding);
  els.studentsCleared.textContent = studentsCleared;
}

function refreshAll() {
  saveState();
  fillStudentOptions();
  fillInvoiceOptions(els.paymentStudent.value);
  els.invoiceNumber.value = `INV-${state.invoices.length + 1}`;
  els.receiptNumber.value = `RCPT-${state.payments.length + 1}`;
  els.paymentDate.value = todayISO();
  els.invoiceDueDate.value = todayISO();
  renderStudents();
  renderInvoices();
  renderPayments();
  renderClearance();
  renderDashboard();
  renderReports();
}

window.editStudent = function(id) {
  const s = getStudentById(id);
  if (!s) return;
  els.studentId.value = s.id;
  els.admissionNo.value = s.admissionNo;
  els.studentName.value = s.name;
  els.programme.value = s.programme;
  els.yearOfStudy.value = s.yearOfStudy;
  els.phone.value = s.phone || '';
  els.studentStatus.value = s.status;
  switchSection('students');
};

window.showClearance = function(studentId) {
  const s = getStudentById(studentId);
  if (!s) return;
  const invoiced = getStudentTotalInvoiced(studentId);
  const paid = getStudentTotalPaid(studentId);
  const balance = invoiced - paid;
  const clearanceStatus = balance <= 0 && invoiced > 0 ? 'CLEARED' : balance > 0 ? 'NOT CLEARED' : 'NO BILLING RECORD';

  els.clearanceSummary.innerHTML = `
    <strong>${s.name}</strong><br>
    Admission No: ${s.admissionNo}<br>
    Programme: ${s.programme}<br>
    Year of Study: ${s.yearOfStudy}<br><br>
    Total Invoiced: <strong>${fmtMoney(invoiced)}</strong><br>
    Total Paid: <strong>${fmtMoney(paid)}</strong><br>
    Outstanding Balance: <strong>${fmtMoney(balance)}</strong><br><br>
    Clearance Status: <span class="badge ${balance <= 0 && invoiced > 0 ? 'success' : balance > 0 ? 'warning' : 'danger'}">${clearanceStatus}</span>
  `;
  switchSection('clearance');
};

els.navLinks.forEach(btn => btn.addEventListener('click', () => switchSection(btn.dataset.section)));

els.studentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const record = {
    id: els.studentId.value || uid('STU'),
    admissionNo: els.admissionNo.value.trim(),
    name: els.studentName.value.trim(),
    programme: els.programme.value.trim(),
    yearOfStudy: els.yearOfStudy.value,
    phone: els.phone.value.trim(),
    status: els.studentStatus.value,
    createdAt: new Date().toISOString()
  };

  if (!record.admissionNo || !record.name || !record.programme || !record.yearOfStudy) {
    showToast('Please fill all required student fields.');
    return;
  }

  const duplicate = state.students.find(s => s.admissionNo === record.admissionNo && s.id !== record.id);
  if (duplicate) {
    showToast('Admission number already exists.');
    return;
  }

  const existingIndex = state.students.findIndex(s => s.id === record.id);
  if (existingIndex >= 0) {
    state.students[existingIndex] = { ...state.students[existingIndex], ...record };
    showToast('Student record updated.');
  } else {
    state.students.push(record);
    showToast('Student added successfully.');
  }

  resetStudentForm();
  refreshAll();
});

els.clearStudentForm.addEventListener('click', resetStudentForm);
els.studentSearch.addEventListener('input', renderStudents);

els.invoiceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const studentId = els.invoiceStudent.value;
  if (!studentId) {
    showToast('Please select a student.');
    return;
  }

  state.invoices.push({
    id: uid('INV'),
    invoiceNumber: els.invoiceNumber.value,
    studentId,
    description: els.invoiceDescription.value.trim(),
    term: els.invoiceTerm.value.trim(),
    amount: Number(els.invoiceAmount.value),
    dueDate: els.invoiceDueDate.value,
    createdAt: new Date().toISOString()
  });

  els.invoiceForm.reset();
  showToast('Invoice created successfully.');
  refreshAll();
});

els.paymentStudent.addEventListener('change', () => fillInvoiceOptions(els.paymentStudent.value));
els.paymentInvoice.addEventListener('change', () => {
  const invoice = getInvoiceById(els.paymentInvoice.value);
  if (!invoice) return;
  const balance = Number(invoice.amount) - getInvoiceTotalPaid(invoice.id);
  els.paymentAmount.value = balance > 0 ? balance : '';
});

els.paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const invoice = getInvoiceById(els.paymentInvoice.value);
  if (!invoice) {
    showToast('Please select a valid invoice.');
    return;
  }

  const amount = Number(els.paymentAmount.value);
  const balance = Number(invoice.amount) - getInvoiceTotalPaid(invoice.id);

  if (amount <= 0) {
    showToast('Payment amount must be greater than zero.');
    return;
  }

  if (amount > balance) {
    showToast('Payment amount cannot exceed invoice balance.');
    return;
  }

  state.payments.push({
    id: uid('PAY'),
    receiptNumber: els.receiptNumber.value,
    studentId: els.paymentStudent.value,
    invoiceId: els.paymentInvoice.value,
    method: els.paymentMethod.value,
    amount,
    date: els.paymentDate.value,
    createdAt: new Date().toISOString()
  });

  els.paymentForm.reset();
  showToast('Payment recorded successfully.');
  refreshAll();
});

els.seedDataBtn.addEventListener('click', () => {
  if (state.students.length || state.invoices.length || state.payments.length) {
    showToast('Sample data can be loaded after reset only.');
    return;
  }

  const s1 = { id: uid('STU'), admissionNo: 'JOOUST/2026/001', name: 'Akinyi Mary', programme: 'BSc Information Technology', yearOfStudy: '2', phone: '0712345678', status: 'Active', createdAt: new Date().toISOString() };
  const s2 = { id: uid('STU'), admissionNo: 'JOOUST/2026/002', name: 'Otieno Brian', programme: 'BEd Arts', yearOfStudy: '3', phone: '0723456789', status: 'Active', createdAt: new Date().toISOString() };
  state.students.push(s1, s2);

  const i1 = { id: uid('INV'), invoiceNumber: 'INV-1', studentId: s1.id, description: 'Semester 1 Fees', term: 'Semester 1', amount: 25000, dueDate: todayISO(), createdAt: new Date().toISOString() };
  const i2 = { id: uid('INV'), invoiceNumber: 'INV-2', studentId: s2.id, description: 'Semester 1 Fees', term: 'Semester 1', amount: 30000, dueDate: todayISO(), createdAt: new Date().toISOString() };
  state.invoices.push(i1, i2);

  state.payments.push({ id: uid('PAY'), receiptNumber: 'RCPT-1', studentId: s1.id, invoiceId: i1.id, method: 'MPesa', amount: 15000, date: todayISO(), createdAt: new Date().toISOString() });
  refreshAll();
  showToast('Sample data loaded.');
});

els.resetDataBtn.addEventListener('click', () => {
  if (!confirm('This will remove all saved data from this browser. Continue?')) return;
  state.students = [];
  state.invoices = [];
  state.payments = [];
  localStorage.removeItem(STORAGE_KEY);
  resetStudentForm();
  els.invoiceForm.reset();
  els.paymentForm.reset();
  els.clearanceSummary.textContent = 'Select a student from the students or clearance area to review financial clearance status.';
  refreshAll();
  showToast('All data reset successfully.');
});

function exportCSV(filename, rows) {
  if (!rows.length) {
    showToast('No data available to export.');
    return;
  }
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

els.exportStudentsBtn.addEventListener('click', () => {
  const rows = [
    ['Admission Number', 'Name', 'Programme', 'Year', 'Phone', 'Status', 'Balance']
  ].concat(state.students.map(s => [s.admissionNo, s.name, s.programme, s.yearOfStudy, s.phone, s.status, getStudentBalance(s.id)]));
  exportCSV('students.csv', rows);
});

els.exportPaymentsBtn.addEventListener('click', () => {
  const rows = [
    ['Receipt Number', 'Student', 'Invoice Number', 'Method', 'Amount', 'Date']
  ].concat(state.payments.map(p => {
    const student = getStudentById(p.studentId);
    const invoice = getInvoiceById(p.invoiceId);
    return [p.receiptNumber, student?.name || '', invoice?.invoiceNumber || '', p.method, p.amount, p.date];
  }));
  exportCSV('payments.csv', rows);
});

refreshAll();
switchSection('dashboard');
