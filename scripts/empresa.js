
id="";
window.onload = function () {
    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
         }
        
    id=data.id;
    console.log(id);

    this.crearEncuesta();
    
    firebase.database().ref('/empresas/' + id).once('value').then(function(snapshot) {
        var name = (snapshot.val() && snapshot.val().empresa) || 'Anonymous';
        
        
        var responsable= "Representante: "+snapshot.val().representante;
        console.log(responsable)
        document.getElementById('empresa').innerHTML =name;
        document.getElementById('Nombre_Empresa').innerHTML =name;
        document.getElementById('representante').innerHTML =responsable;
      });

/*  for (let i = 1; i < 11; i++) {
        firebase.database().ref("empresas/" + id+"/empleados/"+i**5).set({
            "Nombre": "empleado "+i,
            "Foto":"Foto "+i,
            "Direccion":"Calle "+i**2,
            "contraseña": 123456,
            "Habilitado":i%2,
            "id":i**5,
        });
         
     }   */
    

     
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
        console.log(datos); 
        cant_empleados=0;
        document.getElementById('tabla').innerHTML ="";  
        for(var k in datos) {
            cant_empleados++;
            if (datos[k].Habilitado==1) {
            var estado='<span class="text-white bg-success">Habilitado</span>';
            } else {
            var estado= '<span class="text-white bg-secondary">No Habilitado</span>' ; 
            }
            
        tabla.innerHTML+=   `
        <tr>
										<td>
											<img src="../assets/img/gallina.png" alt="">
											${datos[k].Nombre}
											
										</td>
										<td class="text-center">
											${datos[k].Direccion}
										</td>
										<td class="text-center">
											${datos[k].contraseña}
										</td>
                                        <td class="text-center">
                                        <span onClick="estado('${datos[k].id}','${datos[k].Habilitado}')">${estado}</span>
                                        </td>
                                        <td class="text-center">
                                        <button  class="btn text-white bg-danger" onClick="_eliminar('${datos[k].id}')">Eliminar</button>
                                         </td>
                                         <td class="text-center">
                                         <a  class="btn text-white bg-warning"  data-toggle="modal" data-target="#myModal" onClick="_editar('${datos[k].id}','${datos[k].Nombre}','${datos[k].contraseña}','${datos[k].Direccion}')">Editar</a>
                                          </td>
										
										<td style="width: 15%;" class="text-center">
											<a href="evaluacion.html" class="btn text-white bg-primary">Do test</a>
										</td>
									</tr>
      `;
      

        
         }
         document.getElementById('cant_empleados').innerHTML ="Cantidad de empleados: "+cant_empleados;
     });
}
function crearEncuesta(){
    console.log("Entra");
    encuesta=document.getElementById('crearEncuesta');
    encuesta.innerHTML= `
    <div class="card card-body">
        <form>`
    for (let i = 1; i <6; i++) {
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
    encuesta.innerHTML+= `
    <button type="button" onClick="subirEncuesta()" class="btn btn-primary">Crear</button>
      </form>
</div>`
    
}
function subirEncuesta(){
    firebase.database().ref('/empresas/' + id+"/encuestas").once('value').then(function(snapshot) {
        cantidad=0;   
        updates={};
        if(snapshot.hasChild("empresas/"+id+"/encuestas/cantidad")){
            
            cantidad=snapshot.cantidad;
            }else{
                cantidad=1;
            
            }
            updates["empresas/" + id+"/encuestas/cantidad"] = cantidad;
            for (let i = 1; i < 6; i++) {
                
                
                
                for (let j = 1; j < 5; j++) {
                    console.log("empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/opciones/op"+j);
                    updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/opciones/op"+j] = document.getElementById('op'+j+'P'+i).value;
                }
                correcta=document.getElementById('correcta'+i);
                valor=document.getElementById('valor'+i);
                updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/enunciado"] = document.getElementById('enun'+i).value;
                updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/respuesta"] =correcta.options[correcta.selectedIndex].value ; 
                updates["empresas/" + id+"/encuestas/"+cantidad+"/q"+i+"/valor"] = valor.options[valor.selectedIndex].value;   
                firebase.database().ref().update(updates);
    
            }


    });
    


}
function estado(identificador,estado){
   
    var updates = {};
    if (estado==1) {
        updates["empresas/" + id+"/empleados/"+identificador+"/Habilitado"] = 0;
        firebase.database().ref().update(updates);
    }else{
        updates["empresas/" + id+"/empleados/"+identificador+"/Habilitado"] = 1;
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
    updates["empresas/" +id+"/empleados/"+identificador+"/Nombre"]=document.getElementById('edit_nombre').value.toString();
    
    updates["empresas/" +id+"/empleados/"+identificador+"/Direccion"]=document.getElementById('edit_direccion').value.toString();
   
    updates["empresas/" +id+"/empleados/"+identificador+"/contraseña"]=document.getElementById('edit_contraseña').value.toString();
    firebase.database().ref().update(updates);
    cargarLista();

}
function _eliminar(identificador) {
    
    
    firebase.database().ref("empresas/" + id+"/empleados/"+identificador).remove();
    cargarLista();
}