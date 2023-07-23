# HW9. SQL Databases

## Description

InnoDB Indexes

Use MySQL (or fork) with InnoDB

Make a table for 40M users

Compare performance of selections by date of birth:

Without index

With BTREE index

With HASH index

Check insert speed difference with different `innodb_flush_log_at_trx_commit` value and different ops per second


## Usage

1. docker compose up mysql -d
2. docker compose up insert_users
3. docker compose up benchmark


## Inserts

|  `innodb_flush_log_at_trx_commit` setting | queries/second |
|---|---|
| 0  | 108701  |
| 1  | 63673   |
| 2  | 96255   |

## `SELECT` benchmarks


 Exact (=) : `SELECT * FROM Users WHERE birth_date = '2000-01-01' LIMIT 10000`                   
 
 Comparrison (>) :  `SELECT * FROM Users WHERE birth_date > '2000-01-01' LIMIT 10000`     

High selectivity (BETWEEN) : `SELECT * FROM Users WHERE birth_date BETWEEN '2000-01-01' AND '2000-01-31' LIMIT 10000`

  Low selectivity (BETWEEN): `SELECT * FROM Users WHERE birth_date BETWEEN '2000-01-01' AND '2005-01-31' LIMIT 10000`

|  SELECT type \ queries/second | Without Index  |  Btree index  | Hash idnex  |   
|---|---|---|---|
| Exact (=)                     | 4.96    |  450.21 |  **588.44** |   
| Comparrison (>)               |  **74.63**  | 5.21   | 25.51   |   
|  High selectivity (BETWEEN)   |  1.70   | 27.70   | **30.40**   |  
|  Low selectivity (BETWEEN)    | **37.59**   | 18.94  |  16.90  |  

