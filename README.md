node-db-monitor
===============

an application which can allow a db to be queried using ReST API based on predefined queries.

This program allows for a set of queries to be invoked using ReST api (from express) and execute named queries defined in configuration.json

the query results are exported in response.


NOTE: the current impl has been made to work with MSSQL server, please change 

require ("any-db-mssql") to require("any-db-<<whatever db you want>>") in line 1

you should be good to go.

the configuration.json file is self explanatory, email me for any clarifications.
