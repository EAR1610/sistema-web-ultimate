eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {
	
		var textos = /^[A-Za-z\s]{0,100}/;
		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var numero = /^[0-9\.\,]{0,10}/;
		var largoc = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,300}/;
		var valurl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
		var correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		
		/*recibo tokens, foto_perfil, foto_normal, foto_reverso, foto_frontal,block.pais, tipoletracedula, numerocedula, nom1, nom2, ape1, ape2, direction, departamento, ciudad, barrio, telefofijo, telefomovil, correo, alias*/
		
		
		if (arrays.length==20){
		
			var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
				}else if(decoded.t=="2"){

					var moment = require("moment");
					var hoy = moment().format('YYYY-MM-DD HH:mm:ss');
					
					function randomIntFromInterval(min,max){
						return Math.floor(Math.random()*(max-min+1)+min);
					}
					var ids = randomIntFromInterval(1000000,9999999);
					
					arrays.push(hoy);

					arrays[0] = ids;
						
					/*
					asigno idicadores a cliente
					
					*/
					redisClient.set("cliente_"+arrays[7],JSON.stringify(arrays),function(err,reply) {
						
						/*
						verifico si existe y listo
						*/
						
						redisClient.get("registro_client_"+decoded.d,function(errw,replyw) {
							if(replyw!==null){
								var esa = JSON.parse(replyw);
								
								/*
								guardo
								*/
								
								if(esa.indexOf("cliente_"+arrays[7])==-1){
									esa.push("cliente_"+arrays[7]);
									redisClient.set("registro_client_"+decoded.d,JSON.stringify(esa),function(erwrw,repelyw) {
										resolve([true,true]);
									});
								}else{
									resolve([true,true]);
								}
							}else{
								var esa = [];
								esa.push("cliente_"+arrays[7]);
								redisClient.set("registro_client_"+decoded.d,JSON.stringify(esa),function(erwrw,repelyw) {
									resolve([true,true]);
								});
							}
						});
						
					});

						
				}else{
					reject([false,"2"]);
				}
			});
			
		}else{
			reject([false,"3"]);
		}
		
	});
};

module.exports = eje;