# 🩸 LifeLink — Blood Bank & Organ Donation Network

A full-stack web application for managing blood bank operations, organ donations, patient matching, and logistics tracking for a medical network.

![LifeLink Dashboard](https://img.shields.io/badge/LifeLink-v1.0-C0152A?style=for-the-badge&logo=heart&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js) ![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white) ![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)

---

## 📋 Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time stats, blood inventory chart, expiring organs, active alerts |
| **Donors** | Register & manage blood/organ donors with health history tracking |
| **Blood Inventory** | Track blood bags by type, manage expiry, run automated checks |
| **Organs** | Organ registry with live viability countdown timers |
| **Hospitals** | Hospital network management with verification system |
| **Patients** | Patient records, organ waitlists, urgency levels |
| **Requests** | Blood & organ request pipeline (Requested → Matched → Dispatched → Delivered) |
| **Matching Engine** | ABO+Rh blood compatibility & organ tissue matching with scoring |
| **Allocations** | Dispatch tracking, delivery audit trails, delay detection |
| **Alerts** | Auto-generated alerts for expiry, low stock, organ viability, emergencies |

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express.js (REST API)
- **Database:** MySQL 8.0+ with triggers, stored procedures, and views
- **Frontend:** Vanilla HTML/CSS/JavaScript (Single Page Application)
- **Design:** Dark clinical theme with glassmorphism, crimson/cyan accents

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm

### 1. Clone the repository
```bash
git clone <repository-url>
cd lifelink
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create or edit `.env` in the project root:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lifelink_db
PORT=3000
```

### 4. Set up the database
Log into MySQL and run the SQL scripts **in order**:
```bash
mysql -u root -p
```

```sql
SOURCE sql/schema.sql;
SOURCE sql/procedures_and_triggers.sql;
SOURCE sql/seed_data.sql;
```

### 5. Start the server
```bash
npm start
```

### 6. Open in browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📡 API Reference

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/donors` | List all donors (filter: `blood_type`, `donor_type`, `is_eligible`) |
| `GET` | `/api/donors/:id` | Get donor profile + health history |
| `POST` | `/api/donors` | Register new donor |
| `PUT` | `/api/donors/:id/eligibility` | Update eligibility status |
| `POST` | `/api/donors/:id/health` | Add health record |
| `GET` | `/api/donors/:id/donations` | Get donation history |

### Blood Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/blood` | List blood bags (filter: `blood_type`, `status`) |
| `GET` | `/api/blood/summary` | Per-type available count |
| `POST` | `/api/blood` | Add new blood bag (auto-generates UID & expiry) |
| `POST` | `/api/blood/expire-check` | Mark expired bags |

### Organs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/organs` | List organs (filter: `organ_type`, `status`) |
| `POST` | `/api/organs` | Register harvested organ |

### Hospitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/hospitals` | List all hospitals |
| `GET` | `/api/hospitals/:id` | Get hospital details |
| `POST` | `/api/hospitals` | Register hospital |
| `PUT` | `/api/hospitals/:id/verify` | Verify/revoke hospital |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patients` | List patients (filter: `hospital_id`, `organ_needed`, `urgency_level`) |
| `GET` | `/api/patients/:id` | Get patient with their requests |
| `POST` | `/api/patients` | Add new patient |

### Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/requests` | List requests (filter: `type`, `status`, `hospital_id`) |
| `POST` | `/api/requests/blood` | Create blood request |
| `POST` | `/api/requests/organ` | Create organ request |

### Matching Engine
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/match/blood` | Find ABO+Rh compatible blood bags |
| `POST` | `/api/match/organ` | Find compatible organs (blood + tissue match scoring) |

### Allocations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/allocations` | List allocations (filter: `status`, `request_type`) |
| `GET` | `/api/allocations/:id` | Full allocation details |
| `POST` | `/api/allocate/blood` | Allocate blood bag to request |
| `POST` | `/api/allocate/organ` | Allocate organ to request |
| `PUT` | `/api/allocations/:id/delivery` | Update delivery status |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/alerts` | List unresolved alerts (use `?show_all=true` for all) |
| `PUT` | `/api/alerts/:id/resolve` | Resolve an alert |

---

## 📁 Project Structure

```
lifelink/
├── server/
│   ├── index.js              # Express entry point
│   ├── db.js                 # MySQL connection pool
│   ├── routes/               # Route definitions
│   │   ├── donors.js
│   │   ├── blood.js
│   │   ├── organs.js
│   │   ├── hospitals.js
│   │   ├── patients.js
│   │   ├── requests.js
│   │   ├── matching.js
│   │   ├── allocations.js
│   │   └── alerts.js
│   └── controllers/          # Business logic
│       ├── donorsController.js
│       ├── bloodController.js
│       ├── organsController.js
│       ├── hospitalsController.js
│       ├── patientsController.js
│       ├── requestsController.js
│       ├── matchingController.js
│       ├── allocationsController.js
│       └── alertsController.js
├── public/
│   ├── index.html            # SPA shell
│   ├── css/
│   │   └── style.css         # Full design system (~1800 lines)
│   └── js/
│       ├── api.js            # API helper + utilities
│       ├── app.js            # SPA router
│       ├── dashboard.js      # Dashboard view
│       ├── donors.js         # Donors view
│       ├── blood.js          # Blood inventory view
│       ├── organs.js         # Organs view
│       ├── hospitals.js      # Hospitals view
│       ├── patients.js       # Patients view
│       ├── requests.js       # Requests view
│       ├── matching.js       # Matching engine view
│       ├── allocations.js    # Allocations view
│       └── alerts.js         # Alerts view
├── sql/
│   ├── schema.sql            # Full database schema
│   ├── procedures_and_triggers.sql  # Triggers & stored procedures
│   └── seed_data.sql         # Sample data (10 donors, 20 bags, etc.)
├── .env                      # Environment config
└── package.json
```

---

## 🧠 Database Features

- **Triggers:** Auto-expiry detection, low stock alerts, organ viability alerts, donor eligibility checks
- **Stored Procedures:** ABO+Rh blood matching, organ compatibility scoring, allocation workflow, delivery tracking
- **Relationships:** Foreign keys linking donors → blood/organs → hospitals → patients → requests → allocations

---

## 📸 Screenshots

### Dashboard
> Dark-themed dashboard with stat cards, blood inventory bar chart, expiring organs table, and alert feed.

### Matching Engine
> Side-by-side blood and organ matching panels with heartbeat scanning animation and score bars.

### Organs View
> Card grid with live viability countdown timers that pulse red when urgent.

### Alerts
> Color-coded alert cards with emergency flashing borders and smooth resolve animations.

---

## 📝 License

This project was built for educational purposes as part of a DBMS course project.
