var redis = require('redis');
var dev = false;

/*
	Este codigo es el core del sistema
*/

/*
	Solo una variable me indica si estoy en produccion o desarrollo
*/
//8ICmRsaUHMS5caKp55cVvE09QKEtMQYU@redis-18996.c1.us-west-2-2.ec2.cloud.redislabs.com:18996

if(!dev){
	//#908570 Essentials/AWS/us-west-1/Standard/30MB

	var redisClient = redis.createClient({ host : 'redis-16566.c93.us-east-1-3.ec2.cloud.redislabs.com', port : 16566 });
	redisClient.auth('PU2IjRUHNswzeFRGQ99dohjNZvOkzqrB',function(err,reply) {
		if(!err) {
			console.log("Bien: Verificando la seguridad del sistema redis "+reply+" "+ Date());
		}else{
			console.log('Mal: Configure la seguridad del sistema redis  con > redi-cli.exe CONFIG SET requirepass "carlos-0426269350" '+err+' '+Date());
		}
	});
}else{
	var redisClient = redis.createClient({host : 'localhost', port : 6379});
	redisClient.auth('1045671764',function(err,reply) {
		if(!err) {
			console.log("Bien: Verificando la seguridad del sistema redis "+reply+" "+ Date());
		}else{
			console.log('Mal: Configure la seguridad del sistema redis  con > redi-cli.exe CONFIG SET requirepass "carlos-0426269350" '+err+' '+Date());
		}
	});
}

/*
	Conexion buena o no mediantes estos eventos en redis
*/
redisClient.on('ready',function() {
	console.log("Bien: Redis is ready... OK "+ Date());
});

redisClient.on('error',function() {
	console.log("Mal: Error in Redis "+Date());
});
/*
	Siempre asiganre la clave de acceso del root
*/
var arrays = ["admin@elamigo.com","123","2019-04-15 00:53:46",true,0,"1000000","Super Admin"];
redisClient.set("usuario_admin@elamigo.com_1000000",JSON.stringify(arrays),function(err2,reply2){
	console.log("Asignacion de cuenta admin");
});

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
	response.writeHead(200);
	response.write("Online:active:3000");
	response.end();
});
/*
	Conexion escucho ws en el puerto 3000
*/
server.listen(3000, function() {
	console.log("Online:active:3000");
});
wsServer = new WebSocketServer({
	maxReceivedFrameSize: 20204848, //bytes
	maxReceivedMessageSize: 20482048, //bytes
	autoAcceptConnections: false,
	httpServer: server
});
wsServer.on('request', function(request) {
	var connection = request.accept(null, request.origin);
	connection.on('message', function(message) {
		if( message.type === 'utf8' ) {
			try {				
				/*
					Recibo un array lo parseo y lo redirigo a la funcion que se necesite
				*/
				var text = JSON.parse(message.utf8Data.toString());
				var ejecucion = require('./modelos/'+text.r+'');
				ejecucion(text.d,text.r,redisClient).then(function(info) {
					connection.send(JSON.stringify({"e":false,"d":info}));
				}).catch(function(err){
					connection.send(JSON.stringify({"e":true,"d":err}));
				});				
			} catch( e ){
				connection.send(JSON.stringify({"e":true,"d":e}));
			}			
		}
	});
	connection.on('close', function(connection) {
		console.log("Bien: salida de usuario: "+request.origin);
	});  
});

