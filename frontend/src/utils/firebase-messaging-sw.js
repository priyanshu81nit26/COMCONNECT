importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
 apiKey: "AIzaSyC2ZYTLEBAcMvmYa5fhQdDoUrcWa9YzdTA",
authDomain: "comconnect-2b1d7.firebaseapp.com",
projectId: "comconnect-2b1d7",
messagingSenderId: "854170103458",
appId: "1:854170103458:web:9661dd687bcdf4e12db1fb"
});
 

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  
  self.registration.showNotification(title, {
    body,
    icon: '/icon.png',
    badge: '/badge.png'
  });
}); 