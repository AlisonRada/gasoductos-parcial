
id = this.localStorage.eid
const $bell = document.getElementById('notification');
const count = Number($bell.getAttribute('data-count')) || 0;

window.onload = function () {
    
    const $bell = document.getElementById('notification');



$bell.addEventListener("animationend", function(event){
  $bell.classList.remove('notify');
});


    




	
	console.log(id);
	this.cargarLista()
	this.crearEncuesta();
   
	firebase.database().ref('/empresas/' + id).once('value').then(function(snapshot) {
		var name = (snapshot.val() && snapshot.val().empresa) || 'Anonymous';
		
		
		var responsable= "Representante: "+snapshot.val().representante;
		console.log(responsable)
		document.getElementById('empresa').innerHTML =name;
		document.getElementById('Nombre_Empresa').innerHTML =name;
		document.getElementById('representante').innerHTML =responsable;
	  });    
}

function aumentarNotis(){
    
  
    $bell.setAttribute('data-count', count + 1);
    $bell.classList.add('show-count');
    $bell.classList.add('notify');
}
console.log('empresas/'+id+'/historial')
firebase.database().ref('empresas/'+id+'/historial').on('child_added',function(snapshot){

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



    console.log(snapshot.val());
    this.aumentarNotis();
    Push.create("Se contestó una encuesta", {
        body: "la contestó el vale yatusabes'?",
        icon: '/assets/img/natural gas.svg',
        timeout: 4000,
        onClick: function () {
            window.focus();
            this.close();
        }
    });
    



});


function limpiarHistorial(){
    firebase.database().ref("/empresas/"+id+"/historial").remove();
    $bell.setAttribute('data-count', 0);
    document.getElementById('historial_body').innerHTML="";


}


function cargarLista(){
	encabezado=document.getElementById("lista_operarios");
				encabezado.innerHTML=	`
				<h3>Lista de operarios</h3>
				<div class="row">
				<div class="col-lg-12">
					<div class="main-box clearfix">
						<div class="table-responsive">
							<table  class="table user-list table-hover">
								<thead>
									<tr>
										<th><span>Persona</span></th>
										<th><span>Direccion</span></th>
										<th><span>Contraseña</span></th>
										<th class="text-center"><span>Estado</span></th>
										<th><span>Eliminar</span></th>
										<th><span>Editar</span></th>
										<th>&nbsp;</th>
									</tr>
								</thead>
								<tbody id="tabla">
									
								</tbody>
							</table>
						</div>
						
					</div>
				</div>
			</div>`
	firebase.database().ref('/empresas/' + id+"/empleados").once('value').then(function(snapshot){
		datos=snapshot.val();
		cant_empleados=0;
		document.getElementById('tabla').innerHTML ="";  
		for(var k in datos) {
			escribirUsuario(k);
			cant_empleados++;        
		 }
		 document.getElementById('cant_empleados').innerHTML ="Cantidad de empleados: "+cant_empleados;
	 });
}
function escribirUsuario(id){
	firebase.database().ref('/empleados/'+id).once('value').then(function(snapshot){
		empleado=snapshot.val();
		console.log(empleado);
		if (empleado.habilitado==1) {
			var estado='<span class="text-white bg-success">Habilitado</span>';
			} else {
			var estado= '<span class="text-white bg-secondary">No Habilitado</span>' ; 
			}
			
		tabla.innerHTML+=   `
		<tr>
										<td>
											<img src="../assets/img/gallina.png" alt="">
											${empleado.nombre}
											
										</td>
										<td class="text-center">
											${empleado.direccion}
										</td>
										<td class="text-center">
											*******
										</td>
										<td class="text-center">
										<span onClick="estado('${id}','${empleado.habilitado}')">${estado}</span>
										</td>
										<td class="text-center">
										<button  class="btn text-white bg-danger" onClick="_eliminar('${id}')">Eliminar</button>
										 </td>
										 <td class="text-center">
										 <a  class="btn text-white bg-warning"  data-toggle="modal" data-target="#myModal" onClick="_editar('${id}','${empleado.nombre}','*****','${empleado.direccion}')">Editar</a>
										  </td>
										
										<td style="width: 15%;" class="text-center">
											<a onClick="verResultados('${id}')" class="btn text-white bg-primary">Ver resultados</a>
										</td> 
									</tr>
	  `;

	});
}

function crearEncuesta(){
	encuesta=document.getElementById('formEncuesta');
	encuesta.innerHTML+=
	`
		<div class="form-group">
			<label for="inputAddress" >Nombre del cuestionario</label>
			<input type="text" value="Titulo" class="form-control" id="tituloEncuesta" placeholder="Titulo de encuesta">
		</div>
		<div class="form-group">
			<label for="inputAddress" >Duración aproximada</label>
			<input type="text" value="10" class="form-control" id="tiempoEncuesta" placeholder="Tiempo aproximado en minutos">
		</div>
	`
	for (let i = 1; i <= 5; i++) {
		encuesta.innerHTML+= `
		<div class="form-group">
			<label for="inputAddress" >Enunciado #${i}</label>
			<input type="text" value="prueba" class="form-control" id="enun${i}" placeholder="¿Le gusta la cañandoga?">
		</div>
		<div class="form-row">
		  <div class="form-group col-md-3">
			<input type="text" class="form-control" value="respuesta1" id="op1P${i}" placeholder="opción 1">
		  </div>
		  <div class="form-group col-md-3">
			<input type="text" class="form-control" value="respuesta2" id="op2P${i}" placeholder="opción 2">
		  </div>
		  <div class="form-group col-md-3">
			<input type="text" class="form-control" value="respuesta3" id="op3P${i}" placeholder="opción 3">
		  </div>
		  <div class="form-group col-md-3">
			<input type="text" class="form-control" value="respuesta4" id="op4P${i}" placeholder="opción 3">
		  </div>
		</div>
		<div class="row">
			<div class="col-md-3">
			  <label class="mr-sm-2" for="inlineFormCustomSelect">Respuesta correcta</label>
			  <select class="custom-select mr-sm-2" id="correcta${i}">
			   <option value="op1">Opción 1</option>
				<option value="op2">Opción 2</option>
				<option value="op3">Opción 3</option>
				<option value="op4">Opción 4</option>
			  </select>
			</div>
		  
		  <div class="col-md-3">
			<label class="mr-sm-2" for="inlineFormCustomSelect">Valor de la pregunta</label>
			<select class="custom-select mr-sm-2" id="valor${i}">
			 <option value="1">1</option>
			  <option value="2">2</option>
			  <option value="3">3</option>
			</select>
		  </div>
		</div>
		`
	}	
}
function subirEncuesta(){
	firebase.database().ref('/empresas/' + id+"/encuestas").once('value').then(function(snapshot) {
		console.log('Estoy aquí')
		cantidad=0;
		updates={};
		if(snapshot.hasChild("1")){
			cantidad = snapshot.val()["cantidad"]+1;
		}else{
			cantidad = 1;
		}
	
			updates["empresas/" + id+"/encuestas/cantidad"] = cantidad;
			updates["empresas/" + id+"/encuestas/"+cantidad+"/titulo"] = document.getElementById('tituloEncuesta').value;
			updates["empresas/" + id+"/encuestas/"+cantidad+"/tiempo"] = document.getElementById('tiempoEncuesta').value;
			//Cuestionarios de 5 preguntas
			for (let i = 1; i <= 5; i++) {
				//Pregunta con 4 opciones
				for (let j = 1; j <= 4; j++) {
					updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/opciones/op"+j] = document.getElementById('op'+j+'P'+i).value;
				}
				correcta=document.getElementById('correcta'+i);
				valor=document.getElementById('valor'+i);
				updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/enunciado"] = document.getElementById('enun'+i).value;
				updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/respuesta"] =correcta.options[correcta.selectedIndex].value ; 
				updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/valor"] = valor.options[valor.selectedIndex].value;   
				firebase.database().ref().update(updates);
			}
			asignarAEmpleados(id);
	});
	Swal.fire({
		icon: 'success',
		title: 'La encuesta se ha creado.',
	}); 
}

function verResultados(id){
    window.location.href = "lista-encuestas-jefe.html";
    localStorage.uid = id;
}


function asignarAEmpleados(id){
	firebase.database().ref('/empresas/' + id+"/empleados").once('value').then(function(snapshot){
		datos=snapshot.val();
		console.log(datos);
		for (k in datos) {
			console.log("empleados/" + k+"/encuestas/"+cantidad+"/completado");
			updates["empleados/" + k+"/encuestas/"+cantidad+"/completado"]=0;
			firebase.database().ref().update(updates);
			}
	 });
}

function estado(identificador,estado){
   
	var updates = {};
	if (estado==1) {
		updates["empleados/" + identificador+"/habilitado"] = 0;
		firebase.database().ref().update(updates);
	}else{
		updates["empleados/" + identificador+"/habilitado"] = 1;
		firebase.database().ref().update(updates);
	}
	cargarLista();
	
}
function _editar(identificador,nombre,contraseña,direccion){
	console.log(contraseña);
	document.getElementById('edit_nombre').value=nombre;
	document.getElementById('edit_direccion').value=direccion;
	document.getElementById('edit_contraseña').value=contraseña;
	document.getElementById('guardar_cambios').innerHTML=`<button type='button' data-dismiss="modal" class='btn btn-primary' onClick="_guardar('${identificador}')">Save changes</button>`
}
function _guardar(identificador){
	var updates = {};
	updates["/empleados/"+identificador+"/nombre"]=document.getElementById('edit_nombre').value.toString();
	
	updates["/empleados/"+identificador+"/direccion"]=document.getElementById('edit_direccion').value.toString();
   
	updates["/empleados/"+identificador+"/contraseña"]=document.getElementById('edit_contraseña').value.toString();
	firebase.database().ref().update(updates);
	cargarLista();

}
function _eliminar(identificador) {
	firebase.database().ref("/empleados/"+identificador).remove();
	cargarLista();
}