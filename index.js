const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const departmentRoutes = require("./routes/department");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const ReviewRoutes = require("./routes/review");

const app = express();
app.use(
  body_parser.json(),
  departmentRoutes,
  categoryRoutes,
  productRoutes,
  ReviewRoutes
);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/my-database", {
  useNewUrlParser: true
});

app.get("/", (req, res) => {
  res.json("welcome sur la boutique");
});

app.listen(process.env.PORT || 3000);
