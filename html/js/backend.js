var backend = this;

backend.dev = false;

if(!backend.dev){
	backend.usuando = "178.156.148.112";
} else {
	backend.usuando = "192.168.1.27";
}

backend.conexionEnvio = function (datos,callback){	
	if ("WebSocket" in window){

        if (!backend.dev) {
            var ws = new WebSocket("ws://" + backend.usuando + ":3000");
        } else {
            var ws = new WebSocket("ws://" + backend.usuando + ":3000");
        }

		ws.onopen = function(){
			$("#conectado_server")[0].innerText ="true";			
			ws.send(datos);
		};
		ws.onmessage = function (evt) {
			ws.close();
			return callback(evt.data);
		};
		ws.onerror = function (evt) {
			toastr.error('Error en la conexion de internet','Atención!');
			$("#conectado_server")[0].innerText ="false";
		};
		window.onbeforeunload = function(event) {
			ws.close();
		};
	} else {
	   return callback(JSON.stringify({"e":true,"m":"WebSocket NOT supported by your Browser"}));
	}
};