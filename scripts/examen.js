puntaje_max = 0;

window.onload = function () {
	//
	uid = localStorage.uid;
	console.log("uid: "+uid);
	//id del cuestionario
	cid = parseInt(params = document.location.href.split('=')[1]);
	//id de la empresa
	id = localStorage.eid;
	this.cargarCuestionario();
}


function cargarCuestionario(){
	puntaje_max = 0;

	firebase.database().ref('/empresas/' + id+"/encuestas/"+cid).once('value').then(function(snapshot){
		
		document.getElementById('cuestionario').innerHTML =""; 
		datos=snapshot.val();
		document.getElementById('titulo').innerHTML = datos.titulo;
		
		for (let question = 1; question < 6; question++) {
			q = 'q'+question;
			cuestionario.innerHTML+=
			`
			<!--Pregunta ${question}-->
			<div class="question" id="question-${question}">
				<h4>Pregunta ${question}</h4>
				<h2>${datos[q].enunciado}</h2>
			</div>
			`;

			
			elem = document.getElementById('question-'+question);
			
			for (let opcion = 1; opcion <= 4; opcion++) {
				op = 'op'+opcion;
				valor = 0;
				if (datos[q].respuesta == op) {
					valor = datos[q].valor;
					puntaje_max += parseInt(valor);
				}
				if (opcion === 1) { //default check
					elem.innerHTML +=
					`
						<div class="form-check">
							<label class="form-check-label">
								<input type="radio" class="form-check-input" value="${valor}" name="${q}" checked>${datos[q].opciones[op]}
							</label>
						</div>
					`					
				} else{
					elem.innerHTML +=
					`
						<div class="form-check">
							<label class="form-check-label">
								<input type="radio" class="form-check-input" value="${valor}" name="${q}">${datos[q].opciones[op]}
							</label>
						</div>
					`
				} //If-else
			} //for de adentro
			if (question===5) {
				elem.innerHTML += 
				`
					<div>
						<!--Submit button-->
						<button onclick="submitEncuesta()" class="btn mx-2 my-5 text-white bg-primary btn-block btn-lg">Enviar</button>
					</div>
				`
			}
		} //for de afuera
		console.log('Puntaje máximo: '+puntaje_max);
		return puntaje_max;
		
	});
	
}

$("#logo").click(function name(params) {
	window.location.href = "lista-encuestas.html";
});

function submitEncuesta() {
	event.preventDefault();
	console.log('submit');
	puntaje = getPuntuacion();
	console.log("Puntuacion: "+puntaje);	
	firebase.database().ref('/empleados/' + uid+"/encuestas/"+cid).update({
		"completado": 1,
		"puntaje": puntaje
	});
	window.location.href = "resultados.html?puntaje="+puntaje;
}

function getPuntuacion(){
	//Inicia con cero puntos
	calificacion = 0;
	for (let question = 1; question <= 5; question++) {
		q = 'q'+question;
		//Adiciono el valor que obtuve de la pregunta
		calificacion += getPuntos(q);
	}
	return calificacion/puntaje_max*100;
}

function getPuntos(name) { 
	var ele = document.getElementsByName(name); 
	for(i = 0; i < ele.length; i++) { 
		if(ele[i].checked){
			return parseInt(ele[i].value, 10);
		}
	}
} 

function showResultados(){
	
}