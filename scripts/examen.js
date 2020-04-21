id = "bL7rZpf7uxWhxD1iAa8DDMbBFRa2";
cid = 1;
puntaje_max = 0;

window.onload = function () {
	this.cargarCuestionario();
}


function cargarCuestionario(){
	puntaje_max = 0;

	firebase.database().ref('/empresas/' + id+"/encuestas/"+cid).once('value').then(function(snapshot){
		
		document.getElementById('cuestionario').innerHTML =""; 
		datos=snapshot.val();
		document.getElementById('titulo').innerHTML = datos.titulo;
		console.log(datos['q1'].opciones);
		
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
					puntaje_max += valor;
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
						<button id="submit-encuesta" href="results.html" class="btn mx-2 my-5 text-white bg-primary btn-block btn-lg">Enviar</button>
					</div>
				`
			}
		} //for de afuera
		
	});
	console.log('Puntaje máximo');
	console.log(puntaje_max);
	return puntaje_max;
}

$("#submit-encuesta").click(function() {
	console.log('No escribeeee');
	console.log(getPuntuacion());
});

function getPuntuacion(){
	calificacion = 0;
	for (let question = 1; question <= 5; question++) {
		q = 'q'+question;
		calificacion += getPuntos(q);
	}
	return calificacion;
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