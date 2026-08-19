#!/bin/bash

# Start SQL Server in background
/opt/mssql/bin/sqlservr &
MSSQL_PID=$!

echo "Waiting for SQL Server to become ready..."
for i in $(seq 1 60); do
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" -C 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "SQL Server is ready!"
        break
    fi
    echo "  Attempt $i/60 — sleeping 2s..."
    sleep 2
done

echo "Running database initialization script..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i /init.sql -C
echo "Database initialization complete!"

# Keep the container running (wait for SQL Server)
wait $MSSQL_PID
