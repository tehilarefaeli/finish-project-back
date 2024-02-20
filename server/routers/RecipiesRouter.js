const { Router } = require('express');
const express = require('express');
const { mysqlConnection } = require('../sql/sql');
const mysql = require('node-mysql');

const RecipiesRouter = Router();

RecipiesRouter.post('/rating', (req, res) => {
   const { newRating, recipeid } = req.body; 

   const sql = `UPDATE mydb.recipes SET recipe_rating = ? WHERE recipe_id = ?`;
   mysqlConnection.query(sql, [newRating, recipeid], (err) => {
       if (!err) {
           res.status(200).send('Updated rating successfully');
       } else {
           console.error(err);
           res.status(500).send('Failed to update rating');
       }
   });
});


RecipiesRouter.get('/all', (req, res) => {



   // const numOfProductFields = 15;

   // const selectFields = Array.from({ length: numOfProductFields }, (_, i) => `
   //     (SELECT pm.product_name FROM products_mapping pm WHERE pm.product_id = p.product_id_${i + 1}) AS product_name_${i + 1} `).join(', ');

   // const query = `
   //    SELECT r.recipe_id, r.category_id, r.recipe_name, r.recipe_rating, r.recipe_prepare,
   //           r.rating_count, r.recipe_img,
   //           ${selectFields}
   //    FROM recipes r
   //    LEFT JOIN recipes_product p ON r.recipe_id = p.recipe_id
   //    WHERE ${getNotNullFieldsConditions('p', numOfProductFields)};
   // `;

   // function getNotNullFieldsConditions(tableName, numOfFields) {
   //    const conditions = Array.from({ length: numOfFields }, (_, i) => `
   //       ${tableName}.product_id_${i + 1} IS NOT NULL
   //    `);
   //    return conditions.join(' OR ');
   // }

const query = `SELECT * FROM recipes`

   

mysqlConnection.query(query, (err, rows) => {
   if (!err)
      {

         const filterProductNames = (rows) => {
            const productNames = Object.keys(rows)
              .filter((key) => key.startsWith("product_name") && rows[key] !== null)
              .map((key) => rows[key]);
          
            const filteredRows = { ...rows };
            
            // Remove the original "product_name" keys
            for (let key in filteredRows) {
              if (key.startsWith("product_name")) {
                delete filteredRows[key];
              }
            }
          
            filteredRows.products = productNames;
          
            return filteredRows;
          };
          
          // Applying the filter to each recipe in the array
          const filteredRecipes = rows.map(filterProductNames);
          
          
          console.log(filteredRecipes);
         res.send(filteredRecipes)}
       
   else
       console.log(err);
  })
})





module.exports = RecipiesRouter;
