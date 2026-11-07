# Issue Tracking & Project Management System

A lightweight, RESTful, Jira-like web application designed for software teams to manage projects, report bugs, assign tasks, and track issue progression. Built with Python, FastAPI, and SQLite.

## 🚀 Features

*   **User Authentication:** Secure JWT-based registration and login system with password hashing (bcrypt).
*   **Role-Based Access Control (RBAC):** Distinct roles for `admin` (can create projects) and `developer` (can report and manage issues).
*   **Project Management:** Full CRUD operations for project tracking.
*   **Issue Tracking:** Create tickets, link them to specific projects, and update statuses (`Open`, `In Progress`, `Resolved`).
*   **Interactive UI:** A responsive Single Page Application (SPA) built with Vanilla JavaScript and Bootstrap 5.
*   **Auto-Generated API Docs:** Interactive Swagger UI documentation provided out-of-the-box by FastAPI.

## 🛠️ Technology Stack

*   **Backend:** Python 3.11, FastAPI
*   **Database:** SQLite, SQLAlchemy (ORM)
*   **Data Validation:** Pydantic v2
*   **Authentication:** PyJWT, Passlib (OAuth2 with Password Flow)
*   **Frontend:** HTML5, Vanilla JavaScript, Bootstrap 5 (CDN)

## 📁 Project Structure

```text
issue_tracker/
├── requirements.txt      # Project dependencies
├── make_admin.py         # Utility script to promote users
├── app/
│   ├── main.py           # Application entry point
│   ├── database.py       # SQLite connection and session factory
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic schemas for data validation
│   ├── auth.py           # JWT and password hashing logic
│   ├── routers/          # API route handlers (users, projects, issues)
│   ├── static/           # Frontend JS and CSS
│   └── templates/        # HTML templates (Jinja2)
```

## ⚙️ Local Setup & Installation

### 1. Prerequisites
Ensure you have Python 3.11+ installed on your machine.

### 2. Clone and Environment Setup
Clone the repository and set up a virtual environment:
```bash
git clone https://github.com/ParimalSarode/issue-tracker.git
cd issue-tracker
python -m venv .venv
```

Activate the virtual environment:
*   **Windows:** `.venv\Scripts\activate`
*   **macOS/Linux:** `source .venv/bin/activate`

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
Start the FastAPI server. The database tables will be created automatically on the first run.
```bash
python -m uvicorn app.main:app --reload
```

### 5. Access the Application
*   **Web UI:** Open `http://127.0.0.1:8000/` in your browser.
*   **API Documentation:** Open `http://127.0.0.1:8000/docs` to view the interactive Swagger UI.

## 🔐 Creating an Admin Account

By default, newly registered users are given the `developer` role. To create projects, you need an `admin` account.

1. Open the Web UI and register a new user (e.g., `admin`).
2. Open a new terminal window (keep the server running).
3. Ensure your virtual environment is active.
4. Run the admin promotion script (make sure `TARGET_USERNAME` in the script matches your registered user):
   ```bash
   python make_admin.py
   ```
5. Refresh the Web UI, log in, and you will now have permissions to create projects.

## 🔮 Future Enhancements

*   Implementation of advanced Search & Filtering for issues.
*   Kanban board UI layout for drag-and-drop issue management.
*   Unit and Integration testing using Pytest.
*   Containerization using Docker.