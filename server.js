// Imports
const express = require("express"); // library module name
const dotenv = require("dotenv"); // import .env variable library
const mongoose = require("mongoose");

// middleware that help with request conversion + logging
const methodOverride = require("method-override");
const morgan = require("morgan");

// APP + Configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// opens connection to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// mongoose connection event listeners
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

// IMPORT mongoose models
const Food = require("./models/Food");

// configure view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// Landing Page - Home page
// ROLE - provide information about the app / site
app.get("/", (req, res) => {
  res.render("index");
});

// New Food Route - GET - /Foods/new
// ROLE -> render a form (new.ejs)
app.get("/Food/new", (req, res) => {
  res.render("Food/new.ejs");
});

// Show Route
// ROLE -> display a single instance of a resource (Food) from the database
app.get("/Food/:id", async (req, res) => {
  try {
    const foundFood = await Food.findById(req.params.id);
    // const variable = await Model.findById()
    const contextData = { Food: foundFood };
    res.render("Food/show", contextData);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// app.get - Food index route - GET - /Foods
app.get("/Food", async (req, res) => {
  try {
    const allFood = await Food.find();
    res.render("Food/index", { Food: allFood, message: "Hello Friend" });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// app.post - POST - /Foods
app.post("/Food", async (req, res) => {
  if (req.body.isReadyToEat) {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  try {
    await Food.create(req.body);
    res.redirect("/Food");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// app.delete
app.delete("/Food/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    // console.log(deletedFood, "response from db after deletion");
    res.redirect("/Food");
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
});

// app.get - EDIT route
app.get("/Food/:FoodId/edit", async (req, res) => {
  try {
    const FoodToEdit = await Food.findById(req.params.FoodId);
    res.render("Food/edit", { Food: FoodToEdit });
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
});

// app.put - UPDATE route
app.put("/Food/:id", async (req, res) => {
  try {
    // console.log(req.body, 'testing data from form')

    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }

    await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // findByIdAndUpdate - breakdown of arguments:
    // 1. id - the resource _id property for looking the document
    // 2. req.body - data from the form
    // 3. {new: true} option is provided as an optional third argument

    res.redirect(`/Food/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/Food/${req.params.id}`);
  }
});

// Server handler
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});