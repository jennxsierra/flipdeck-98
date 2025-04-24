import express from "express";
import {
  renderHomepage,
  getFlashcardsAsJson,
  showAddFlashcardForm,
  createFlashcardHandler,
  showEditFlashcardForm,
  updateFlashcardHandler,
  deleteFlashcardHandler,
} from "../controllers/flashcardController.js";

const router = express.Router();

router.get("/", renderHomepage);
router.get("/api/flashcards", getFlashcardsAsJson);
router.get("/flashcards/new", showAddFlashcardForm);
router.post("/flashcards", createFlashcardHandler);
router.get("/flashcards/:id/edit", showEditFlashcardForm);
router.patch("/flashcards/:id", updateFlashcardHandler);
router.delete("/flashcards/:id/delete", deleteFlashcardHandler);

export default router;
