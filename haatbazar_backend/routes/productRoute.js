const { Router } = require("express");
const {
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
} = require("../controllers/productController.js");
const { authGuard, adminGuard } = require("../middleware/authGuard.js");

const router = Router();

router.post("/create", adminGuard, createProduct);

// Fetch all products
router.get("/get_all_products", getAllProducts);

// Fetch single product
router.get("/get_single_product/:id", authGuard, getProduct);

// Delete product
router.delete("/delete_product/:id", adminGuard, deleteProduct);

// Update product
router.put("/update_product/:id", adminGuard, updateProduct);

//pagination
router.get("/pagination", productPagination);

//new_arival
router.get("/new_arrivals", fetchNewArrivals);

//form store
router.get("/by_store", getProductsByStore);

// Products by category
router.get("/by_category", getProductsByCategory);

//form catagory inside store
router.get("/by_store_and_category", getProductsByCategoryAndStore);

// Search products by name
router.get("/search_products", searchProducts);

// Search products in store
router.get("/search_in_store", searchProductsInStore);

module.exports = router;
