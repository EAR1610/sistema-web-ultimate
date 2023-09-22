eje = function(arrays,origen,redisClient) {
    return new Promise(function(resolve, reject) {
    
        var jwt = require('jsonwebtoken');
        jwt.verify(arrays[0], 'clWve-G*-9)1', function(err, decoded) {
            if (err) {
                reject([false,"1"]);
            }else if(decoded.t=="1" || decoded.t=="0" || decoded.t=="5"){
                
                console.log(decoded.d);
                
                redisClient.keys('listado_'+decoded.d+'_pago_*',function(err3,reply3){
                    if(reply3.length > 0){
                        
                        var litado = [];
                        function iterar(ind,arrs){
                            if(ind == arrs.length){
                                resolve([true,litado]);
                            }else{
                                redisClient.get(arrs[ind],function(err,reply) {
                                    if(reply!==null){
                                        litado.push(reply);
                                        ind++;
                                        iterar(ind,arrs);
                                    }else{
                                        ind++;
                                        iterar(ind,arrs);
                                    }
                                });
                            }
                        }
                        
                        iterar(0,reply3);
                    }else{
                        reject([false,"4"]);
                    }
                });
                
            }else{
                reject([false,"2"]);
            }
        });
        
    });
};

module.exports = eje;
