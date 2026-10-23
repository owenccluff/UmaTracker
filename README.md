# UmaTracker

UmaTracker is a Node.js command-line application for recording and searching
Uma Musume training runs. Run data is stored in a MySQL database and includes
the runner's name, score, five stats, and cards used.

## Features

- Add run entries
- Edit existing entries by ID
- Search by name or filter a stat above or below a threshold
- Remove entries by ID
- Test the database connection

## Requirements

- Node.js
- MySQL

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database
   ```

3. Create a `runs` table in the configured database. The application expects
   these columns:

   ```sql
   CREATE TABLE runs (
     entry_id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     score INT,
     stat_speed INT,
     stat_stamina INT,
     stat_power INT,
     stat_guts INT,
     stat_wit INT,
     cards TEXT
   );
   ```

## Usage

Start the interactive menu:

```sh
node menu.js
```

Test the database connection:

```sh
node test-db.js
```

The menu provides options to add, edit, search, and remove entries, or exit
the application.
