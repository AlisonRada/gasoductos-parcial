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
	secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
}

myRegex = /image/;

$("#login").click(function() {
	event.preventDefault();
	logout();
	var email = document.getElementById('inputEmail').value;
	var password = document.getElementById('inputPassword').value;
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then(function(){
			firebase.database().ref(`empleados/${firebase.auth().currentUser.uid}`).once("value", snapshot => {
				if (snapshot.exists()){
					if (snapshot.val().habilitado) {
						window.location.href = "lista-encuestas.html";
						localStorage.uid = firebase.auth().currentUser.uid;
						localStorage.eid = null;						
					} else{
						Swal.fire({
							icon: 'error',
							title: 'Lo sentimos, no se encuentra habilitado para ingresar.',
						});						
					}
				} else{
					firebase.database().ref(`empresas/${firebase.auth().currentUser.uid}`).once("value", snapshot => {
						if (snapshot.exists()) {
							uid = firebase.auth().currentUser.uid;
							localStorage.eid = uid;
							localStorage.uid = null;
							window.location.href = "empresa.html";
						} else{
							Swal.fire({
								icon: 'error',
								title: 'Usuario no existe',
							});							
						}
					});
				}
			}); 
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
	file = document.querySelector('#foto').files[0];
	enterprise_name = $("#entName").val();
	photo_name = null;
	good = true;

	if (!ValidateEmail(username)) {
		good = false;
		Swal.fire({
			icon: 'error',
			title: 'El correo no corresponde con un formato válido.',
		});
	}else if (file!= undefined) {
		if (!myRegex.test(file.type)) {
			Swal.fire({
				icon: 'error',
				title: 'El archivo debe ser una imagen',
			});
			good = false
		}
	}
	if (good) {
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
		}); 
		
		
	
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
		
		logout();		
	}
});

function ValidateEmail(email){
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
	return true
	}
	return false
}

$("#signUpEmployee").click(function () { 
	const ref = secondaryApp.storage().ref();
	event.preventDefault();
	//Atributos del empleado
	username = $("#signUpEmployeeEmail").val();
	password = $("#passwdSignUpEmployee").val();
	nameEmployee = $("#nameEmployee").val();
	addressEmployee = $("#addressEmployee").val();
	nid = $("#idEmployee").val();
	file = document.querySelector('#fotoEmployee').files[0];
	photo_name = null;
	good = true;

	if (!ValidateEmail(username)) {
		good = false;
		Swal.fire({
			icon: 'error',
			title: 'El correo no corresponde con un formato válido.',
		});
	} else if (file!= undefined) {
		if (!myRegex.test(file.type)) {
			Swal.fire({
				icon: 'error',
				title: 'El archivo debe ser una imagen',
			});
			good = false
		}
	}
	if (good) {
		secondaryApp.auth().createUserWithEmailAndPassword(username, password)
		.then(function(user) {
			
			secondaryApp.auth().signInWithEmailAndPassword(username, password).then(function(user){
		
				secondaryApp.auth().onAuthStateChanged(function(user) {
					if (user) {
						uid = secondaryApp.auth().currentUser.uid;
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
						secondaryApp.database().ref("empleados/" + uid).set({
							"nombre": nameEmployee,
							"direccion": addressEmployee,
							"foto": photo_name,
							"empresa": localStorage.eid,
							"habilitado": 1,
							"tipo_id": $("#tipoEmployee").val(),
							"id": nid
						});
						secondaryApp.database().ref(`empresas/${localStorage.eid}/empleados/${uid}`).update({
							"email": username
						});                
					}
				});
				
				resetForm("signUpEmployeeForm");
				Swal.fire({
					icon: 'success',
					title: 'Empleado registrado, ya puede ingresar',
				});
			}).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
			});
			
			secondaryApp.auth().signOut().then(function() {
				//console.log("Salió");
			}).catch(function(error) {
				//console.log("No salió");
			});;
		
		}).catch(function(error) {
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
		
	}
	
});

function resetForm(name) {
	var frm = document.getElementsByName(name)[0];
	frm.reset();  // Reset
	$(`#${name}`).modal('dispose');
	return false; // Prevent page refresh
 }

$("#logout").click(function() {
	logout();
});

$("#passwdReset").click(function(){
	sendPasswordReset();
});

function logout(){
	localStorage.eid = null;
	localStorage.uid = null;
	firebase.auth().signOut().then(function() {
		//console.log("Cierro sesion");
	}).catch(function(error) {
	console.log("No cierro sesion");
	});;
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