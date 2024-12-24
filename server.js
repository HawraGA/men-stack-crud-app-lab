// Here is where we import modules
// We begin by loading Express
const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
require('dotenv').config();
const methodOverride = require("method-override"); 
const app = express();
const path = require("path");
//Connect MongoDB
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//Add Model
const Food = require("./models/food.js");

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });
  app.get("/foods/new", (req, res) => {
    res.render("foods/new.ejs");
  });
  app.post("/foods", async (req, res) => {
    if (req.body.isVegan === "on") {
      req.body.isVegan = true;
    } else {
      req.body.isVegan = false;
    }
    await Food.create(req.body);
    res.redirect("/foods");
    });
    //Show all the foods
  app.get("/foods", async (req, res) => {
    const allFoods = await Food.find();
    res.render("foods/index.ejs", { foods: allFoods });
  });
  //To Found Food by id
  app.get("/foods/:foodId",async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
res.render("foods/show.ejs",{food:foundFood});
    // res.send(
    //   `This route renders the show page for food id: ${req.params.foodId}!`
    // );
  });
  //To Delete 
  app.delete("/foods/:foodId", async (req, res) => {
    await Food.findByIdAndDelete(req.params.foodId);
    res.redirect("/foods");
  });
//To open the edit page 
app.get("/foods/:foodId/edit", async (req, res) => {
  const foundFood = await Food.findById(req.params.foodId);
  res.render("foods/edit.ejs", {
    food: foundFood,
  });
});
//To Edit the food
app.put("/foods/:foodId", async (req, res) => {
  if (req.body.isVegan === "on") {
    req.body.isVegan = true;
  } else {
    req.body.isVegan = false;
  }
  
  await Food.findByIdAndUpdate(req.params.foodId, req.body);

  res.redirect(`/foods/${req.params.foodId}`);
});
  app.listen(3000, () => {
  console.log('Listening on port 3000');
});