importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js")

firebase.initializeApp(
    {
        apiKey: "AIzaSyDcVMlPAXULZsnuptCIjw1AkeFS7IjG5W4",
        authDomain: "escudo-test.firebaseapp.com",
        projectId: "escudo-test",
        storageBucket: "escudo-test.appspot.com",
        messagingSenderId: "140694630202",
        appId: "1:140694630202:web:299b2e06614901c53baa03",
        measurementId: "G-P1VS5JFYHQ"
    }
)

const messaging = firebase.messaging();

