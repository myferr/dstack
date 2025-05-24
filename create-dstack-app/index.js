#!/usr/bin/env node

import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import figlet from "figlet";
import chalk from "chalk";
import { createSpinner } from "nanospinner";

const execPromise = promisify(exec);
const figletTextPromise = promisify(figlet.text);

const STARTER_TEMPLATE_DIR_NAME = "template";
const NONE_TEMPLATE_DIR_NAME = "template-blank";

async function main() {
  try {
    const banner = await figletTextPromise("create-dstack-app", {
      font: "Slant",
      horizontalLayout: "default",
      verticalLayout: "default",
    });
    console.log(chalk.blue(banner));
    console.log(chalk.green("Welcome to create-dstack-app!"));
  } catch (error) {
    console.log(chalk.green("Welcome to create-dstack-app"));
  }

  const scriptFilePath = fileURLToPath(import.meta.url);
  const scriptDirectory = path.dirname(scriptFilePath);

  try {
    const requiredNodeVersion = 160700;
    const currentNodeVersion = process.versions.node
      .split(".")
      .map(Number)
      .reduce((acc, val, i) => acc + val * Math.pow(100, 2 - i), 0);

    if (currentNodeVersion < requiredNodeVersion) {
      console.error(
        chalk.red(
          `\nError: Your Node.js version is too old. This script requires Node.js v${Math.floor(
            requiredNodeVersion / 10000
          )}.${Math.floor((requiredNodeVersion % 10000) / 100)}.${
            requiredNodeVersion % 100
          } or higher.`
        )
      );
      console.error(
        chalk.red(`You are currently running Node.js ${process.versions.node}.`)
      );
      console.error(
        chalk.red(`Please update your Node.js to a supported version.`)
      );
      process.exit(1);
    }

    const questions = [
      {
        type: "input",
        name: "projectName",
        message: chalk.cyan("What is your project name?:"),
        default: "my-dstack-app",
        validate: function (input) {
          const trimmedInput = input.trim();
          if (!trimmedInput) {
            return chalk.red("Project name cannot be empty.");
          }

          const isValidName =
            /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]*[a-zA-Z0-9])?$/.test(trimmedInput) &&
            !/[-_]{2,}/.test(trimmedInput);

          if (!isValidName) {
            return chalk.red(
              "Project name must be alphanumeric, can include hyphens or underscores, but cannot start/end with them, or have consecutive hyphens/underscores."
            );
          }

          const targetPath = path.resolve(process.cwd(), trimmedInput);
          if (
            fs.existsSync(targetPath) &&
            trimmedInput !== "./" &&
            trimmedInput !== "." &&
            trimmedInput !== "/"
          ) {
            return chalk.red(
              `A directory named '${trimmedInput}' already exists in your current location. Please choose a different name.`
            );
          }
          return true;
        },
      },
      {
        type: "list",
        name: "projectTemplateChoice",
        message: chalk.cyan("Project template:"),
        choices: ["Starter template", "None"],
        default: "Starter template",
      },
      {
        type: "confirm",
        name: "installDependencies",
        message: chalk.cyan("Install dependencies (npm install)?"),
        default: true,
      },
      {
        type: "confirm",
        name: "initializeGit",
        message: chalk.cyan("Initialize a Git repository?"),
        default: true,
      },
    ];

    const answers = await inquirer.prompt(questions);

    const finalProjectName = answers.projectName.trim();
    let templateDirToCopy;

    if (answers.projectTemplateChoice === "None") {
      templateDirToCopy = NONE_TEMPLATE_DIR_NAME;
    } else {
      templateDirToCopy = STARTER_TEMPLATE_DIR_NAME;
    }

    const sourceTemplatePath = path.join(scriptDirectory, templateDirToCopy);

    if (
      !fs.existsSync(sourceTemplatePath) ||
      !fs.lstatSync(sourceTemplatePath).isDirectory()
    ) {
      console.error(
        chalk.red(
          `\nError: Source template directory not found or is not a directory: ${sourceTemplatePath}`
        )
      );
      console.error(
        chalk.red(
          `Please ensure a directory named '${templateDirToCopy}' exists in the script's directory: ${scriptDirectory}`
        )
      );
      process.exit(1);
    }

    const destinationPath = path.resolve(process.cwd(), finalProjectName);

    const copySpinner = createSpinner(
      chalk.yellow(
        `Copying '${templateDirToCopy}' to ./${finalProjectName} ...`
      )
    ).start();
    try {
      fs.cpSync(sourceTemplatePath, destinationPath, { recursive: true });
      copySpinner.success({
        text: chalk.green(
          `Successfully copied '${templateDirToCopy}' to ./${finalProjectName}`
        ),
      });
    } catch (copyError) {
      copySpinner.error({
        text: chalk.red(`Failed to copy files: ${copyError.message}`),
      });
      throw copyError;
    }

    process.chdir(destinationPath);

    if (answers.installDependencies) {
      const installSpinner = createSpinner(
        chalk.yellow(
          "Installing dependencies (npm install)... This may take a moment."
        )
      ).start();
      try {
        const { stdout, stderr } = await execPromise("npm install");
        installSpinner.success({
          text: chalk.green("Dependencies installed successfully."),
        });
      } catch (execError) {
        installSpinner.error({
          text: chalk.red("Error installing dependencies."),
        });
        console.error(chalk.red(`\nError details: ${execError.message}`));
        console.warn(
          chalk.yellow(
            "Please try running 'npm install' manually in your project directory if needed."
          )
        );
      }
    }

    if (answers.initializeGit) {
      const gitSpinner = createSpinner(
        chalk.yellow("Initializing Git repository...")
      ).start();
      try {
        const { stdout, stderr } = await execPromise("git init");
        gitSpinner.success({
          text: chalk.green("Git repository initialized successfully."),
        });
      } catch (execError) {
        gitSpinner.error({
          text: chalk.red("Error initializing Git repository."),
        });
        console.error(chalk.red(`\nError details: ${execError.message}`));
        console.warn(
          chalk.yellow(
            "Please try running 'git init' manually in your project directory if needed."
          )
        );
      }
    }

    console.log(chalk.magenta("\nProject setup complete!"));
    console.log(
      chalk.white(
        `\nTo get started:\n  ${chalk.cyan(`cd ${finalProjectName}`)}`
      )
    );
    console.log(chalk.white(`  ${chalk.cyan("npm run dev")}`));
    if (!answers.installDependencies) {
      console.log(chalk.white("  ") + chalk.cyan("npm install"));
    }
    console.log(chalk.yellow("\nHappy coding! 🎉"));
  } catch (error) {
    console.error(chalk.red("\nAn error occurred during the setup process:"));
    if (error.code === "EEXIST") {
      console.error(
        chalk.red(
          `Error: A directory named '${
            error.path ||
            (answers && answers.projectName
              ? answers.projectName.trim()
              : "the specified project name")
          }' already exists.`
        )
      );
    } else if (error.code === "ENOENT") {
      console.error(
        chalk.red(
          `Error: A required file or directory was not found. Path: ${error.path}`
        )
      );
      if (error.cmd) {
        console.error(
          chalk.red(
            `Command not found: '${
              error.cmd.split(" ")[0]
            }'. Make sure it's installed and in your PATH.`
          )
        );
      }
    } else if (error.code === "EACCES") {
      console.error(
        chalk.red(
          `Error: Permission denied. Cannot access or write to path: ${error.path}`
        )
      );
    } else {
      console.error(chalk.red(`Error details: ${error.message}`));
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
    }
    console.error(chalk.red("Project setup failed."));
    process.exit(1);
  }
}

main();
