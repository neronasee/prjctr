# Isolations & locks 

## Task
Set up percona and postgre and create an InnoDB table 

By changing isolation levels and making parallel queries, reproduce the main problems of parallel access:

- lost update
- dirty read
- non-repeatable read
- phantom read

## Test Data

### Maria DB
```sql
CREATE TABLE accounts (
  id INT PRIMARY KEY,
  balance INT
) ENGINE=InnoDB;
```

### PostgreSQL

```sql
-- Insert sample data
INSERT INTO accounts (id, balance) VALUES (1, 1000);
INSERT INTO accounts (id, balance) VALUES (2, 1500);
```


## Lost Update

```sql
-- Set Isolation Levels for MariaDB
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- or
-- Set Isolation Levels for PostgreSQL
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Session 1 increase by 100
(1)START TRANSACTION;
(2)SELECT balance FROM accounts WHERE id = 1;
(3)UPDATE accounts SET balance = 1100 WHERE id = 1;
(4)COMMIT;

 
 -- Session 2 decrease by 100
(1)START TRANSACTION;
(2)SELECT balance FROM accounts WHERE id = 1;
(5)UPDATE accounts SET balance = 900 WHERE id = 1;
(6)COMMIT;


```

### Conclusion
Getting 900 or 1100 (depending on which transactrion was commited first) and not the expected result - 1000;

Lost update is reproducable both for MariaDB and for PostgreSQL on isolation levels other than Serializable

## Dirty Read

```sql
-- Set Isolation Levels for MariaDB
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- or
-- Set Isolation Levels for PostgreSQL
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Session 1 - update then rollback
(1)START TRANSACTION;
(2)UPDATE accounts SET balance = 1000 WHERE id = 1;
(4)ROLLBACK;

-- Sesssion 2 - select before rollback
(1)START TRANSACTION;
(3)SELECT balance FROM accounts WHERE id = 1;
(5)COMMIT;

```
### Conclusion

On read-commited isolation level dirty read is reproducable for MariaDB, but not for Postgresql, since it treats `READ_UNCOMMITED` isolation level as `READ_COMMITED`

## Non-repeatable read

```sql
-- Set Isolation Levels for MariaDB
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITED;
-- or
-- Set Isolation Levels for PostgreSQL
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL READ COMMITED;

-- Session 1
(1)START TRANSACTION;
(3)SELECT balance FROM accounts WHERE id = 1;
(6)SELECT balance FROM accounts WHERE id = 1;
(7)COMMIT;

-- Session 2
(2)START TRANSACTION;
(4)UPDATE accounts SET balance = 0 WHERE id = 1;
(5)COMMIT;
```

### Conclusion

Non-repetable read is reproducable both for MariaDB and Postgresql on isolation levels lower than `REPEATABLE_READ`

## Phantom Read

```sql
-- Set Isolation Levels for MariaDB
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITED;
-- or
-- Set Isolation Levels for PostgreSQL
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL READ COMMITED;

-- Session 1
(1)START TRANSACTION;
(2)SELECT * FROM accounts WHERE balance >= 1100;
(5)SELECT * FROM accounts WHERE balance >= 1200;
(6)COMMIT;

-- Session 2
(1)START TRANSACTION;
(3)INSERT INTO accounts (id, balance) VALUES (3, 1300);
(4)COMMIT;
```

### Conclusion

Phantom read happens for both MariaDB and Postgresql on isolation levels lower than `REPEATABLE_READ`;