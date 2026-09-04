import React, { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Download,
    Filter,
    RotateCcw,
    Eye,
    Pencil,
    Trash2,
    Calculator,
    Wallet,
    CheckCircle,
    Clock,
    Gift,
    Store,
    AlertTriangle,
    Percent,
    Users,
    UserRound,
    Building2,
    Paintbrush,
    UserPlus,
    FileText,
    ChevronLeft,
    ChevronRight,
    X,
    Search,
} from "lucide-react";

import "../css/CommissionManagement.css";

const API_URL = "http://localhost:5000/api/commissions";

const STATUS_OPTIONS = [
    "PENDING_CALCULATION",
    "UNDER_VERIFICATION",
    "APPROVED",
    "RELEASED",
    "ON_HOLD",
    "CANCELLED",
];

const SALE_TYPES = ["CASH", "CREDIT"];

const emptyForm = {
    invoiceNumber: "",
    customer: "",
    store: "",
    territory: "",
    salesExecutive: "",
    saleDate: "",
    invoiceValue: "",
    rewardPoints: "",
    saleType: "CASH",
    paymentDate: "",
    paymentStatus: "PENDING",
    commissionStatus: "PENDING_CALCULATION",
};

const formatMoney = (value) => {
    const number = Number(value || 0);

    return `₹ ${number.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const normalizeStatus = (value) => {
    if (!value) return "PENDING_CALCULATION";

    return String(value).toUpperCase().replace(/ /g, "_");
};

const statusLabel = (status) => {
    const value = normalizeStatus(status);

    const labels = {
        PENDING_CALCULATION: "Pending Calculation",
        UNDER_VERIFICATION: "Under Verification",
        APPROVED: "Approved",
        RELEASED: "Released",
        ON_HOLD: "On Hold",
        CANCELLED: "Cancelled",
    };

    return labels[value] || value;
};

const getStatusClass = (status) => {
    const value = normalizeStatus(status);

    if (value === "APPROVED") return "approved";
    if (value === "RELEASED") return "released";
    if (value === "UNDER_VERIFICATION") return "verification";
    if (value === "ON_HOLD") return "hold";
    if (value === "CANCELLED") return "cancelled";

    return "pending";
};

const getCommissionPercentage = (commission) => {
    if (commission?.commissionPercentage !== undefined) {
        return Number(commission.commissionPercentage || 0);
    }

    if (commission?.commissionPercent !== undefined) {
        return Number(commission.commissionPercent || 0);
    }

    if (commission?.commissionRate !== undefined) {
        return Number(commission.commissionRate || 0);
    }

    return 0;
};

const getCommissionAmount = (commission) => {
    return Number(
        commission?.commissionAmount ??
        commission?.commission ??
        commission?.cashReward ??
        0
    );
};

const getPenaltyAmount = (commission) => {
    return Number(
        commission?.penaltyAmount ??
        commission?.penalty ??
        0
    );
};

const getNetCommission = (commission) => {
    return Number(
        commission?.netCommission ??
        commission?.netPayable ??
        getCommissionAmount(commission) - getPenaltyAmount(commission)
    );
};

const getInvoiceValue = (commission) => {
    return Number(
        commission?.invoiceValue ??
        commission?.salesAmount ??
        commission?.saleAmount ??
        0
    );
};

const getPaymentStatus = (commission) => {
    return String(
        commission?.paymentStatus ||
        commission?.payment_status ||
        "PENDING"
    ).toUpperCase();
};

const getSaleType = (commission) => {
    return String(
        commission?.saleType ||
        commission?.incentiveType ||
        "CASH"
    ).toUpperCase();
};

const getRecoveryDays = (commission) => {
    if (commission?.recoveryDays !== undefined) {
        return Number(commission.recoveryDays || 0);
    }

    if (!commission?.saleDate || !commission?.paymentDate) {
        return 0;
    }

    const start = new Date(commission.saleDate);
    const end = new Date(commission.paymentDate);

    const difference = end.getTime() - start.getTime();

    if (difference <= 0) return 0;

    return Math.floor(difference / (1000 * 60 * 60 * 24));
};

const getUserName = (commission) => {
    if (typeof commission?.salesExecutive === "string") {
        return commission.salesExecutive;
    }

    if (commission?.salesExecutive?.name) {
        return commission.salesExecutive.name;
    }

    if (commission?.employee?.name) {
        return commission.employee.name;
    }

    return "—";
};

const getUserType = (commission) => {
    return (
        commission?.userType ||
        commission?.employeeType ||
        commission?.designation ||
        "Employee"
    );
};

const getBranch = (commission) => {
    return commission?.branch || commission?.store || "—";
};

const getTerritory = (commission) => {
    return commission?.territory || "—";
};

const getSchemeSource = (commission) => {
    return (
        commission?.schemeSource ||
        commission?.source ||
        commission?.scheme ||
        commission?.incentiveType ||
        "Commission"
    );
};

const getDateMonth = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "";

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
    )}`;
};

const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    iconClass = "",
}) => {
    return (
        <div className="commission-stat-card">
            <div className={`commission-stat-icon ${iconClass}`}>
                {icon}
            </div>

            <div className="commission-stat-content">
                <div className="commission-stat-title">{title}</div>

                <div className="commission-stat-value">{value}</div>

                {subtitle && (
                    <div className="commission-stat-subtitle">
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );
};

const CategoryCard = ({
    icon,
    title,
    items,
    children,
}) => {
    return (
        <div className="commission-category-card">
            <div className="commission-category-title">
                <span className="commission-category-icon">
                    {icon}
                </span>

                <span>{title}</span>
            </div>

            {items && (
                <ul className="commission-category-list">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            )}

            {children}

            <button className="commission-view-details">
                View Details
                <span>→</span>
            </button>
        </div>
    );
};

const ReportCard = ({ icon, title }) => {
    return (
        <button className="commission-report-card">
            <span className="commission-report-icon">
                {icon}
            </span>

            <span>{title}</span>
        </button>
    );
};

export default function CommissionManagement() {
    const [commissions, setCommissions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState("");
    const [incentiveType, setIncentiveType] = useState("");
    const [userType, setUserType] = useState("");
    const [territory, setTerritory] = useState("");
    const [branch, setBranch] = useState("");
    const [status, setStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedCommission, setSelectedCommission] =
        useState(null);

    const [form, setForm] = useState(emptyForm);

    const fetchCommissions = async () => {
        try {
            setLoading(true);

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch commissions");
            }

            const data = await response.json();

            const records = Array.isArray(data?.commissions)
                ? data.commissions
                : Array.isArray(data?.commission)
                    ? data.commission
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];

            setCommissions(records);
        } catch (error) {
            console.error("Commission fetch error:", error);
            setCommissions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAddCommission = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

            const payload = {
                invoiceNumber: form.invoiceNumber,
                customer: form.customer,
                store: form.store,
                territory: form.territory,
                salesExecutive: form.salesExecutive,
                saleDate: form.saleDate,
                invoiceValue: Number(form.invoiceValue),
                rewardPoints: form.rewardPoints === "" ? 0 : Number(form.rewardPoints),
                saleType: form.saleType,
                paymentDate: form.paymentDate || null,
                paymentStatus: form.paymentStatus,
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || data?.success === false) {
                throw new Error(
                    data?.message || "Failed to create commission"
                );
            }

            setShowAddModal(false);
            setForm(emptyForm);

            await fetchCommissions();
        } catch (error) {
            console.error("Create commission error:", error);
            alert(error.message || "Failed to create commission");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateCommission = async (event) => {
        event.preventDefault();

        if (!selectedCommission?._id) return;

        try {
            setSaving(true);

            const payload = {
                invoiceNumber: form.invoiceNumber,
                customer: form.customer,
                store: form.store,
                territory: form.territory,
                salesExecutive: form.salesExecutive,
                saleDate: form.saleDate,
                invoiceValue: Number(form.invoiceValue),
                rewardPoints: form.rewardPoints === "" ? 0 : Number(form.rewardPoints),
                saleType: form.saleType,
                paymentDate: form.paymentDate || null,
                paymentStatus: form.paymentStatus,
            };

            const response = await fetch(
                `${API_URL}/${selectedCommission._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (!response.ok || data?.success === false) {
                throw new Error(
                    data?.message || "Failed to update commission"
                );
            }

            setShowEditModal(false);
            setSelectedCommission(null);
            setForm(emptyForm);

            await fetchCommissions();
        } catch (error) {
            console.error("Update commission error:", error);
            alert(error.message || "Failed to update commission");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (commission) => {
        if (!commission?._id) return;

        const confirmed = window.confirm(
            `Delete commission ${commission.invoiceNumber || ""}?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API_URL}/${commission._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || data?.success === false) {
                throw new Error(
                    data?.message || "Failed to delete commission"
                );
            }

            await fetchCommissions();
        } catch (error) {
            console.error("Delete commission error:", error);
            alert(error.message || "Failed to delete commission");
        }
    };

    const updateStatus = async (commission, newStatus) => {
        if (!commission?._id) return;

        try {
            const response = await fetch(
                `${API_URL}/${commission._id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        commissionStatus: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || data?.success === false) {
                throw new Error(
                    data?.message || "Failed to update status"
                );
            }

            await fetchCommissions();
        } catch (error) {
            console.error("Status update error:", error);
            alert(error.message || "Failed to update status");
        }
    };

    const openViewModal = (commission) => {
        setSelectedCommission(commission);
        setShowViewModal(true);
    };

    const openEditModal = (commission) => {
        setSelectedCommission(commission);

        setForm({
            invoiceNumber: commission?.invoiceNumber || "",
            customer: commission?.customer || "",
            store: commission?.store || "",
            territory: commission?.territory || "",
            salesExecutive:
                typeof commission?.salesExecutive === "string"
                    ? commission.salesExecutive
                    : commission?.salesExecutive?.name || "",
            saleDate: commission?.saleDate
                ? new Date(commission.saleDate)
                    .toISOString()
                    .split("T")[0]
                : "",
            invoiceValue: getInvoiceValue(commission),
            rewardPoints: commission?.rewardPoints ?? "",
            saleType: getSaleType(commission),
            paymentDate: commission?.paymentDate
                ? new Date(commission.paymentDate)
                    .toISOString()
                    .split("T")[0]
                : "",
            paymentStatus: getPaymentStatus(commission),
        });

        setShowEditModal(true);
    };

    const filteredCommissions = useMemo(() => {
        return commissions.filter((commission) => {
            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                String(commission?.invoiceNumber || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(commission?.customer || "")
                    .toLowerCase()
                    .includes(searchText) ||
                getUserName(commission)
                    .toLowerCase()
                    .includes(searchText) ||
                getBranch(commission)
                    .toLowerCase()
                    .includes(searchText);

            const matchesIncentiveType =
                !incentiveType ||
                getSaleType(commission) === incentiveType;

            const matchesUserType =
                !userType ||
                getUserType(commission) === userType;

            const matchesTerritory =
                !territory ||
                getTerritory(commission) === territory;

            const matchesBranch =
                !branch ||
                getBranch(commission) === branch;

            const matchesStatus =
                !status ||
                normalizeStatus(
                    commission?.commissionStatus || commission?.status
                ) === status;

            const matchesDate =
                !dateRange ||
                getDateMonth(commission?.saleDate) === dateRange;

            return (
                matchesSearch &&
                matchesIncentiveType &&
                matchesUserType &&
                matchesTerritory &&
                matchesBranch &&
                matchesStatus &&
                matchesDate
            );
        });
    }, [
        commissions,
        search,
        dateRange,
        incentiveType,
        userType,
        territory,
        branch,
        status,
    ]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        dateRange,
        incentiveType,
        userType,
        territory,
        branch,
        status,
        rowsPerPage,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCommissions.length / rowsPerPage)
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const startIndex =
        (safeCurrentPage - 1) * rowsPerPage;

    const paginatedCommissions = filteredCommissions.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const totalInvoiceValue = commissions.reduce(
        (sum, item) => sum + getInvoiceValue(item),
        0
    );

    const totalCommission = commissions.reduce(
        (sum, item) => sum + getCommissionAmount(item),
        0
    );

    const totalPenalty = commissions.reduce(
        (sum, item) => sum + getPenaltyAmount(item),
        0
    );

    const totalNetCommission = commissions.reduce(
        (sum, item) => sum + getNetCommission(item),
        0
    );

    const releasedCommission = commissions
        .filter(
            (item) =>
                normalizeStatus(
                    item?.commissionStatus || item?.status
                ) === "RELEASED"
        )
        .reduce(
            (sum, item) => sum + getNetCommission(item),
            0
        );

    const pendingCommission = commissions
        .filter((item) => {
            const currentStatus = normalizeStatus(
                item?.commissionStatus || item?.status
            );

            return [
                "PENDING_CALCULATION",
                "UNDER_VERIFICATION",
            ].includes(currentStatus);
        })
        .reduce(
            (sum, item) => sum + getNetCommission(item),
            0
        );

    const cashSales = commissions
        .filter((item) => getSaleType(item) === "CASH")
        .reduce(
            (sum, item) => sum + getInvoiceValue(item),
            0
        );

    const creditSales = commissions
        .filter((item) => getSaleType(item) === "CREDIT")
        .reduce(
            (sum, item) => sum + getInvoiceValue(item),
            0
        );

    const delayedPayments = commissions.filter(
        (item) => getRecoveryDays(item) > 90
    );

    const paidWithinRecovery = commissions.filter(
        (item) =>
            item?.paymentDate &&
            getRecoveryDays(item) <= 90
    );

    const recoveryPercentage =
        commissions.length > 0
            ? (paidWithinRecovery.length / commissions.length) *
            100
            : 0;

    const statusCounts = STATUS_OPTIONS.reduce(
        (result, currentStatus) => {
            result[currentStatus] = commissions.filter(
                (item) =>
                    normalizeStatus(
                        item?.commissionStatus || item?.status
                    ) === currentStatus
            ).length;

            return result;
        },
        {}
    );

    const departments = useMemo(() => {
        const values = commissions
            .map((item) => item?.department)
            .filter(Boolean);

        return [...new Set(values)];
    }, [commissions]);

    const userTypes = useMemo(() => {
        const values = commissions
            .map((item) => getUserType(item))
            .filter(Boolean);

        return [...new Set(values)];
    }, [commissions]);

    const territories = useMemo(() => {
        const values = commissions
            .map((item) => getTerritory(item))
            .filter(Boolean);

        return [...new Set(values)];
    }, [commissions]);

    const branches = useMemo(() => {
        const values = commissions
            .map((item) => getBranch(item))
            .filter(Boolean);

        return [...new Set(values)];
    }, [commissions]);

    const exportReport = () => {
        if (!filteredCommissions.length) {
            alert("No commission data available to export.");
            return;
        }

        const headers = [
            "Invoice Number",
            "Customer",
            "Store",
            "Territory",
            "Sales Executive",
            "Sale Date",
            "Invoice Value",
            "Reward Points",
            "Sale Type",
            "Payment Date",
            "Recovery Days",
            "Commission %",
            "Commission Amount",
            "Penalty Amount",
            "Net Commission",
            "Payment Status",
            "Commission Status",
        ];

        const rows = filteredCommissions.map((item) => [
            item?.invoiceNumber || "",
            item?.customer || "",
            getBranch(item),
            getTerritory(item),
            getUserName(item),
            formatDate(item?.saleDate),
            getInvoiceValue(item),
            item?.rewardPoints ?? 0,
            getSaleType(item),
            formatDate(item?.paymentDate),
            getRecoveryDays(item),
            getCommissionPercentage(item),
            getCommissionAmount(item),
            getPenaltyAmount(item),
            getNetCommission(item),
            getPaymentStatus(item),
            statusLabel(
                item?.commissionStatus || item?.status
            ),
        ]);

        const csv = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((cell) =>
                        `"${String(cell).replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "commission-report.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const resetFilters = () => {
        setSearch("");
        setDateRange("");
        setIncentiveType("");
        setUserType("");
        setTerritory("");
        setBranch("");
        setStatus("");
        setCurrentPage(1);
    };

    const handleQuickCalculate = () => {
        setForm(emptyForm);
        setShowAddModal(true);
    };

    const handleQuickApprove = async () => {
        const pending = commissions.find((item) => {
            const currentStatus = normalizeStatus(
                item?.commissionStatus || item?.status
            );

            return (
                currentStatus === "PENDING_CALCULATION" ||
                currentStatus === "UNDER_VERIFICATION"
            );
        });

        if (!pending) {
            alert("No pending commission available.");
            return;
        }

        await updateStatus(pending, "APPROVED");
    };

    const handleReleasePayment = async () => {
        const approved = commissions.find(
            (item) =>
                normalizeStatus(
                    item?.commissionStatus || item?.status
                ) === "APPROVED"
        );

        if (!approved) {
            alert("No approved commission available.");
            return;
        }

        await updateStatus(approved, "RELEASED");
    };

    return (
        <div className="commission-page">

            {/* =========================
          PAGE HEADER
      ========================== */}

            <div className="commission-page-header">
                <div>
                    <div className="commission-breadcrumb">
                        Dashboard
                        <span>›</span>
                        Commission Management
                        <span>›</span>
                        Overview
                    </div>

                    <h1>Commission Management</h1>

                    <p>
                        Manage employee commissions, rewards,
                        incentives and own store rolling commission
                    </p>
                </div>

                <div className="commission-header-actions">
                    <button
                        className="commission-secondary-btn"
                        onClick={handleQuickCalculate}
                    >
                        <Calculator size={17} />
                        Calculate Commission
                    </button>

                    <button
                        className="commission-secondary-btn"
                        onClick={exportReport}
                    >
                        <Download size={17} />
                        Export
                    </button>

                    <button
                        className="commission-primary-btn"
                        onClick={() => {
                            setForm(emptyForm);
                            setShowAddModal(true);
                        }}
                    >
                        <Plus size={18} />
                        Add Commission
                    </button>
                </div>
            </div>

            {/* =========================
          TOP 10 STATS
      ========================== */}

            <div className="commission-stats-grid">

                <StatCard
                    icon={<Wallet size={22} />}
                    iconClass="blue"
                    title="Total Incentive Payable"
                    value={formatMoney(totalNetCommission)}
                    subtitle="Current commission payable"
                />

                <StatCard
                    icon={<CheckCircle size={22} />}
                    iconClass="green"
                    title="Total Rewards Released"
                    value={formatMoney(releasedCommission)}
                    subtitle="Released commission"
                />

                <StatCard
                    icon={<Clock size={22} />}
                    iconClass="orange"
                    title="Pending Commission Approval"
                    value={formatMoney(pendingCommission)}
                    subtitle="Awaiting approval"
                />

                <StatCard
                    icon={<Gift size={22} />}
                    iconClass="purple"
                    title="Pending Reward Redemption"
                    value={formatMoney(pendingCommission)}
                    subtitle="Pending incentives"
                />

                <StatCard
                    icon={<Store size={22} />}
                    iconClass="blue"
                    title="Total Dealer Rewards"
                    value={formatMoney(
                        commissions
                            .filter(
                                (item) =>
                                    String(getUserType(item)).toLowerCase() ===
                                    "dealer"
                            )
                            .reduce(
                                (sum, item) =>
                                    sum + getNetCommission(item),
                                0
                            )
                    )}
                    subtitle="Dealer commission"
                />

                <StatCard
                    icon={<Paintbrush size={22} />}
                    iconClass="red"
                    title="Total Painter Rewards"
                    value={formatMoney(
                        commissions
                            .filter(
                                (item) =>
                                    String(getUserType(item)).toLowerCase() ===
                                    "painter"
                            )
                            .reduce(
                                (sum, item) =>
                                    sum + getNetCommission(item),
                                0
                            )
                    )}
                    subtitle="Painter commission"
                />

                <StatCard
                    icon={<Users size={22} />}
                    iconClass="purple"
                    title="Total Referral Incentives"
                    value={formatMoney(
                        commissions
                            .filter((item) =>
                                String(getSchemeSource(item))
                                    .toLowerCase()
                                    .includes("referral")
                            )
                            .reduce(
                                (sum, item) =>
                                    sum + getNetCommission(item),
                                0
                            )
                    )}
                    subtitle="Referral incentives"
                />

                <StatCard
                    icon={<Store size={22} />}
                    iconClass="blue"
                    title="Store Commission Payable"
                    value={formatMoney(totalNetCommission)}
                    subtitle="Own store commission"
                />

                <StatCard
                    icon={<AlertTriangle size={22} />}
                    iconClass="orange"
                    title="Penalty Amount"
                    value={formatMoney(totalPenalty)}
                    subtitle="Delayed payment penalty"
                />

                <StatCard
                    icon={<Percent size={22} />}
                    iconClass="green"
                    title="Recovery % (This Month)"
                    value={`${recoveryPercentage.toFixed(2)}%`}
                    subtitle="Payment recovery"
                />
            </div>

            {/* =========================
          FILTERS
      ========================== */}

            <div className="commission-filter-card">

                <div className="commission-filter-grid">

                    <div className="commission-field">
                        <label>Date Range</label>

                        <input
                            type="month"
                            value={dateRange}
                            onChange={(e) =>
                                setDateRange(e.target.value)
                            }
                        />
                    </div>

                    <div className="commission-field">
                        <label>Incentive Type</label>

                        <select
                            value={incentiveType}
                            onChange={(e) =>
                                setIncentiveType(e.target.value)
                            }
                        >
                            <option value="">All Types</option>

                            {SALE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="commission-field">
                        <label>User Type</label>

                        <select
                            value={userType}
                            onChange={(e) =>
                                setUserType(e.target.value)
                            }
                        >
                            <option value="">All User Types</option>

                            {userTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="commission-field">
                        <label>Territory</label>

                        <select
                            value={territory}
                            onChange={(e) =>
                                setTerritory(e.target.value)
                            }
                        >
                            <option value="">All Territories</option>

                            {territories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="commission-field">
                        <label>Branch</label>

                        <select
                            value={branch}
                            onChange={(e) =>
                                setBranch(e.target.value)
                            }
                        >
                            <option value="">All Branches</option>

                            {branches.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="commission-field">
                        <label>Status</label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            <option value="">All Status</option>

                            {STATUS_OPTIONS.map((item) => (
                                <option key={item} value={item}>
                                    {statusLabel(item)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="commission-field">
                        <button
                            className="commission-filter-btn"
                            onClick={() => setCurrentPage(1)}
                        >
                            <Filter size={17} />
                            Filters
                        </button>
                    </div>

                    <div className="commission-field">
                        <button
                            className="commission-reset-btn"
                            onClick={resetFilters}
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </div>
                </div>

               
            </div>

            {/* =========================
          MAIN CONTENT
      ========================== */}

            <div className="commission-main-layout">

                <div className="commission-main-content">

                    {/* =========================
              COMMISSION CATEGORIES
          ========================== */}

                    <div className="commission-section-header">
                        <div>
                            <h2>Commission Categories</h2>
                            <p>
                                Commission and incentive categories
                            </p>
                        </div>
                    </div>

                    <div className="commission-category-grid">

                        <CategoryCard
                            icon={<UserRound size={18} />}
                            title="Employee Commission"
                            items={[
                                "Sales Executive",
                                "Sales Manager",
                                "Regional Manager",
                                "Store Manager",
                                "Store Staff",
                            ]}
                        />

                        <CategoryCard
                            icon={<Building2 size={18} />}
                            title="Dealer Rewards"
                            items={[
                                "Reward Points",
                                "Cash Rewards",
                                "Scheme Rewards",
                                "Target Achievement",
                                "Cashback",
                            ]}
                        />

                        <CategoryCard
                            icon={<Paintbrush size={18} />}
                            title="Painter Rewards"
                            items={[
                                "QR Scan Rewards",
                                "Cashback",
                                "Milestone Rewards",
                                "Referral Rewards",
                            ]}
                        />

                        <CategoryCard
                            icon={<UserPlus size={18} />}
                            title="Referral Incentives"
                            items={[
                                "Builder",
                                "Contractor",
                                "Architect",
                                "Engineer",
                                "Interior Designer",
                                "Dealer Referral",
                                "Painter Referral",
                            ]}
                        />

                        <CategoryCard
                            icon={<Store size={18} />}
                            title="Own Store Rolling Commission"
                        >
                            <div className="rolling-mini-card">
                                <div className="rolling-mini-title">
                                    This Month Cycle
                                </div>

                                <div className="rolling-mini-value">
                                    20 Apr 2026 - 20 May 2026
                                </div>

                                <div className="rolling-mini-row">
                                    <span>Cash Sales</span>
                                    <strong>
                                        {formatMoney(cashSales)}
                                    </strong>
                                </div>

                                <div className="rolling-mini-row">
                                    <span>Credit Sales</span>
                                    <strong>
                                        {formatMoney(creditSales)}
                                    </strong>
                                </div>

                                <div className="rolling-mini-row">
                                    <span>Eligible Incentive</span>
                                    <strong>
                                        {formatMoney(totalCommission)}
                                    </strong>
                                </div>

                                <div className="rolling-mini-row">
                                    <span>Pending Recovery</span>
                                    <strong>
                                        {formatMoney(creditSales)}
                                    </strong>
                                </div>

                                <div className="rolling-mini-row">
                                    <span>Penalty</span>
                                    <strong>
                                        {formatMoney(totalPenalty)}
                                    </strong>
                                </div>

                                <div className="rolling-mini-row net">
                                    <span>Net Commission</span>
                                    <strong>
                                        {formatMoney(totalNetCommission)}
                                    </strong>
                                </div>
                            </div>
                        </CategoryCard>

                    </div>

                    {/* =========================
              COMMISSION TABLE
          ========================== */}

                    <div className="commission-table-card">

                        <div className="commission-table-header">
                            <div>
                                <h2>
                                    Commission / Incentive Overview
                                </h2>

                                <p>
                                    Complete commission transaction history
                                </p>
                            </div>

                            <div className="commission-table-header-actions">
                                <button
                                    className="commission-small-btn"
                                    onClick={handleQuickCalculate}
                                >
                                    <Plus size={15} />
                                    Add Commission
                                </button>

                                <button
                                    className="commission-small-btn"
                                    onClick={exportReport}
                                >
                                    <Download size={15} />
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="commission-table-wrapper">

                            <table className="commission-table">

                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>User</th>
                                        <th>User Type</th>
                                        <th>Branch</th>
                                        <th>Territory</th>
                                        <th>Scheme / Source</th>
                                        <th>Sales Amount (₹)</th>
                                        <th>Reward Points</th>
                                        <th>Cash Reward (₹)</th>
                                        <th>Comm. %</th>
                                        <th>Penalty (₹)</th>
                                        <th>Net Payable (₹)</th>
                                        <th>Status</th>
                                        <th>Payment Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="15"
                                                className="commission-empty"
                                            >
                                                Loading commission data...
                                            </td>
                                        </tr>
                                    ) : paginatedCommissions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="15"
                                                className="commission-empty"
                                            >
                                                No commission data available
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedCommissions.map(
                                            (commission, index) => {
                                                const currentStatus =
                                                    commission?.commissionStatus ||
                                                    commission?.status ||
                                                    "PENDING_CALCULATION";

                                                return (
                                                    <tr key={commission._id || index}>

                                                        <td>
                                                            {startIndex + index + 1}
                                                        </td>

                                                        <td>
                                                            <div className="commission-user-cell">
                                                                <div className="commission-user-avatar">
                                                                    {getUserName(
                                                                        commission
                                                                    )
                                                                        .charAt(0)
                                                                        .toUpperCase()}
                                                                </div>

                                                                <span>
                                                                    {getUserName(
                                                                        commission
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            {getUserType(commission)}
                                                        </td>

                                                        <td>
                                                            {getBranch(commission)}
                                                        </td>

                                                        <td>
                                                            {getTerritory(commission)}
                                                        </td>

                                                        <td>
                                                            {getSchemeSource(
                                                                commission
                                                            )}
                                                        </td>

                                                        <td>
                                                            {formatMoney(
                                                                getInvoiceValue(
                                                                    commission
                                                                )
                                                            )}
                                                        </td>

                                                        <td>
                                                            {commission?.rewardPoints ??
                                                                "—"}
                                                        </td>

                                                        <td>
                                                            {formatMoney(
                                                                getCommissionAmount(
                                                                    commission
                                                                )
                                                            )}
                                                        </td>

                                                        <td>
                                                            {getCommissionPercentage(
                                                                commission
                                                            ).toFixed(2)}
                                                            %
                                                        </td>

                                                        <td>
                                                            {formatMoney(
                                                                getPenaltyAmount(
                                                                    commission
                                                                )
                                                            )}
                                                        </td>

                                                        <td className="net-payable">
                                                            {formatMoney(
                                                                getNetCommission(
                                                                    commission
                                                                )
                                                            )}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`commission-status ${getStatusClass(
                                                                    currentStatus
                                                                )}`}
                                                            >
                                                                {statusLabel(
                                                                    currentStatus
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {formatDate(
                                                                commission?.paymentDate
                                                            )}
                                                        </td>

                                                        <td>
                                                            <div className="commission-actions">

                                                                <button
                                                                    title="View"
                                                                    onClick={() =>
                                                                        openViewModal(
                                                                            commission
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye size={16} />
                                                                </button>

                                                                <button
                                                                    title="Edit"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            commission
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil size={16} />
                                                                </button>

                                                                <button
                                                                    title="Delete"
                                                                    className="delete"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            commission
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>

                                                            </div>
                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )
                                    )}

                                </tbody>

                            </table>
                        </div>

                        {/* Pagination */}

                        <div className="commission-pagination">

                            <span>
                                Showing{" "}
                                {filteredCommissions.length === 0
                                    ? 0
                                    : startIndex + 1}{" "}
                                to{" "}
                                {Math.min(
                                    startIndex + rowsPerPage,
                                    filteredCommissions.length
                                )}{" "}
                                of {filteredCommissions.length} entries
                            </span>

                            <div className="commission-pagination-controls">

                                <button
                                    disabled={safeCurrentPage <= 1}
                                    onClick={() =>
                                        setCurrentPage(
                                            Math.max(1, safeCurrentPage - 1)
                                        )
                                    }
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                )
                                    .slice(
                                        Math.max(0, safeCurrentPage - 3),
                                        Math.min(totalPages, safeCurrentPage + 2)
                                    )
                                    .map((page) => (
                                        <button
                                            key={page}
                                            className={
                                                safeCurrentPage === page
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setCurrentPage(page)
                                            }
                                        >
                                            {page}
                                        </button>
                                    ))}

                                <button
                                    disabled={safeCurrentPage >= totalPages}
                                    onClick={() =>
                                        setCurrentPage(
                                            Math.min(
                                                totalPages,
                                                safeCurrentPage + 1
                                            )
                                        )
                                    }
                                >
                                    <ChevronRight size={16} />
                                </button>

                                <select
                                    value={rowsPerPage}
                                    onChange={(e) =>
                                        setRowsPerPage(
                                            Number(e.target.value)
                                        )
                                    }
                                >
                                    <option value="5">5 / page</option>
                                    <option value="10">10 / page</option>
                                    <option value="20">20 / page</option>
                                    <option value="50">50 / page</option>
                                </select>

                            </div>
                        </div>
                    </div>

                    {/* =========================
              REPORTS
          ========================== */}

                    <div className="commission-reports-card">

                        <div className="commission-section-header">
                            <div>
                                <h2>
                                    Commission & Incentive Reports
                                </h2>

                                <p>
                                    Commission related reports and registers
                                </p>
                            </div>
                        </div>

                        <div className="commission-reports-grid">

                            <ReportCard
                                icon={<UserRound size={20} />}
                                title="Employee Commission Report"
                            />

                            <ReportCard
                                icon={<Building2 size={20} />}
                                title="Dealer Reward Report"
                            />

                            <ReportCard
                                icon={<Paintbrush size={20} />}
                                title="Painter Reward Report"
                            />

                            <ReportCard
                                icon={<UserPlus size={20} />}
                                title="Referral Commission Report"
                            />

                            <ReportCard
                                icon={<Store size={20} />}
                                title="Store Commission Report"
                            />

                            <ReportCard
                                icon={<Calculator size={20} />}
                                title="Rolling Incentive Report"
                            />

                            <ReportCard
                                icon={<AlertTriangle size={20} />}
                                title="Penalty Report"
                            />

                            <ReportCard
                                icon={<Percent size={20} />}
                                title="Recovery Report"
                            />

                            <ReportCard
                                icon={<FileText size={20} />}
                                title="Monthly Incentive Register"
                            />

                            <ReportCard
                                icon={<FileText size={20} />}
                                title="Commission Ledger"
                            />

                        </div>
                    </div>

                </div>

                {/* =========================
            RIGHT SIDEBAR
        ========================== */}

                <aside className="commission-right-sidebar">

                    {/* Quick Actions */}

                    <div className="commission-side-card">

                        <h3>Quick Actions</h3>
                
                        <button onClick={handleQuickCalculate}>
                            <Calculator size={17} />
                            Calculate Commission
                        </button>

                        <button onClick={handleQuickCalculate}>
                            <Building2 size={17} />
                            Calculate Dealer Rewards
                        </button>

                        <button onClick={handleQuickCalculate}>
                            <Paintbrush size={17} />
                            Calculate Painter Rewards
                        </button>

                        <button onClick={handleQuickCalculate}>
                            <UserPlus size={17} />
                            Calculate Referral Incentive
                        </button>

                        <button onClick={handleQuickApprove}>
                            <CheckCircle size={17} />
                            Approve Incentives
                        </button>

                        <button onClick={handleReleasePayment}>
                            <Wallet size={17} />
                            Release Payment
                        </button>

                        <button onClick={exportReport}>
                            <Download size={17} />
                            Export Report
                        </button>

                        <button
                            onClick={() =>
                                document
                                    .querySelector(
                                        ".commission-table-card"
                                    )
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            <FileText size={17} />
                            Commission Ledger
                        </button>

                    </div>

                    {/* Rolling Cycle */}

                    <div className="commission-side-card">

                        <h3>Rolling Cycle Schedule</h3>

                        <div className="cycle-item">
                            <div>
                                <strong>20 Mar – 20 Apr</strong>
                            </div>

                            <span>
                                Payment: 20 Jun – 20 Jul
                            </span>
                        </div>

                        <div className="cycle-item active">
                            <div>
                                <strong>20 Apr – 20 May</strong>
                            </div>

                            <span>
                                Payment: 20 Jul – 20 Aug
                            </span>
                        </div>

                        <div className="cycle-item">
                            <div>
                                <strong>20 May – 20 Jun</strong>
                            </div>

                            <span>
                                Payment: 20 Aug – 20 Sep
                            </span>
                        </div>

                        <button className="cycle-view-all">
                            View All Cycles →
                        </button>

                    </div>

                    {/* Reward / Incentive Status */}

                    <div className="commission-side-card">

                        <h3>Reward / Incentive Status</h3>

                        <div className="status-summary-row">
                            <span>
                                <i className="status-dot pending" />
                                Pending
                            </span>

                            <strong>
                                {statusCounts.PENDING_CALCULATION ||
                                    0}
                            </strong>
                        </div>

                        <div className="status-summary-row">
                            <span>
                                <i className="status-dot verification" />
                                Under Verification
                            </span>

                            <strong>
                                {statusCounts.UNDER_VERIFICATION ||
                                    0}
                            </strong>
                        </div>

                        <div className="status-summary-row">
                            <span>
                                <i className="status-dot approved" />
                                Approved
                            </span>

                            <strong>
                                {statusCounts.APPROVED || 0}
                            </strong>
                        </div>

                        <div className="status-summary-row">
                            <span>
                                <i className="status-dot released" />
                                Released
                            </span>

                            <strong>
                                {statusCounts.RELEASED || 0}
                            </strong>
                        </div>

                        <div className="status-summary-row">
                            <span>
                                <i className="status-dot hold" />
                                Hold
                            </span>

                            <strong>
                                {statusCounts.ON_HOLD || 0}
                            </strong>
                        </div>

                        <div className="status-summary-row">
                            <span>
                                <i className="status-dot rejected" />
                                Rejected
                            </span>

                            <strong>0</strong>
                        </div>

                        <div className="status-summary-row">
                            <span>
                                <i className="status-dot cancelled" />
                                Cancelled
                            </span>

                            <strong>
                                {statusCounts.CANCELLED || 0}
                            </strong>
                        </div>

                    </div>

                    {/* Delayed Payment Info */}

                    <div className="commission-side-card delayed-payment-card">

                        <h3>Delayed Payments</h3>

                        <div className="delayed-payment-number">
                            {delayedPayments.length}
                        </div>

                        <span>
                            Payments pending beyond 90 days
                        </span>

                        <div className="delayed-payment-amount">
                            {formatMoney(totalPenalty)}
                        </div>

                        <small>Penalty amount</small>

                    </div>

                </aside>
            </div>

            {/* =========================
          ADD / EDIT MODAL
      ========================== */}

            {(showAddModal || showEditModal) && (
                <div className="commission-modal-overlay">

                    <div className="commission-modal">

                        <div className="commission-modal-header">

                            <div>
                                <h2>
                                    {showEditModal
                                        ? "Edit Commission"
                                        : "Add Commission"}
                                </h2>

                                <p>
                                    Enter commission transaction details
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                    setForm(emptyForm);
                                }}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={
                                showEditModal
                                    ? handleUpdateCommission
                                    : handleAddCommission
                            }
                        >

                            <div className="commission-form-grid">

                                <div className="commission-form-field">
                                    <label>
                                        Invoice Number *
                                    </label>

                                    <input
                                        name="invoiceNumber"
                                        value={form.invoiceNumber}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter invoice number"
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Customer *</label>

                                    <input
                                        name="customer"
                                        value={form.customer}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter customer"
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Store *</label>

                                    <input
                                        name="store"
                                        value={form.store}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter store"
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Territory *</label>

                                    <input
                                        name="territory"
                                        value={form.territory}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter territory"
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Sales Executive *</label>

                                    <input
                                        name="salesExecutive"
                                        value={form.salesExecutive}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter sales executive"
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Sale Date *</label>

                                    <input
                                        type="date"
                                        name="saleDate"
                                        value={form.saleDate}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Invoice Value *</label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="invoiceValue"
                                        value={form.invoiceValue}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Enter invoice value"
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Reward Points</label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="rewardPoints"
                                        value={form.rewardPoints}
                                        onChange={handleFormChange}
                                        placeholder="Enter reward points"
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Sale Type *</label>

                                    <select
                                        name="saleType"
                                        value={form.saleType}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="CASH">
                                            Cash Sale
                                        </option>

                                        <option value="CREDIT">
                                            Credit Sale
                                        </option>
                                    </select>
                                </div>

                                <div className="commission-form-field">
                                    <label>Payment Date</label>

                                    <input
                                        type="date"
                                        name="paymentDate"
                                        value={form.paymentDate}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <div className="commission-form-field">
                                    <label>Payment Status</label>

                                    <select
                                        name="paymentStatus"
                                        value={form.paymentStatus}
                                        onChange={handleFormChange}
                                    >
                                        <option value="PENDING">
                                            Pending
                                        </option>

                                        <option value="PAID">
                                            Paid
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Commission Status</label>

                                    <select
                                        name="commissionStatus"
                                        value={form.commissionStatus}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                commissionStatus: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="PENDING_CALCULATION">
                                            Pending Calculation
                                        </option>

                                        <option value="UNDER_VERIFICATION">
                                            Under Verification
                                        </option>

                                        <option value="APPROVED">
                                            Approved
                                        </option>

                                        <option value="RELEASED">
                                            Released
                                        </option>

                                        <option value="ON_HOLD">
                                            On Hold
                                        </option>

                                        <option value="CANCELLED">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="commission-modal-footer">

                                <button
                                    type="button"
                                    className="commission-cancel-btn"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        setForm(emptyForm);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="commission-save-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : showEditModal
                                            ? "Update Commission"
                                            : "Add Commission"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* =========================
          VIEW MODAL
      ========================== */}

            {showViewModal && selectedCommission && (
                <div className="commission-modal-overlay">

                    <div className="commission-modal commission-view-modal">

                        <div className="commission-modal-header">

                            <div>
                                <h2>Commission Details</h2>

                                <p>
                                    Complete commission transaction
                                    information
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedCommission(null);
                                }}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="commission-detail-grid">

                            <div>
                                <span>Invoice Number</span>
                                <strong>
                                    {selectedCommission.invoiceNumber ||
                                        "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Customer</span>
                                <strong>
                                    {selectedCommission.customer || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Store</span>
                                <strong>
                                    {getBranch(selectedCommission)}
                                </strong>
                            </div>

                            <div>
                                <span>Territory</span>
                                <strong>
                                    {getTerritory(selectedCommission)}
                                </strong>
                            </div>

                            <div>
                                <span>Sales Executive</span>
                                <strong>
                                    {getUserName(selectedCommission)}
                                </strong>
                            </div>

                            <div>
                                <span>Sale Date</span>
                                <strong>
                                    {formatDate(
                                        selectedCommission.saleDate
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Invoice Value</span>
                                <strong>
                                    {formatMoney(
                                        getInvoiceValue(selectedCommission)
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Reward Points</span>
                                <strong>
                                    {selectedCommission?.rewardPoints ?? "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Sale Type</span>
                                <strong>
                                    {getSaleType(selectedCommission)}
                                </strong>
                            </div>

                            <div>
                                <span>Payment Date</span>
                                <strong>
                                    {formatDate(
                                        selectedCommission.paymentDate
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Recovery Days</span>
                                <strong>
                                    {getRecoveryDays(selectedCommission)}
                                </strong>
                            </div>

                            <div>
                                <span>Commission %</span>
                                <strong>
                                    {getCommissionPercentage(
                                        selectedCommission
                                    ).toFixed(2)}
                                    %
                                </strong>
                            </div>

                            <div>
                                <span>Commission Amount</span>
                                <strong>
                                    {formatMoney(
                                        getCommissionAmount(
                                            selectedCommission
                                        )
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Penalty Amount</span>
                                <strong>
                                    {formatMoney(
                                        getPenaltyAmount(
                                            selectedCommission
                                        )
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Net Commission</span>
                                <strong>
                                    {formatMoney(
                                        getNetCommission(
                                            selectedCommission
                                        )
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Payment Status</span>
                                <strong>
                                    {getPaymentStatus(
                                        selectedCommission
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Commission Status</span>
                                <strong>
                                    {statusLabel(
                                        selectedCommission?.commissionStatus ||
                                        selectedCommission?.status
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="commission-modal-footer">

                            <button
                                className="commission-cancel-btn"
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedCommission(null);
                                }}
                            >
                                Close
                            </button>

                            <button
                                className="commission-save-btn"
                                onClick={() => {
                                    setShowViewModal(false);
                                    openEditModal(selectedCommission);
                                }}
                            >
                                <Pencil size={16} />
                                Edit
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}