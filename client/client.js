var needle = require('needle')
  , shots  = 0
  , begin  = Date.now();

setInterval(function( ){
  console.log('// * ---- FIRE ' + shots + '! ---- * \\\\');
  fire(getRandomInt(0,10000));
},500);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fire (int) {
  needle.post( 'http://localhost:8888/level'
             , { resistance : int }
             , function(err, res, body) {
                 console.log( '\n    Fired ' + shots++ + ' at ' + ( Date.now() - begin ) + 'ms.' +
                              '\n\n// * ----------------- * \\\\\n');
               });
}
