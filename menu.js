const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const db = require("./db");

const rl = readline.createInterface({ input, output });

async function addEntry() {
  const name = await rl.question("Name: ");
  const score = await rl.question("Score: ");
  const stat_speed = await rl.question("Speed: ");
  const stat_stamina = await rl.question("Stamina: ");
  const stat_power = await rl.question("Power: ");
  const stat_guts = await rl.question("Guts: ");
  const stat_wit = await rl.question("Wit: ");
  const cards = await rl.question("Cards: ");

  const sql = `
    INSERT INTO runs
    (name, score, stat_speed, stat_stamina, stat_power, stat_guts, stat_wit, cards)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    name,
    Number(score),
    Number(stat_speed),
    Number(stat_stamina),
    Number(stat_power),
    Number(stat_guts),
    Number(stat_wit),
    cards
  ]);

  console.log(`Entry added with ID ${result.insertId}`);
}

async function editEntry() {
  const id = await rl.question("Enter the entry ID to edit: ");
  const name = await rl.question("New name: ");
  const score = await rl.question("New score: ");
  const stat1 = await rl.question("New stat 1: ");
  const stat2 = await rl.question("New stat 2: ");
  const stat3 = await rl.question("New stat 3: ");
  const stat4 = await rl.question("New stat 4: ");
  const stat5 = await rl.question("New stat 5: ");

  const sql = `
    UPDATE runs
    SET name = ?, score = ?, stat_speed = ?, stat_stamina = ?,
        stat_power = ?, stat_guts = ?, stat_wit = ?, cards = ?
    WHERE entry_id = ?
  `;

  const [result] = await db.execute(sql, [
    name,
    Number(score),
    Number(stat_speed),
    Number(stat_stamina),
    Number(stat_power),
    Number(stat_guts),
    Number(stat_wit),
    cards,
    Number(id)
  ]);

  console.log(
    result.affectedRows
      ? "Entry updated."
      : "No entry found with that ID."
  );
}

async function searchEntries() {
  const name = await rl.question(
    "Name to search for, or press Enter for any name: "
  );

  const stat = await rl.question(
    "Stat to filter by (stat_speed through stat_wit), or press Enter for any stat: "
  );

  let operator;
  let threshold;

  if (stat) {
    operator = await rl.question("Use above (>) or below (<): ");
    threshold = await rl.question("Enter the threshold: ");
  }

  const allowedStats = ["stat_speed", "stat_stamina", "stat_power", "stat_guts", "stat_wit"];
  const allowedOperators = [">", "<"];

  if (stat && !allowedStats.includes(stat)) {
    console.log("Invalid stat name.");
    return;
  }

  if (stat && !allowedOperators.includes(operator)) {
    console.log("Operator must be > or <.");
    return;
  }

  let sql = "SELECT * FROM runs WHERE 1 = 1";
  const values = [];

  if (name) {
    sql += " AND name LIKE ?";
    values.push(`%${name}%`);
  }

  if (stat) {
    sql += ` AND ${stat} ${operator} ?`;
    values.push(Number(threshold));
  }

  const [rows] = await db.execute(sql, values);

  if (rows.length === 0) {
    console.log("No matching entries found.");
  } else {
    console.table(rows);
  }
}

async function removeEntry() {
  const id = await rl.question("Enter the entry ID to remove: ");
  const confirmation = await rl.question(
    `Are you sure you want to remove entry ${id}? (y/n): `
  );

  if (confirmation.toLowerCase() !== "y") {
    console.log("Deletion cancelled.");
    return;
  }

  const [result] = await db.execute(
    "DELETE FROM runs WHERE entry_id = ?",
    [Number(id)]
  );

  console.log(
    result.affectedRows
      ? "Entry removed."
      : "No entry found with that ID."
  );
}

async function mainMenu() {
  while (true) {
    console.log(`
1. Add an entry
2. Edit an entry
3. Search entries
4. Remove an entry
5. Exit
`);

    const choice = await rl.question("Choose an option: ");

    try {
      if (choice === "1") {
        await addEntry();
      } else if (choice === "2") {
        await editEntry();
      } else if (choice === "3") {
        await searchEntries();
      } else if (choice === "4") {
        await removeEntry();
      } else if (choice === "5") {
        break;
      } else {
        console.log("Invalid choice.");
      }
    } catch (error) {
      console.error("Database error:", error.message);
    }
  }

  rl.close();
  await db.end();
  console.log("Goodbye!");
}

mainMenu();