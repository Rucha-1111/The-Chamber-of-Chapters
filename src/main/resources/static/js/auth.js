// Very small "session": once login/signup succeeds, we remember the user
// in localStorage and redirect to the dashboard. No JWTs, no cookies -
// deliberately simple for a personal project.

const loginCard = document.getElementById("loginCard");
const signupCard = document.getElementById("signupCard");

document.getElementById("showSignup").addEventListener("click", () => {
  loginCard.classList.add("hidden");
  signupCard.classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", () => {
  signupCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
});

// If someone is already signed in, skip straight to the dashboard.
if (localStorage.getItem("bookTrackerUser")) {
  window.location.href = "dashboard.html";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("loginError");
  errorEl.textContent = "";

  const form = new FormData(e.target);
  const payload = {
    username: form.get("username").trim(),
    password: form.get("password"),
  };

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || "Sign in failed.";
      return;
    }

    localStorage.setItem("bookTrackerUser", JSON.stringify(data));
    window.location.href = "dashboard.html";
  } catch (err) {
    errorEl.textContent = "Could not reach the server. Is it running?";
  }
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("signupError");
  errorEl.textContent = "";

  const form = new FormData(e.target);
  const payload = {
    username: form.get("username").trim(),
    email: form.get("email").trim(),
    password: form.get("password"),
  };

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || "Sign up failed.";
      return;
    }

    localStorage.setItem("bookTrackerUser", JSON.stringify(data));
    window.location.href = "dashboard.html";
  } catch (err) {
    errorEl.textContent = "Could not reach the server. Is it running?";
  }
});
