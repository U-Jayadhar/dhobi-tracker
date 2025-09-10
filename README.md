# Dhobi Tracker

A simple web application built with Next.js and Tailwind CSS to help track laundry expenses for my mom. Designed with simplicity in mind, this application is specifically tailored for users who are not comfortable with complex spreadsheet software.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Features](#features)
3.  [Tech Stack](#tech-stack)
4.  [Data Storage](#data-storage)
5.  [Setup Instructions](#setup-instructions)
6.  [Usage](#usage)
7.  [Upcoming Features](#upcoming-features)

## Introduction

The Dhobi Tracker is a personal project created to assist in tracking laundry expenses. It provides a user-friendly interface for recording the number of clothes given to a laundry service, along with associated costs, all displayed in a clear and organized manner. This is particularly useful for users who find traditional spreadsheet software intimidating or difficult to use.

## Features

- **Easy Data Entry:** Simple form for entering the number of each type of clothing item (shirts, pants, sarees, etc.).
- **Automatic Cost Calculation:** Calculates the total cost based on pre-defined prices for each item type.
- **Date and Time Tracking:** Automatically records the date and time of each entry.
- **Monthly Table View:** Displays all entries for the current month in a tabular format.
- **Total Monthly Cost:** Calculates and displays the total cost for the entire month.
- **JSON File Storage:** Uses GitHub Gists for JSON file to store the data.

## Tech Stack

- **[Next.js](https://nextjs.org/):** React framework for building performant web applications.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for rapid UI development.
- **[GitHub Gist](https://gist.github.com/):**  A service for sharing code snippets, notes, and other small pieces of text or code.

## Data Storage

This application uses a **JSON file-based storage system** to persist data. This approach was chosen for its simplicity and to avoid the complexity of setting up a database, making it ideal for a single-user application.

- **File Location:** The data is stored in a file named `records.json`, located in the GitHub `Gist`.
- **API Routes:** Next.js API routes are used to read and write data to the `records.json` file. The following API endpoints are available:
  - `GET /api/records`: Retrieves all records from the `records.json` file.
  - `POST /api/records`: Adds a new record to the `records.json` file.
- **Note about Committing to Git:** This file is meant to be tracked in GitHub

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone [your-repository-url]
    cd [your-repository-name]
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install or pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev  # or yarn dev or pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1.  Open the Dhobi Tracker in your web browser.
2.  Use the form to enter the number of each type of clothing item.
3.  The application will automatically calculate the total cost and record the date and time of the entry.
4.  The entries for the current month will be displayed in a table.
5.  The total cost for the month will be displayed below the table.

## Upcoming Features

- **Progressive Web App (PWA) Support:** Enable the application to be installed as a PWA, allowing offline access and a more native app-like experience.
- **Table Pagination:** Implement pagination for the table to handle a large number of entries more efficiently.
- **Enhanced UI:** Improve the user interface with better styling, animations, and user experience enhancements.
- **Data Backup/Export:** Implement a feature to export the data as a JSON file for backup purposes.
- **Sorting and Filtering:** Allow the user to sort and filter the entries in the table.

**With 💖 for my mom**
