import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1Fho5b99jL4-H4j_OFtSKmt8TV1X2PdM",
  authDomain: "greatchem12.firebaseapp.com",
  projectId: "greatchem12",
  storageBucket: "greatchem12.firebasestorage.app",
  messagingSenderId: "1083119029036",
  appId: "1:1083119029036:web:596c450f7ba58138767a89",
  measurementId: "G-MX4CCYK774"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ambil userId
const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");

console.log("Haloo Gess");
document.getElementById("uid-display").innerText =
  userId ? `User ID: ${userId}` : "User ID tidak ditemukan";

if (userId) localStorage.setItem("firebaseUserId", userId);

// inisialisasi data user di firestore
async function initUser() {
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // buat dokumen baru dengan default false
    await setDoc(userRef, {
      level1: false,
      level2: false,
      level3: false,
      level4: false,
    });
    return { level1: false, level2: false, level3: false, level4: false };
  }
  return snap.data();
}

// atur tampilan tombol berdasarkan progress
function updateUI(levels) {
  const maxUnlocked = Object.values(levels).lastIndexOf(true) + 1;
  // jika semua false, hanya level 1 yang aktif
  let allowed = maxUnlocked === 0 ? 1 : maxUnlocked + 1;

  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById(`level${i}`);
    if (i <= allowed) {
      btn.classList.remove("locked");
      btn.onclick = () => window.startGame(i);
    } else {
      btn.classList.add("locked");
      btn.onclick = null;
    }
  }
}

// init
(async () => {
  const levels = await initUser();
  if (levels) updateUI(levels);
})();