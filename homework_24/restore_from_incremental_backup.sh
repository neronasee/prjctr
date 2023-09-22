#!/bin/bash

start_time=$(date +%s%N)  # Capture the start time in nanoseconds

# Get a list of all incremental backup tarballs sorted in ascending order
BACKUP_TARBALLS=$(ls backup_incremental_*.tar.gz | sort)

# Temporary directory for unarchiving
TMP_DIR=tmp_restore_dir
mkdir -p $TMP_DIR

# Restore each incremental backup tarball
for TARBALL in $BACKUP_TARBALLS; do
    tarball_start_time=$(date +%s%N)  # Capture the start time for the current tarball in nanoseconds

    echo "Processing $TARBALL..."

    # Unarchive the backup tarball
    tar -xzvf $TARBALL -C $TMP_DIR

    # Directory where SQL files are present after extraction
    SQL_DIR=$TMP_DIR/tmp_backup_dir

    # Apply each SQL file in the unarchived directory
    for SQL_FILE in $(ls $SQL_DIR/*.sql); do
        sql_start_time=$(date +%s%N)  # Capture the start time for the current SQL file in nanoseconds

        echo "Restoring $SQL_FILE..."
        docker exec -i mysql-container mysql -u root --password=root test_db < $SQL_FILE

        sql_end_time=$(date +%s%N)  # Capture the end time for the current SQL file in nanoseconds
        sql_elapsed_time=$(( (sql_end_time - sql_start_time) / 1000000 ))  # Calculate elapsed time in milliseconds
        echo "Restored $SQL_FILE in $sql_elapsed_time ms"
    done

    tarball_end_time=$(date +%s%N)  # Capture the end time for the current tarball in nanoseconds
    tarball_elapsed_time=$(( (tarball_end_time - tarball_start_time) / 1000000 ))  # Calculate elapsed time in milliseconds
    echo "Processed $TARBALL in $tarball_elapsed_time ms"

    # Clear the temporary directory for the next iteration
    rm -rf $TMP_DIR/*
done

# Cleanup: Remove the temporary directory
rm -rf $TMP_DIR

end_time=$(date +%s%N)  # Capture the end time in nanoseconds
elapsed_time=$(( (end_time - start_time) / 1000000 ))  # Calculate elapsed time in milliseconds

echo "Restoration complete! Total execution time: $elapsed_time ms"
