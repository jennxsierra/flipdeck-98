import { query } from "../config/dbConfig.js";

export interface Flashcard {
  id?: number;
  prompt: string;
  answer: string;
  created_at?: Date;
  updated_at?: Date;
}

interface FlashcardQueryOptions {
  searchTerm?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export const getAllFlashcards = async (
  options: FlashcardQueryOptions = {}
): Promise<{ flashcards: Flashcard[]; totalCount: number }> => {
  try {
    const { searchTerm, sortOrder = "desc", limit, offset } = options;

    // Build the base query for filtering
    let whereClause = "";
    const queryParams: any[] = [];

    if (searchTerm) {
      whereClause = "WHERE prompt ILIKE $1 OR answer ILIKE $1";
      queryParams.push(`%${searchTerm}%`);
    }

    // Get the total count of matching flashcards
    const countResult = await query(
      `SELECT COUNT(*) FROM flashcards ${whereClause}`,
      searchTerm ? queryParams : []
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // Build the query for fetching flashcards with pagination
    let queryText = `SELECT * FROM flashcards ${whereClause}`;
    queryText += ` ORDER BY created_at ${sortOrder === "asc" ? "ASC" : "DESC"}`;

    // Add pagination if limit is specified
    if (limit !== undefined && offset !== undefined) {
      queryText +=
        " LIMIT $" +
        (queryParams.length + 1) +
        " OFFSET $" +
        (queryParams.length + 2);
      queryParams.push(limit, offset);
    }

    const result = await query(queryText, queryParams);

    return {
      flashcards: result.rows,
      totalCount,
    };
  } catch (error) {
    console.error("Database query error:", error);
    return { flashcards: [], totalCount: 0 };
  }
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
