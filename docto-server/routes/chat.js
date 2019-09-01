const express = require('express');
const router = express.Router();
const _ = require("lodash");
const mysql = require("../config/mysqlconfig");


var storeChat = (from, to, msg) => {
	let queryargs = [from, to, msg];
	if (to) {


		let query = "insert into message (from_user_id,to_user_id,message) VALUES(?,?,?) ";
		mysql.getmysqlconnandrun(function (err, data, msg) {
			if (!err) {

			}
		}, mysql.queryReturn(query, queryargs));
	}

}


var storeSChat = (u1, u2) => {
	let queryargs = [u1, u2];
	let query = "insert into schat (user1,user2) VALUES(?,?) ";
	let query2 = "select * from schat where user1=? AND user2=?";

	mysql.getmysqlconnandrun(function (err, data, msg) {

		if (data.length == 0) {
			mysql.getmysqlconnandrun(function (err, data, msg) {
				if (!err) {
				}
			}, mysql.queryReturn(query, queryargs));
		}
	}, mysql.queryReturn(query2, queryargs));

}

var getSuccessChats = (userId) => {
	let queryargs = [userId];
	let query = "SELECT * FROM schat WHERE user1=?";

	mysql.getmysqlconnandrun(function (err, data, msg) {
		if (!err) {

			return data;
		}
	}, mysql.queryReturn(query, queryargs));
}




exports.storeChat = storeChat;
exports.storeSChat = storeSChat;
exports.getSuccessChats = getSuccessChats;