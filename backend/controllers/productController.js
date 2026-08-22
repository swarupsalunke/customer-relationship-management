const Product = require("../models/Product");

// ==========================================
// CREATE PRODUCT
// ==========================================

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      sku,
      barcode,
      category,
      subCategory,
      brand,
      packingSize,
      mrp,
      discountPrice,
      stockQuantity,
      status,
    } = req.body;

    // Check required fields
    if (
      !productName ||
      !sku ||
      !category ||
      !brand ||
      !packingSize ||
      mrp === undefined ||
      discountPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields",
      });
    }

    // Check duplicate SKU
    const existingProduct = await Product.findOne({ sku });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU already exists",
      });
    }

    const product = await Product.create({
      productName,
      sku,
      barcode,
      category,
      subCategory,
      brand,
      packingSize,
      mrp,
      discountPrice,
      stockQuantity,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      subCategory,
      brand,
      status,
    } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (category) {
      filter.category = category;
    }

    if (subCategory) {
      filter.subCategory = subCategory;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (status) {
      filter.status = status;
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const activeProducts = await Product.countDocuments({
      status: "ACTIVE",
    });

    const inactiveProducts = await Product.countDocuments({
      status: "INACTIVE",
    });

    const lowStockProducts = await Product.countDocuments({
      stockQuantity: {
        $gt: 0,
        $lte: 50,
      },
    });

    const outOfStockProducts = await Product.countDocuments({
      stockQuantity: 0,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        inactiveProducts,
      },
    });
  } catch (error) {
    console.error("Get product stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product statistics",
    });
  }
};


// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  getProductStats,
  deleteProduct,
};