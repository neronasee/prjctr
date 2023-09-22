#!/bin/bash

# Configuration based on docker-compose settings
HOST="localhost"  # Use the service name as the hostname
PORT="3306"
USER="root"
PASSWORD="root"
DATABASE="test_db"
TABLE="test_data"
SQL_FILE="insert_data.sql"
BATCH_SIZE=100

# If SQL file already exists, use it
if [ -f $SQL_FILE ]; then
    echo "Existing SQL file detected: $SQL_FILE"
else
    # Create the table if it does not exist
    CREATE_TABLE_SQL="CREATE TABLE IF NOT EXISTS $TABLE (
        id INT AUTO_INCREMENT PRIMARY KEY,
        random_data TEXT
    );"

    echo "$CREATE_TABLE_SQL" > $SQL_FILE

    # Generate the rest of the SQL file with about 50MB of data
    echo "Generating SQL file with random data..."

    COUNT=0
    for i in {1..100000}; do
        # Starting a transaction every BATCH_SIZE records
        if [ $(($COUNT % $BATCH_SIZE)) -eq 0 ]; then
            echo "START TRANSACTION;" >> $SQL_FILE
        fi

        # Generating a random string of length 100
        RANDOM_DATA=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 100 | head -n 1)
        echo "INSERT INTO $TABLE (random_data) VALUES ('$RANDOM_DATA');" >> $SQL_FILE

        COUNT=$((COUNT+1))

        # Committing the transaction every BATCH_SIZE records
        if [ $(($COUNT % $BATCH_SIZE)) -eq 0 ] || [ $COUNT -eq 10000 ]; then
            echo "COMMIT;" >> $SQL_FILE
        fi
    done

    echo "Generated SQL file: $SQL_FILE"
fi

# Insert the generated data into the MySQL database
echo "Inserting data into the MySQL database..."
docker exec -i mysql-container mysql -h $HOST -P $PORT -u $USER -p$PASSWORD $DATABASE < $SQL_FILE
echo "Data insertion completed."

# Clean up the SQL file
# rm $SQL_FILE  # Commenting out if you want to reuse the file in the future.

echo "Done."
