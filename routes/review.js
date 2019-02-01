const express = require("express");
const router = express.Router();
const body_parser = require("body-parser");
const mongoose = require("mongoose");

const Product = require("../Models/Product_model");
const Category = require("../Models/Category_model");
const Department = require("../Models//Department_model");

router.use(body_parser.json());

mongoose.connect(
  "mongodb://localhost/boutique_app",
  { useNewUrlParser: true }
);

const review = mongoose.model("Review", {
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    minlength: 0,
    maxlength: 150,
    trim: true,
    required: true
  },
  username: {
    type: String,
    minlength: 3,
    maxlength: 15,
    trim: true,
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }
});

const functionMoyen = async Productto => {
  let note = 0;
  for (let i = 0; i <= Productto.reviews.length - 1; i++) {
    //console.log(Productto.reviews[i]);
    const temp = await review.findById(Productto.reviews[i]);
    // console.log(temp.rating);
    note = note + temp.rating;
    // console.log(note);
  }
  // console.log(note + "'/'" + Productto.reviews.length);
  note = note / Productto.reviews.length;
  // console.log(note);
  return note;
};

const deleteFunction = async (req, res, choose) => {
  try {
    if (choose === "review") {
      const deleteproduct = await Product.findById({ _id: req.query.id });
      await deleteproduct.remove();
    }
    return true;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
router.post("/review/create", async (req, res) => {
  try {
    const newReview = new review({
      rating: req.body.rating,
      comment: req.body.comment,
      username: req.body.username,
      product_id: req.body.product_id
    });

    console.log("review create");
    if (newReview) {
      const Productto = await Product.findById(req.body.product_id);
      Productto.reviews.push(newReview);
      await newReview.save();
      await Productto.save();
      Productto.averageRating = await functionMoyen(Productto);
      await Productto.save();
      res.json({ message: "review created" });
    }

    //
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/review/update", async (req, res) => {
  try {
    const updateReview = await review.findById(req.query.id);
    updateReview.rating = req.body.rating;
    updateReview.comment = req.body.comment;
    await updateReview.save();

    const Producinfo = await Product.findById(updateReview.product_id);
    Producinfo.averageRating = await functionMoyen(Producinfo);
    await Producinfo.save();
    res.json({ message: "review Updated" });
  } catch (error) {
    res.status(400).json({ error: { message: "An error occurred" } });
  }
});

router.post("/review/delete", async (req, res) => {
  let result = await deleteFunction(req, res, "review");
  if (result === true) {
    res.json("Delete okay");
  }
});

module.exports = router;
