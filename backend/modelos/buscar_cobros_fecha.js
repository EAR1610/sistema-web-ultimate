eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {
	
		var textos = /^[A-Za-z\s]{0,100}/;
		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var numero = /^[0-9\.\,]{0,10}/;
		var largoc = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,300}/;
		var valurl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
		var correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		
		/*
		Recibo un array con los valores token,idasesor,idempresa;
		*/
		
		if (arrays.length==3){
		
			var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
				}else if(decoded.t=="1" || decoded.t=="0" || decoded.t=="2" || decoded.t=="5"){


					/*
					busco registro de montos del asesor
					*/
					var comando = "monto_"+arrays[1]+"_*_"+arrays[2]+"_*_*"
					redisClient.keys(comando,function(err,replyv) {
						
						//console.log(err,reply);
						if(replyv!==null){
												
							var reply = JSON.parse(replyv);
                            console.log(reply);
							if(reply.length>0){
								
								/*
								al tener los registros los intero etilo kanban usando recursividad
								*/
								
								var lista = [];
								function recurso(ind,arrs){
									if(ind==arrs.length){
										
										/*
										revuelvo
										*/
										
										resolve([true,lista]);
										
									}else{
										var elementos  = arrs[ind].split("_");
										const cedula = elementos[elementos.length-1];
										console.log(arrs[ind]);
										redisClient.get("cliente_"+cedula,function(exrrs,cliente){
											
											var datoscliente = JSON.parse(cliente);
											let nombre= datoscliente[8]+" "+datoscliente[9]+" "+datoscliente[10]+" "+datoscliente[11];
                                            let registro = [datoscliente[7],nombre,datoscliente[12],elementos[2],elementos[4]+":"+elementos[5]];
                                            console.log(registro);
                                            lista.push(registro);
											/*
											extraigo informacion de cliente
											*/
											
										
										});
                                        ind++;
									}
								}

								recurso(0,reply);

							}else{
								reject([false,"4"]);
							}
						}else{
							reject([false,"4"]);
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
