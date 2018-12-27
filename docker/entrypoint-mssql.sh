#!/bin/bash

echo running command "$@"
if [ "$1" = '/opt/mssql/bin/sqlservr' ]; then
  /opt/mssql/bin/sqlservr --setup & /usr/src/app/import-data.sh
fi

exec "$@"
