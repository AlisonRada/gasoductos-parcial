window.onload = function () {
	uid = localStorage.uid;
	id = localStorage.eid;
	this.cargarLista();

}

function cargarLista(){
	firebase.database().ref('/empresas/' + id).once('value').then(function(snapshot){
		empresa = snapshot.val().empresa;
		document.getElementById("hiUser").innerHTML = empresa;
		datos=snapshot.val().encuestas;
		document.getElementById('tabla_encuestas_jefe').innerHTML =""; 
		localStorage.eid = id;
		firebase.database().ref('/empleados/'+uid).once('value').then(function (imagen) {
			name = imagen.val().nombre;
			document.getElementById("persona").innerHTML = "Estado de encuestas de "+name;
			info = imagen.val().encuestas;
			for(var k in datos) {
				if (k != 'cantidad') {
					if (info[k].completado){
						puntuacion = info[k].puntaje;
						id_activo = "resultados.html?puntaje="+puntuacion;
						estado = "Completado";
					}else{
						id_activo = "examen.html?cuestionario="+k;
						puntuacion = "Por calificar";
						estado = "Sin realizar";
					}
					tabla_encuestas_jefe.innerHTML+=
					`
						<tr>
							<td>
								<a href=${id_activo}>${k}</a>
							</td>
							<td>
								${datos[k].titulo}
							</td>
							<td class="text-center">
								${estado}
							</td>
							<td class="text-center">
								${puntuacion}
							</td>
							<td class="text-center">
								<a  class="btn text-white bg-warning" onClick="_limpiar('${uid}', '${k}')">Borrar</a>
							</td>
						</tr>
					`;
				}
			 }			
		})
	 });
}

function _limpiar(identificador, cid){
	var updates = {};
	updates["/empleados/"+identificador+"/encuestas/"+cid+"/completado"]=0;
	updates["/empleados/"+identificador+"/encuestas/"+cid+"/puntaje"]=null;
	firebase.database().ref().update(updates);
	cargarLista();
}