// models/fruit

const mongoose = require('mongoose')

// define a schema for all Fruit documents
const foodSchema = new mongoose.Schema({
    // structure the keys / properties in our document
    name: String, 
    isReadyToEat: Boolean,
    // add a new key for storing 'color' 
    color: String
    // validators (schema) -> mongoose document
}) 

// register the model using the schema
const Food = mongoose.model("Food", foodSchema)

// export the model object 
module.exports = Food // ??? - export a value that allows that value to be accessible outside of fruit.js