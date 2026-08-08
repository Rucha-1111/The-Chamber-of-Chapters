# The Chamber of Chapters — Book Tracker

A tiny full-stack Spring Boot app: sign up, log in, and track books across
three shelves (To Read / Currently Reading / Finished), with a personal
"thoughts" note and a 0-5 star rating on finished books.

## Project structure

```
src/main/java/com/booktracker/
  BookTrackerApplication.java   - app entry point + password hasher bean
  model/User.java               - users table
  model/Book.java                - books table
  repository/UserRepository.java - user lookups (one-liners, Spring Data JPA)
  repository/BookRepository.java - book lookups
  controller/AuthController.java - /api/auth/signup, /api/auth/login
  controller/BookController.java - /api/books CRUD

src/main/resources/
  application.properties        - your Supabase connection details go here
  static/index.html             - login / signup page
  static/dashboard.html         - the shelf page
  static/css/style.css
  static/js/auth.js             - login/signup form logic
  static/js/app.js              - dashboard logic (add/update/delete books)
  static/js/sparkles.js         - the floating gold light effect
```

That's the whole backend: 3 controllers/app classes with real logic, plus
2 tiny entity classes and 2 one-line repository interfaces that Spring Data
JPA implements for you automatically.

## 1. Set up your Supabase database

1. Go to [supabase.com](https://supabase.com), create a free project.
2. In the dashboard: **Project Settings → Database → Connection string**.
3. Copy your project's host (looks like `db.xxxxxxxxxxxx.supabase.co`) and
   your database password (you set this when creating the project — if you
   forgot it, you can reset it from that same settings page).
4. Open `src/main/resources/application.properties` and replace
   `<YOUR_SUPABASE_HOST>` with your actual host.
5. You don't need to create any tables yourself — Hibernate will create the
   `users` and `books` tables automatically the first time you run the app
   (that's what `spring.jpa.hibernate.ddl-auto=update` does).

## 2. Run it

Set your DB password as an environment variable (keeps it out of the code):

```bash
export DB_PASSWORD=your_supabase_db_password
```

Then, from the project root:

```bash
mvn spring-boot:run
```

Open **http://localhost:8080** — that's `index.html`, the sign-in page.

## 3. How auth works (and its limits)

- Passwords are hashed with BCrypt before being stored — never saved as
  plain text.
- After a successful login/signup, the browser just remembers your user id
  and username in `localStorage` and uses that to tag every book you add.
  There's no session token or expiry — it's intentionally the simplest
  thing that works for a personal project. If you later want this to be
  production-grade, the next step up is adding JWTs or Spring Security
  sessions.

## 4. API quick reference

| Method | Path                  | Body                                             |
|--------|-----------------------|---------------------------------------------------|
| POST   | /api/auth/signup      | `{ username, email, password }`                   |
| POST   | /api/auth/login       | `{ username, password }`                          |
| GET    | /api/books?userId=1   | —                                                  |
| POST   | /api/books             | `{ userId, title, author, status }`               |
| PUT    | /api/books/{id}       | any of `{ title, author, status, rating, notes }` |
| DELETE | /api/books/{id}       | —                                                  |
