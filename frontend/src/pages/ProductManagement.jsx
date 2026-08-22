import { useEffect, useState } from "react";
import axios from "axios";
import {
    Eye,
    Pencil,
    Trash2,
    MoreVertical,
    Package,
    PackageCheck,
    PackageX,
    AlertTriangle,
    PackageMinus,
    Filter,
    ChevronRight,
    Upload,
    Download,
    Search,
} from "lucide-react";
import "../css/productmanagement.css";


const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        inactiveProducts: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [newProduct, setNewProduct] = useState({
        productName: "",
        sku: "",
        barcode: "",
        category: "",
        brand: "",
        packingSize: "",
        mrp: "",
        discountPrice: "",
        stockQuantity: "",
        status: "ACTIVE",
    });



    const API_URL = "http://localhost:5000/api/products";

    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Fetch products error:", error);
            setError("Failed to load products");
        }
    };

    // ==========================================
    // FETCH PRODUCT STATS
    // ==========================================

    const fetchProductStats = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_URL}/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStats(
                response.data.stats || {
                    totalProducts: 0,
                    activeProducts: 0,
                    lowStockProducts: 0,
                    outOfStockProducts: 0,
                    inactiveProducts: 0,
                }
            );
        } catch (error) {
            console.error("Fetch product stats error:", error);
        }
    };

    const handleViewProduct = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSelectedProduct(response.data.product);
            setShowViewModal(true);
        } catch (error) {
            console.error("View product error:", error);
        }
    };

    const handleEditProduct = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEditingProduct(response.data.product);
            setShowEditModal(true);
        } catch (error) {
            console.error("Edit product fetch error:", error);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            setEditLoading(true);

            const token = localStorage.getItem("token");

            await axios.put(
                `${API_URL}/${editingProduct._id}`,
                editingProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShowEditModal(false);
            setEditingProduct(null);

            await fetchProducts();
            await fetchProductStats();

        } catch (error) {
            console.error("Update product error:", error);
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Refresh product list
            await fetchProducts();

            // Refresh stats
            await fetchProductStats();

        } catch (error) {
            console.error("Delete product error:", error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        try {
            setAddLoading(true);

            const token = localStorage.getItem("token");

            await axios.post(
                API_URL,
                newProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShowAddModal(false);

            setNewProduct({
                productName: "",
                sku: "",
                barcode: "",
                category: "",
                brand: "",
                packingSize: "",
                mrp: "",
                discountPrice: "",
                stockQuantity: "",
                status: "ACTIVE",
            });

            await fetchProducts();
            await fetchProductStats();

        } catch (error) {
            console.error("Add product error:", error);
        } finally {
            setAddLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            !search ||
            product.productName?.toLowerCase().includes(search) ||
            product.sku?.toLowerCase().includes(search) ||
            product.barcode?.toLowerCase().includes(search);

        const matchesCategory =
            !selectedCategory ||
            product.category === selectedCategory;

        const matchesSubCategory =
            !selectedSubCategory ||
            product.subCategory === selectedSubCategory;

        const matchesBrand =
            !selectedBrand ||
            product.brand === selectedBrand;

        const matchesStatus =
            !selectedStatus ||
            product.status === selectedStatus;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesSubCategory &&
            matchesBrand &&
            matchesStatus
        );
    });

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                fetchProducts(),
                fetchProductStats(),
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    return (
        <div className="product-management-page">

            {/* PAGE HEADER */}
            <div className="product-page-header">
                <div>
                    <h2>Product Management</h2>
                    <div className="users-breadcrumb">
                        Dashboard
                        <span>›</span>
                        Product Management
                    </div>
                </div>

                <div className="product-header-actions">
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
                        onClick={() => setShowAddModal(true)}
                    >
                        + Add Product
                    </button>
                </div>
            </div>


            {/* =============== PRODUCT STATS================= */}

            <div className="product-stats-grid">

                {/* Total Products */}
                <div className="product-stat-card">
                    <div className="product-stat-icon total-products-icon">
                        <Package size={22} />
                    </div>

                    <span>Total Products</span>

                    <strong>{stats.totalProducts}</strong>

                    <small>All registered products</small>
                </div>


                {/* Active Products */}
                <div className="product-stat-card">
                    <div className="product-stat-icon active-products-icon">
                        <PackageCheck size={22} />
                    </div>

                    <span>Active Products</span>

                    <strong>{stats.activeProducts}</strong>

                    <small>Currently active</small>
                </div>


                {/* Low Stock */}
                <div className="product-stat-card">
                    <div className="product-stat-icon low-stock-icon">
                        <AlertTriangle size={22} />
                    </div>

                    <span>Low Stock</span>

                    <strong>{stats.lowStockProducts}</strong>

                    <small>Products running low</small>
                </div>


                {/* Out of Stock */}
                <div className="product-stat-card">
                    <div className="product-stat-icon out-stock-icon">
                        <PackageX size={22} />
                    </div>

                    <span>Out of Stock</span>

                    <strong>{stats.outOfStockProducts}</strong>

                    <small>Currently unavailable</small>
                </div>


                {/* Inactive Products */}
                <div className="product-stat-card">
                    <div className="product-stat-icon inactive-products-icon">
                        <PackageMinus size={22} />
                    </div>

                    <span>Inactive Products</span>

                    <strong>{stats.inactiveProducts}</strong>

                    <small>Currently inactive</small>
                </div>

            </div>



            {/* PRODUCT CONTENT */}
            <div className="product-content-card">

                <div className="product-content-header">
                    <h2>Products</h2>

                    <div className="product-search-filter">

                        {/* Search */}

                        <div className="product-search-box">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by product name, SKU or barcode..."
                            />
                            <Search size={16} className="product-search-icon" />
                        </div>



                        {/* Category */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Emulsion">Emulsion</option>
                            <option value="Primer">Primer</option>
                            <option value="Putty">Putty</option>
                            <option value="Enamel">Enamel</option>
                            <option value="Texture">Texture</option>
                            <option value="Wood Finish">Wood Finish</option>
                            <option value="Waterproofing">Waterproofing</option>
                            <option value="Accessories">Accessories</option>
                        </select>

                        {/* Sub Category */}
                        <select
                            value={selectedSubCategory}
                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                        >
                            <option value="">All Sub Categories</option>
                        </select>

                        {/* Brand */}
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                            <option value="">All Brands</option>
                            <option value="Oneplus Spark">Oneplus Spark</option>
                        </select>

                        {/* Status */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>

                        {/* More Filters */}
                        <button
                            type="button"
                            className="product-filter-btn"
                        >
                            <Filter size={16} />
                            More Filters
                        </button>

                        {/* Reset */}
                        <button
                            type="button"
                            className="product-reset-btn"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("");
                                setSelectedSubCategory("");
                                setSelectedBrand("");
                                setSelectedStatus("");
                            }}
                        >
                            Reset
                        </button>

                    </div>
                </div>


                {/* TABLE */}
                {loading ? (
                    <div className="product-loading">
                        Loading products...
                    </div>
                ) : error ? (
                    <div className="product-error">
                        {error}
                    </div>
                ) : (
                    <div className="product-table-wrapper">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th className="checkbox-column">
                                        <input
                                            type="checkbox"
                                            checked={
                                                filteredProducts.length > 0 &&
                                                selectedProducts.length === filteredProducts.length
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts(
                                                        filteredProducts.map((product) => product._id)
                                                    );
                                                } else {
                                                    setSelectedProducts([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th>Product Details</th>
                                    <th>SKU / Barcode</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Packing Size</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.length === 0 ?
                                    (
                                        <tr>
                                            <td colSpan="9">
                                                No products found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <tr key={product._id}>

                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedProducts((prev) => [
                                                                    ...prev,
                                                                    product._id
                                                                ]);
                                                            } else {
                                                                setSelectedProducts((prev) =>
                                                                    prev.filter((id) => id !== product._id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </td>

                                                <td className="product-name-cell">
                                                    {product.productName}
                                                </td>

                                                <td>
                                                    <div className="product-barcode-cell">{product.sku}</div>
                                                    <small>
                                                        {product.barcode || "-"}
                                                    </small>
                                                </td>

                                                <td>
                                                    {product.category}
                                                </td>

                                                <td>
                                                    {product.brand}
                                                </td>

                                                <td>
                                                    {product.packingSize}
                                                </td>

                                                <td>
                                                    ₹{product.mrp}
                                                </td>

                                                <td>
                                                    {product.stockQuantity}
                                                </td>

                                                <td>
                                                    {product.status}
                                                </td>

                                                <td className="product-action-cell">
                                                    <button
                                                        type="button"
                                                        className="product-action-btn"
                                                        title="View Product"
                                                        onClick={() => handleViewProduct(product._id)}
                                                    >
                                                        <Eye size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="product-action-btn"
                                                        title="Edit Product"
                                                        onClick={() => handleEditProduct(product._id)}
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="product-action-btn delete-action"
                                                        title="Delete Product"
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="product-action-btn"
                                                        title="More"
                                                    >
                                                        <MoreVertical size={19} />
                                                    </button>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {showViewModal && selectedProduct && (
                <div className="product-modal-overlay">
                    <div className="product-view-modal">

                        <div className="product-modal-header">
                            <h2>Product Details</h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedProduct(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="product-details-grid">

                            <div>
                                <label>Product Name</label>
                                <strong>{selectedProduct.productName || "-"}</strong>
                            </div>

                            <div>
                                <label>SKU</label>
                                <strong>{selectedProduct.sku || "-"}</strong>
                            </div>

                            <div>
                                <label>Barcode</label>
                                <strong>{selectedProduct.barcode || "-"}</strong>
                            </div>

                            <div>
                                <label>Category</label>
                                <strong>{selectedProduct.category || "-"}</strong>
                            </div>

                            <div>
                                <label>Brand</label>
                                <strong>{selectedProduct.brand || "-"}</strong>
                            </div>

                            <div>
                                <label>Packing Size</label>
                                <strong>{selectedProduct.packingSize || "-"}</strong>
                            </div>

                            <div>
                                <label>MRP</label>
                                <strong>₹{selectedProduct.mrp || 0}</strong>
                            </div>

                            <div>
                                <label>Discount Price</label>
                                <strong>₹{selectedProduct.discountPrice || 0}</strong>
                            </div>

                            <div>
                                <label>Stock</label>
                                <strong>{selectedProduct.stockQuantity || 0}</strong>
                            </div>

                            <div>
                                <label>Status</label>
                                <strong>{selectedProduct.status || "-"}</strong>
                            </div>

                        </div>

                        <div className="product-modal-footer">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedProduct(null);
                                }}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {showEditModal && editingProduct && (
                <div className="product-modal-overlay">
                    <div className="product-view-modal">

                        <div className="product-modal-header">
                            <h2>Edit Product</h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingProduct(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct}>

                            <div className="product-edit-grid">

                                <div>
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        value={editingProduct.productName || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                productName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>SKU</label>
                                    <input
                                        type="text"
                                        value={editingProduct.sku || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                sku: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Barcode</label>
                                    <input
                                        type="text"
                                        value={editingProduct.barcode || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                barcode: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Category</label>
                                    <select
                                        value={editingProduct.category || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                category: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Emulsion">Emulsion</option>
                                        <option value="Primer">Primer</option>
                                        <option value="Putty">Putty</option>
                                        <option value="Enamel">Enamel</option>
                                        <option value="Texture">Texture</option>
                                        <option value="Wood Finish">Wood Finish</option>
                                        <option value="Waterproofing">Waterproofing</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Brand</label>
                                    <input
                                        type="text"
                                        value={editingProduct.brand || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                brand: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Packing Size</label>
                                    <input
                                        type="text"
                                        value={editingProduct.packingSize || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                packingSize: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>MRP</label>
                                    <input
                                        type="number"
                                        value={editingProduct.mrp || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                mrp: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Discount Price</label>
                                    <input
                                        type="number"
                                        value={editingProduct.discountPrice || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                discountPrice: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={editingProduct.stockQuantity || ""}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                stockQuantity: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Status</label>
                                    <select
                                        value={editingProduct.status || "ACTIVE"}
                                        onChange={(e) =>
                                            setEditingProduct({
                                                ...editingProduct,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>

                            </div>

                            <div className="product-modal-footer">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingProduct(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="save-product-btn"
                                >
                                    {editLoading ? "Updating..." : "Update Product"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="product-modal-overlay">
                    <div className="product-view-modal">

                        <div className="product-modal-header">
                            <h2>Add Product</h2>

                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct}>

                            <div className="product-edit-grid">

                                <div>
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.productName}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                productName: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>SKU</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.sku}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                sku: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Barcode</label>
                                    <input
                                        type="text"
                                        value={newProduct.barcode}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                barcode: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Category</label>
                                    <select
                                        required
                                        value={newProduct.category}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                category: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Emulsion">Emulsion</option>
                                        <option value="Primer">Primer</option>
                                        <option value="Putty">Putty</option>
                                        <option value="Enamel">Enamel</option>
                                        <option value="Texture">Texture</option>
                                        <option value="Wood Finish">Wood Finish</option>
                                        <option value="Waterproofing">Waterproofing</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Brand</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.brand}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                brand: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Packing Size</label>
                                    <input
                                        type="text"
                                        value={newProduct.packingSize}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                packingSize: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>MRP</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newProduct.mrp}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                mrp: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Discount Price</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newProduct.discountPrice}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                discountPrice: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newProduct.stockQuantity}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                stockQuantity: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Status</label>
                                    <select
                                        value={newProduct.status}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                status: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>

                            </div>

                            <div className="product-modal-footer">

                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-product-btn"
                                    disabled={addLoading}
                                >
                                    {addLoading ? "Adding..." : "Add Product"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductManagement;