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
    console.log(data.id)
    firebase.database().ref('/empresas/' + id).once('value').then(function(snapshot) {
        var name = (snapshot.val() && snapshot.val().empresa) || 'Anonymous';
        
        
        var responsable= "Representante: "+snapshot.val().representante;
        console.log(responsable)
        document.getElementById('empresa').innerHTML =name;
        document.getElementById('Nombre_Empresa').innerHTML =name;
        document.getElementById('representante').innerHTML =responsable;
      });

   /*    for (let i = 0; i < 10; i++) {
        firebase.database().ref("empresas/" + id+"/empleados/empleado "+i).set({
            "Nombre": "empleado "+i,
            "Foto":"Foto "+i,
            "Direccion":"Calle "+i**2,
            "contraseña": 123456,
            "Habilitado":1,
            
        });
         
     }  */
     this.cargarLista();

     
}
function cargarLista(){
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
                                        <span onClick="estado('${datos[k].Nombre}','${datos[k].Habilitado}')">${estado}</span>
                                        </td>
                                        <td class="text-center">
                                        <button  class="btn text-white bg-danger" onClick="_eliminar('${datos[k].Nombre}')">Eliminar</button>
                                         </td>
                                         <td class="text-center">
                                         <a  class="btn text-white bg-warning">Editar</a>
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
function estado(nombre,estado){
   
    var updates = {};
    if (estado==1) {
        updates["empresas/" + id+"/empleados/"+nombre+"/Habilitado"] = 0;
        firebase.database().ref().update(updates);
    }else{
        updates["empresas/" + id+"/empleados/"+nombre+"/Habilitado"] = 1;
        firebase.database().ref().update(updates);
    }
    cargarLista();
    
}
function _eliminar(nombre) {
    console.log("Eliminando a: "+nombre);
    firebase.database().ref("empresas/" + id+"/empleados/"+nombre).remove();
    cargarLista();
}