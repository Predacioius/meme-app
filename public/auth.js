
  document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.getElementById("authTabs");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const signupTabBtn = document.getElementById("signupTabBtn");
    const loginTabBtn = document.getElementById("loginTabBtn");
    const launchBtn = document.getElementById("launchBtn");

    const params = new URLSearchParams(window.location.search);
    const forceWeb = params.get("mode") === "web";
    const isLocal = (window.location.protocol === "file:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

    const showSignup = true;


    function setTab(which) {
      const allTabs = tabs.querySelectorAll(".auth-tab");
      allTabs.forEach(b => b.classList.remove("active"));

      if (which === "signup" && showSignup) {
        signupTabBtn.classList.add("active");
        signupForm.classList.add("active");
        signupForm.style.display = "";
        loginForm.classList.remove("active");
        loginForm.style.display = "none";
      } else {
        loginTabBtn.classList.add("active");
        loginForm.classList.add("active");
        loginForm.style.display = "";
        signupForm.classList.remove("active");
        signupForm.style.display = "none";
      }
    }

    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".auth-tab");
      if (!btn) return;
      const tab = btn.getAttribute("data-tab");
      setTab(tab);
    });

        async function postJSON(url, payload) {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload)
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = data && data.error ? data.error : "Request failed";
        throw new Error(msg);
      }
      return data;
    }

    function showWelcome(name) {
      const d = document.createElement('div');
      d.textContent = `Welcome ${name}`;
      d.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#2e7d32; color:#fff; padding:12px 24px; border-radius:30px; z-index:99999; font-size:16px; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.2); opacity:1; transition:opacity 0.5s ease;";
      document.body.appendChild(d);
      
      setTimeout(() => {
        d.style.opacity = "0";
        setTimeout(() => d.remove(), 500);
      }, 3000);
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (window.location.protocol === "file:") {
        launchBtn.click();
        return;
      }

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPass").value;

      try {
        const response = await postJSON("/api/auth/login", { email, password });
        showWelcome(response.user.name);
        launchBtn.click();
      } catch (err) {
        let errNode = document.getElementById("loginErrorText");
        if (!errNode) {
          errNode = document.createElement("div");
          errNode.id = "loginErrorText";
          errNode.style.color = "red";
          errNode.style.marginTop = "10px";
          loginForm.appendChild(errNode);
        }
        errNode.innerText = err.message || "Login failed";
      }
    });

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (window.location.protocol === "file:") {
        launchBtn.click();
        return;
      }

      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const pass = document.getElementById("signupPass").value;
      const confirm = document.getElementById("signupPassConfirm").value;

      let errNode = document.getElementById("signupErrorText");
      if (!errNode) {
        errNode = document.createElement("div");
        errNode.id = "signupErrorText";
        errNode.style.color = "red";
        errNode.style.marginTop = "10px";
        signupForm.appendChild(errNode);
      }

      if (pass !== confirm) {
        errNode.innerText = "Passwords do not match.";
        document.getElementById("signupPassConfirm").focus();
        return;
      }

      try {
        const response = await postJSON("/api/auth/signup", { name, email, password: pass });
        showWelcome(response.user.name);
        launchBtn.click();
      } catch (err) {
        errNode.innerText = err.message || "Signup failed";
      }
    });



const appWrapper = document.getElementById("app-wrapper");
if (appWrapper) appWrapper.style.display = "none";

(async () => {
if (window.location.protocol === "file:") {
if (appWrapper) appWrapper.style.display = "";
setTab("login");
return;
}

try {
const r = await fetch("/api/auth/me", { credentials: "same-origin" });
const d = await r.json().catch(() => null);
if (d && d.success) {
showWelcome(d.user.name);
launchBtn.click();
return;
}
} catch (e) {
}

if (appWrapper) appWrapper.style.display = "";
setTab("login");
})();

  });
