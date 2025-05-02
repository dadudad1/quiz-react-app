import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCtac6l1fUX1nqM-o-oH0Kq35Qls7-NiTk",
  authDomain: "grileadmitere-30702.firebaseapp.com",
  projectId: "grileadmitere-30702",
  storageBucket: "grileadmitere-30702.firebasestorage.app",
  messagingSenderId: "433700636024",
  appId: "1:433700636024:web:20fea50c704b7005c8b48d",
  measurementId: "G-FLYLE3XMSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics }; 