# The Chamber of Chapters — Book Tracker

<div align="center">

*A very small, very magical reading ledger.*

Track what you're reading, tuck away your thoughts, rate the books you finish, and watch your shelves grow — all by candlelight.

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=flat-square&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## 📖 Overview

**The Chamber of Chapters** is a full-stack **Spring Boot** web application that lets readers manage a personal reading list. Users sign up, log in, and organize books across three cozy shelves:

- 📚 **To Read**
- 🍷 **Currently Reading**
- 🏆 **Finished**

Each book can carry a personal "thoughts" note, and finished books can be rated with a **0–5 star** system. The frontend is a lightweight set of static HTML/CSS/JS pages served directly by Spring Boot — no separate frontend build step required.

The app is designed to be simple, self-contained, and easy to run — a great demonstration of a modern Java web stack with a clean, thematic UI.

---

## ✨ Features

- **User authentication** — sign up and log in with username/email/password
- **Secure password storage** — passwords are hashed with **BCrypt** before being saved; plain text is never stored
- **Personal reading shelves** — organize books into *To Read*, *Currently Reading*, and *Finished* columns
- **Free-text personal notes** — jot down your thoughts on any book
- **Star ratings** — rate finished books from 0 to 5 stars directly on the card
- **Drag-free status updates** — move a book between shelves with a dropdown
- **Persistent storage** — data lives in a cloud **PostgreSQL** database (Supabase)
- **Thematic UI** — a candlelit, library-inspired interface with floating golden sparkle particles
- **Responsive & mobile-friendly** — works across screen sizes

---

## 🛠️ Tech Stack

| Layer      | Technology                                                              |
|------------|-------------------------------------------------------------------------|
| Backend    | [Spring Boot 3.3.4](https://spring.io/projects/spring-boot) (Java 17)   |
| ORM        | Spring Data JPA (Hibernate)                                             |
| Security   | `spring-security-crypto` — BCrypt password hashing                      |
| Database   | [PostgreSQL](https://www.postgresql.org/) (via Supabase)                |
| Frontend   | Vanilla HTML, CSS, JavaScript (no build step / no framework)            |
| Build Tool | [Maven](https://maven.apache.org/)                                      |
| Container  | [Docker](https://www.docker.com/) (multi-stage build)                   |

---

## 📂 Project Structure

```
Chamber of Books/
├── Dockerfile                          # Multi-stage Docker image (build + runtime)
├── pom.xml                             # Maven build config & dependencies
├── README.md
└── src/
    ├── main/
    │   ├── java/com/booktracker/
    │   │   ├── BookTrackerApplication.java   # App entry point + BCrypt PasswordEncoder bean
    │   │   ├── controller/
    │   │   │   ├── AuthController.java       # /api/auth/signup, /api/auth/login
    │   │   │   └── BookController.java       # /api/books CRUD endpoints
    │   │   ├── model/
    │   │   │   ├── User.java                 # users table entity
    │   │   │   └── Book.java                 # books table entity
    │   │   └── repository/
    │   │       ├── UserRepository.java       # Spring Data JPA user queries
    │   │       └── BookRepository.java       # Spring Data JPA book queries
    │   └── resources/
    │       ├── application.properties        # App config (DB URL, port, JPA settings)
    │       └── static/                       # Served automatically as the frontend
    │           ├── index.html                # Login / signup page
    │           ├── dashboard.html            # The personal shelf page
    │           ├── css/
    │           │   └── style.css             # All styling & sparkle animations
    │           └── js/
    │               ├── auth.js               # Login/signup form logic + session
    │               ├── app.js                # Dashboard logic (add/update/delete books)
    │               └── sparkles.js           # Floating golden light particle effect
    └── test/                                # (reserved for tests)
```

> **Note:** The backend is intentionally lean — a couple of controllers with real
> logic, two small entity classes, and two one-line Spring Data JPA repository
> interfaces. Spring Data JPA implements all the standard CRUD methods for you.

---

## ✅ Prerequisites

Before you begin, make sure you have:

- **Java 17** (JDK) installed
- **Maven 3.9+** installed (or use the Maven wrapper included via the Docker build)
- A **Supabase** account (free tier is fine) — or any PostgreSQL instance
- (**Optional**) **Docker** installed to run the containerized version

---

## 🗄️ Database Setup (Supabase)

This app uses PostgreSQL for persistence. The easiest way to get a hosted,
free database is [Supabase](https://supabase.com):

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the dashboard, open **Project Settings → Database → Connection string**.
3. Copy your project's **host** (looks like `db.xxxxxxxxxxxx.supabase.co`) and
   your **database password** (set when you created the project; reset it from
   the same settings page if you forgot it).
4. Build the full JDBC connection URL:
   ```
   jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
   Stored as the `DATABASE_URL` environment variable (see [Configuration](#configuration)).

> **You don't need to create any tables yourself.** Hibernate will create the
> `users` and `books` tables automatically the first time you run the app
> (that's what `spring.jpa.hibernate.ddl-auto=update` does).

---

## ⚙️ Configuration

All runtime configuration lives in `src/main/resources/application.properties`:

```properties
spring.application.name=book-tracker
server.port=${PORT:8080}

spring.datasource.url=${DATABASE_URL}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

Two values are injected from **environment variables** so secrets stay out of code:

| Environment Variable | Purpose                                                    | Default |
|----------------------|------------------------------------------------------------|---------|
| `DATABASE_URL`       | Full PostgreSQL JDBC connection string (`jdbc:postgresql://…`) | *(required)* |
| `PORT`               | Server port for the embedded web container                | `8080`  |

---

## 🚀 Running Locally

### 1. Set your database URL

Set the `DATABASE_URL` environment variable (keeps credentials out of your code):

```bash
# macOS / Linux
export DATABASE_URL="jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres"

# Windows (Command Prompt)
set DATABASE_URL=jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres

# Windows (PowerShell)
$env:DATABASE_URL="jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres"
```

### 2. Run the app

From the project root:

```bash
mvn spring-boot:run
```

### 3. Open the app

Navigate to **http://localhost:8080** in your browser. That's `index.html`, the
sign-in page. Sign up for a new account, then start adding books to your shelves.

---

## 🐳 Running with Docker

The included `Dockerfile` uses a **multi-stage build**: a Maven stage compiles the
jar, then a slim JRE stage runs it.

```bash
# 1. Build the image
docker build -t chamber-of-chapters .

# 2. Run the container (pass your DATABASE_URL)
docker run -p 8080:8080 \
  -e DATABASE_URL="jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres" \
  chamber-of-chapters
```

Then open **http://localhost:8080**.

---

## 🔌 API Reference

All endpoints are served under `/api`. Requests and responses use **JSON**.

### Authentication (`/api/auth`)

#### `POST /api/auth/signup`
Create a new account.

**Request body:**
```json
{
  "username": "harry_potter",
  "email": "harry@hogwarts.edu",
  "password": "expelliarmus"
}
```

**Response `201 Created`:**
```json
{
  "id": 1,
  "username": "harry_potter",
  "email": "harry@hogwarts.edu"
}
```

> The password hash is never returned to the browser — only the safe user fields.
> Errors return a `message`, e.g. `400` for missing fields, `409` for a taken
> username/email.

#### `POST /api/auth/login`
Authenticate an existing user.

**Request body:**
```json
{
  "username": "harry_potter",
  "password": "expelliarmus"
}
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "username": "harry_potter",
  "email": "harry@hogwarts.edu"
}
```

> Returns `401` with `"Incorrect username or password."` on failure.

### Books (`/api/books`)

| Method | Path                  | Description                                  | Body |
|--------|-----------------------|----------------------------------------------|------|
| `GET`  | `/api/books?userId=1` | List all books belonging to a user           | — |
| `POST` | `/api/books`          | Add a new book                               | See below |
| `PUT`  | `/api/books/{id}`     | Update any/some fields of a book             | Any subset below |
| `DELETE`| `/api/books/{id}`    | Delete a book                                | — |

**`POST /api/books` request body:**
```json
{
  "userId": 1,
  "title": "Jane Eyre",
  "author": "Charlotte Brontë",
  "status": "TO_READ",
  "notes": "First impressions: gothic, atmospheric, love it."
}
```

**`PUT /api/books/{id}` request body** — send only the fields you want to change:
```json
{
  "status": "COMPLETED",
  "rating": 5
}
```

**Book fields:**

| Field    | Type    | Notes                                                        |
|----------|---------|--------------------------------------------------------------|
| `id`     | number  | Auto-generated primary key                                   |
| `userId` | number  | Owner of the book (foreign key)                              |
| `title`  | string  | Required                                                      |
| `author` | string  | Required                                                      |
| `status` | string  | One of `TO_READ`, `READING`, `COMPLETED` (default `TO_READ`) |
| `rating` | number  | Optional `1–5`; only meaningful when `status = COMPLETED`     |
| `notes`  | string  | Optional free-text thoughts (stored as `TEXT`)               |

---

## 🔐 How Authentication Works

- **Passwords** are hashed with **BCrypt** before being stored (`User.password`
  holds the hash, never the plain text). The `PasswordEncoder` bean is defined
  once in `BookTrackerApplication.java` and reused by `AuthController`.
- **No server-side session** is used. After a successful login/signup, the
  browser stores the safe user object (`id`, `username`, `email`) in
  `localStorage` under the key `bookTrackerUser`. Every book a user adds is
  tagged with that `userId`.
- **There is deliberately no JWT or token expiry** — this is intentionally the
  simplest thing that works for a personal project.
- The password hash is **never** sent back to the browser; only safe fields are
  returned.

> **Production note:** If you later want this to be production-grade, the natural
> next step is to add **JWT-based authentication** or **Spring Security sessions**
> to secure the API and manage token lifecycle.

---

## 🎨 Frontend Overview

The frontend is served directly by Spring Boot from `src/main/resources/static/`:

| File             | Purpose                                                              |
|------------------|----------------------------------------------------------------------|
| `index.html`     | The landing/sign-in page with toggling login & signup cards          |
| `dashboard.html` | The personal shelf page with three columns and an "add book" drawer  |
| `css/style.css`  | All styling, including the candlelit theme and sparkle animations    |
| `js/auth.js`     | Handles the login/signup forms, `localStorage` session, redirects    |
| `js/app.js`      | Loads/renders books, handles status changes, notes, ratings, remove  |
| `js/sparkles.js` | Spawns the floating golden light particles (purely decorative)       |

**Notable UX behaviors:**
- **Notes auto-save** — thoughts are saved silently when you blur out of the
  textarea (no separate save button), so the UI doesn't re-render while typing.
- **Ratings appear only on finished books** — clicking a star sets the rating;
  clicking the same star again clears it back to `0`.
- **Status dropdown** — changing a book's status immediately moves it to the
  matching shelf column.
- **Guests are redirected** — `auth.js` sends already-logged-in users to the
  dashboard, and `app.js` bounces logged-out visitors back to the sign-in page.

---

## 🗃️ Data Model

### `users` table

| Column     | Type    | Constraints                     |
|------------|---------|---------------------------------|
| `id`       | BIGINT  | Primary key, auto-increment     |
| `username` | VARCHAR | Not null, unique                |
| `email`    | VARCHAR | Not null, unique                |
| `password` | VARCHAR | Not null — BCrypt hash          |

### `books` table

| Column    | Type    | Constraints                                  |
|-----------|---------|----------------------------------------------|
| `id`      | BIGINT  | Primary key, auto-increment                  |
| `title`   | VARCHAR | Not null                                     |
| `author`  | VARCHAR | Not null                                     |
| `status`  | VARCHAR | Not null — `TO_READ` / `READING` / `COMPLETED` |
| `rating`  | INTEGER | Nullable (`1–5`, shown when completed)       |
| `notes`   | TEXT    | Nullable free-text thoughts                  |
| `user_id` | BIGINT  | Not null — owner reference                   |

Tables are created and kept in sync automatically by Hibernate
(`spring.jpa.hibernate.ddl-auto=update`).

---

## 🚧 Roadmap / Future Improvements

- **JWT-based authentication** with token expiry for production-grade security
- **Email verification & password reset** flows
- **Search & filter** across a user's books
- **Sorting** options (by title, author, rating, date added)
- **Cover images** for books (via Open Library / Google Books API)
- **Reading progress / page counts**
- **Export** your library to CSV/JSON
- **Automated tests** for the API and frontend

---

## 📜 License

This project is open source and available for learning and portfolio purposes.
Feel free to adapt it for your own projects.
