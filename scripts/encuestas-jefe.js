
window.onload = function () {
	const $bell = document.getElementById('notification');
	$bell.addEventListener("animationend", function(event){
	$bell.classList.remove('notify');
	});
	uid = localStorage.uid;
	//id = localStorage.eid;
	this.cargarLista();

}

/* firebase.database().ref('empresas/'+id+'/historial').on('child_added',function(snapshot){

	empleado=snapshot.val().Empleado;
	idempleado=empleado+"";

	
	cuestionario= snapshot.val().cuestionario;
	firebase.database().ref('/empleados/'+empleado).once('value').then(function(snapshot2){
		nombre=snapshot2.val().nombre;
		resultado=snapshot2.val().encuestas[cuestionario].puntaje;
	 
		document.getElementById('historial_body').innerHTML+= `
		<tr>
					  <th scope="row">${nombre}</th>
					  <td>P${cuestionario}</td>
					  <td>${resultado}</td>
					  <td style="width: 15%;" class="text-center">
						<a onClick="verResultados('${idempleado}')" class="btn text-white bg-primary">Ver</a>
					  </td> 
					</tr>
					`


	});

	this.aumentarNotis();
	Push.create("Cuestionario realizada", {
		body: "Uno de sus empleados ha realizado una encuesta'?",
		icon: '/assets/img/natural gas.svg',
		timeout: 4000,
		onClick: function () {
			window.focus();
			this.close();
		}
	});
	



}); */

function cargarLista(){
	firebase.database().ref('/empresas/' + id).once('value').then(function(snapshot){

		fotoEmpresa = snapshot.val().foto || 'default.jpg';
		storage = firebase.storage();
		storageRef = storage.ref();
		tangRef = storageRef.child(fotoEmpresa);

		var responsable= "Representante: "+snapshot.val().representante;
		document.getElementById('hiUser').innerHTML = name;
		document.getElementById('Nombre_Empresa').innerHTML = snapshot.val().empresa || 'Empresa';
		document.getElementById('cant_encuestas').innerHTML = "Cantidad de encuestas: "+snapshot.val().encuestas.cantidad;
		document.getElementById('representante').innerHTML =responsable;

		tangRef.getDownloadURL().then(function(url) {
			// Once we have the download URL, we set it to our img element
			document.getElementById('fotoPerfil').src = url;
		}).catch(function(error) {
			// If anything goes wrong while getting the download URL, log the error
			console.error(error);
		});

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