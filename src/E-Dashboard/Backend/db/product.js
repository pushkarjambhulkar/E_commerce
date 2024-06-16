const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  company: { type: String, required: true },
  image: {
    contentType: { type: String, required: true },
    imageBase64: { type: String, required: true },
  },
});

module.exports = mongoose.model("Product", productSchema);
