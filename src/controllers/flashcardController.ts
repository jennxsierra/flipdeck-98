import { Request, Response } from "express";
import {
  getAllFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../models/flashcardModel.js";

export const listFlashcards = async (_req: Request, res: Response) => {
  try {
    const flashcards = await getAllFlashcards();
    res.render("index", { flashcards });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(404).render("error", { message: errorMessage });
  }
};

export const showFlashcard = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .render("error", { message: "Invalid flashcard ID" });
    }

    const flashcard = await getFlashcardById(id);
    res.render("flashcard", { flashcard });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(404).render("error", { message: errorMessage });
  }
};

export const createFlashcardHandler = async (req: Request, res: Response) => {
  const { prompt, answer } = req.body;
  const flashcard = await createFlashcard({ prompt, answer });
  res.redirect(`/flashcards/${flashcard.id}`);
};

export const updateFlashcardHandler = async (req: Request, res: Response) => {
  const { prompt, answer } = req.body;
  const flashcard = await updateFlashcard(Number(req.params.id), {
    prompt,
    answer,
  });
  res.redirect(`/flashcards/${flashcard.id}`);
};

export const deleteFlashcardHandler = async (req: Request, res: Response) => {
  await deleteFlashcard(Number(req.params.id));
  res.redirect("/");
};
