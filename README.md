# Smart Way Academy — Enterprise ERP & Mini-CRM

A secure, production-grade institutional automation engine engineered to eliminate fragmented student data, manual invoicing overhead, and communication delays in coaching hubs. 

This platform bridges the gap between educational administration and modern cloud architectures by digitizing transactional billing, student ledgers, and automated external notifications.

## 🚀 Live Production Links
* **Live Web Application:** [👉 Click Here to View Live Demo](https://smartwayacademy.vercel.app/)
* **Backend API Base Engine:** [https://your-render-or-railway-backend-link.com](https://smartwayacademy.onrender.com/api)

---

## 🛠 Architectural Stack & System Design

### Frontend Architecture
* **State Engine:** React.js powered by **Redux Toolkit** for predictable, global state synchronization across authentication cycles.
* **Build System & UI:** **Vite** for optimized assets compilation; **Tailwind CSS** for fully fluid, mobile-responsive layout mechanics.

### Backend & Core Systems
* **Engine runtime:** **Node.js** with **Express.js** handling structured RESTful routing, payload validation, and custom global error-handling middleware.
* **Security & Auth:** Stateless **JWT Authentication** layered with secure HttpOnly cookie routing and custom **Role-Based Access Control (RBAC)** filters (Admin vs. Student scopes).
* **Database Pipeline:** **MongoDB via Mongoose ORM**, utilizing optimized indexing strategies and deeply nested aggregation schemas to balance dynamic transactional ledgers.

---

## 💡 Technical Deep-Dive: Core Problems Solved

### 1. Automated Messaging Pipeline (Meta WhatsApp Cloud API & Twilio)
* **The Challenge:** High manual labor overhead when communicating fee updates, session shifts, or balance alerts to guardians.
* **The Implementation:** Architected a backend messaging broker that hooks directly into **Meta's WhatsApp Cloud API** webhooks. Upon internal database state transitions (e.g., invoice generation), the backend fires automated background workers to dispatch real-time structured templates, reducing operational notification delays down to milliseconds.

### 2. High-Integrity Financial Ledger Schemas
* **The Challenge:** Mitigating calculation anomalies and balance race-conditions in multi-month coaching plans with fluid payment milestones.
* **The Implementation:** Designed a strict relational document embedding pattern within MongoDB. Student profiles are mapped to historical transactional logs via atomicity enforcement, tracking precise dynamic fee balances, adjustments, and automated penalty assessments without computational drift.

### 3. Granular Access Control Isolation
* **The Challenge:** Preventing cross-tenant data exposure and keeping administrative configurations invisible to the student body.
* **The Implementation:** Engineered custom backend middleware checking signed cryptographic JWT payloads on every request. Resource visibility changes dynamically across client and server layers based on strictly assigned authorization claims.

---

## ⚙️ Local Development Setup

Clone the repository and jump into the workspace:
\`\`\`bash
git clone https://github.com
cd smartwayacademy
\`\`\`

1. Install backend and frontend dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure your local `.env` environment variables matrix:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_cluster_string
JWT_SECRET=your_cryptographic_secret
WHATSAPP_API_TOKEN=your_meta_token
\`\`\`

3. Initialize the development clusters:
\`\`\`bash
npm run dev
\`\`\`
