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
            firebase.database().ref(`empresas/${firebase.auth().currentUser.uid}`).once("value", snapshot => {
                if (snapshot.exists()){
                    window.location.href = "lista-operarios.html";
                } else{
                    window.location.href = "lista-encuestas.html";
                }
            });
            resetForm("signUpForm");
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
    resetForm("signUpForm");

    Swal.fire({
        icon: 'success',
        title: 'Empresa registrada, ya puede ingresar',
    });
});

//No funciona correctamente
$("#signUpEmployee").click(function () { 
    const ref = firebase.storage().ref();
    event.preventDefault();
    username = $("#signUpEmployeeEmail").val();
    password = $("#passwdSignUpEmployee").val();
    nameEmployee = $("#nameEmployee").val();
    addressEmployee = $("#addressEmployee").val();
    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
            Swal.fire({
                icon: 'error',
                title: 'El correo electrónico ya se encuentra en uso',
            });
        } else{
            console.log(errorCode);
            console.log(errorMessage);
        }
    });

    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    });

    file = document.querySelector('#fotoEmployee').files[0];
    photo_name = null;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = firebase.auth().currentUser.uid;
            if (uid != localStorage.eid) {
                if(file!=undefined){
                    if(myRegex.test(file.type)){
                        photo_name = uid;
                        const metadata = { contentType: file.type };
                        
                        const task = ref.child(uid).put(file, metadata);
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
                firebase.database().ref("empleados/" + uid).set({
                    "nombre": nameEmployee,
                    "direccion": addressEmployee,
                    "foto": photo_name,
                    "empresa": localStorage.eid,
                    "habilitado": 1
                });
                firebase.database().ref(`empresas/${localStorage.eid}/empleados/${uid}`).update({
                    "email": username
                });                
            }
        }
    });
    resetForm("signUpEmployeeForm");
    Swal.fire({
        icon: 'success',
        title: 'Empleado registrado, ya puede ingresar',
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

function resetForm(name) {
    var frm = document.getElementsByName(name)[0];
    frm.reset();  // Reset
    frm.modal('dispose');
    return false; // Prevent page refresh
 }

async function sendPasswordReset() {
    const { value: email } = await Swal.fire({
        title: 'Ingresa el correo electrónico',
        input: 'email',
        inputPlaceholder: 'ejemplo@correo.com',
        showCloseButton: true
    }) 
    if (email) {
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
            if (errorCode == 'auth/user-not-found') {
                errorMessage = 'Usuario no existe.';
            }
            Swal.fire({
                icon: 'error',
                title: errorMessage,
            }); 
            // [END_EXCLUDE]
        });
        // [END sendpasswordemail];        
    } else {
        Swal.fire({
            icon: 'error',
            title: 'El correo electrónico ingresado no corresponde con un formato válido.',
        });          
    }
}