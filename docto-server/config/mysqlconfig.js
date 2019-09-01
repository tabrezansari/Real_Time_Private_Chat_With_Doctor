var mysql = require('mysql');

var connectionconfig = {
    'connectionLimit': 5,
    'host': 'localhost',
    'user': 'root',
    'password': 'intellicar',
    'database': 'docto',
    'debug': false
    //'multipleStatements': true
};

var mysqlpool = mysql.createPool(connectionconfig);

var getmysqlconnandrun = function (callback, funcafterconnection) {
    mysqlpool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null, "Connection to mysql failed");
        } else {
            console.log("Connected");
            funcafterconnection(connection, callback);
        }
    });
};

var queryReturn = function (queryToRun, queryArg) {
    return function (connection, callback) {
        var sqlquery = connection.query(queryToRun, queryArg, function (err, results) {
            console.log("Connected and entered");
            connection.release();
            if (err) {
                console.log("Connected and failed", err);
                callback(err, null, "Query Run Error");
            }

            else {
                console.log("Connected and passed");
                callback(null, results, "Query ran successfully");
            }
        });
        console.log(sqlquery.sql);
    };
};

exports.connection = connectionconfig;
exports.mysqlpool = mysqlpool;
exports.getmysqlconnandrun = getmysqlconnandrun;
exports.queryReturn = queryReturn;