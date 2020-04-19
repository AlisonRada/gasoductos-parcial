function init_firebase() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBA5AswB_u60GcSAUjUlhxQdSyzhnQwZIQ",
        authDomain: "gasoducto-baq-parcial.firebaseapp.com",
        databaseURL: "https://gasoducto-baq-parcial.firebaseio.com",
        projectId: "gasoducto-baq-parcial",
        storageBucket: "gasoducto-baq-parcial.appspot.com",
        messagingSenderId: "847401181410",
        appId: "1:847401181410:web:1b155f51fb90da30cf7ebb"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

myRegex = /image/;

$("#login").click(function() {
    event.preventDefault();
    logout();
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(){
            window.location.href = "lista-operarios.html"; 
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            switch (errorCode) {
                case 'auth/wrong-password':
                    message = 'Contraseña incorrecta.';
                  break;
                case 'auth/user-not-found': // foo es 0, por lo tanto se cumple la condición y se ejecutara el siguiente bloque
                    message = 'Usuario no existe.';
                    break;
                case 'auth/invalid-email':
                    message = 'El email ingresado no corresponde con un formato válido.';
                    break; // Al encontrar un "break", no será ejecutado el 'case 2:'
                default:
                    console.log(errorCode);
                    message = errorMessage;
            }
            Swal.fire({
                icon: 'error',
                title: message,
            });
        });
});

$("#signup").click(function() {
    const ref = firebase.storage().ref();
    event.preventDefault();
    username = $("#signUpEmail").val();
    password = $("#passwdSignUp").val();
    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
    // autenticacion con firebase
    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorMessage);
    });
    
    file = document.querySelector('#foto').files[0];
    enterprise_name = $("#entName").val();
    photo_name = null;

    if(file!=undefined){
        if(myRegex.test(file.type)){
            photo_name = enterprise_name
            const metadata = { contentType: file.type };
            
            const task = ref.child(enterprise_name).put(file, metadata);
            task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .catch(console.error);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'El archivo debe ser una imagen',
            });            
        }
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = firebase.auth().currentUser.uid;
            firebase.database().ref("empresas/" + uid).set({
                "representante": $("#nameUser").val(),
                "tipo_id": $("#tipo").val(),
                "nid": $("#id").val(),
                "empresa": enterprise_name,
                "foto": photo_name
            });
        }
    });
    Swal.fire({
        icon: 'success',
        title: 'Empresa registrada, ya puede ingresar',
    });
});

$("#logout").click(function() {
    logout();
});

$("#passwdReset").click(function(){
    sendPasswordReset();
});

function logout(){
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
}

function sendPasswordReset() {
    var email = document.getElementById('inputEmail').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        Swal.fire({
            icon: 'success',
            title: 'El correo electrónico de restablecimiento de contraseña fue enviado. Por favor, verificar.',
        });  
      // [END_EXCLUDE]
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            errorMessage = 'El email ingresado no corresponde con un formato válido.';
        } else if (errorCode == 'auth/user-not-found') {
            errorMessage = 'Usuario no existe.';
        }
        Swal.fire({
            icon: 'error',
            title: errorMessage,
        }); 
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}