const { Router } = require('express');
const express = require('express');
const { mysqlConnection } = require('../sql/sql');
const mysql = require('node-mysql');

const RecipiesRouter = Router();

RecipiesRouter.put('/rating/:calculateRecipeRating/:recipeid', (req, res) => {
    const rating = req.params.calculateRecipeRating;
    const recipe_id = req.params.recipe_id;
    const sql = `UPDATE mydb.recipes set racipe_rating ='${rating}'where recipe_id = '${recipe_id}';`;
 mysqlConnection.query(sql,[rating,recipe_id], (err) => {
    if (!err)
        res.send('Updated rating successfully');
    else
        console.log(err);
   })
})

RecipiesRouter.get('/all', (req, res) => {
   //const sql = `SELECT * FROM mydb.recipes;`;
mysqlConnection.query(`SELECT * FROM mydb.recipes;`, (err, rows) => {
   if (!err)
      {console.log(rows)
         res.send(rows);}
       
   else
       console.log(err);
  })
})
module.exports = RecipiesRouter;
