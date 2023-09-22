# Homework - 24. Backups

All backed up

Take/create the database from your pet project

Implement all kinds of repository models (Full, Incremental, Differential, Reverse Delta, CDP)

Compare their parameters: size, ability to roll back at specific time point, speed of roll back, cost

## Note

we'll implement only Full and Incremental backups


## How to run

To run mysql instance:

```
docker compose up
``` 

## Test results

First, we run 

```
chmod +x ./insert_data.sh && ./insert_data.sh
```

to insert some data to the database

after we create full and first incremental backup:

```
chmod +x ./full_backup.sh && ./full_backup.sh
chmod +x ./incremental_backup.sh && ./incremental_backup.sh
```

The first command will create a full backup using `mysqldump`
The second one uses `mysqlbinlog` to get latest updates from mysql's binlog. It remembers the last binlog entry and does `--flush-logs` to close the current binlog file

We run that 5 times (insert + both backups);

In the end we have the following:

| Filename                                     | Size (MB) |
|----------------------------------------------|-----------|
| full_backup_20230922_181829.tar.gz           | 16        |
| full_backup_20230922_182130.tar.gz           | 24        |
| full_backup_20230922_182254.tar.gz           | 32        |
| full_backup_20230922_182853.tar.gz           | 40        |
| full_backup_20230922_182928.tar.gz           | 47        |
| full_backup_20230922_183011.tar.gz           | 55        |
| backup_incremental_20230922_181919.tar.gz    | 44        |
| backup_incremental_20230922_182136.tar.gz    | 17        |
| backup_incremental_20230922_182249.tar.gz    | 16        |
| backup_incremental_20230922_182856.tar.gz    | 16        |
| backup_incremental_20230922_182931.tar.gz    | 16        |
| backup_incremental_20230922_183016.tar.gz    | 16        |

Total size for full backups: 214 MB

Total size for incremental backups: 125 MB

### Restore

Let's drop the table in db and restore it using both backups:

```
chmod +x ./restore_from_full_backup.sh && ./restore_from_full_backup.sh
chmod +x ./restore_from_incremental_backup.sh && ./restore_from_incremental_backup.sh
```

First script will take the latest full backup and restore it

Second script takes all incremental backups from the folder and restores them 1 by 1

Amount of rows in the db table: ~715000

| Type                                         | Time taken |
|----------------------------------------------|-----------  |
| Full backup restore                          |     ~60s    |
| Incremental backup restore                   |     ~10m    |

## Conclusions

| Metric                           | Full Backup                      | Incremental Backup             |
|----------------------------------|----------------------------------|----------------------------------|
| Size                             | Typically Larger                 | Smaller (changes only)          |
| Ability to Roll Back at Specific Time Point | Yes (to the point of backup)   | Yes (requires a full backup and all subsequent incrementals) |
| Speed of Roll Back               | Faster (direct restore)          | Slower (sequential restore needed) |
| Cost                             | Higher (more storage space used) | Lower (less storage space used) |
