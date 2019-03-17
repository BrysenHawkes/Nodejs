const cool = require('cool-ascii-faces')
const { Client } = require('pg');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool',(req,res) => res.send(cool()))
  .get('/currency', function(req, res) {
  	var name = "Brysen";
    var params = {username: name};
  	res.render('pages/currency', params);
  })
  .get('/getAmount', function(req, res){
    console.log("looking for amount");
    var id = 1;

    //function call
    getAmountFromDB(id, function(error, result){
      console.log("Back from the database with result:", result);
    }); 

    var result = {currency_rate: 19.21};
    res.json(result);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))



function getAmountFromDB(id, callback){
  console.log("getPersonFromDB called with id", id);

  var sql = "SELECT currency_rate FROM rates WHERE id = 1";
  var params = [id];

  client.query(sql, params, function(err, result){
    if (err){
      console.log("an error has accured");
      //console.log(err);
      //callback(err, null);
    }

    console.log("result: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}