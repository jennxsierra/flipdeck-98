\echo '\n\033[1;31m[PSQL] Dropping Database and User\033[0m'
DROP DATABASE IF EXISTS flashcards;
DROP USER IF EXISTS flipdeck_user;

\echo '\033[1;34m[PSQL] Creating Database and User\033[0m'
CREATE USER flipdeck_user WITH PASSWORD '#swordfish#';
CREATE DATABASE flashcards OWNER flipdeck_user;