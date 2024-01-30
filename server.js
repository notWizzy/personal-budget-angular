// Budget API

const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use("/", express.static("public"));

const budgetData = JSON.parse(fs.readFileSync("budget-data.json", "utf8"));

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

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

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
