# EduBill Pro Finance - Version 4

A polished browser-based student billing and finance workflow demo.

## Demo Login
- Username: `admin`
- Password: `admin123`

## New Version 4 Features
- Bank setup and bank balance tracking
- Draft and posted invoices
- Draft and posted receipts with bank selection
- Refund workflow: Draft → Approved → Paid
- Reversal workflow for invoices, receipts, and refunds
- Student ledger with debit/credit running balance
- Audit trail for posting, approvals, and reversals
- Balance-based clearance logic
- Printable invoice, receipt, refund voucher, and clearance letter
- CSV export plus JSON backup/restore
- Local browser storage using `localStorage`

## Finance Logic
- **Posted invoice:** Dr Student Debtor / Cr Fee Revenue
- **Posted receipt:** Dr Bank / Cr Student
- **Paid refund:** Dr Student / Refund Control / Cr Bank
- **Reversal:** keeps history; posted transactions are not deleted

## How to Use
1. Extract the zip file.
2. Open `index.html` in a browser.
3. Sign in using the demo credentials.
4. Optionally click **Load Sample Data**.
5. Create banks before posting receipts or refunds.

## Notes
- This is a front-end demo only.
- It is suitable for workflow demonstration and requirement validation.
- For production use, connect it to a backend/database with proper user permissions and server-side posting controls.
