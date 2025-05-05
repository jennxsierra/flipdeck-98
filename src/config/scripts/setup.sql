\echo '\n\033[1;34m===== FlipDeck-98 Database Setup =====\033[0m'

-- Enable better error reporting
\set ON_ERROR_STOP on

-- First, connect to a different database to ensure we're not connected to the one we want to drop
\c postgres;

\echo '\n\033[1;31m[PSQL] Dropping Database (if it exists)\033[0m'
-- Drop database first
DROP DATABASE IF EXISTS flashcards;

\echo '\n\033[1;31m[PSQL] Dropping User (if it exists)\033[0m'
-- Drop owned objects first to handle dependencies, then drop the user
DROP OWNED BY flipdeck_user CASCADE;
DROP USER IF EXISTS flipdeck_user;

\echo '\n\033[1;34m[PSQL] Creating Database User\033[0m'
CREATE USER flipdeck_user WITH PASSWORD '#swordfish#';

\echo '\n\033[1;34m[PSQL] Creating Database\033[0m'
CREATE DATABASE flashcards OWNER flipdeck_user;

-- Connect to the newly created database
\c flashcards

\echo '\n\033[1;34m[PSQL] Creating Tables\033[0m'

CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo '\n\033[1;34m[PSQL] Creating Triggers\033[0m'

-- Trigger to update the `updated_at` column on update
CREATE OR REPLACE FUNCTION update_flashcard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER flashcard_update_trigger
BEFORE UPDATE ON flashcards
FOR EACH ROW
EXECUTE FUNCTION update_flashcard_updated_at();

\echo '\n\033[1;34m[PSQL] Inserting Example Data\033[0m'

INSERT INTO flashcards (prompt, answer)
VALUES
    ('What are the starters for Pokémon Red/Blue?', 'Bulbasaur, Charmander, Squirtle'),
    ('What are the starters for Pokémon Gold/Silver?', 'Chikorita, Cyndaquil, Totodile'),
    ('What are the starters for Pokémon Ruby/Sapphire?', 'Treecko, Torchic, Mudkip'),
    ('What are the starters for Pokémon Diamond/Pearl?', 'Turtwig, Chimchar, Piplup'),
    ('What are the starters for Pokémon Black/White?', 'Snivy, Tepig, Oshawott'),
    ('What are the starters for Pokémon X/Y?', 'Chespin, Fennekin, Froakie'),
    ('What are the starters for Pokémon Sun/Moon?', 'Rowlet, Litten, Popplio'),
    ('What are the starters for Pokémon Sword/Shield?', 'Grookey, Scorbunny, Sobble'),
    ('What are the starters for Pokémon Scarlet/Violet?', 'Sprigatito, Fuecoco, Quaxly');

\echo '\n\033[1;34m[PSQL] Changing Ownership of Objects\033[0m'

-- Change ownership of the flashcards table
ALTER TABLE flashcards OWNER TO flipdeck_user;

-- Change ownership of the update_flashcard_updated_at function
ALTER FUNCTION update_flashcard_updated_at() OWNER TO flipdeck_user;

\echo '\n\033[1;32m[PSQL] Database setup completed successfully!\033[0m'