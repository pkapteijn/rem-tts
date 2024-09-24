#!/usr/bin/bash 
 docker run --name pauls-postgres -e POSTGRES_PASSWORD=$POSTGRES_PWD \
    -d -p 5432:5432 -v postgres-data:/var/lib/postgresql/data postgres
