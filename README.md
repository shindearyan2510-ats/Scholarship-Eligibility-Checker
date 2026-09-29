# Scholarship Eligibility Checker (Rule-Based)

Internship project — checks a student's eligibility for scholarships by comparing
their details (category, income, marks %, attendance %, course) against a set of
rules stored in a database, and shows a dashboard of results with reasons for
non-eligibility.

## Tech Stack
- **Frontend:** React (Vite) + React Router + Bootstrap 5 + Axios
- **Backend:** Node.js + Express (rule engine)
- **Database:** MySQL

## Folder Structure
```
ScholarshipEligibilityChecker/
├── Backend/
│   ├── Config/db.js              # MySQL connection
│   ├── controller/
│   │   ├── scholarshipController.js   # CRUD for admin
│   │   └── eligibilityController.js   # rule engine
│   ├── routes/
│   │   ├── scholarshipRoutes.js
│   │   └── eligibilityRoutes.js
│   ├── Server.js
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── pages/                # Home, Check Eligibility, About
    │   ├── admin/                # Admin dashboard + manage scholarships
    │   └── Components/           # NavBar, Footer
    └── package.json
```

## Setup — step by step (VS Code)

### 1. Database
1. Create an empty MySQL database, or select the database already provided by
   your hosting provider.
2. Set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and
   `MYSQL_DATABASE` in the project-root `.env` file locally or in the hosting
   provider's environment settings.
3. On startup, the backend connects to the selected database and creates the
   `scholarships` table if it does not exist. The database user must have
   permission to create tables. Add scholarship records from the admin page.

### 2. Backend
```bash
cd Backend
npm install
```
Open `Backend/Config/db.js` and set your MySQL `password` (and `user` if different
from `root`).

Start the server:
```bash
npm run dev
```
It should print `🚀 Server running on port 5000`.

### 3. Frontend
Open a **second terminal**:
```bash
cd Frontend
npm install
npm run dev
```
Vite will print a local URL, usually `http://localhost:5173`. Open it in your
browser.

## Admin Login
The Admin panel is protected by a simple login page.

- URL: `/login` (also linked from the "Admin" nav item)
- **Username:** `aryan`
- **Password:** `1234`

This check happens on the frontend (`src/auth.js`) and is meant for a
demo/internship project — it is not secure enough for a real production app,
since anyone can read the credentials in the browser's source code. For a real
deployment you'd verify credentials on the backend and issue a session
token/JWT instead.

## How it works
1. A student fills the **Check Eligibility** form (category, family income,
   marks %, course).
2. The frontend sends this to `POST /check-eligibility` on the backend.
3. The backend's **rule engine** compares the data against every scholarship row
   in the database (category match, income cap, min marks %, course match) and
   returns two lists: scholarships the student **qualifies** for, and
   scholarships they **don't**, each with the specific reason(s).
4. The **Scholarships** page (`/scholarships`) lists every Government and
   Private scholarship in the database, with a filter to switch between them.
5. The **Admin panel** (`/admin`, behind login) lets you add, edit, or delete
   scholarships and their eligibility rules — no code changes needed to update
   criteria.

## API Endpoints
| Method | Endpoint                    | Description                          |
|--------|------------------------------|---------------------------------------|
| POST   | `/check-eligibility`         | Check a student's eligibility         |
| GET    | `/scholarships`              | List all scholarships                 |
| GET    | `/scholarships/:id`          | Get one scholarship                   |
| POST   | `/scholarships`              | Add a new scholarship                 |
| PUT    | `/scholarships/:id`          | Update a scholarship                  |
| DELETE | `/scholarships/:id`          | Delete a scholarship                  |

## Sample Data
`Backend/database.sql` seeds 21 real, well-known scholarships — 11 Government
(NMMS, PM YASASVI, CSSS, SC/ST Post-Matric, Minority Scholarship, INSPIRE,
AICTE Pragati, CBSE Single Girl Child, ONGC, etc.) and 10 Private (Tata
Capital Pankh, LIC Golden Jubilee, Reliance Foundation, Aditya Birla, HDFC
Bank, Infosys Foundation, Bharti Airtel, Generation Google Scholarship,
Sitaram Jindal Foundation, Vidyasaarathi). Each row also stores the
scholarship's `website` — a link to its official page, shown on the
Scholarships page, in eligibility results, and summarized on the About page.
Income limits and marks % are representative — always verify current figures
on [scholarships.gov.in](https://scholarships.gov.in) or the provider's own
site before relying on them for a real application.

If you're upgrading an existing database created before the `website` column
existed, run:
```sql
ALTER TABLE scholarships ADD COLUMN website VARCHAR(255) AFTER description;
```

## Possible Extensions
- Student login + saved application history (a `students` and `applications`
  table: `application_id`, `student_id`, `scholarship_id`, `status`)
- Export eligible scholarships list as PDF
- Email/SMS notification when a new scholarship matches a student's profile
