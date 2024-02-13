// Budget API

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(cors());

const budgetData = JSON.parse(fs.readFileSync("budget-data.json", "utf8"));
const newBudgetData = JSON.parse(fs.readFileSync("new-budget.json", "utf8"));

app.get("/budget", (req, res) => {
  if (!budgetData) {
    try {
      const data = fs.readFileSync("budget-data.json", "utf8");
      budgetData = JSON.parse(data);
    } catch (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  res.json(budgetData);
});

app.get("/newbudget", (req, res) => {
  if (!newBudgetData) {
    try {
      const data = fs.readFileSync("new-budget.json", "utf8");
      newBudgetData = JSON.parse(data);
    } catch (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  res.json(newBudgetData);
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
