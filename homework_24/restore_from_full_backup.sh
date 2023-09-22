#!/bin/bash

start_time=$(date +%s%N)  # Capture the start time in nanoseconds

# Get the latest full backup
LATEST_BACKUP=$(ls full_backup_*.tar.gz | sort -r | head -n1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "No full backups found!"
    exit 1
fi

echo "Restoring from latest backup: $LATEST_BACKUP"

# Unarchive the latest backup
tar -xzvf "$LATEST_BACKUP"

# Extract the .sql filename from the tar.gz name
SQL_FILE="${LATEST_BACKUP%.tar.gz}.sql"

# Restore the database
docker exec -i mysql-container mysql -u root --password=root test_db < "$SQL_FILE"

# (Optional) Clean up the extracted .sql file
rm "$SQL_FILE"

end_time=$(date +%s%N)  # Capture the end time in nanoseconds
elapsed_time=$(( (end_time - start_time) / 1000000 ))  # Calculate elapsed time in milliseconds

echo "Total execution time: $elapsed_time ms"
