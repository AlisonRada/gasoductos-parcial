id = "";
estado = {};

window.onload = function () {
	uid=localStorage.uid;
	//console.log("id empleado: "+uid);
	firebase.database().ref('/empleados/'+uid).once('value').then(function(snapshot){
		registro = snapshot.val();
		var name = registro['nombre'];
		document.getElementById('hiUser').innerHTML = "Hola, "+name;
		id = registro['empresa'];
		cargarLista();
	});
}

function cargarLista(){
	firebase.database().ref('/empresas/' + id+"/encuestas/").once('value').then(function(snapshot){
		datos=snapshot.val();
		document.getElementById('tabla_encuestas').innerHTML =""; 
		localStorage.eid = id;
		//console.log("id empresa cargar lista: "+localStorage.eid);
		firebase.database().ref('/empleados/'+uid+'/encuestas/').once('value').then(function (imagen) {
			
			info = imagen.val();
			for(var k in datos) {
				if (k != 'cantidad') {
					estado = "Sin realizar";
					if (info[k].completado){
						puntuacion = info[k].puntaje;
						id_activo = "resultados.html?puntaje="+puntuacion;
						estado = "Completado";
					}else{
						id_activo = "examen.html?cuestionario="+k;
						puntuacion = "Por calificar";
					}
					tabla_encuestas.innerHTML+=
					`
						<tr>
							<td>
								<a href=${id_activo}>${k}</a>
							</td>
							<td>
								${datos[k].titulo}
							</td>
							<td class="text-center">
								${datos[k].tiempo} minutos
							</td>
							<td class="text-center">
								${estado}
							</td>
							<td class="text-center">
								${puntuacion}
							</td>  
						</tr>
					`;
				}
			 }			
		})
	 });
}