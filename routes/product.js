//Déclaration des imports
const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const mongoose = require("mongoose");

router.use(body_parser.json());
// Modele Reviews
const Category = require("../Models/Category_model");
const Department = require("../Models//Department_model");
const Product = require("../Models/Product_model");

// Cnx a la base de donnée
mongoose.connect("mongodb://localhost/boutique_app", { useNewUrlParser: true });

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
router.post("/create_Product", async (req, res) => {
  try {
    for (let i = 0; i <= req.body.length - 1; i++) {
      // FIND = récupère un tableau d'objets
      // FINDONE = récupère un objet
      const existingProduct = await Product.findOne({
        title: req.body[i].title,
        description: req.body[i].description,
        price: req.body[i].price,
        category: req.body[i].category,
        reviews: req.body[i].reviews,
        averageRating: req.body[i].averageRating
      });

      if (existingProduct === null) {
        const newProduct = new Product({
          title: req.body[i].title,
          description: req.body[i].description,
          price: req.body[i].price,
          category: req.body[i].category,
          reviews: req.body[i].reviews,
          averageRating: req.body[i].averageRating
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
router.get("/Product", async (req, res) => {
  let pageOptions = {
    page: req.query.page || 0,
    limit: 10
  };

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
  }
  if (req.query.sort === "rating-asc") {
    const selectProduct = await Product.find(NewParametre.averageRating)
      .sort({ price: 1 })
      .populate("reviews");
    res.json(selectProduct);
  } else if (req.query.sort === "rating-desc") {
    const selectProduct = await Product.find(NewParametre.averageRating)
      .sort({ price: -1 })
      .populate("reviews");
    res.json(selectProduct);
  } else {
    const selectProduct = await Product.find(NewParametre)
      .populate("reviews")
      .skip(pageOptions.page * pageOptions.limit) //Ignore X resulta
      .limit(pageOptions.limit) //limit a x resulta
      .exec(function(err, doc) {
        if (err) {
          res.status(500).json(err);
          return;
        }
        res.status(200).json(doc);
      });
    //res.json(selectProduct);
  }
});
router.post("/Product/update", async (req, res) => {
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
router.post("/Product/delete", async (req, res) => {
  let result = await deleteFunction(req, res, "Product");
  if (result === true) {
    res.json("Delete okay");
  }
});

module.exports = router;
