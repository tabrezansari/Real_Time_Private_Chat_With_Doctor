const express = require('express');
const router = express.Router();
const mysql = require("../config/mysqlconfig.js");
const _ = require("lodash");

router.post('/', async (req, res) => {


	let queryargs = [req.body.email, req.body.password];
	let query = "select * from users where email=? AND password=?";
	mysql.getmysqlconnandrun(function (err, data, msg) {
		if (!err) {
			var resData = {
				message: 1,
				token: data[0].email,
				group: data[0].usergrp,
				name: data[0].name
			}
			console.log("response:",resData)
			res.send(resData);
		}
	}, mysql.queryReturn(query, queryargs));




});



module.exports = router;