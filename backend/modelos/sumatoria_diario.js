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
		
		if (arrays.length==2){
		
			var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
				} else if(decoded.t=="1" || decoded.t=="0" || decoded.t=="2" || decoded.t=="5"){
					var moment = require("moment");
					var dia = moment().format('YYYY-MM-DD');
					var coando = "monto_"+arrays[1]+"_*_"+dia+"_*"					
					/*
						toma los monto y los suma
					*/					
					redisClient.keys(coando,function(err3,reply3){
						if(reply3.length > 0){							
							var total=0;
							for(var es = 0; es < reply3.length; es ++){
								var explit  = reply3[es].split("_");
								total = total + parseInt(explit[2]);								
								if(es==reply3.length-1){
									redisClient.get("base_"+arrays[1]+"_"+dia,function(ersr,replcy) {
										if(replcy!==null){
											var inf = JSON.parse(replcy);
											resolve([true,total,inf[1],dia]);
										}else{
											resolve([true,total,"0","Sin base"]);
										}
									});
								}								
							}							
						} else {
							redisClient.keys("base_"+arrays[1]+"_*", function(errBase, replyBasesRegistradas){

								if(replyBasesRegistradas.length == 0) {
									console.log("NO HAY DATOS; SIN BASE");
									resolve([true,0,0,"Sin base"]);									
								} else {
									recurso(0, replyBasesRegistradas)
								}

								var lista = [];

								console.log("replyBasesRegistradas")
								console.log(replyBasesRegistradas.length)
								console.log(replyBasesRegistradas)

								function recurso(ind, arrs){
									if(ind == arrs.length){
										console.log(lista);
										console.log("[true, 0, lista[0][1], lista[0][0]]")
										console.log([true, 0, lista[0][1], lista[0][0]])
										resolve([true, 0, lista[0][1], lista[0][0]]);
									} else {
										console.log("replyBasesRegistradas");
										console.log(replyBasesRegistradas);
										console.log("replyBasesRegistradas.length > 0")

										redisClient.get(arrs[ind], function(errorBase, replyBaseRegistrada){
											let base = JSON.parse(replyBaseRegistrada);
											console.log("base");
											console.log(base);

											if(base[3] == false){ //Tiene apertura abierta
												lista.push(base);
												recurso(replyBasesRegistradas.length, arrs);
											}

											ind++;
											recurso(ind,arrs);
										})
									}					
								} 

							})
							// redisClient.get("base_"+arrays[1],function(ersr,replcy) {
							// 	if(replcy==null){
							// 		resolve([true,0,0,"Sin base"]);
							// 	}else{
							// 		var inf = JSON.parse(replcy);
							// 		resolve([true,0,inf[1],inf[0]]);
							// 	}
							// });
						}
					});					
				} else {
					reject([false,"2"]);
				}
			});
			
		} else{
			reject([false,"3"]);
		}		
	});
};

module.exports = eje;
