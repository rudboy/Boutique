const express = require("express");
const router = express.Router();

router.get("/student", (req, res) => {
  res.json({ message: "Students List" });
});

router.post("/student/create", (req, res) => {
  res.json({ message: "Create Student" });
});

module.exports = router;
