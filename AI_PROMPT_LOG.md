# AI_PROMPT_LOG.md
## Project: CampusSplit (Autonomous Campus Debt Settlement Engine)
## Track 4: Student Finance & Smart Campus Living
## Team: Tech Mind (Loveleen - Lead, Shania Bawa)

---

### Prompt 1: System Architecture & Data Modeling
Act as a Full-Stack MERN Architect. Design the backend data model and architecture for a campus expense-sharing application named "CampusSplit".
- Define Mongoose schemas for:
  1. Members (name, UPI ID, avatar/initials)
  2. Expenses (title, total amount, category, payer, splitMode ['equal', 'uneven'], participants array with breakdown shares, isRecurring flag, timestamp)
  3. Settlements (debtor, creditor, amount, status ['pending', 'settled'])
- Ensure the architecture supports dynamic recalculation of net balances on every expense addition or deletion without data anomalies.

---

### Prompt 2: Greedy Min-Cash Flow Algorithm Implementation
Act as an Algorithm & Graph Theory Specialist. 
Write a clean, efficient Node.js service implementing the Greedy Min-Cash Flow algorithm to resolve multi-party debts:
- Input: An array of participants and all recorded shared expense documents.
- Step 1: Calculate net balance for each person (Total Amount Paid - Total Consumed Share).
- Step 2: Segregate participants into two categories: Net Debtors (balance < 0) and Net Creditors (balance > 0).
- Step 3: Use a greedy two-pointer approach to match the maximum debtor with the maximum creditor.
- Step 4: Settle min(|Debtor Balance|, Creditor Balance), adjust remaining balances, and record the directional payment edge { from, to, amount }.
- Output: An optimized array of directional settlements bounded by at most (N - 1) transactions, completely resolving circular debt deadlocks.

---

### Prompt 3: Dynamic Split Logic Engine (Equal vs Uneven Validation)
Act as a Senior React Engineer.
Create a flexible expense logging component supporting two distinct split modes:
1. Equal Split (1/N): Automatically calculates and divides the total bill evenly across all selected members.
2. Uneven / Itemized Split: Allows manual entry of individual rupee shares for each member.
- Enforce strict client-side validation ensuring the sum of individual uneven inputs strictly matches the total bill amount before enabling submission.
- Include a simulated OCR bill scanner preset that parses receipt items and auto-populates amounts and expense categories.

---

### Prompt 4: Fintech Rails Integration (Dynamic UPI & WhatsApp Nudges)
Act as a Fintech Integration Developer.
Implement frictionless peer-to-peer settlement actions on the client dashboard:
- Dynamic UPI Deep Link: Construct a standard `upi://pay` URI embedding payee VPA, payee name, calculated settlement amount, and transaction note.
- In-App QR Modal: Render a dynamic QR code containing the generated UPI URI alongside a simulated payment verification flow (UTR mock callback).
- WhatsApp Nudge Engine: Build a deep-link trigger using `https://wa.me/` with a pre-formatted message alerting the debtor of the exact pending amount and creditor's UPI handle to eliminate manual chasing.

---

### Prompt 5: Expenditure Analytics & Ledger Audit Trail
Act as a Frontend Data Visualization Specialist.
Build an interactive Analytics and Audit view using React and Tailwind CSS:
- Metrics Overview: Display high-level metric cards for Gross Campus Outlay, Total Logged Bills, Pending Settlements, and Transaction Hops Saved by the Min-Cash Flow algorithm.
- Visual Breakdown: Render dynamic category-wise expenditure progress bars (Food & Canteen, Wi-Fi & Utilities, Project Supplies).
- Audit Trail: Include a single-click CSV export utility that formats all ledger entries into a downloadable timestamped spreadsheet for room or club financial audits.
