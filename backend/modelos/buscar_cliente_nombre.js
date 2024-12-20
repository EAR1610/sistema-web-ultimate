eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {
	
		var textos = /^[A-Za-z\s]{0,100}/;
		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var numero = /^[0-9\.\,]{0,10}/;
		var largoc = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,300}/;
		var valurl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
		var correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		
		/*
			? recibo token y nombre
		*/
		
		if ( arrays.length == 2 ){
			var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject( [false,"1"] );
				} else if( decoded.t=="1" || decoded.t=="0" || decoded.t=="2"  || decoded.t=="5" || decoded.t=="4" ){
										
					/* 
                        ? verifico si el nombre del cliente coincide dentro de los registros 
                    */

                    redisClient.keys("cliente_*", function(err, replyClientesTotales){
                        if( replyClientesTotales !== null && replyClientesTotales !== undefined){
                            var clientesMatch = [];

                            function iterar(ind, arrs){
                                if( ind == arrs.length ){
                                    resolve( [ true, clientesMatch ] );

                                } else {
                                    redisClient.get(arrs[ind], function(err, replyCliente){
                                        if( replyCliente !== undefined && replyCliente !== null){
                                            let datosCliente = JSON.parse(replyCliente);
                                            let nombre1Cliente = datosCliente[8];
                                            let nombre2Cliente = datosCliente[9];
                                            let apellido1Cliente = datosCliente[10];
                                            let apellido2Cliente = datosCliente[11];

											/* 	
                                                ? COMPRUEBO LOS DATOS PARA CORROBORAR SI HACE MATCH 
                                            */

                                            if( nombre1Cliente && String( arrays[1] ).toUpperCase().includes( nombre1Cliente.toUpperCase() ) || 
                                                nombre2Cliente && String( arrays[1] ).toUpperCase().includes( nombre2Cliente.toUpperCase() ) || 
                                                apellido1Cliente && String( arrays[1] ).toUpperCase().includes( apellido1Cliente.toUpperCase() ) || 
                                                apellido2Cliente && String( arrays[1] ).toUpperCase().includes( apellido2Cliente.toUpperCase() ) 
                                            ){
                                                clientesMatch = [ ...clientesMatch, datosCliente ];
                                            }
                                            
                                            ind++;
                                            iterar(ind, arrs);

                                        } else {
                                            ind++;
                                            iterar(ind, arrs);
                                        }
                                    });
                                }
                            }
                            iterar(0, replyClientesTotales);
                        }
                    });

				}else{
					reject( [false,"2"] );
				}
			});			
		}else{
			reject( [false,"3"] );
		}		
	});
};

module.exports = eje;