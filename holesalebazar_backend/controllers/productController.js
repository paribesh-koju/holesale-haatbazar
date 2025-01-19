const path = require("path");
const fs = require("fs");
// const { fileURLToPath } = require('url');
const Products = require("../models/productModel.js");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//create the product
const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const {
    storeName,
    productName,
    productPrice,
    productCategory,
    productDescription,
    productAvailability,
  } = req.body;

  if (
    !storeName ||
    !productName ||
    !productPrice ||
    !productCategory ||
    !productDescription ||
    !productAvailability
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Image not found",
    });
  }

  const { productImage } = req.files;
  const imageName = `${Date.now()}-${productImage.name}`;
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );

  try {
    await productImage.mv(imageUploadPath);

    const newProduct = new Products({
      storeName,
      productName,
      productPrice,
      productCategory,
      productDescription,
      productImage: imageName,
      productAvailability,
    });

    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//fetching the all product
const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//fetching the single product
const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Products.findById(productId);
    res.status(200).json({
      success: true,
      message: "Product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

//deleting the product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await Products.findByIdAndDelete(productId);
    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    //handling the error on the delete product
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//updating the product
const updateProduct = async (req, res) => {
  try {
    if (req.files && req.files.productImage) {
      const { productImage } = req.files;
      const imageName = `${Date.now()}-${productImage.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      //moving the image to the new path
      await productImage.mv(imageUploadPath);
      req.body.productImage = imageName;

      //checking if the product has an image
      const existingProduct = await Products.findById(req.params.id);
      if (existingProduct.productImage) {
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );
        fs.unlinkSync(oldImagePath);
      }
    }

    //updating the product
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Product updated Successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//fetching the new product
const fetchNewArrivals = async (req, res) => {
  try {
    // Find products sorted by createdAt in descending order and limit the number of products fetched
    const products = await Products.find().sort({ createdAt: -1 }).limit(5); // Adjust the limit as needed
    res.status(200).json({
      success: true,
      message: "New arrivals fetched successfully",
      products,
    });
  } catch (error) {
    //handling the error on the new arrivals of product on the system
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// pagination
const productPagination = async (req, res) => {
  // result per page
  const resultPerPage = 4;

  // page no (received from user)
  const pageNo = req.query.page;

  try {
    const products = await Products.find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);

    // if there is no product
    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Product Found!",
      });
    }
    //returning the products
    res.status(201).json({
      success: true,
      message: "Product Fetched",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error!",
    });
  }
};

//product fetch from store
const getProductsByStore = async (req, res) => {
  const storeName = req.query.storeName;
  try {
    //fetching the products by store name
    const products = await Products.find({ storeName });
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products by store:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//product fetch from catagory
const getProductsByCategory = async (req, res) => {
  const category = req.query.category;
  try {
    const products = await Products.find({ productCategory: category });
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//product fetch from the catagory inside teh store
const getProductsByCategoryAndStore = async (req, res) => {
  const { category, storeName } = req.query;

  if (!category || !storeName) {
    return res.status(400).json({
      success: false,
      message: "Both category and store name are required",
    });
  }

  try {
    const products = await Products.find({
      productCategory: category,
      storeName: storeName,
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category and store:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//searching the prodcut
const searchProducts = async (req, res) => {
  const { search, page } = req.query;
  const pageNumber = parseInt(page) || 1;
  const pageSize = 10; // Adjust the page size as needed

  try {
    let query = {};
    if (search) {
      query.productName = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const products = await Products.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalProducts = await Products.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//search the product accourding to store
const searchProductsInStore = async (req, res) => {
  const { storeName, query } = req.query;
  try {
    const regex = new RegExp(query, "i"); // i for case insensitive
    const products = await Products.find({
      storeName,
      productName: { $regex: regex },
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error searching products in store:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  productPagination,
  fetchNewArrivals,
  getProductsByStore,
  getProductsByCategory,
  getProductsByCategoryAndStore,
  searchProducts,
  searchProductsInStore,
};
