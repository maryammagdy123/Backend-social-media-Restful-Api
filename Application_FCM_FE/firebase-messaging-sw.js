importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCbToS9n0RM_k3szHvLkJ9lxp7pAgpJOZM",
  authDomain: "social-media-app-be.firebaseapp.com",
  projectId: "social-media-app-be",
  storageBucket: "social-media-app-be.firebasestorage.app",
  messagingSenderId: "336132334007",
  appId: "1:336132334007:web:2902902dda6fd032740832",
  measurementId: "G-BJKMT0N7P4"
});

const messaging = firebase.messaging();

// ✅ Background Notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);

  self.registration.showNotification(
    payload.data?.title || "New Notification",
    {
      body: payload.data?.body || "You have a message",
      icon: "/firebase-logo.png"
    }
  );
});