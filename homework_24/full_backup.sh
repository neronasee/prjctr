#!/bin/bash

start_time=$(date +%s%N)  # Capture the start time in nanoseconds

# Unarchive the backup
tar -xzvf full_backup.tar.gz

# Restore the database
docker exec -i mysql-container mysql -u root --password=root test_db < full_backup.sql

# (Optional) Clean up the extracted .sql file
rm full_backup.sql

end_time=$(date +%s%N)  # Capture the end time in nanoseconds

elapsed_time=$(( (end_time - start_time) / 1000000 ))  # Calculate elapsed time in milliseconds

echo "Total execution time: $elapsed_time ms"
