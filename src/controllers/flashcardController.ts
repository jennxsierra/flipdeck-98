import { Request, Response } from "express";
import {
  getAllFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../models/flashcardModel.js";

export const renderHomepage = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.search as string | undefined;
    const sortOption = req.query.sort as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 5; // Cards per page
    const offset = (page - 1) * limit;

    // Get flashcards with search, sort, and pagination options
    const { flashcards, totalCount } = await getAllFlashcards({
      searchTerm,
      sortOrder: sortOption === "oldest" ? "asc" : "desc",
      limit,
      offset,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);

    res.render("index", {
      flashcards,
      query: req.query,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error loading homepage:", error);
    res.status(500).render("error", { message: "Failed to load homepage." });
  }
};

export const renderStudyPage = async (_req: Request, res: Response) => {
  try {
    const { flashcards } = await getAllFlashcards();
    res.render("flashcards/study", { flashcards });
  } catch (error) {
    res.status(500).render("error", { message: "Failed to load study page." });
  }
};

export const getFlashcardsAsJson = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.search as string | undefined;
    const sortOption = req.query.sort as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || undefined;
    const offset = page && limit ? (page - 1) * limit : undefined;

    const { flashcards, totalCount } = await getAllFlashcards({
      searchTerm,
      sortOrder: sortOption === "oldest" ? "asc" : "desc",
      limit,
      offset,
    });

    res.json({
      flashcards,
      pagination: {
        currentPage: page,
        totalPages: limit ? Math.ceil(totalCount / limit) : 1,
        totalItems: totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
};

export const showAddFlashcardForm = (_req: Request, res: Response) => {
  res.render("flashcards/new");
};

export const createFlashcardHandler = async (req: Request, res: Response) => {
  const { prompt, answer } = req.body;
  const errors: { [key: string]: string } = {};

  // Validate prompt
  if (!prompt || prompt.trim().length < 3) {
    errors.prompt = "Prompt must be at least 3 characters.";
  } else if (prompt.length > 500) {
    errors.prompt = "Prompt cannot exceed 500 characters.";
  }

  // Validate answer
  if (!answer || answer.trim().length < 3) {
    errors.answer = "Answer must be at least 3 characters.";
  } else if (answer.length > 500) {
    errors.answer = "Answer cannot exceed 500 characters.";
  }

  // If there are errors, re-render the form with error messages
  if (Object.keys(errors).length > 0) {
    return res.render("flashcards/new", {
      flashcard: { prompt, answer },
      errors,
    });
  }

  // If validation passes, create the flashcard
  await createFlashcard({ prompt, answer });
  res.redirect("/");
};

export const showEditFlashcardForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .render("error", { message: "Invalid flashcard ID" });
    }

    const flashcard = await getFlashcardById(id);
    res.render("flashcards/edit", { flashcard });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(404).render("error", { message: errorMessage });
  }
};

export const updateFlashcardHandler = async (req: Request, res: Response) => {
  const { prompt, answer } = req.body;
  const id = Number(req.params.id);
  const errors: { [key: string]: string } = {};

  // Validate prompt
  if (!prompt || prompt.trim().length < 3) {
    errors.prompt = "Prompt must be at least 3 characters.";
  } else if (prompt.length > 500) {
    errors.prompt = "Prompt cannot exceed 500 characters.";
  }

  // Validate answer
  if (!answer || answer.trim().length < 1) {
    errors.answer = "Answer must be at least 1 character.";
  } else if (answer.length > 500) {
    errors.answer = "Answer cannot exceed 500 characters.";
  }

  // If there are errors, re-render the form with error messages
  if (Object.keys(errors).length > 0) {
    try {
      const flashcard = await getFlashcardById(id);
      return res.render("flashcards/edit", {
        flashcard: { ...flashcard, prompt, answer, id },
        errors,
      });
    } catch (error) {
      return res.status(404).render("error", {
        message: "Failed to retrieve flashcard",
      });
    }
  }

  // If validation passes, update the flashcard
  await updateFlashcard(id, { prompt, answer });
  res.redirect("/");
};

export const deleteFlashcardHandler = async (req: Request, res: Response) => {
  try {
    await deleteFlashcard(Number(req.params.id));
    res.redirect("/?alert=success"); // Redirect with a success alert
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    res.redirect("/?alert=error"); // Redirect with an error alert
  }
};
