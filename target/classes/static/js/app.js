// Reads the "logged in user" out of localStorage (set by auth.js).
// If nobody is logged in, bounce back to the sign-in page.
const savedUser = JSON.parse(localStorage.getItem("bookTrackerUser") || "null");
if (!savedUser) {
  window.location.href = "index.html";
}

document.getElementById("whoami").textContent = savedUser.username;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("bookTrackerUser");
  window.location.href = "index.html";
});

const columns = {
  TO_READ: document.getElementById("col-TO_READ"),
  READING: document.getElementById("col-READING"),
  COMPLETED: document.getElementById("col-COMPLETED"),
};

const STATUS_LABELS = {
  TO_READ: "📚 To Read",
  READING: "🍷 Reading",
  COMPLETED: "🏆 Finished",
};

async function loadBooks() {
  const res = await fetch(`/api/books?userId=${savedUser.id}`);
  const books = await res.json();
  renderShelves(books);
}

function renderShelves(books) {
  // Clear each column first.
  Object.values(columns).forEach((col) => (col.innerHTML = ""));

  const grouped = { TO_READ: [], READING: [], COMPLETED: [] };
  books.forEach((book) => grouped[book.status]?.push(book));

  Object.entries(grouped).forEach(([status, list]) => {
    const container = columns[status];

    if (list.length === 0) {
      container.innerHTML = `<p class="shelf-empty">Nothing here yet…</p>`;
      return;
    }

    list.forEach((book) => container.appendChild(buildBookCard(book)));
  });
}

function buildBookCard(book) {
  const card = document.createElement("div");
  card.className = "book-card";

  const title = document.createElement("p");
  title.className = "book-title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className = "book-author";
  author.textContent = `by ${book.author}`;

  // "What are your thoughts?" - a free-text note under the title/author.
  // Saves when you click away (blur), so there's no separate save button.
  const thoughtsLabel = document.createElement("p");
  thoughtsLabel.className = "thoughts-label";
  thoughtsLabel.textContent = "✒ What are your thoughts?";

  const thoughtsInput = document.createElement("textarea");
  thoughtsInput.className = "thoughts-input";
  thoughtsInput.placeholder = "Jot down how this book made you feel…";
  thoughtsInput.value = book.notes || "";
  thoughtsInput.rows = 2;
  let lastSavedNotes = book.notes || "";
  thoughtsInput.addEventListener("blur", () => {
    if (thoughtsInput.value !== lastSavedNotes) {
      lastSavedNotes = thoughtsInput.value;
      updateBookQuiet(book.id, { notes: thoughtsInput.value });
    }
  });

  const controls = document.createElement("div");
  controls.className = "book-controls";

  // Status dropdown - moves the book to a different column.
  const select = document.createElement("select");
  select.className = "status-select";
  Object.entries(STATUS_LABELS).forEach(([value, label]) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    if (value === book.status) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => updateBook(book.id, { status: select.value }));

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => deleteBook(book.id));

  controls.appendChild(select);
  controls.appendChild(removeBtn);

  card.appendChild(title);
  card.appendChild(author);
  card.appendChild(thoughtsLabel);
  card.appendChild(thoughtsInput);

  // Star rating (0-5) - only shown once a book is marked Finished.
  if (book.status === "COMPLETED") {
    const ratingRow = document.createElement("div");
    ratingRow.className = "rating-row";

    const stars = document.createElement("div");
    stars.className = "stars";
    for (let i = 1; i <= 5; i++) {
      const starBtn = document.createElement("button");
      starBtn.type = "button";
      starBtn.className = "star-btn" + (book.rating >= i ? " filled" : "");
      starBtn.textContent = "★";
      starBtn.title = `Rate ${i} star${i > 1 ? "s" : ""}`;
      starBtn.addEventListener("click", () => {
        const newRating = book.rating === i ? null : i; // click same star again to clear back to 0
        updateBook(book.id, { rating: newRating });
      });
      stars.appendChild(starBtn);
    }

    ratingRow.appendChild(stars);
    card.appendChild(ratingRow);
  }

  card.appendChild(controls);

  return card;
}

async function updateBook(id, changes) {
  await fetch(`/api/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  loadBooks();
}

// Same as updateBook, but skips the full re-render. Used for the notes
// textarea so typing/blurring doesn't yank focus or scroll position.
async function updateBookQuiet(id, changes) {
  await fetch(`/api/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
}

async function deleteBook(id) {
  await fetch(`/api/books/${id}`, { method: "DELETE" });
  loadBooks();
}

document.getElementById("addBookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("addError");
  errorEl.textContent = "";

  const form = new FormData(e.target);
  const payload = {
    userId: savedUser.id,
    title: form.get("title").trim(),
    author: form.get("author").trim(),
    status: form.get("status"),
    notes: form.get("notes").trim(),
  };

  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    errorEl.textContent = "Could not add that book. Try again.";
    return;
  }

  e.target.reset();
  loadBooks();
});

loadBooks();
