const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const mongoose = require("mongoose");
router.use(body_parser.json());

mongoose.connect(
  "mongodb://localhost/boutique_app",
  { useNewUrlParser: true }
);
const Department = mongoose.model("Department", {
  title: {
    type: String,
    default: ""
  }
});
const deleteFunction = async (req, res, choose) => {
  try {
    if (choose === "Department") {
      const deleteDepartartement = await Department.findById(req.query.id);
      //console.log(deleteDepartartement);
      const deletecategory = ([] = await Category.find({
        department: deleteDepartartement.id
      }));
      //console.log(deletecategory);
      for (let i = 0; i <= deletecategory.length - 1; i++) {
        await Product.remove({ category: deletecategory[i].id });
      }
      //console.log(deleteproduct);
      // await deleteproduct.remove();
      await deletecategory[0].remove();
      await deleteDepartartement.remove();
    } else if (choose === "Category") {
      const deletecategory = ([] = await Category.findById({
        _id: req.query.id
      }));
      for (let i = 0; i <= deletecategory.length - 1; i++) {
        await Product.remove({ category: deletecategory[i].id });
      }
      await deletecategory[0].remove();
    } else if (choose === "Product") {
      const deleteproduct = await Product.findById({ _id: req.query.id });
      await deleteproduct.remove();
    }
    return true;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
router.post("/create_Department", async (req, res) => {
  try {
    for (let i = 0; i <= req.body.length - 1; i++) {
      // FIND = récupère un tableau d'objets
      // FINDONE = récupère un objet
      const existingDepartment = await Department.findOne({
        title: req.body[i].title
      });

      if (existingDepartment === null) {
        const newDepartment = new Department({
          title: req.body[i].title
        });

        await newDepartment.save();
        res.json({ message: "Department created" });
      } else {
        res.status(400).json({
          error: {
            message: "Department already exists"
          }
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: { message: "An error occurred" } });
  }
});
router.get("/Department", async (req, res) => {
  const allDepartement = await Department.find();
  res.json(allDepartement);
});
router.post("/Department/update", async (req, res) => {
  let newTitle = req.body.title;
  let id = req.query.id;
  const departmentUpdate = await Department.findById(id);
  departmentUpdate.title = newTitle;
  let toto = await departmentUpdate.save();
  res.json({ modification_ok: toto });
});
router.post("/Department/delete", async (req, res) => {
  let result = await deleteFunction(req, res, "Department");
  if (result === true) {
    res.json("Delete okay");
  }
});

module.exports = router;
