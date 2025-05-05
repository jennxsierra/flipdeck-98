import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Helper function to run shell commands
async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(
      `${colors.blue}Running: ${command} ${args.join(" ")}${colors.reset}`
    );

    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

// Check for environment variables
async function checkEnvironment() {
  console.log(`${colors.cyan}=== Checking Environment ====${colors.reset}`);

  if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_DATABASE
  ) {
    console.log(
      `${colors.red}Missing required environment variables.${colors.reset}`
    );
    console.log(
      `${colors.yellow}Please create a .env file based on .env.example${colors.reset}`
    );
    process.exit(1);
  }

  console.log(`${colors.green}Environment variables present.${colors.reset}`);
}

// Initialize database
async function setupDatabase() {
  try {
    console.log(`${colors.cyan}=== Setting Up Database ====${colors.reset}`);

    // Read the original SQL file
    const originalSqlPath = path.join(
      __dirname,
      "src",
      "config",
      "scripts",
      "setup.sql"
    );
    const sqlContent = await fs.readFile(originalSqlPath, "utf8");

    // Create a temporary file in /tmp (which postgres user can access)
    const tmpFilePath = "/tmp/flipdeck_setup.sql";
    await fs.writeFile(tmpFilePath, sqlContent);

    // Make the file readable by postgres user
    await runCommand("chmod", ["644", tmpFilePath]);

    // Run the database setup script using the temporary file
    await runCommand("sudo", ["-u", "postgres", "psql", "-f", tmpFilePath]);

    // Clean up the temporary file
    await fs.unlink(tmpFilePath);

    console.log(
      `${colors.green}Database setup completed successfully.${colors.reset}`
    );
  } catch (error) {
    console.error(`${colors.red}Database setup failed:${colors.reset}`, error);
    console.log(`${colors.yellow}Common issues:${colors.reset}`);
    console.log("1. PostgreSQL is not running");
    console.log('2. "postgres" user does not have sufficient privileges');
    console.log("3. Invalid database credentials in .env file");
    process.exit(1);
  }
}

// Install npm dependencies
async function installDependencies() {
  try {
    console.log(
      `${colors.cyan}=== Installing Dependencies ====${colors.reset}`
    );
    await runCommand("npm", ["install"]);
    console.log(
      `${colors.green}Dependencies installed successfully.${colors.reset}`
    );
  } catch (error) {
    console.error(
      `${colors.red}Failed to install dependencies:${colors.reset}`,
      error
    );
    process.exit(1);
  }
}

// Build the project
async function buildProject() {
  try {
    console.log(`${colors.cyan}=== Building Project ====${colors.reset}`);
    await runCommand("npm", ["run", "build"]);
    console.log(`${colors.green}Project built successfully.${colors.reset}`);
  } catch (error) {
    console.error(
      `${colors.red}Failed to build project:${colors.reset}`,
      error
    );
    process.exit(1);
  }
}

// Main setup function
async function setup() {
  console.log(
    `${colors.cyan}========================================${colors.reset}`
  );
  console.log(
    `${colors.cyan}====== FlipDeck-98 Setup Script ========${colors.reset}`
  );
  console.log(
    `${colors.cyan}========================================${colors.reset}`
  );

  try {
    await checkEnvironment();
    await setupDatabase();
    await installDependencies();
    await buildProject();

    console.log(
      `${colors.green}========================================${colors.reset}`
    );
    console.log(`${colors.green}Setup completed successfully!${colors.reset}`);
    console.log(
      `${colors.green}You can now run the app with: npm start${colors.reset}`
    );
    console.log(
      `${colors.green}========================================${colors.reset}`
    );
  } catch (error) {
    console.error(`${colors.red}Setup failed:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the setup
setup();
