eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {
	
		var textos = /^[A-Za-z\s]{0,100}/;
		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var numero = /^[0-9\.\,]{0,10}/;
		var largoc = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,300}/;
		var valurl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
		var correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		
		/*
		recibe token y idasesor
		*/
		
		if (arrays.length==3){
		
			var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
				}else if(decoded.t=="1" || decoded.t=="0" || decoded.t=="2" || decoded.t=="5"){
					
					// var moment = require("moment");
					// var dia = moment().format('YYYY-MM-DD');
					var coando = "monto_"+arrays[1]+"_*_"+arrays[2]+"_*"
					
					/*
					toma los monto y los suma
					*/
					
					redisClient.keys(coando,function(err3,reply3){
						if(reply3!==null){
							data = []
							for(var i = 0; i < reply3.length; i ++){
								var explit  = reply3[i].split("_");
								console.log("ID DEL CONTRATO:  "+explit[7]);
								// cliente =[];
								// redisClient.get("registro_contrato_"+arrays[1],function(err,reply) {
									
								// 	var contrato = JSON.parse(reply);
									
								// 	for (const string of contrato) {
								// 		// if (explit[7]!=null){
								// 		// 	const partes = string.split("_");
								// 		// 	const ultimoElemento = partes[partes.length - 1];
								// 		// 	console.log(ultimoElemento);
								// 		// 	console.log(explit[7]);
								// 		// 	if (parseInt(ultimoElemento) ===explit[7] ) {
								// 		// 	console.log("encontrado");
								// 		// 	var cliente = redisClient.get("cliente_"+partes[1], function (qersr, reply_cliente) {
								// 		// 		if(reply_cliente!==null){
								// 		// 			cliente.push(JSON.parse(reply_cliente));
								// 		// 			console.log(reply_cliente);
								// 		// 			console.log(cliente);
								// 		// 		}
								// 		// 		else{
								// 		// 			cliente.push(reply_cliente);
								// 		// 		}
								// 		// 	});
								// 		// 	}
								// 		// }
										
								// 	  }
									  
									  
								// });

								
								info=[i,explit[2],explit[4]+":"+explit[5],explit[7]];
								data[i] = info;
								
							}
							resolve([true,data]);
						}else{
							resolve([true,data]);
						}
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