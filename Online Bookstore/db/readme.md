# Database Directory

This folder contains all files and components related to the **database files** of the Online Bookstore project.

Postgresql
Create User:
```
createuser obs_user --pwprompt --createdb
createdb -U obs_user obs_db
```
Restore the database:
```
psql -U obs_user -d obs_db -f db/obs_db_dump.sql
```
