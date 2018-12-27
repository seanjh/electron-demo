#!/bin/bash
set -euo pipefail

if [ ! -e /INITIALIZED ]; then
  #wait for the SQL Server to come up
  sleep 10s
  apt-get update -y && apt-get install curl -y --no-install-recommends

  echo initializing database
  mkdir -p /var/opt/mssql/backup

  echo downloading backup
  cd /var/opt/mssql/backup
  curl -L -o wwi.bak \
    'https://github.com/Microsoft/sql-server-samples/releases/download/wide-world-importers-v1.0/WideWorldImporters-Full.bak'

  echo inspecting backup
  /opt/mssql-tools/bin/sqlcmd -S localhost \
    -U sa -P "$SA_PASSWORD" \
    -Q 'RESTORE FILELISTONLY FROM DISK = "/var/opt/mssql/backup/wwi.bak"' \
    | tr -s ' ' | cut -d ' ' -f 1-2

  echo loading backup
  /opt/mssql-tools/bin/sqlcmd -S localhost \
    -U sa -P "$SA_PASSWORD" \
  -Q 'RESTORE DATABASE WideWorldImporters FROM DISK = "/var/opt/mssql/backup/wwi.bak" WITH MOVE "WWI_Primary" TO "/var/opt/mssql/data/WideWorldImporters.mdf", MOVE "WWI_UserData" TO "/var/opt/mssql/data/WideWorldImporters_userdata.ndf", MOVE "WWI_Log" TO "/var/opt/mssql/data/WideWorldImporters.ldf", MOVE "WWI_InMemory_Data_1" TO "/var/opt/mssql/data/WideWorldImporters_InMemory_Data_1"'
  #run the script to create the DB and the schema
  #/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master \
    #-i /usr/src/app/schema.sql

  #run the script to insert the sample data
  #/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master \
    #-i /usr/src/app/insert.sql

  touch /INITIALIZED
else
  echo no initialization required
fi
