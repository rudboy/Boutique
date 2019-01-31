const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(body_parser.json());

mongoose.connect(
  "mongodb://localhost/boutique_app",
  { useNewUrlParser: true }
);

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
app.get("/", (req, res) => {
  res.json("welcome sur la boutique");
});
const Department = mongoose.model("Department", {
  title: {
    type: String,
    default: ""
  }
});
const Category = mongoose.model("Category", {
  title: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});
const Product = mongoose.model("Product", {
  title: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    default: ""
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});
//////////////DEPARTEMENT///////////////////////////////
app.post("/create_Department", async (req, res) => {
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
app.get("/Department", async (req, res) => {
  const allDepartement = await Department.find();
  res.json(allDepartement);
});
app.post("/Department/update", async (req, res) => {
  let newTitle = req.body.title;
  let id = req.query.id;
  const departmentUpdate = await Department.findById(id);
  departmentUpdate.title = newTitle;
  let toto = await departmentUpdate.save();
  res.json({ modification_ok: toto });
});
app.post("/Department/delete", async (req, res) => {
  let result = await deleteFunction(req, res, "Department");
  if (result === true) {
    res.json("Delete okay");
  }
});
//////////////CATEGORY////////////////////////////////////////
app.post("/create_Category", async (req, res) => {
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
app.get("/Category", async (req, res) => {
  const allDepartement = await Category.find().populate("Department");
  res.json(allDepartement);
});
app.post("/Category/update", async (req, res) => {
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
app.post("/Category/delete", async (req, res) => {
  let result = await deleteFunction(req, res, "Category");
  if (result === true) {
    res.json("Delete okay");
  }
});
///////////////PRODUCT//////////////////////////////////////
app.post("/create_Product", async (req, res) => {
  try {
    for (let i = 0; i <= req.body.length - 1; i++) {
      // FIND = récupère un tableau d'objets
      // FINDONE = récupère un objet
      const existingProduct = await Product.findOne({
        title: req.body[i].title,
        description: req.body[i].description,
        price: req.body[i].price,
        category: req.body[i].category
      });

      if (existingProduct === null) {
        const newProduct = new Product({
          title: req.body[i].title,
          description: req.body[i].description,
          price: req.body[i].price,
          category: req.body[i].category
        });

        await newProduct.save();
        res.json({ message: "category created" });
      } else {
        res.status(400).json({
          error: {
            message: "category already exists"
          }
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: { message: "An error occurred" } });
  }
});
app.get("/Product", async (req, res) => {
  //console.log(req);
  // if (req.query.sort === "price-asc") {
  //   toto = "price: 1";
  // }

  // try {
  //   selectProductName = await Product.find({
  //     category: req.query.category,
  //     title: new RegExp(req.query.title, "i"),
  //     price: { $gt: req.query.priceMin, $lt: req.query.priceMax }
  //   });

  //   console.log(selectProductName);
  //   res.json(selectProductName);
  // } catch (error) {
  //   res.status(400).json({ error: error.message });
  // }
  let NewParametre = {};
  let parameter = req.query;
  if ("category" in parameter) {
    NewParametre.category = req.query.category;
  }
  if ("title" in parameter) {
    NewParametre.title = new RegExp(req.query.title, "i");
  }
  if ("priceMin" in parameter && "priceMax" in parameter) {
    NewParametre.price = { $gt: req.query.priceMin, $lt: req.query.priceMax };
  }
  if ("priceMin" in parameter && !("priceMax" in parameter)) {
    NewParametre.price = { $gt: req.query.priceMin };
  }
  if ("priceMax" in parameter && !("priceMin" in parameter)) {
    NewParametre.price = { $lt: req.query.priceMax };
  }
  if (req.query.sort === "price-asc") {
    const selectProduct = await Product.find(NewParametre).sort({ price: 1 });
    res.json(selectProduct);
  } else if (req.query.sort === "price-desc") {
    const selectProduct = await Product.find(NewParametre).sort({ price: -1 });
    res.json(selectProduct);
  } else {
    const selectProduct = await Product.find(NewParametre);
    res.json(selectProduct);
  }
});
app.post("/Product/update", async (req, res) => {
  let newTitle = req.body.title;
  let newDescription = req.body.description;
  let newCategory = req.body.category;
  let newPrice = req.body.price;
  let id = req.query.id;
  const ProductUpdate = await Product.findById(id);
  ProductUpdate.title = newTitle;
  ProductUpdate.description = newDescription;
  ProductUpdate.category = newCategory;
  ProductUpdate.price = newPrice;
  let toto = await ProductUpdate.save();
  res.json({ modification_ok: toto });
});
app.post("/Product/delete", async (req, res) => {
  let result = await deleteFunction(req, res, "Product");
  if (result === true) {
    res.json("Delete okay");
  }
});
///////////////////////////////////////////////////////////////////Ò
app.listen(3000, () => {
  console.log("Server has started");
});
