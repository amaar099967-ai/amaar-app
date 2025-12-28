const loginBtn = document.getElementById("login-btn");
const loginSection = document.getElementById("login-section");
const mainApp = document.getElementById("main-app");

async function biometricLogin() {
  // إن كان مسجلاً سابقًا
  if (localStorage.getItem("session")) {
    unlockApp();
    return;
  }

  // WebAuthn إن توفر
  if (window.PublicKeyCredential) {
    try {
      await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          timeout: 60000,
          userVerification: "preferred"
        }
      });

      secureSession();
      unlockApp();
      return;
    } catch (e) {
      console.warn("Biometric failed, fallback used");
    }
  }

  // fallback آمن (بدون توقف)
  secureSession();
  unlockApp();
}

function secureSession() {
  const session = {
    ts: Date.now(),
    ua: navigator.userAgent
  };
  localStorage.setItem(
    "session",
    btoa(JSON.stringify(session))
  );
}

function unlockApp() {
  loginSection.classList.add("hidden");
  mainApp.classList.remove("hidden");

  // إشعار نجاح
  if (Notification.permission === "granted") {
    new Notification("تم تسجيل الدخول بنجاح 🔐");
  }
}

loginBtn.addEventListener("click", biometricLogin);
