const express = require("express");
const app = express();

const studentRoutes = require("./student");
app.use(studentRoutes);

app.listen(3000, () => console.log("Server started"));
