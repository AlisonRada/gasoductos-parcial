id="bL7rZpf7uxWhxD1iAa8DDMbBFRa2"
uid="1";
window.onload = function () {

	firebase.database().ref('/empresas/' + id + '/empleados/'+uid).once('value').then(function(snapshot) {
		var name = (snapshot.val() && snapshot.val().Nombre) || 'Anonymous';
		document.getElementById('nombre_employee').innerHTML = name;
	});

	this.cargarLista();
}

function cargarLista(){
	firebase.database().ref('/empresas/' + id+"/encuestas/").once('value').then(function(snapshot){
	   
		datos=snapshot.val();
		cant_encuestas=0;
		document.getElementById('tabla_encuestas').innerHTML ="";  
		for(var k in datos) {
			cant_encuestas++;
			tabla_encuestas.innerHTML+=
			`
				<tr>
					<td>
						${k}
					</td>
					<td>
						${datos[k].titulo}
					</td>
					<td class="text-center">
						${datos[k].tiempo} minutos
					</td>
					<td class="text-center">
						Sin hacer
					</td> 
				</tr>
			`;
		 }
		 document.getElementById('cant_encuestas').innerHTML ="Cantidad de encuestas: "+cant_encuestas;
	 });
}