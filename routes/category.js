const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const mongoose = require("mongoose");
router.use(body_parser.json());

const Product = require("../Models/Product_model");
const Department = require("../Models//Department_model");

mongoose.connect(
  "mongodb://localhost/boutique_app",
  { useNewUrlParser: true }
);
// const Category = mongoose.model("Category", {
//   title: {
//     type: String,
//     default: ""
//   },
//   description: {
//     type: String,
//     default: ""
//   },
//   department: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Department"
//   }
// });
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
router.post("/create_Category", async (req, res) => {
  try {
    for (let i = 0; i <= req.body.length - 1; i++) {
      // FIND = récupère un tableau d'objets
      // FINDONE = récupère un objet
      const existingCategory = await Category.findOne({
        title: req.body[i].title,
        description: req.body[i].description,
        department: req.body[i].department
      });

      if (existingCategory === null) {
        const newCategory = new Category({
          title: req.body[i].title,
          description: req.body[i].description,
          department: req.body[i].department
        });

        await newCategory.save();
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
router.get("/Category", async (req, res) => {
  const allDepartement = await Category.find().populate("Department");
  res.json(allDepartement);
});
router.post("/Category/update", async (req, res) => {
  let newTitle = req.body.title;
  let newDescription = req.body.description;
  let newDepartment = req.body.department;
  let id = req.query.id;
  const CategoryUpdate = await Category.findById(id);
  CategoryUpdate.title = newTitle;
  CategoryUpdate.description = newDescription;
  CategoryUpdate.department = newDepartment;
  let toto = await CategoryUpdate.save();
  res.json({ modification_ok: toto });
});
router.post("/Category/delete", async (req, res) => {
  let result = await deleteFunction(req, res, "Category");
  if (result === true) {
    res.json("Delete okay");
  }
});

module.exports = router;
