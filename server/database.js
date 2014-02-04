var pg              = require('pg')
  , validator       = require('validator')
  , conString       = 'postgres://jlepper:5432@localhost/resistances';

exports.create = function (params, res) {

  console.log('creation');
  pg.connect(conString, function(err, client, done) {
    var queryString = 'INSERT INTO resistances (value, time) VALUES (\'' + escape(params.resistance) + '\',\'' + escape(params.time) + '\') RETURNING *;';
    console.log(queryString);
    var query = client.query( queryString );

    handleResponse(query, '', done, function (data) {
      console.log(data);
    });
  });
};

exports.batchLookup = function (params, res) {

  console.log('// -------- //');
  console.log(params);
  console.log('batch lookup');
  pg.connect(conString, function(err, client, done) {
    var query   = client.query('SELECT * FROM resistances WHERE time BETWEEN ' + params.start + ' and ' + params.end + ';')
      , acounts = [];

    handleResponse(query, [], done, res);
  });
};

function escape (name) {
  return validator.escape(validator.blacklist(name, ';'));
}

function handleErrors (query, res) {
  query.on('error', function(err) {
    console.log('postgres error: ', err);
    res(err);
  });
}

function handleResponse (query, data, done, res) {
  console.log('inside response handler')
  handleErrors(query, res);
  query.on('row', function(row) {
    if ( data === '') {
      data = row;
    } else {
      data.push(row);
    }
  });
  query.on('end', function(){
    done();
    res(data);
  });
}

// SELECT count(*) AS exact_count FROM resistances.resistances;

