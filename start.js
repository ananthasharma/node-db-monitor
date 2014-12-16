var anydb = require("any-db-mssql");
var express = require("express");
var config = require("./configuration.json");

var app = express();

app.get("/get",function(req, resp){
	var queryId = req.query.namedQuery;
	var stmtConf = getConfig(queryId);
	if(stmtConf==null) {
		resp.send({"error":"Query ID Not Found."});
		return;
	}
	var query = stmtConf.queryString;
	var isDML = stmtConf.isDML;
	resp.send(JSON.stringify(stmtConf));
	var params = stmtConf.params;
	var paramArray = [];
	params.forEach(function(item){
		paramArray.push(eval("req.query.dbo_"+item));
	});

	var dbResp = getQueryResponse(query, isDML, paramArray);
	resp.send(dbResp);

});


/**
 reads config from the file for a specific query id
 **/
function getConfig(queryId){
	var resp=null;
	for( e in config.queries){
		var elem = config.queries[e];
		console.log("comparing "+queryId+" with "+elem.name);
		if(elem.name === queryId){
			console.log("found elem");
			resp = elem;
			break;
		}
	}
	return resp;
}

/**
 runs the query in the database and returns the response
**/
function getQueryResponse(sql, isDML, paramArray){
	var resp=null;
	var conn = anydb.createConnection(config.dbUrl);
	if(isDML){
		var tx = conn.begin();
		tx.on("error",function(error){
			tx.rollback();
		});
		if(paramArray==null || paramArray.length>0){
			tx.query(sql, paramArray, function(error, result){
				resp = result;
			});
			tx.commit();
		}else{
			tx.query(sql, function(error, result){
				resp = result;
			});						
		}
	}
	else{
		pool.query(sql, function(error, result){
			resp=result;
		});
	}
	return resp;
}

app.listen(3000);
