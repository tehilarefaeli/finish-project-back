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

RecipiesRouter.post("/addrecipe", (req, res) => {
  const {
    category_id,
    recipe_name,
    recipe_rating,
    recipe_prepare,
    rating_count,
    recipe_img,
  } = req.body;

  const sql =
    "INSERT INTO recipes (category_id, recipe_name,recipe_rating, recipe_prepare,rating_count, recipe_img) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    parseInt(category_id),
    recipe_name,
    recipe_rating,
    recipe_prepare,
    rating_count,
    recipe_img,
  ];

  mysqlConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding recipe: " + err.message);
      res.status(500).json({ error: "Error adding recipe" });
      return;
    }
    console.log("Added recipe with ID: " + result.insertId);
    res.json({ message: "Recipe added successfully" });
  });
});

RecipiesRouter.delete("/deleterecipe/:recipeName", (req, res) => {
  const recipeName = req.params.recipeName;

  // Delete the recipe from the database based on recipe_name
  const sql = "DELETE FROM recipes WHERE recipe_name = ?";

  mysqlConnection.query(sql, [recipeName], (err, result) => {
    if (err) {
      console.error("Error deleting recipe: " + err.message);
      res.status(500).json({ error: "Error deleting recipe" });
      return;
    }
    console.log("Deleted recipe with name: " + recipeName);
    res.json({ message: "Recipe deleted successfully" });
  });
});

RecipiesRouter.put("/updaterecipe/:recipename", (req, res) => {
  const recipeName = req.params.recipename; // Use recipename to match with the route parameter
  const {
    category_id,
    recipe_name,
    recipe_rating,
    recipe_prepare,
    rating_count,
    recipe_img,
  } = req.body;

  const sql = `UPDATE recipes 
               SET category_id=?, 
                   recipe_name=?, 
                   recipe_rating=?, 
                   recipe_prepare=?, 
                   rating_count=?, 
                   recipe_img=? 
               WHERE recipe_name=?`; // Use recipe_name to match with the column in the database

  const values = [
    parseInt(category_id),
    recipe_name,
    recipe_rating,
    recipe_prepare,
    rating_count,
    recipe_img,
    recipeName,
  ]; // Pass recipeName as the last value

  mysqlConnection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating recipe: " + err.message);
      res.status(500).json({ error: "Error updating recipe" });
      return;
    }
    console.log("Updated recipe with name: " + recipeName);
    res.json({ message: "Recipe updated successfully" });
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

      console.log(rows[0]);
      // Applying the filter to each recipe in the array
      const filteredRecipes = rows.map(filterProductNames);

      res.send(filteredRecipes);
    } else console.log(err);
  });
});

RecipiesRouter.get("/recipeByParams/:productsInRecipeIds/:productsNotInRecipeIds", (req, res) => {
    let productsInRecipes=[];
    let count =0;
    for(var i=0 ;i <req.params.productsInRecipeIds.length; i++){
      if(req.params.productsInRecipeIds[i]!= ","){
        productsInRecipes[count] = req.params.productsInRecipeIds[i];
        count++;
      }
    }

    let productsNotInRecipes=[];
    let count2 =0;
    for(var j=0 ;j <req.params.productsNotInRecipeIds.length; j++){
      if(req.params.productsNotInRecipeIds[j]!= ","){
        productsNotInRecipes[count] = req.params.productsNotInRecipeIds[j];
        count2++;
      }
    }
    var recipesNotContains = [];
    let flag = false;

    let query1;
    if(productsNotInRecipes.length>0){
    query1 = `
    SELECT recipe_id
    FROM recipe_products
    WHERE product_id IN (`;
    for (const productId of productsNotInRecipes) {
      if(productId != undefined){
       query1 += `${productId},`;
      }
    }
    query1 = query1.slice(0, -1); query1 += ")";
    query1 += "GROUP BY recipe_id";
    }
    else{
      flag =true;
    query1 =`
    SELECT recipe_id
    FROM recipe_products 
    GROUP BY recipe_id`;
    }
    mysqlConnection.query(query1, (error, results, fields) => {
      if (error) {
        console.error("Error with query 1", error);
      } 
      else {
        console.log("query 1 success:", results);
        if(flag != true){
        let recipeIds = results.map((row) => row.recipe_id);
        recipesNotContains = recipeIds;
        }
        if (recipesNotContains.length > 0 && productsInRecipes.length>0) {
          let query2 = `
          SELECT recipe_id
          FROM recipe_products
          WHERE product_id IN (`;

          for (const productId of productsInRecipes) {
            query2 += `${productId},`;
          }
          query2 = query2.slice(0, -1); query2 += ")";
          query2 += "AND recipe_id NOT IN (";
          for (const productId of recipesNotContains) {
            query2 += `${productId},`;
          }
          query2 = query2.slice(0, -1); query2 += ")";
          query2 += "GROUP BY recipe_id";

          mysqlConnection.query(query2, (error, QueryTwoResults, fields) => {
            if (error) {
              console.error("Error with query 2", error);
            } else {
              console.log("query 2 success", QueryTwoResults);
              let recipeIdsResults = QueryTwoResults.map((row) => row.recipe_id);
              if (recipeIdsResults) {
                let finalQuery = `
                SELECT *
                FROM recipes
                WHERE recipe_id IN (`;
                for (const recipeId of recipeIdsResults) {
                  finalQuery += `${recipeId},`;
                }
                finalQuery = finalQuery.slice(0, -1);  finalQuery += ")";
                // finalQuery += "GROUP BY recipe_id";
                mysqlConnection.query(finalQuery, (error, finallResults, fields) => {
                  if (!error) {
                    console.log("finall query succcess", finallResults);
                    res.send(finallResults);
                  } else {
                    console.error("Error with finall query",error);
                  }
                });
              }
            }
          });
        } 
        else {
          if (productsInRecipes.length>0) {
            let query3 = `
            SELECT recipe_id
            FROM recipe_products
            WHERE product_id IN (`;
            for (const productId of productsInRecipes) {
              query3 += `${productId},`;
            }
            query3 = query3.slice(0, -1);  query3 += ")";
            query3 += "GROUP BY recipe_id";

            mysqlConnection.query(query3, (error, queryThreeResults, fields) => {
              if (error){
                console.error("Error with query 3",error);
              }
              else  {
                console.log("Query 3 success", queryThreeResults);
                let recipeIdResults = queryThreeResults.map((row) => row.recipe_id);
                if (recipeIdResults) {
                  let finalQuery = `
                  SELECT *
                  FROM recipes
                  WHERE recipe_id IN (`;
                  for (const recipeId of recipeIdResults) {
                    finalQuery += `${recipeId},`;
                  }
                  finalQuery = finalQuery.slice(0, -1); finalQuery += ")";
                  finalQuery += "GROUP BY recipe_id";
                  mysqlConnection.query(finalQuery,(error, finalResults, fields) => {
                  if (!error) {
                        console.log("final query success", finalResults);
                        res.send(finalResults);
                      } else {
                        console.error("Error with finall query",error);
                      }
                    }
                  );
                }
              }
            });
          } 
          else {
            if (recipesNotContains.length > 0) {
              let query4 = `
              SELECT recipe_id
              FROM recipe_products
              WHERE recipe_id NOT IN (`;
              for (const recipeId of recipesNotContains) {
                query4 += `${recipeId},`;
              }
              query4 = query4.slice(0, -1);  query4 += ")";
              query4 += "GROUP BY recipe_id";
              mysqlConnection.query(query4, (error, queryFourResults, fields) => {
                if (error){
                  console.error("Error with query 4",error);
                }
                else  {
                  console.log("Query 4 success", queryFourResults);
                  let recipeIdResults;
                  if(queryFourResults){
                    recipeIdResults = queryFourResults.map((row) => row.recipe_id);
                  }
                  if (recipeIdResults) {
                      let finalQuery = `
                      SELECT *
                      FROM recipes
                      WHERE recipe_id IN (`;
                      for (const recipeId of recipeIdResults) {
                        finalQuery += `${recipeId},`;
                      }
                      finalQuery = finalQuery.slice(0, -1); finalQuery += ")";
                      finalQuery += "GROUP BY recipe_id";
                      mysqlConnection.query( finalQuery,(error, finalResults, fields) => {
                        if (!error) {
                        console.log("query 4 success", finalResults);
                        res.send(finalResults);
                        }
                       else {
                        console.error("error with query 4",error);
                       }
                      });
                }
                }
              });
            }
            else {
              alert("You dont choose any item to filter....");
              res.send(null);
            }
          }
        }
      }
    });
  }
);

module.exports = RecipiesRouter;
