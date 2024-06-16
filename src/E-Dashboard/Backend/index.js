const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const Product = require("./db/product"); // Adjust the path based on your actual file structure
require("./db/config");

const app = express();
app.use(cors());
app.use(express.json());

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Initialize multer with storage options for single file upload
const upload = multer({ storage }).single("file"); // Assuming frontend sends the file with key 'file'

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Route to add a new product including file upload
app.post("/add-product", (req, resp) => {
  upload(req, resp, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      console.error("Multer error:", err);
      return resp.status(500).send("Multer error.");
    } else if (err) {
      // Unknown error occurred
      console.error("Unknown error:", err);
      return resp.status(500).send("Unknown error.");
    }

    try {
      const { name, price, category, company } = req.body;

      // Validate required fields
      if (!name || !price || !category || !company || !req.file) {
        return resp.status(400).send("All fields and image are required.");
      }

      // Validate price
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return resp.status(400).send("Valid price is required.");
      }

      // Read image file and convert to Buffer
      const image = fs.readFileSync(req.file.path);
      const encodedImage = image.toString("base64");

      // Create image data object
      const imageData = {
        contentType: req.file.mimetype,
        imageBase64: encodedImage,
      };

      // Create new product with image data
      const newProduct = new Product({
        name,
        price: parsedPrice,
        category,
        company,
        image: imageData,
      });

      // Save product to MongoDB
      const result = await newProduct.save();
      resp.status(201).send(result);
    } catch (error) {
      console.error("Error adding product:", error);
      resp.status(500).send("Error adding product.");
    }
  });
});

// Route to get all products
app.get("/products", async (req, resp) => {
  try {
    const products = await Product.find();
    if (products.length > 0) {
      resp.status(200).send(products);
    } else {
      resp.status(404).send({ result: "No products found" });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    resp.status(500).send("Error fetching products.");
  }
});

// Route to handle file upload directly
app.post("/upload", upload, (req, res) => {
  // File uploaded successfully
  res.send("File uploaded successfully.");
});
const User = require('./db/User');
const product = require("./db/product");

app.use(cors());
app.use(express.json());
app.post("/register" , async(req,resp)=>{
  let user = new User(req.body);
    let result = await user.save();
    result=result.toObject();
    delete result.password

    resp.send(result);
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email, password }).select("-password");

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.delete('/products/:id', async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});
app.get('/products/:id', async (req, res) => {
  try {
    const result = await product.findById(req.params.id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const result = await product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

app.get('/products/search', (req, res) => {
  let query = (req.query.query || '').toLowerCase().trim(); // Handle case where query might be undefined

  const filteredProducts = productsData.filter(product => {
    return product.name.toLowerCase().includes(query)
      || product.company.toLowerCase().includes(query)
      || product.category.toLowerCase().includes(query);
  });

  res.json(filteredProducts);
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
