import { query } from "../config/dbConfig.js";

export interface Flashcard {
  id?: number;
  prompt: string;
  answer: string;
  created_at?: Date;
  updated_at?: Date;
}

export const getAllFlashcards = async (): Promise<Flashcard[]> => {
  const result = await query(
    "SELECT * FROM flashcards ORDER BY created_at DESC"
  );
  if (result.rows.length === 0) {
    throw new Error("No flashcards found in the database.");
  }
  return result.rows;
};

export const getFlashcardById = async (
  id: number
): Promise<Flashcard | null> => {
  const result = await query("SELECT * FROM flashcards WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    throw new Error(`Flashcard with ID ${id} not found.`);
  }
  return result.rows[0];
};

export const createFlashcard = async (
  flashcard: Flashcard
): Promise<Flashcard> => {
  const result = await query(
    "INSERT INTO flashcards (prompt, answer) VALUES ($1, $2) RETURNING *",
    [flashcard.prompt, flashcard.answer]
  );
  return result.rows[0];
};

export const updateFlashcard = async (
  id: number,
  flashcard: Flashcard
): Promise<Flashcard> => {
  const result = await query(
    "UPDATE flashcards SET prompt = $1, answer = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
    [flashcard.prompt, flashcard.answer, id]
  );
  return result.rows[0];
};

export const deleteFlashcard = async (id: number): Promise<void> => {
  await query("DELETE FROM flashcards WHERE id = $1", [id]);
};
