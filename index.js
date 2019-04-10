const cool = require('cool-ascii-faces')
const { Pool } = require('pg');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
//const client = new Client({
  //connectionString: process.env.DATABASE_URL,
  //ssl: true,
//});
const connectionString = process.env.DATABASE_URL || "postgres://puzbmychvnvfeo:a5b2637d8d5075b793f9d89cf10cffe4b285011c5797d485bb74dc0ee14036b0@ec2-184-73-216-48.compute-1.amazonaws.com:5432/d4eg3kvdtnr7bv?ssl=true";
const pool = new Pool({connectionString: connectionString});

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
  .get('/adjust', function(req, res){
    var id2 = req.query.id;
    var rate = parseFloat(req.query.rate);
    console.log("id is");
    console.log(id2);
    console.log("rate is");
    console.log(rate);
    var sql = "UPDATE rates SET currency_rate = $1::int WHERE id = $2::int";
    var params = [rate,id2];

    pool.query(sql, params, function(err, result){
      // If an error occurred...
      if (err) {
        console.log("Error in query: ")
        console.log(err);
      }
    });
  })
  .get('/getAmount', function(req, res){
    console.log("looking for amount");
    
    var id = req.query.id;
    var sql = "SELECT * FROM rates WHERE id = $1::int";
    var params = [id];

    console.log("id is");
    console.log(id);

    pool.query(sql, params, function(err, result) {
    // If an error occurred...
      if (err) {
        console.log("Error in query: ")
        console.log(err);
      }

    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(result.rows);
    res.json(result.rows);
    });     

    //function call
    //getAmountFromDB(id, function(error, result){
    //  console.log("Back from the database with result:", result);
    //}); 

    //var result = {currency_rate: 19.21};
    //res.json(resultToReturn);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))



//function getAmountFromDB(id, callback){
  //console.log("getPersonFromDB called with id", id);

  //var sql = "SELECT currency_rate FROM rates WHERE id = 1";
  //var params = [id];

  //console.log("getPersonFromDB called with id", id);

  //client.query(sql, params, function(err, result){
    //if (err){
      //console.log("an error has accured");
      //console.log(err);
      //callback(err, null);
    //}

    //console.log("result: " + JSON.stringify(result.rows));

    //callback(null, result.rows);
  //});
//}