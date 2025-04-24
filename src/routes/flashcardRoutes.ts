import express from "express";
import {
  listFlashcards,
  showFlashcard,
  createFlashcardHandler,
  updateFlashcardHandler,
  deleteFlashcardHandler,
} from "../controllers/flashcardController.js";

const router = express.Router();

router.get("/", listFlashcards);
router.get("/flashcards/:id", showFlashcard);
router.post("/flashcards", createFlashcardHandler);
router.post("/flashcards/:id", updateFlashcardHandler);
router.post("/flashcards/:id/delete", deleteFlashcardHandler);

export default router;
