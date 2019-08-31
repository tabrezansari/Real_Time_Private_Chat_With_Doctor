const express = require('express');
const router = express.Router();
const _ = require("lodash");
const mysql = require("../config/mysqlconfig");


var storeChat=(from,to,msg)=>{
    let queryargs = [from,to,msg];
	let query = "insert into message (from_user_id,to_user_id,message) VALUES(?,?,?) ";
    console.log("fianl query",query)
	mysql.getmysqlconnandrun(function (err, data, msg) {
	    if (!err){
			console.log("message stored in the database!")
			
		}
	}, mysql.queryReturn(query, queryargs));
}

var getSuccessChats=(userId)=>{
	let queryargs = [userId,userId];
	let query = "select * from message where from_user_id=? OR to_user_id=? GROUP BY to_user_id";
    console.log("fianl query",query)
	mysql.getmysqlconnandrun(function (err, data, msg) {
	    if (!err){
		console.log("user message history is:",data)
		return data;			
		}
	}, mysql.queryReturn(query, queryargs));
}


router.post('/', async (req, res) => {
	console.log("req data:",req.body)
    

	let queryargs = [req.body.email, req.body.password];
	let query = "select * from users where email=? AND password=?";
    console.log("fianl query",query)
	mysql.getmysqlconnandrun(function (err, data, msg) {
	    if (!err){
			var resData={
				message:1,
				token:data[0].email,
				group:data[0].usergrp
			}

	        res.send(resData);
	    }
	}, mysql.queryReturn(query, queryargs));




});


exports.storeChat=storeChat;
exports.getSuccessChats=getSuccessChats;