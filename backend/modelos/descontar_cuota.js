eje = function(arrays,origen,redisClient) {
	return new Promise(function(resolve, reject) {
	
		var textos = /^[A-Za-z\s]{0,100}/;
		var coment = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,100}/;
		var numero = /^[0-9\.\,]{0,10}/;
		var largoc = /^[A-Za-z0-9\-\_\.\;\#\$\%\s]{0,300}/;
		var valurl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
		var correo = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

		/*
			Recibo tokens,idasesor,Numcuota,idcontrato,cedula
		*/
		
		if (arrays.length==5){
		
			var jwt = require('jsonwebtoken');
			jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
				if (err) {
					reject([false,"1"]);
				}else if(decoded.t=="1" || decoded.t=="2"){

					if(arrays[2]!=="" && arrays[2]!=="0" && arrays[2]!==0){
						/*
							Busco contrato y traigo la informacion
						*/						
						redisClient.keys("registry_"+arrays[4]+"_contrato_*_*_"+arrays[3],function(err,reply) {
							if(reply != null && reply != undefined){
								if(reply.length>0){
									var origena = reply[0],cedulax = origena.split("_") ;
									/*
										Busco el cliente de ese contrato
									*/
									redisClient.get("cliente_"+cedulax[1], function (qersr, sreeply) {
										redisClient.get(reply[0], function (ersr, reeply) {
											
											var interno = JSON.parse(reeply);
											
											var lisa = interno[13],
												monto = parseInt(arrays[2]),
												monto2 = monto,
												adelantos = 0,
												complete = 0,
												finiquite = 0,
												tota = 0,
												tolete = 0;
											
											for(var w = 0; w <lisa.length; w++){
	
												if(lisa[w].ct || lisa[w].pe> 0){
													finiquite++;
												}
	
												adelantos = adelantos + lisa[w].pe;
												if(lisa[w].pe> 0){
													tota = tota + (parseInt(lisa[w].cp) - parseInt(lisa[w].pe));
												}
												
												if(lisa[w].pe> 0){
													tolete = tolete + (parseInt(lisa[w].cp) - parseInt(lisa[w].pe));
												}else if(!lisa[w].ct){
													tolete = tolete + (parseInt(lisa[w].cp));
												}
	
												if(!lisa[w].ct){
													complete++;
												}

												console.log("tolete, monto2");												
												console.log(tolete + "-"+monto2);

												var canti = parseInt(lisa[w].cp);
												var moment = require("moment-timezone");
												var dia = moment().tz("America/Guatemala").format('YYYY-MM-DD');
	
												if(!lisa[w].ct) {
													console.log(monto);
													console.log("monto");
													console.log(lisa[w].pe);
													console.log("lisa[w].pe");
													if( monto < canti && lisa[w].pe != 0){
														monto += lisa[w].pe;
														console.log("monto abono");
														console.log(monto);
														if(monto < canti) {
															lisa[w].pe = monto;
															lisa[w].pago = dia;
															monto=0;
														} else if (monto == canti){
															lisa[w].ct = true;
															lisa[w].pe = 0;
															lisa[w].pago = dia;
															monto=0;
														} else{
															lisa[w].ct = true;
															lisa[w].pe = 0;
															lisa[w].pago = dia;
															monto -= canti;
														}														
													} else if (monto > canti &&  lisa[w].pe != 0) {
														monto -= (canti - lisa[w].pe);
														lisa[w].ct = true;
														lisa[w].pe = 0;
														lisa[w].pago = dia;
													} else if (monto > canti &&  lisa[w].pe == 0) {
														console.log("monto > canti &&  lisa[w].pe == 0");
														lisa[w].ct = true;
														monto = monto - parseInt(lisa[w].cp);
														console.log("lisa[w].cp");
														console.log(lisa[w].cp);
														lisa[w].pago = dia;
													} else if (monto == canti && lisa[w].pe == 0) {	//Pago exactooooo
														console.log("monto == canti && lisa[w].pe == 0")
														lisa[w].ct = true;
														monto = 0;
														lisa[w].pago = dia;
													} else if(lisa[w].pe == 0 && monto>0){
														console.log("lisa[w].pe == 0 && monto>0");
														lisa[w].ct = false;
														lisa[w].pe = monto;
														console.log("lisa[w].pe");
														console.log(lisa[w].pe);
														monto = 0;
														lisa[w].pago = dia;
													}
												}
											}
											/*
												descuento y sumo los valores que necesito calcular
											*/										
											var asesorw = arrays[1];
											console.log("arrays[2]==lisa[lisa.length-1].cp");
											console.log(arrays[2]==lisa[lisa.length-1].cp);

											if(arrays[2]==lisa[lisa.length-1].cp){
												console.log("tolete_"+asesorw+"_"+fechaqx2);
												redisClient.get("tolete_"+asesorw+"_"+fechaqx2, function (errex, rewprelyx) { 
													if(rewprelyx == null){
														console.log("tolete_"+asesorw+"_"+fechaqx2,JSON.stringify({"n":1,"c":arrays[2]}));
														redisClient.set("tolete_"+asesorw+"_"+fechaqx2,JSON.stringify({"n":1,"c":arrays[2]}), function (errex, rewprelyx) {});
													}else{
														var infqo = JSON.parse(rewprelyx);
														var sumo1 = parseInt(infqo.n) +1;
														var sumo2 = parseInt(infqo.c) + parseInt(arrays[2]);
														console.log("tolete_"+asesorw+"_"+fechaqx2,JSON.stringify({"n":sumo1,"c":sumo2}));
														redisClient.set("tolete_"+asesorw+"_"+fechaqx2,JSON.stringify({"n":sumo1,"c":sumo2}), function (errex, rewprelyx) {});
													}
												});
											}
	
											redisClient.set("liquido_"+arrays[4]+"_"+fechaq+"_"+arrays[2]+"_"+lisa[lisa.length-1].cp,"true", function (errex, rewprlyx) { 
											});
	
											var moment = require("moment-timezone"),fechaqx2 = moment().tz("America/Guatemala").format('YYYY-MM-DD');													
											var fechaq = moment().tz("America/Guatemala").format('YYYY-MM-DD_hh_mm_A'),asesorw = arrays[1];
											console.log("monto_" + asesorw + "_"+arrays[2]+"_"+fechaq+"_"+arrays[3]+"_"+cedulax[1],"true");
											redisClient.set("monto_" + asesorw + "_"+arrays[2]+"_"+fechaq+"_"+arrays[3]+"_"+cedulax[1],"true", function (errex, rewprlyx) {
											});
	
											console.log("tolet is:")
											console.log(tolete);
											if( tolete == monto2 ){//si pago exacto
												
												interno[13] = lisa;
												redisClient.set(origena,JSON.stringify(interno),function(errx,replyxs) {
													redisClient.rename(origena,"old_"+origena,function(errx,replyx) {
														var moment = require("moment-timezone");
														var dia = moment().tz("America/Guatemala").format('YYYY-MM-DD');
														var bou = [interno,arrays[2]];
														redisClient.set('cancelado_'+arrays[1]+"_"+dia,JSON.stringify(bou),function(err3,reply3){
															
															redisClient.get("registro_contrato_"+arrays[1], function (errx, repslyx) {
																var infes = JSON.parse(repslyx), nuva =[];
																for(var j = 0; j < infes.length; j++){
																	if(infes[j].indexOf(origena)==-1){
																		nuva.push(infes[j]);
																	}
																	if(j==infes.length-1){
																		redisClient.set("registro_contrato_"+arrays[1],JSON.stringify(nuva), function (errx, repslyx) {
																			resolve([true,interno,sreeply]);
																		});
																	}
																}
															});													
														});													
													});												
												});												
											}else if( tolete < monto2 ){//si pago demas (tolete = resto del contrato, monto2 = valor pagado)
												interno[13] = lisa;
												redisClient.set(origena,JSON.stringify(interno),function(errx,replyxs) {
													redisClient.rename(origena,"old_"+origena,function(errx,replyx) {
														var moment = require("moment-timezone");
														var dia = moment().tz("America/Guatemala").format('YYYY-MM-DD');
														var bou = [interno,arrays[2]];
														
														redisClient.set('cancelado_'+arrays[1]+"_"+dia,JSON.stringify(bou),function(err3,reply3){															
															redisClient.get("registro_contrato_"+arrays[1], function (errx, repslyx) {
																var infes = JSON.parse(repslyx), nuva =[];
																for(var j = 0; j < infes.length; j++){
																	if(infes[j].indexOf(origena)==-1){
																		nuva.push(infes[j]);
																	}
																	if(j==infes.length-1){																		
																		redisClient.set("registro_contrato_"+arrays[1],JSON.stringify(nuva), function (errx, repslyx) {
																			resolve([true,interno,sreeply]);
																		});
																	}
																}
															});															
														});														
													});													
												});											
											}
											// else if(finiquite >= lisa.length){
											// 	console.log("finiquite >= lisa.length");
											// 	console.log(finiquite >= lisa.length);
											// 	var moment = require("moment-timezone"),fechaq = moment().tz("America/Guatemala").format('YYYY-MM-DD');
											// 	lisa.push({"cp":"0","ct":false,"fe":fechaq,"pe":monto2});
											// 	console.log("lisa")
											// 	console.log(lisa)
											// 	interno[13] = lisa;
											// 	console.log(interno[13]);
											// 	redisClient.set(origena,JSON.stringify(interno),function(errx,replyxs) {
											// 		resolve([true,interno,sreeply]);
											// 	});
											// }
											else{//descuento normal
												console.log("descuento normal");												
												interno[13] = lisa;
												console.log(interno[13]);
												redisClient.set(origena,JSON.stringify(interno),function(errx,replyxs) {
													resolve([true,interno,sreeply]);
												});
											}
										});
									});
								} else{
									reject([false,"4"]);
								}
							} else{
								reject([false,"4"]);
							}
						});
					}
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