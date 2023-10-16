eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {
	
		var textos = /^[A-Za-z\s]{0,100}/;
		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var numero = /^[0-9\.\,]{0,10}/;
		var largoc = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,300}/;
		var valurl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
		var correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		
		//{"r":"crear_cliente_admin","d":["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpIjoiYWxmYUBtYWlsLmNvbSIsImQiOjM1NDI5MzQsInQiOjEsIm4iOiItIiwiaWF0IjoxNTYzNTk1MTQ5LCJleHAiOjE1NjM2MzgzNDl9.a0Eh_Ph68bnK0QNPlaH6CNfG1f432XDPJ-VgDUEmstI","https://firebasestorage.googleapis.com/v0/b/demostrativo-web.appspot.com/o/images%2F65043563_2323759527670811_6787238785240268800_n.jpg?alt=media&token=aff28d3f-7b79-4fdb-ba95-7cdd91727eb0","https://firebasestorage.googleapis.com/v0/b/demostrativo-web.appspot.com/o/images%2FCaptura%20(1).PNG?alt=media&token=13c55a92-c7d4-4a44-ad60-bcc95ac7b21a","https://firebasestorage.googleapis.com/v0/b/demostrativo-web.appspot.com/o/images%2Ffavicon.png?alt=media&token=09b99c0d-5be5-4075-915a-5a172aba5861","https://firebasestorage.googleapis.com/v0/b/demostrativo-web.appspot.com/o/images%2F64495732_342781189696261_3540245171616612352_n.jpg?alt=media&token=b339ffa5-dee3-4795-b2f0-7a9d4a69bfa9","2","V","19210587","JHOSMAIRA","JOSEFINA","UZCATEGUI","CARRASQUERO","por su casa","Atlantico","Soledad","Los almendros","0","0","","No asignado"]}
		
		
		if (arrays.length==20){
		
			var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
				}else if(decoded.t=="1" || decoded.t=="5"){

					var moment = require("moment-timezone");
					var hoy = moment().tz("America/Guatemala").format('YYYY-MM-DD HH:mm:ss');
					
					function randomIntFromInterval(min,max){
						return Math.floor(Math.random()*(max-min+1)+min);
					}
					var ids = randomIntFromInterval(1000000,9999999);
					
					arrays.push(hoy);

					arrays[0] = ids;
					redisClient.set("cliente_"+arrays[7],JSON.stringify(arrays),function(err,reply) {
						
						/*
						busco si exite sino lo creo y  ya
						*/
						
						redisClient.get("registro_client_"+decoded.d,function(errw,replyw) {
							if(replyw!==null){
								var esa = JSON.parse(replyw);
								
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