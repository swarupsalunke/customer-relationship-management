import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Upload, Download, Filter, Search, Pencil } from "lucide-react";
import "../css/pricemanagement.css";

const API_BASE_URL = "http://localhost:5000/api";


const PriceManagement = () => {
  // =========================================================
  // TAB
  // =========================================================

  const [activeTab, setActiveTab] = useState("priceList");

  // =========================================================
  // FILTER STATES
  // =========================================================

  const [search, setSearch] = useState("");

  const [selectedPriceList, setSelectedPriceList] =
    useState("All Price Lists");

  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [selectedBrand, setSelectedBrand] =
    useState("All Brands");

  const [effectiveDate, setEffectiveDate] = useState("");

  // =========================================================
  // DATA STATES
  // =========================================================

  const [products, setProducts] = useState([]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    priceLists: 0,
    updatedToday: 0,
    priceChanges: 0,
    averageDiscount: 0,
  });

  // =========================================================
  // UI STATES
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  // =========================================================
  // SELECTED PRODUCTS
  // =========================================================

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [selectAll, setSelectAll] = useState(false);

  // =========================================================
  // PRICE LIST OPTIONS
  // =========================================================

  const priceListOptions = [
    {
      label: "All Price Lists",
      value: "",
    },
    {
      label: "Dealer Price",
      value: "DEALER",
    },
    {
      label: "Painter Price",
      value: "PAINTER",
    },
    {
      label: "Seasonal Campaign",
      value: "SEASONAL",
    },
    {
      label: "Promotional Offer",
      value: "PROMOTIONAL",
    },
  ];

  // =========================================================
  // GET TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken")
    );
  };

  // =========================================================
  // COMMON AXIOS CONFIG
  // =========================================================

  const getAuthConfig = () => {
    const token = getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchPriceProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      // Search
      if (search.trim()) {
        params.search = search.trim();
      }

      // Category
      if (
        selectedCategory &&
        selectedCategory !== "All Categories"
      ) {
        params.category = selectedCategory;
      }

      // Brand
      if (
        selectedBrand &&
        selectedBrand !== "All Brands"
      ) {
        params.brand = selectedBrand;
      }

      // Price List
      const selectedPriceListValue =
        priceListOptions.find(
          (item) =>
            item.label === selectedPriceList
        )?.value || "";

      if (selectedPriceListValue) {
        params.priceListType =
          selectedPriceListValue;
      }

      // Effective Date
      if (effectiveDate) {
        params.effectiveDate = effectiveDate;
      }

      const response = await axios.get(
        `${API_BASE_URL}/prices`,
        {
          ...getAuthConfig(),
          params,
        }
      );

      if (response.data?.success) {
        setProducts(
          Array.isArray(response.data.products)
            ? response.data.products
            : []
        );
      } else {
        setProducts([]);

        setError(
          response.data?.message ||
          "Failed to fetch products"
        );
      }
    } catch (err) {
      console.error(
        "Fetch price products error:",
        err
      );

      setProducts([]);

      if (err.response) {
        setError(
          err.response.data?.message ||
          `Request failed with status ${err.response.status}`
        );
      } else if (err.request) {
        setError(
          "Unable to connect to backend server."
        );
      } else {
        setError(
          "Failed to load price management data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH PRICE STATISTICS
  // =========================================================

  const fetchPriceStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const response = await axios.get(
        `${API_BASE_URL}/prices/stats`,
        getAuthConfig()
      );

      if (response.data?.success) {
        setStats({
          totalProducts:
            response.data.stats
              ?.totalProducts || 0,

          priceLists:
            response.data.stats
              ?.priceLists || 0,

          updatedToday:
            response.data.stats
              ?.updatedToday || 0,

          priceChanges:
            response.data.stats
              ?.priceChanges || 0,

          averageDiscount:
            response.data.stats
              ?.averageDiscount || 0,
        });
      } else {
        setStatsError(
          response.data?.message ||
          "Failed to fetch statistics"
        );
      }
    } catch (err) {
      console.error(
        "Fetch price stats error:",
        err
      );

      setStatsError(
        "Failed to load statistics."
      );
    } finally {
      setStatsLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchPriceProducts();
    fetchPriceStats();
  }, []);

  // =========================================================
  // FILTER CHANGE
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPriceProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    selectedPriceList,
    selectedCategory,
    selectedBrand,
    effectiveDate,
  ]);

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================

  const categoryOptions = useMemo(() => {
    const categories = products
      .map((product) => product.category)
      .filter(Boolean);

    return [
      "All Categories",
      ...Array.from(new Set(categories)),
    ];
  }, [products]);

  // =========================================================
  // BRAND OPTIONS
  // =========================================================

  const brandOptions = useMemo(() => {
    const brands = products
      .map((product) => product.brand)
      .filter(Boolean);

    return [
      "All Brands",
      ...Array.from(new Set(brands)),
    ];
  }, [products]);

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleReset = () => {
    setSearch("");

    setSelectedPriceList(
      "All Price Lists"
    );

    setSelectedCategory(
      "All Categories"
    );

    setSelectedBrand(
      "All Brands"
    );

    setEffectiveDate("");

    setSelectedProducts([]);

    setSelectAll(false);
  };

  // =========================================================
  // SELECT SINGLE PRODUCT
  // =========================================================

  const handleSelectProduct = (productId) => {
    setSelectedProducts((previous) => {
      if (previous.includes(productId)) {
        return previous.filter(
          (id) => id !== productId
        );
      }

      return [
        ...previous,
        productId,
      ];
    });
  };

  // =========================================================
  // SELECT ALL PRODUCTS
  // =========================================================

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
      setSelectAll(false);

      return;
    }

    const allIds = products
      .map((product) => product._id)
      .filter(Boolean);

    setSelectedProducts(allIds);
    setSelectAll(true);
  };

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // PRICE LIST LABEL
  // =========================================================

  const getPriceListLabel = (value) => {
    switch (value) {
      case "DEALER":
        return "Dealer Price";

      case "PAINTER":
        return "Painter Price";

      case "SEASONAL":
        return "Seasonal Campaign";

      case "PROMOTIONAL":
        return "Promotional Offer";

      default:
        return "-";
    }
  };

  // =========================================================
  // LOADING SKELETON
  // =========================================================

  const renderLoadingRows = () => {
    return Array.from(
      { length: 5 },
      (_, index) => (
        <tr key={`loading-${index}`}>
          <td colSpan="13">
            <div className="price-loading-row">
              Loading product...
            </div>
          </td>
        </tr>
      )
    );
  };

  // =========================================================
  // EMPTY STATE
  // =========================================================

  const renderEmptyState = () => {
    return (
      <tr>
        <td
          colSpan="13"
          className="price-empty-state"
        >
          <div className="price-empty-content">
            <div className="price-empty-icon">
              ₹
            </div>

            <h3>
              No products available
            </h3>

            <p>
              No products match the
              selected filters.
            </p>

            <button
              type="button"
              className="price-reset-button"
              onClick={handleReset}
            >
              ↻ Reset Filters
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // =========================================================
  // ERROR STATE
  // =========================================================

  const renderErrorState = () => {
    return (
      <tr>
        <td
          colSpan="13"
          className="price-empty-state"
        >
          <div className="price-empty-content">
            <div className="price-empty-icon">
              !
            </div>

            <h3>
              Unable to load products
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="price-primary-btn"
              onClick={() => {
                fetchPriceProducts();
                fetchPriceStats();
              }}
            >
              ↻ Try Again
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="price-management-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="price-page-header">

        <div className="price-page-title">

          <h1>
            Price Management
          </h1>

          <div className="price-breadcrumb">

            <span>
              Dashboard
            </span>

            <span>
              ›
            </span>

            <span>
              Price Management
            </span>

          </div>

        </div>


        {/* ==================================================
            HEADER ACTIONS
        ================================================== */}

        <div className="price-header-actions">

          <button className="users-secondary-btn">
            <Upload size={16} />
            Import
          </button>

          <button className="users-secondary-btn">
            <Download size={16} />
            Export
          </button>


          <button
            type="button"
            className="price-primary-btn"
          >
            + Create Price List
          </button>

        </div>

      </div>


      {/* ==================================================
          STATISTICS CARDS
      ================================================== */}

      <div className="price-stats-grid">

        {/* TOTAL PRODUCTS */}

        <div className="price-stat-card">

          <div className="price-stat-icon blue">
            ◇
          </div>

          <div className="price-stat-content">

            <span className="price-stat-label">
              Total Products
            </span>

            <strong>
              {statsLoading
                ? "..."
                : stats.totalProducts.toLocaleString(
                  "en-IN"
                )}
            </strong>

            <small>
              All active products
            </small>

          </div>

        </div>


        {/* PRICE LISTS */}

        <div className="price-stat-card">

          <div className="price-stat-icon purple">
            ♙
          </div>

          <div className="price-stat-content">

            <span className="price-stat-label">
              Price Lists
            </span>

            <strong>
              {statsLoading
                ? "..."
                : stats.priceLists}
            </strong>

            <small>
              Active price lists
            </small>

          </div>

        </div>


        {/* UPDATED TODAY */}

        <div className="price-stat-card">

          <div className="price-stat-icon green">
            ▦
          </div>

          <div className="price-stat-content">

            <span className="price-stat-label">
              Updated Today
            </span>

            <strong>
              {statsLoading
                ? "..."
                : stats.updatedToday}
            </strong>

            <small>
              Products price updated
            </small>

          </div>

        </div>


        {/* PRICE CHANGES */}

        <div className="price-stat-card">

          <div className="price-stat-icon orange">
            ▧
          </div>

          <div className="price-stat-content">

            <span className="price-stat-label">
              Price Changes (This Month)
            </span>

            <strong>
              {statsLoading
                ? "..."
                : stats.priceChanges}
            </strong>

            <small className="price-stat-growth">
              Price revisions this month
            </small>

          </div>

        </div>


        {/* AVERAGE DISCOUNT */}

        <div className="price-stat-card">

          <div className="price-stat-icon pink">
            ♢
          </div>

          <div className="price-stat-content">

            <span className="price-stat-label">
              Average Discount
            </span>

            <strong>
              {statsLoading
                ? "..."
                : `${stats.averageDiscount}%`}
            </strong>

            <small>
              Across approved prices
            </small>

          </div>

        </div>

      </div>


      {/* ==================================================
          STATS ERROR
      ================================================== */}

      {statsError && (
        <div className="price-inline-error">
          {statsError}
        </div>
      )}


      {/* ==================================================
          TABS
      ================================================== */}

      <div className="price-tabs">

        <button
          type="button"
          className={
            activeTab === "priceList"
              ? "price-tab active"
              : "price-tab"
          }
          onClick={() =>
            setActiveTab("priceList")
          }
        >
          ☷ Price List View
        </button>


        <button
          type="button"
          className={
            activeTab === "history"
              ? "price-tab active"
              : "price-tab"
          }
          onClick={() =>
            setActiveTab("history")
          }
        >
          ◷ Product Price History
        </button>

      </div>


      {/* ==================================================
          PRICE LIST VIEW
      ================================================== */}

      {activeTab === "priceList" && (

        <>

          {/* ==================================================
              FILTERS
          ================================================== */}

          <div className="price-filter-section">

            {/* SEARCH */}

            <div className="price-search-box">

              <input
                type="text"
                placeholder="Search by product, SKU or barcode..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
              <Search size={17} />

            </div>


            {/* PRICE LIST */}

            <div className="price-select-box">

              <select
                value={selectedPriceList}
                onChange={(e) =>
                  setSelectedPriceList(
                    e.target.value
                  )
                }
              >

                {priceListOptions.map(
                  (option) => (
                    <option
                      key={option.label}
                      value={option.label}
                    >
                      {option.label}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* CATEGORY */}

            <div className="price-select-box">

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
              >

                {categoryOptions.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* BRAND */}

            <div className="price-select-box">

              <select
                value={selectedBrand}
                onChange={(e) =>
                  setSelectedBrand(
                    e.target.value
                  )
                }
              >

                {brandOptions.map(
                  (brand) => (
                    <option
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* EFFECTIVE DATE */}

            <div className="price-date-box">

              <input
                type="date"
                value={effectiveDate}
                onChange={(e) =>
                  setEffectiveDate(
                    e.target.value
                  )
                }
              />

            </div>


            {/* MORE FILTERS */}

            <button
              type="button"
              className="more-filter-btn"
            >
              <Filter size={16} />
              More Filters
            </button>


            {/* RESET */}

            <button
              type="button"
              className="price-reset-button"
              onClick={handleReset}
            >
              Reset
            </button>

          </div>


          {/* ==================================================
              PRICE TABLE
          ================================================== */}

          <div className="price-table-wrapper">

            <table className="price-table">

              <thead>

                <tr>

                  <th>
                    <input
                      type="checkbox"
                      checked={
                        products.length > 0 &&
                        selectedProducts.length ===
                        products.length
                      }
                      onChange={
                        handleSelectAll
                      }
                    />
                  </th>

                  <th>
                    Product Details
                  </th>

                  <th>
                    SKU / Barcode
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Brand
                  </th>

                  <th>
                    Packing Size
                  </th>

                  <th>
                    Base Price (MRP)
                  </th>

                  <th>
                    Discount %
                  </th>

                  <th>
                    Discount Price
                  </th>

                  <th>
                    Effective Date
                  </th>

                  <th>
                    Price List
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* LOADING */}

                {loading &&
                  renderLoadingRows()}


                {/* ERROR */}

                {!loading &&
                  error &&
                  renderErrorState()}


                {/* EMPTY */}

                {!loading &&
                  !error &&
                  products.length === 0 &&
                  renderEmptyState()}


                {/* PRODUCTS */}

                {!loading &&
                  !error &&
                  products.length > 0 &&
                  products.map(
                    (product) => {

                      const productId =
                        product._id;

                      const isSelected =
                        selectedProducts.includes(
                          productId
                        );

                      return (
                        <tr
                          key={productId}
                        >

                          {/* CHECKBOX */}

                          <td>

                            <input
                              type="checkbox"
                              checked={
                                isSelected
                              }
                              onChange={() =>
                                handleSelectProduct(
                                  productId
                                )
                              }
                            />

                          </td>


                          {/* PRODUCT */}

                          <td>

                            <div className="price-product-details">

                              <strong>
                                {
                                  product.productName ||
                                  "-"
                                }
                              </strong>

                            </div>

                          </td>


                          {/* SKU / BARCODE */}

                          <td>

                            <div className="price-sku">

                              <strong>
                                {
                                  product.sku ||
                                  "-"
                                }
                              </strong>

                              {product.barcode && (
                                <span>
                                  {
                                    product.barcode
                                  }
                                </span>
                              )}

                            </div>

                          </td>


                          {/* CATEGORY */}

                          <td>
                            {
                              product.category ||
                              "-"
                            }
                          </td>


                          {/* BRAND */}

                          <td>
                            {
                              product.brand ||
                              "-"
                            }
                          </td>


                          {/* PACKING SIZE */}

                          <td>
                            {
                              product.packingSize ||
                              "-"
                            }
                          </td>


                          {/* BASE PRICE / MRP */}

                          <td>

                            <strong className="price-mrp">
                              ₹
                              {formatCurrency(
                                product.mrp
                              )}
                            </strong>

                          </td>


                          {/* DISCOUNT */}

                          <td>

                            <span className="price-discount">

                              {Number(
                                product.discountPercent ||
                                0
                              )}
                              %

                            </span>

                          </td>


                          {/* DISCOUNT PRICE */}

                          <td>

                            <strong className="price-discount-price">

                              ₹
                              {formatCurrency(
                                product.priceDiscountPrice ??
                                product.discountPrice
                              )}

                            </strong>

                          </td>


                          {/* EFFECTIVE DATE */}

                          <td>
                            {formatDate(
                              product.effectiveDate
                            )}
                          </td>


                          {/* PRICE LIST */}

                          <td>

                            <span className="price-list-badge">

                              {getPriceListLabel(
                                product.priceList
                              )}

                            </span>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={
                                product.status ===
                                  "ACTIVE"
                                  ? "price-status active"
                                  : "price-status inactive"
                              }
                            >
                              {
                                product.status ||
                                "-"
                              }
                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="price-table-actions">

                            <button
                              className="price-action"
                              title="Edit User"
                              onClick={() => handleEditUser(user._id)}
                            >
                              <Pencil size={17} />
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

              </tbody>

            </table>

          </div>

        </>

      )}


      {/* ==================================================
          PRICE HISTORY TAB
      ================================================== */}

      {activeTab === "history" && (

        <div className="price-history-placeholder">

          <div className="price-empty-content">

            <div className="price-empty-icon">
              ◷
            </div>

            <h3>
              Product Price History
            </h3>

            <p>
              Select a product from the
              price list to view its
              complete price revision
              history.
            </p>

          </div>

        </div>

      )}

    </div>
  );
};

export default PriceManagement;