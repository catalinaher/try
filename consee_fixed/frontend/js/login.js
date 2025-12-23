// frontend/js/login.js
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("authMsg");

function setMsg(text, good = false) {
  msg.textContent = text;
  msg.style.color = good ? "#a3ffb0" : "#ffd1d1";
}

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("Creating account…");

  const username = document.getElementById("suUsername").value.trim();
  const password = document.getElementById("suPassword").value;

  if (password.length < 6) {
    setMsg("Password must be at least 6 characters.");
    return;
  }

  const { data, error } = await window.ConseeAuth.signUpWithUsername(username, password);

  if (error) {
    setMsg(`❌ ${error.message}`);
    return;
  }

 
  setMsg("✅ Account created successfully! You can sign in now (or you may already be signed in).", true);

  // If they were signed in automatically, send them to profile
  const user = await window.ConseeAuth.getSessionUser();
  if (user) window.location.href = "./profile.html";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("Signing in…");

  const username = document.getElementById("liUsername").value.trim();
  const password = document.getElementById("liPassword").value;

  const { data, error } = await window.ConseeAuth.signInWithUsername(username, password);

  if (error) {
    setMsg(`❌ ${error.message}`);
    return;
  }

  setMsg("✅ Signed in!", true);
  window.location.href = "./profile.html";
});
