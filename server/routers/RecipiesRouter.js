const { Router } = require("express");
const express = require("express");
const { mysqlConnection } = require("../sql/sql");

const RecipiesRouter = Router();

RecipiesRouter.post("/rating", (req, res) => {
  // Extract request data
  const { newRating, recipeid } = req.body;

  // Corrected SQL query
  //const sql = `UPDATE mydb.recipes SET recipe_rating = ?, rating_count = rating_count + 1 WHERE recipe_id = ?`;
  const sql = `
  UPDATE mydb.recipes
  SET
    recipe_rating = (recipe_rating * rating_count + ?) / (rating_count + 1),
    rating_count = rating_count + 1
  WHERE recipe_id = ?;
`;
  // Execute query with placeholders
  mysqlConnection.query(sql, [newRating, recipeid], (err) => {
    // Handle response
    if (!err) {
      res.status(200).send("Updated rating successfully");
    } else {
      console.error(err);
      res.status(500).send("Failed to update rating");
    }
  });
});

RecipiesRouter.post('/addrecipe', (req, res) => {
  const { category_id, recipe_name,recipe_rating, recipe_prepare,rating_count, recipe_img } = req.body;
  

  const sql = 'INSERT INTO recipes (category_id, recipe_name,recipe_rating, recipe_prepare,rating_count, recipe_img) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [parseInt(category_id), recipe_name,recipe_rating, recipe_prepare,rating_count, recipe_img];

  mysqlConnection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error adding recipe: ' + err.message);
          res.status(500).json({ error: 'Error adding recipe' });
          return;
      }
      console.log('Added recipe with ID: ' + result.insertId);
      res.json({ message: 'Recipe added successfully' });
  });
});

RecipiesRouter.delete('/deleterecipe/:recipeName', (req, res) => {
  const recipeName = req.params.recipeName;

  // Delete the recipe from the database based on recipe_name
  const sql = 'DELETE FROM recipes WHERE recipe_name = ?';

  mysqlConnection.query(sql, [recipeName], (err, result) => {
      if (err) {
          console.error('Error deleting recipe: ' + err.message);
          res.status(500).json({ error: 'Error deleting recipe' });
          return;
      }
      console.log('Deleted recipe with name: ' + recipeName);
      res.json({ message: 'Recipe deleted successfully' });
  });
});

RecipiesRouter.put('/updaterecipe/:recipename', (req, res) => {
  const recipeName = req.params.recipename; // Use recipename to match with the route parameter
  const { category_id, recipe_name, recipe_rating, recipe_prepare, rating_count, recipe_img } = req.body;

  const sql = `UPDATE recipes 
               SET category_id=?, 
                   recipe_name=?, 
                   recipe_rating=?, 
                   recipe_prepare=?, 
                   rating_count=?, 
                   recipe_img=? 
               WHERE recipe_name=?`; // Use recipe_name to match with the column in the database

  const values = [parseInt(category_id), recipe_name, recipe_rating, recipe_prepare, rating_count, recipe_img, recipeName]; // Pass recipeName as the last value

  mysqlConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating recipe: ' + err.message);
      res.status(500).json({ error: 'Error updating recipe' });
      return;
    }
    console.log('Updated recipe with name: ' + recipeName);
    res.json({ message: 'Recipe updated successfully' });
  });
});



RecipiesRouter.get("/likes/:email", (req, res) => {
  const email = req.params.email;

  const query = `SELECT * FROM recipe_likes WHERE user_email=?`;
  mysqlConnection.query(query, [email], (err, results) => {
    if (!err) {
      const likedIds = results.map((row) => row.recipe_id);
      res.status(200).send(likedIds);
    } else {
      console.error(err);
      res.status(500).send("Failed to add like ");
    }
  });
});

RecipiesRouter.post("/likes", (req, res) => {
  const { email, type, recipe_id } = req.body;

  if (type === "like") {
    const query = `INSERT INTO recipe_likes (user_email, recipe_id) VALUES (?, ?)`;
    mysqlConnection.query(query, [email, recipe_id], (err) => {
      if (!err) {
        res.status(200).send("Added like successfully");
      } else {
        console.error(err);
        res.status(500).send("Failed to add like ");
      }
    });
  } else {
    const query = `DELETE FROM recipe_likes WHERE user_email=? AND recipe_id=?`;
    mysqlConnection.query(query, [email, recipe_id], (err) => {
      if (!err) {
        res.status(200).send("Remvoed like successfully");
      } else {
        console.error(err);
        res.status(500).send("Failed to remvoe like");
      }
    });
  }
});

RecipiesRouter.get("/all", (req, res) => {
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

  const query = `
  SELECT r.*, GROUP_CONCAT(p.product_name) as ingridients
  FROM recipes r
  LEFT JOIN recipe_products rp ON r.recipe_id = rp.recipe_id
  LEFT JOIN products_mapping p ON rp.product_id = p.product_id
  GROUP BY r.recipe_id
  `;

  mysqlConnection.query(query, (err, rows) => {
    if (!err) {
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

      console.log(rows[0])
      // Applying the filter to each recipe in the array
      const filteredRecipes = rows.map(filterProductNames);

      res.send(filteredRecipes);
    } else console.log(err);
  });
});

RecipiesRouter.get('/recipeByParams/:productsInRecipeIds/:productsNotInRecipeIds', (req, res) => {
  const productsInRecipeIds = req.params.productsInRecipeIds.split(','); // Assuming product IDs are comma-separated
  const productsNotInRecipeIds = req.params.productsNotInRecipeIds.split(','); // Assuming product IDs are comma-separated
  let recipesContains;
  let recipesNotContains;

  let query = `
  SELECT recipe_id
  FROM recipe_products
  WHERE product_id IN (`;

for (const productId of productsInRecipeIds) {
  query += `${productId},`;
}

query = query.slice(0, -1);
query += ')';
query += ' GROUP BY recipe_id';

mysqlConnection.query(query, (error, results, fields) => {
  if (error) {
    console.error('Error fetching IDs:', error);
  } else {
    console.log('IDs:', results);
  }
});
// Execute the query using your database connection
// Assuming you're using MySQL
// mysqlConnection.query(query, (error, results, fields) => {
//   if (error) {
//       console.error('Error fetching recipes:', error);
//   } else {
//     res.send(results);
//       console.log('Recipes:', results);
//   }
//  });
});


module.exports = RecipiesRouter;
