const firebaseConfig = {
  apiKey: "AIzaSyCbToS9n0RM_k3szHvLkJ9lxp7pAgpJOZM",
  authDomain: "social-media-app-be.firebaseapp.com",
  projectId: "social-media-app-be",
  storageBucket: "social-media-app-be.firebasestorage.app",
  messagingSenderId: "336132334007",
  appId: "1:336132334007:web:2902902dda6fd032740832",
  measurementId: "G-BJKMT0N7P4"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export { messaging };