AI Kata Sweet Shop Management System
This project is a full-stack web application for managing a sweet shop, built as part of the technical assessment for Incubyte. The system is developed following modern software engineering principles, with a strong emphasis on Test-Driven Development (TDD) and quality craftsmanship.

## Problem Statement
The goal is to create a robust and scalable management system for a sweet shop. The application should handle inventory, orders, and product details efficiently. This project demonstrates the implementation of a clean, testable, and maintainable codebase.

## Tech Stack
This project is built using the MERN stack:

MongoDB: A NoSQL database for storing product and order information.

Express.js: A back-end web application framework for Node.js to build the RESTful APIs.

React: A front-end JavaScript library for building the user interface.

Node.js: A JavaScript runtime environment to run the server-side code.

## Testing and Quality Assurance
Jest & React Testing Library: For unit and integration testing on the front-end.

Mocha & Chai: For unit and API testing on the back-end.

## Features
CRUD Functionality: Create, Read, Update, and Delete sweets from the inventory.

Inventory Management: View a list of all available sweets with their names, prices, and current stock levels.

Order Tracking: A simple interface to view and manage customer orders.

Responsive UI: A clean and intuitive user interface that works on different devices.

## Core Development Principles
This project was built with a commitment to the core values of quality software development:

Test-Driven Development (TDD): The development process started with writing tests before writing the functional code. This ensures a high level of code coverage and reliability.

Unit Testing: Every component and function is accompanied by a suite of unit tests to verify its correctness in isolation.

Clean Code: The codebase is written to be readable, maintainable, and easy to understand.

## Getting Started
Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites
Make sure you have the following installed on your machine:

Node.js (which includes npm)

MongoDB

### Installation
Clone the repository:

Bash

git clone <YOUR_REPOSITORY_LINK>
cd ai-kata-sweet-shop
Install server dependencies:

Bash

cd server
npm install
Install client dependencies:

Bash

cd ../client
npm install
Set up environment variables:
Create a .env file in the server directory and add your MongoDB connection string:

MONGO_URI=your_mongodb_connection_string
### Running the Application
Start the back-end server:
From the server directory, run:

Bash

npm start
The server will start on http://localhost:5000.

Start the front-end client:
From the client directory, run:

Bash

npm start
The application will open in your browser at http://localhost:3000.

### Running Tests
To run the unit tests for the project, navigate to the respective directories and run the test command.

For the server:

Bash

cd server
npm test
For the client:

Bash

cd client
npm test







command to pull from git



Show thinking
To pull changes from a remote Git repository, you use the git pull command. This command fetches changes from the remote repository and merges them into your current local branch.

## Basic Command
The most common way to use this command is:

Bash

git pull
This will pull changes from the remote repository and branch that your current local branch is tracking.

## Specifying a Remote and Branch
If you want to pull from a specific remote and branch, you can specify them in the command:

Bash

git pull <remote_name> <branch_name>
For example, to pull from the main branch of the origin remote, you would use:

Bash

git pull origin main
This is useful if you are working with multiple remote repositories or want to pull changes from a branch that you are not currently on.

## git pull vs. git fetch
It's helpful to know the difference between git pull and git fetch:

git fetch: This command downloads the latest changes from the remote repository but does not automatically merge them into your local branch. This allows you to review the changes before merging.

git pull: This command is a combination of git fetch followed by git merge. It downloads the changes and immediately tries to merge them.

If you prefer to review changes before integrating them into your work, you can use fetch and then merge as separate steps:

Bash

git fetch origin
git merge origin/main
