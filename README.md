# CampusSplit: Autonomous Campus Debt Settlement & Expense Engine

> **Track 4:** Student Finance & Smart Campus Living  
> **Team Name:** Tech Mind  
> **Team Members:** Loveleen (Lead), Shania Bawa, Deeksha  

---

## 📌 Project Overview
**CampusSplit** is an algorithmic expense manager designed specifically for campus hostels and student groups. It eliminates tangled multi-party cyclic debts using the **Greedy Min-Cash Flow algorithm**, reducing chaotic transactions down to at most $(N-1)$ directional payments. The platform integrates dynamic UPI intents, OCR receipt ingestion simulation, recurring expense tracking, and ledger audits.

---

## 🚀 Key Features
* **Graph-Based Debt Minimization:** Implements Greedy Min-Cash Flow to break circular debt deadlocks and slash settlement hops.
* **Flexible Split Engine:** Supports **Equal ($1/N$)** division and **Uneven / Itemized (₹)** inputs with strict sum-matching validation.
* **Recurring Expense Engine:** Tracks recurring room utilities (Wi-Fi, rent, subscriptions) with automated tagging.
* **Fintech Settlement Rails:** Dynamic `upi://pay` deep-link generation, scannable QR modal, and automated WhatsApp reminder nudges (`wa.me`).
* **Visual Spend Analytics:** Real-time dashboard showing gross outlay, category-wise spending distributions, and transaction hops saved.
* **Ledger Audit & Export:** One-click timestamped CSV export ensuring zero-sum accounting integrity.

---

## 🛠 Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, Lucide React Icons
* **Backend:** Node.js, Express.js REST API
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## ⚙️ Local Setup & Installation

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas connection string (or local MongoDB)

### 1. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

cd "CAMPUS SPLIT" 


