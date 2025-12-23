// frontend/js/auth.js
(function () {
  // Supabase client
  if (!window.supabase) {
    console.error("Supabase CDN not loaded. Make sure @supabase/supabase-js script is included.");
    return;
  }

  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY. Check frontend/js/config.js");
    return;
  }

  window.sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  // ---------- Nav UI ----------
  function setNavAuthUI(session) {
    const loginLink = document.getElementById("navLogin");
    const profileLink = document.getElementById("navProfile");
    const logoutBtn = document.getElementById("navLogout");

    if (!loginLink || !profileLink || !logoutBtn) return;

    if (session?.user) {
      loginLink.style.display = "none";
      profileLink.style.display = "inline-block";
      logoutBtn.style.display = "inline-block";
    } else {
      loginLink.style.display = "inline-block";
      profileLink.style.display = "none";
      logoutBtn.style.display = "none";
    }
  }

  async function refreshNav() {
    const { data } = await window.sb.auth.getSession();
    setNavAuthUI(data.session);
  }

  // Logout handler
  window.addEventListener("click", async (e) => {
    const btn = e.target.closest("#navLogout");
    if (!btn) return;
    e.preventDefault();
    await window.sb.auth.signOut();
    await refreshNav();
    // optional redirect:
    window.location.href = "./login.html";
  });


  async function protectIfNeeded() {
    const requires = document.body?.dataset?.requiresAuth === "true";
    if (!requires) return;

    const { data } = await window.sb.auth.getSession();
    if (!data.session?.user) {
      window.location.href = "./login.html";
    }
  }

  window.getCurrentUsername = async function getCurrentUsername() {
    const { data } = await window.sb.auth.getSession();
    const user = data.session?.user;
    if (!user) return null;

    // Try profiles
    const { data: prof } = await window.sb
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    return prof?.username || user.email || "User";
  };

  // Initial
  protectIfNeeded();
  refreshNav();

  // Update nav on auth changes
  window.sb.auth.onAuthStateChange((_event, session) => {
    setNavAuthUI(session);
  });
})();
