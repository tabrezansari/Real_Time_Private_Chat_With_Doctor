const express = require('express');
const router = express.Router();
const _ = require("lodash");
const mysql = require("../config/mysqlconfig");




router.post('/getList', async (req, res) => {
	console.log("req data:",req.body)
    
	let queryargs = [req.body.userid];
	let query = "SELECT * FROM schat WHERE user1=?";
    console.log("fianl query",query)
	mysql.getmysqlconnandrun(function (err, data, msg) {
	    if (!err){
		console.log("user message history is:",data)
		
	     res.send(data);
		}
	}, mysql.queryReturn(query, queryargs));


});

router.post('/getAllChats', async (req, res) => {
	console.log("req data:",req.body)
    
	let queryargs = [req.body.userid,req.body.friendid,req.body.friendid,req.body.userid];
	let query = "SELECT id,to_user_id as userid,message FROM message WHERE (from_user_id = ? AND to_user_id = ?)	OR	(from_user_id = ? AND to_user_id = ? ) ORDER BY id ASC";
    console.log("fianl query",query)
	mysql.getmysqlconnandrun(function (err, data, msg) {
	    if (!err){
		console.log("user message history is:",data)
		
	     res.send(data);
		}
	}, mysql.queryReturn(query, queryargs));


});



module.exports=router;
