import { Request, Response } from "express";
import {
  getAllFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../models/flashcardModel.js";

export const renderHomepage = async (_req: Request, res: Response) => {
  try {
    const flashcards = await getAllFlashcards();
    res.render("index", { flashcards });
  } catch (error) {
    res.status(500).render("error", { message: "Failed to load homepage." });
  }
};

export const getFlashcardsAsJson = async (_req: Request, res: Response) => {
  try {
    const flashcards = await getAllFlashcards();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
};

export const showAddFlashcardForm = (_req: Request, res: Response) => {
  res.render("flashcards/new");
};

export const createFlashcardHandler = async (req: Request, res: Response) => {
  const { prompt, answer } = req.body;
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
  await updateFlashcard(Number(req.params.id), { prompt, answer });
  res.redirect("/");
};

export const deleteFlashcardHandler = async (req: Request, res: Response) => {
  try {
    await deleteFlashcard(Number(req.params.id));
    res.status(200).send("Card deleted successfully");
  } catch (error) {
    res.status(500).send("Failed to delete card");
  }
};
