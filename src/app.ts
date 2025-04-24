import express from "express";
import path from "path";
import logger from "./middleware/logger.js";
import { methodOverrideMiddleware } from "./middleware/methodOverride.js";
import { getLocalIpAddress } from "./utils/networkUtils.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";

const app = express();

// Use the logger middleware
app.use(logger);

// Use the method override middleware
app.use(methodOverrideMiddleware);

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(process.cwd(), "public")));

// Set EJS as the templating engine and set the views directory
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

// View engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Routes
app.use("/", flashcardRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  const ipAddress = getLocalIpAddress();
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Access the server from another computer at http://${ipAddress}:${PORT}`
  );
});
