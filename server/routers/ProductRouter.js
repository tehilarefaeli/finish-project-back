const { Router } = require('express');
const express = require('express')

const { mysqlConnection } = require('../sql/sql');
const mysql = require('node-mysql');

const ProductRouter = Router();

ProductRouter.get('/all', (req, res) => {
    mysqlConnection.query('SELECT p.product_id, p.product_name  FROM products_mapping p', (err, rows) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
})


module.exports = ProductRouter;
