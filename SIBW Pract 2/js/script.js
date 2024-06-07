const boton_abrir = document.getElementById('boton_comentarios');
const barra_comentarios = document.getElementById('barra_comentarios');
const boton_cerrar = document.getElementById('boton_cerrar');
const boton_añadir = document.getElementById('boton_añadir');
var prohibidas = ["basura", "tonto", "bulo", "mentira", "retraso", "gilipollas", "idiota", "puta"];

boton_abrir.addEventListener('click', ()=>{   //CUANDO PULSAMOS EL BOTON DE ABRIR APARECEN LOS COMENTARIOS(APARECEN DEBAJO POR UNA CONFUSIÓN)
  barra_comentarios.style.display = "inline-block";   //PREGUNTÉ POR LA CONFUSIÓN POR CORREO Y NO HUBO PROBLEMA
  boton.style.display = "none";
});

boton_cerrar.addEventListener('click', ()=>{    //CUANDO PULSAMOS EL DE CERRRAR DESAPARECEN
  barra_comentarios.style.display = "none";
  boton.style.display = "inline-block";
});

function añadirComent(){
  const caja_comentarios = document.getElementById('caja_comentarios');
  const nombre_usuario = document.getElementById('nombre_usuario');
  const correo_usuario = document.getElementById('correo_usuario');
  const comentario_usuario = document.getElementById('comentario_usuario');
  const fecha = (new Date()).toLocaleString('es-ES',{timeZone:'Europe/Madrid'});
  //const li = document.createElement("li");

  if(1==camposErroneos(nombre_usuario, correo_usuario, comentario_usuario)){   //LA FUNCIÓN COMPRUEBA ANTES DE AÑADIR EL COMENT Y EN FUNCIÓN DEL PROBLEMA 
    alert("Error: Hay campos en blanco");                                      //EMITE UNA ALERTA U OTRA
    return false;
  } else{ if(2==camposErroneos(nombre_usuario, correo_usuario, comentario_usuario)){
      alert("Error: El correo no es correcto");
      return false;
    }
  }
  //li.textContent=nombre_usuario.value +" ha comentado el " + fecha +":" + comentario_usuario.value;
  //caja_comentarios.appendChild(li);     DE ESTA FORMA SERÍA CORRECTO, PERO NO AÑADIRÍA EL CAMBIO DE LÍNEA

  caja_comentarios.insertAdjacentHTML('beforeend', "" +             //INSERTAMOS EL COMENTARIO DE LA MISMA FORMA QUE ESCRIBIRÍAMOS EL HTML COMO SI FUERA UN STRING
    "                <li class=\"comentario_predef\">\n" +
    "                    <p>" + nombre_usuario.value + " ha comentado el " + fecha + "</p>\n" +
    "                    <p>" + comentario_usuario.value + "<\p> ");

  return false;
}

function camposErroneos(nombre_usuario, correo_usuario, comentario_usuario){
  if (nombre_usuario.value.length==0 || correo_usuario.value.length==0 || comentario_usuario.value.length==0)
    return 1;
  
  var caracteres =/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i; //https://es.stackoverflow.com/questions/142/validar-un-email-en-javascript-que-acepte-todos-los-caracteres-latinos
  if(!caracteres.test(String(correo_usuario.value).toLowerCase())) 
    return 2;

  return 0;
}

var aux_letras="";
var aux_espacio="";
var ult_espacio=false;
/* 
Este diseño para censurar detecta los espacios por lo que si escribimos "puta" censuraría pero si escribimos diputado
no lo censuraría, además si escribimos "pu" y añadimos un espacio/./cambio de línea/un carácter que no sea letra, retrocedemos y completamos con "ta"
lo detecta como "puta" y también sería censurado, sin embargo si añadimos varios de los previamente censurados si fallaría,
o si escribimos "pu mañana" pero borramos " mañana" y terminamos la palabra "puta" tampoco la censuraría, por lo que básicamente
nos deja un caracter como fallo a la hora de censurar, si añadimos más de 1 y borramos y terminamos la palabra no es censurada.
*/
function censurarComent(event){   
  var comentario_usuario = document.getElementById("comentario_usuario");
  var letra = String.fromCharCode(event.keyCode).toLowerCase();   //TRASFORMAMO A STRING LA ÚLTIMA LETRA AÑADIDA

  if(esLetra(letra)){ //SI ES LETRA LA AÑADIMOS A UNA VARIABLE AUXILIAR Y COMPROBAMOS LA CENSURA
    aux_letras+=letra;
    compruebaCensura(aux_letras);
    ult_espacio=false;
  }
  else{ 
    if(event.keyCode==8){ //SI RETROCEDEMOS Y EL ÚLTIMO ES UN ESPACIO RESTAURAMOS LA PALABRA, SI NO LO ES QUITAMOS UNA LETRA
      if(ult_espacio){
        aux_letras = aux_espacio;
      } else{
        aux_letras=aux_letras.substring(0, aux_letras.length-1);
      }
      ult_espacio=false;
    } else{
      if(!ult_espacio){            //SI ES EL PRIMER CAMBIO DE LINEA/PUNTO/ESPACIO (U OTRO CARACTER QUE NO SEA LETRA) GUARDAMOS LAS LETRAS
        aux_espacio= aux_letras;  //HASTA EL MOMENTO POR SI RETROCEDEMOS Y CONTINUAMOS LA PALABRA Y RESULTA QUE ES UNA PALABRA PROHÍBIDA
        aux_letras="";
      }
      ult_espacio=true;
    }
  }

  if(comentario_usuario.value=="")
    aux_letras="";
}

function compruebaCensura(aux_letras) {   //SI LA AUXILIAR DE LETRAS COINCIDE CON UNA PALABRA PROB LA CAMBIAMOS POR ASTERISCOS
  var comentario_usuario = document.getElementById("comentario_usuario");
  var aux_ast = "";
  for(var i=0; i<prohibidas.length; i++){
    if(aux_letras==prohibidas[i]){
      for(var j = 0; j < aux_letras.length; j++)
        aux_ast += "*";
      
      var correccion = comentario_usuario.value.substring(0, comentario_usuario.value.length - aux_letras.length);
      comentario_usuario.value = correccion + aux_ast;
      aux_letras="";
    }
  }
}

const esLetra = (caracter) => {
	let ascii = caracter.toUpperCase().charCodeAt(0);
	return ascii > 64 && ascii < 91;
};