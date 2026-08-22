const Price = require("../models/Price");
const Product = require("../models/Product");


// ======================================================
// GET PRICE MANAGEMENT PRODUCTS
// ======================================================

const getPriceProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      priceListType,
      effectiveDate,
    } = req.query;

    const productFilter = {
      status: "ACTIVE",
    };

    // Search
    if (search) {
      productFilter.$or = [
        {
          productName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search,
            $options: "i",
          },
        },
        {
          barcode: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      productFilter.category = category;
    }

    if (brand) {
      productFilter.brand = brand;
    }

    const products = await Product.find(productFilter)
      .sort({ createdAt: -1 })
      .lean();

    const productIds = products.map(
      (product) => product._id
    );

    // Get approved prices
    const priceFilter = {
      product: { $in: productIds },
      approvalStatus: "APPROVED",
    };

    if (priceListType) {
      priceFilter.priceListType = priceListType;
    }

    if (effectiveDate) {
      const start = new Date(effectiveDate);

      const end = new Date(effectiveDate);
      end.setDate(end.getDate() + 1);

      priceFilter.effectiveDate = {
        $gte: start,
        $lt: end,
      };
    }

    const prices = await Price.find(priceFilter)
      .sort({ effectiveDate: -1, createdAt: -1 })
      .lean();

    // Latest price per product + price list
    const priceMap = {};

    prices.forEach((price) => {
      const key =
        `${price.product}_${price.priceListType}`;

      if (!priceMap[key]) {
        priceMap[key] = price;
      }
    });

    const result = products.map((product) => {
      const price =
        priceMap[
          `${product._id}_DEALER`
        ] ||
        priceMap[
          `${product._id}_PAINTER`
        ] ||
        priceMap[
          `${product._id}_SEASONAL`
        ] ||
        priceMap[
          `${product._id}_PROMOTIONAL`
        ];

      return {
        ...product,

        priceId: price?._id || null,

        priceList: price
          ? price.priceListType
          : null,

        basePrice: price
          ? price.basePrice
          : product.mrp,

        gstPercent: price
          ? price.gstPercent
          : 0,

        discountPercent: price
          ? price.discountPercent
          : 0,

        priceDiscountPrice: price
          ? price.discountPrice
          : product.discountPrice,

        effectiveDate: price
          ? price.effectiveDate
          : null,

        approvalStatus: price
          ? price.approvalStatus
          : null,
      };
    });

    res.status(200).json({
      success: true,
      count: result.length,
      products: result,
    });
  } catch (error) {
    console.error(
      "Get price products error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch price products",
    });
  }
};


// ======================================================
// CREATE PRICE REVISION
// ======================================================

const createPrice = async (req, res) => {
  try {
    const {
      product,
      priceListType,
      customerId,
      basePrice,
      gstPercent,
      discountPercent,
      discountPrice,
      effectiveDate,
    } = req.body;

    if (
      !product ||
      !priceListType ||
      basePrice === undefined ||
      discountPercent === undefined ||
      discountPrice === undefined ||
      !effectiveDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required price fields",
      });
    }

    const existingProduct =
      await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Every new revision starts as PENDING
    const price = await Price.create({
      product,
      priceListType,
      customerId: customerId || null,
      basePrice,
      gstPercent: gstPercent || 0,
      discountPercent,
      discountPrice,
      effectiveDate,
      approvalStatus: "PENDING",
      createdBy:
        req.user?.id ||
        req.user?._id ||
        null,
    });

    res.status(201).json({
      success: true,
      message:
        "Price revision submitted for approval",
      price,
    });
  } catch (error) {
    console.error(
      "Create price error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create price revision",
    });
  }
};


// ======================================================
// GET PENDING PRICE REVISIONS
// ======================================================

const getPendingPrices = async (req, res) => {
  try {
    const prices = await Price.find({
      approvalStatus: "PENDING",
    })
      .populate(
        "product",
        "productName sku category brand packingSize mrp"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      prices,
    });
  } catch (error) {
    console.error(
      "Get pending prices error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending prices",
    });
  }
};


// ======================================================
// APPROVE PRICE
// ======================================================

const approvePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const price = await Price.findById(id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price revision not found",
      });
    }

    if (price.approvalStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "This price revision is already processed",
      });
    }

    price.approvalStatus = "APPROVED";

    price.approvedBy =
      req.user?.id ||
      req.user?._id ||
      null;

    price.approvedAt = new Date();

    await price.save();

    res.status(200).json({
      success: true,
      message:
        "Price revision approved successfully",
      price,
    });
  } catch (error) {
    console.error(
      "Approve price error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to approve price",
    });
  }
};


// ======================================================
// REJECT PRICE
// ======================================================

const rejectPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const { rejectionReason } = req.body;

    const price = await Price.findById(id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price revision not found",
      });
    }

    if (price.approvalStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "This price revision is already processed",
      });
    }

    price.approvalStatus = "REJECTED";

    price.rejectionReason =
      rejectionReason || "";

    price.approvedBy =
      req.user?.id ||
      req.user?._id ||
      null;

    price.approvedAt = new Date();

    await price.save();

    res.status(200).json({
      success: true,
      message:
        "Price revision rejected successfully",
      price,
    });
  } catch (error) {
    console.error(
      "Reject price error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to reject price",
    });
  }
};


// ======================================================
// PRICE HISTORY
// ======================================================

const getPriceHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    const prices = await Price.find({
      product: productId,
    })
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "approvedBy",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      prices,
    });
  } catch (error) {
    console.error(
      "Get price history error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch price history",
    });
  }
};


// ======================================================
// PRICE STATISTICS
// ======================================================

const getPriceStats = async (req, res) => {
  try {
    const totalProducts =
      await Product.countDocuments({
        status: "ACTIVE",
      });

    const priceListResult =
      await Price.distinct(
        "priceListType",
        {
          approvalStatus: "APPROVED",
        }
      );

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const updatedToday =
      await Price.countDocuments({
        approvalStatus: "APPROVED",
        approvedAt: {
          $gte: startOfDay,
        },
      });

    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const priceChanges =
      await Price.countDocuments({
        approvalStatus: "APPROVED",
        approvedAt: {
          $gte: startOfMonth,
        },
      });

    const discountResult =
      await Price.aggregate([
        {
          $match: {
            approvalStatus: "APPROVED",
          },
        },
        {
          $group: {
            _id: null,
            averageDiscount: {
              $avg: "$discountPercent",
            },
          },
        },
      ]);

    const averageDiscount =
      discountResult.length
        ? Number(
            discountResult[0]
              .averageDiscount
          ).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,

      stats: {
        totalProducts,
        priceLists: priceListResult.length,
        updatedToday,
        priceChanges,
        averageDiscount,
      },
    });
  } catch (error) {
    console.error(
      "Get price stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch price statistics",
    });
  }
};


// ======================================================
// BULK PRICE UPDATE
// ======================================================

const bulkCreatePrices = async (req, res) => {
  try {
    const { prices } = req.body;

    if (!Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Prices array is required",
      });
    }

    const formattedPrices = prices.map((item) => ({
      product: item.product,
      priceListType: item.priceListType,
      customerId: item.customerId || null,
      basePrice: item.basePrice,
      gstPercent: item.gstPercent || 0,
      discountPercent:
        item.discountPercent || 0,
      discountPrice: item.discountPrice,
      effectiveDate: item.effectiveDate,
      approvalStatus: "PENDING",
      createdBy:
        req.user?.id ||
        req.user?._id ||
        null,
    }));

    const createdPrices =
      await Price.insertMany(
        formattedPrices
      );

    res.status(201).json({
      success: true,
      message:
        "Bulk price revisions submitted for approval",
      count: createdPrices.length,
      prices: createdPrices,
    });
  } catch (error) {
    console.error(
      "Bulk price error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create bulk prices",
    });
  }
};


module.exports = {
  getPriceProducts,
  createPrice,
  getPendingPrices,
  approvePrice,
  rejectPrice,
  getPriceHistory,
  getPriceStats,
  bulkCreatePrices,
};