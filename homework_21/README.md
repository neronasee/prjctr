# HW21. Database: Replication

Set up MySQL Cluster

Create 3 docker containers: mysql-m, mysql-s1, mysql-s2

Setup master slave replication (Master: mysql-m, Slave: mysql-s1, mysql-s2)

Write script that will frequently write data to database

Ensure, that replication is working

Try to turn off mysql-s1

## How to run

To run master and 2 slaves run:
```
./build.sh
```

To start script that inserts a data into the master into the table users

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL
);

```


```
docker compose up insert_data_script --build
```

## Test results

Replication works as expected 

While stopping and then starting one of the slaves it gets in sync short time after

### Deleting column from the end

This results in just missing data replicated on slave

### Deleting column from the middle

If the column data type is the same (it is in our case) we get a shift of columns because of use ROW binlog format

![image](https://github.com/neronasee/prjctr/assets/15675643/b973b193-0818-464b-8881-06d35a826fbd)


in case of different type we get an error that data can't be converted and a slave replication becomes broken
