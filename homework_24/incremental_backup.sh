#!/bin/bash

# Get the last binlog file and position (assumes you saved them to files last time)
LAST_BINLOG_FILE=$(cat last_binlog_file.txt 2>/dev/null)
LAST_POSITION=$(cat last_binlog_position.txt 2>/dev/null)

# Obtain a list of all binary log files
BINLOG_FILES=$(docker exec mysql-container mysql -u root --password=root -e "SHOW BINARY LOGS;" | awk '{print $1}' | tail -n +2)

# Determine starting point
START_FROM_FILE=$LAST_BINLOG_FILE
if [ -z "$START_FROM_FILE" ]; then
    START_FROM_FILE=$(echo "$BINLOG_FILES" | head -n 1)
fi

# Flag to determine if we should start capturing
START_CAPTURE=false
if [ -z "$LAST_BINLOG_FILE" ]; then
    START_CAPTURE=true
fi

# Temporary directory for storage
TMP_DIR=tmp_backup_dir
mkdir -p $TMP_DIR

# Process each file
for FILE in $BINLOG_FILES; do
    if [ "$FILE" = "$START_FROM_FILE" ]; then
        START_CAPTURE=true
    fi
    if $START_CAPTURE; then
        if [ "$FILE" = "$LAST_BINLOG_FILE" ]; then
            docker exec mysql-container mysqlbinlog --no-defaults -u root --password=root --start-position=$LAST_POSITION -r /tmp/backup_incremental_${FILE}.sql /var/lib/mysql/$FILE
        else
            docker exec mysql-container mysqlbinlog --no-defaults -u root --password=root -r /tmp/backup_incremental_${FILE}.sql /var/lib/mysql/$FILE
        fi
        docker cp mysql-container:/tmp/backup_incremental_${FILE}.sql $TMP_DIR/
        docker exec mysql-container rm /tmp/backup_incremental_${FILE}.sql
    fi
done

# Archive the result
tar -czf backup_incremental_$(date +"%Y%m%d_%H%M%S").tar.gz $TMP_DIR
rm -rf $TMP_DIR

# FLUSH LOGS after the backup
docker exec mysql-container mysql -u root --password=root -e "FLUSH LOGS;"

# Record the file and position of the last event for next time
echo $(docker exec mysql-container mysql -u root --password=root -e "SHOW MASTER STATUS\G" | grep File | awk '{print $2}') > last_binlog_file.txt
echo $(docker exec mysql-container mysql -u root --password=root -e "SHOW MASTER STATUS\G" | grep Position | awk '{print $2}') > last_binlog_position.txt
