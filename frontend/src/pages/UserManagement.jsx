import {
    Search,
    Plus,
    Upload,
    Download,
    Eye,
    Pencil,
    MoreVertical,
    Users,
    UserCheck,
    UserX,
    UserPlus,
    Filter,

} from "lucide-react";
import "../css/usermanagement.css";



import { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All Roles");
    const [status, setStatus] = useState("All Status");

    const [showAddUser, setShowAddUser] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);

    const [showViewUser, setShowViewUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const [showEditUser, setShowEditUser] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [updatingUser, setUpdatingUser] = useState(false);

    const [deletingUser, setDeletingUser] = useState(false);

    const [kycActionLoading, setKycActionLoading] = useState(false);
    const [department, setDepartment] = useState("All Departments");

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "",
        address: "",
        state: "",
        district: "",
        city: "",
        pinCode: "",
        status: "ACTIVE",
    });

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "SALES_EXECUTIVE",
        address: "",
        state: "",
        district: "",
        city: "",
        pinCode: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setUsers(response.data.users || []);
            }
        } catch (error) {
            console.error("Users fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    /* ================= FILTER ================= */

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            user.name?.toLowerCase().includes(searchValue) ||
            user.email?.toLowerCase().includes(searchValue) ||
            user.mobile?.toLowerCase().includes(searchValue) ||
            user.role?.toLowerCase().includes(searchValue);

        const matchesRole =
            role === "All Roles" || user.role === role;

        const matchesStatus =
            status === "All Status" || user.status === status;

        return matchesSearch && matchesRole && matchesStatus;
    });

    /* ================= STATS ================= */

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) => user.status === "ACTIVE"
    ).length;

    const inactiveUsers = users.filter(
        (user) => user.status === "INACTIVE"
    ).length;

    const blockedUsers = users.filter(
        (user) => user.status === "BLOCKED"
    ).length;

    const newUsers = users.filter((user) => {
        if (!user.createdAt) return false;

        const createdDate = new Date(user.createdAt);
        const now = new Date();

        return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
        );
    }).length;

    /* ================= ADD USER ================= */

    const handleUserFormChange = (e) => {
        const { name, value } = e.target;

        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            setCreatingUser(true);

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/users",
                userForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                alert("User created successfully");

                setShowAddUser(false);

                setUserForm({
                    name: "",
                    email: "",
                    mobile: "",
                    password: "",
                    role: "SALES_EXECUTIVE",
                    address: "",
                    state: "",
                    district: "",
                    city: "",
                    pinCode: "",
                });

                // Refresh users list
                fetchUsers();
            }
        } catch (error) {
            console.error("Create user error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to create user"
            );
        } finally {
            setCreatingUser(false);
        }
    };

    /* ================= RESET ================= */

    const handleReset = () => {
        setSearch("");
        setRole("All Roles");
        setStatus("All Status");
        setDepartment("All Departments");
    };

    /* ================= INITIALS ================= */

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    /* ================= ROLE CLASS ================= */

    const getRoleClass = (userRole) => {
        switch (userRole) {
            case "SUPER_ADMIN":
                return "role-super-admin";

            case "DIRECTOR":
                return "role-director";

            case "MANAGER":
                return "role-manager";

            case "SALES_EXECUTIVE":
                return "role-sales";

            case "ACCOUNTANT":
                return "role-accountant";

            case "STORE_CASHIER":
                return "role-cashier";

            case "DEALER":
                return "role-dealer";

            case "PAINTER":
                return "role-painter";

            default:
                return "role-default";
        }
    };

    /* ================= STATUS ================= */

    const getStatusClass = (userStatus) => {
        switch (userStatus) {
            case "ACTIVE":
                return "status-active";

            case "INACTIVE":
                return "status-inactive";

            case "BLOCKED":
                return "status-blocked";

            case "PENDING":
                return "status-pending";

            default:
                return "status-inactive";
        }
    };

    const handleViewUser = async (userId) => {
        try {
            setViewLoading(true);
            setShowViewUser(true);
            setSelectedUser(null);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setSelectedUser(response.data.user);
            }
        } catch (error) {
            console.error("Get user error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load user details"
            );

            setShowViewUser(false);
        } finally {
            setViewLoading(false);
        }
    };

    const handleEditUser = async (userId) => {
        try {
            setEditLoading(true);
            setShowEditUser(true);
            setEditingUser(null);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const user = response.data.user;

                setEditingUser(user);

                setEditForm({
                    name: user.name || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                    role: user.role || "",
                    address: user.address || "",
                    state: user.state || "",
                    district: user.district || "",
                    city: user.city || "",
                    pinCode: user.pinCode || "",
                    status: user.status || "ACTIVE",
                });
            }
        } catch (error) {
            console.error("Get user for edit error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load user details"
            );

            setShowEditUser(false);
        } finally {
            setEditLoading(false);
        }
    };


    const handleEditFormChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (!editingUser?._id) return;

        try {
            setUpdatingUser(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:5000/api/users/${editingUser._id}`,
                editForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                alert("User updated successfully");

                setShowEditUser(false);
                setEditingUser(null);

                await fetchUsers();
            }
        } catch (error) {
            console.error("Update user error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update user"
            );
        } finally {
            setUpdatingUser(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${userName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingUser(true);

            const token = localStorage.getItem("token");

            const response = await axios.delete(
                `http://localhost:5000/api/users/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert("User deleted successfully");

                await fetchUsers();
            }
        } catch (error) {
            console.error("Delete user error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        } finally {
            setDeletingUser(false);
        }
    };

    /* ================= KYC ACTIONS ================= */

    const handleKycApprove = async (userId) => {
        if (selectedUser?.kycStatus !== "PENDING") {
            alert("Only pending KYC can be approved.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to approve this KYC?"
        );

        if (!confirmed) return;

        try {
            setKycActionLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:5000/api/users/${userId}/kyc/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert("KYC approved successfully.");

                await fetchUsers();

                const userResponse = await axios.get(
                    `http://localhost:5000/api/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (userResponse.data.success) {
                    setSelectedUser(userResponse.data.user);
                }
            }
        } catch (error) {
            console.error("Approve KYC error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to approve KYC."
            );
        } finally {
            setKycActionLoading(false);
        }
    };


    const handleKycReject = async (userId) => {
        if (selectedUser?.kycStatus !== "PENDING") {
            alert("Only pending KYC can be rejected.");
            return;
        }

        const remarks = window.prompt(
            "Enter rejection reason:"
        );

        if (!remarks || !remarks.trim()) {
            alert("Rejection reason is required.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to reject this KYC?"
        );

        if (!confirmed) return;

        try {
            setKycActionLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:5000/api/users/${userId}/kyc/reject`,
                {
                    remarks: remarks.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert("KYC rejected successfully.");

                await fetchUsers();

                const userResponse = await axios.get(
                    `http://localhost:5000/api/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (userResponse.data.success) {
                    setSelectedUser(userResponse.data.user);
                }
            }
        } catch (error) {
            console.error("Reject KYC error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to reject KYC."
            );
        } finally {
            setKycActionLoading(false);
        }
    };


    const handleKycCorrection = async (userId) => {
        if (selectedUser?.kycStatus !== "PENDING") {
            alert(
                "Only pending KYC can be sent for correction."
            );
            return;
        }

        const remarks = window.prompt(
            "Enter correction remarks:"
        );

        if (!remarks || !remarks.trim()) {
            alert("Correction remarks are required.");
            return;
        }

        const confirmed = window.confirm(
            "Request correction for this KYC?"
        );

        if (!confirmed) return;

        try {
            setKycActionLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:5000/api/users/${userId}/kyc/correction`,
                {
                    remarks: remarks.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert(
                    "KYC correction requested successfully."
                );

                await fetchUsers();

                const userResponse = await axios.get(
                    `http://localhost:5000/api/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (userResponse.data.success) {
                    setSelectedUser(userResponse.data.user);
                }
            }
        } catch (error) {
            console.error(
                "KYC correction error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to request KYC correction."
            );
        } finally {
            setKycActionLoading(false);
        }
    };


    return (
        <div className="user-management-page">

            {/* ================= PAGE HEADER ================= */}

            <div className="users-page-header">

                <div>
                    <h2>User Management</h2>

                    <div className="users-breadcrumb">
                        Dashboard
                        <span>›</span>
                        User Management
                    </div>
                </div>

                <div className="users-header-actions">

                    <button className="users-secondary-btn">
                        <Upload size={16} />
                        Import
                    </button>

                    <button className="users-secondary-btn">
                        <Download size={16} />
                        Export
                    </button>

                    <button
                        className="users-primary-btn"
                        onClick={() => setShowAddUser(true)}
                    >
                        <Plus size={18} />
                        Add User
                    </button>

                </div>

            </div>


            {/* ================= STAT CARDS ================= */}

            <div className="users-stat-grid">

                <div className="users-stat-card">

                    <div className="users-stat-icon orange">
                        <Users size={21} />
                    </div>

                    <span>Total Users</span>

                    <strong>{totalUsers}</strong>

                    <small>
                        Registered users
                    </small>

                </div>


                <div className="users-stat-card">

                    <div className="users-stat-icon purple">
                        <UserCheck size={21} />
                    </div>

                    <span>Active Users</span>

                    <strong>{activeUsers}</strong>

                    <small>
                        Currently active
                    </small>

                </div>


                <div className="users-stat-card">

                    <div className="users-stat-icon blue">
                        <UserX size={21} />
                    </div>

                    <span>Inactive Users</span>

                    <strong>{inactiveUsers}</strong>

                    <small>
                        Currently inactive
                    </small>

                </div>


                <div className="users-stat-card">

                    <div className="users-stat-icon green">
                        <UserPlus size={21} />
                    </div>

                    <span>New Users</span>

                    <strong>{newUsers}</strong>

                    <small>
                        This month
                    </small>

                </div>


                <div className="users-stat-card">

                    <div className="users-stat-icon yellow">
                        <UserX size={21} />
                    </div>

                    <span>Blocked Users</span>

                    <strong>{blockedUsers}</strong>

                    <small>
                        Blocked accounts
                    </small>

                </div>

            </div>


            {/* ================= TABLE CARD ================= */}

            <div className="users-table-card">

                {/* FILTER BAR */}

                <div className="users-filter-bar">

                    {/* SEARCH */}
                    <div className="users-search-box">



                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by name, email, mobile or role..."
                        />

                        <Search size={17} />

                    </div>


                    {/* ROLE */}
                    <div className="users-filter">

                        <label>Role</label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >
                            <option>All Roles</option>
                            <option>SUPER_ADMIN</option>
                            <option>DIRECTOR</option>
                            <option>MANAGER</option>
                            <option>SALES_EXECUTIVE</option>
                            <option>ACCOUNTANT</option>
                            <option>STORE_CASHIER</option>
                            <option>DEALER</option>
                            <option>PAINTER</option>
                        </select>

                    </div>


                    {/* DEPARTMENT */}
                    <div className="users-filter">

                        <label>Department</label>

                        <select
                            value={department}
                            onChange={(e) =>
                                setDepartment(e.target.value)
                            }
                        >
                            <option>All Departments</option>
                            <option>ADMIN</option>
                            <option>SALES</option>
                            <option>ACCOUNTS</option>
                            <option>HR</option>
                            <option>STORE</option>
                            <option>MANAGEMENT</option>
                        </select>

                    </div>


                    {/* STATUS */}
                    <div className="users-filter">

                        <label>Status</label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            <option>All Status</option>
                            <option>ACTIVE</option>
                            <option>INACTIVE</option>
                            <option>PENDING</option>
                            <option>BLOCKED</option>
                        </select>

                    </div>


                    {/* MORE FILTER */}
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
                        className="reset-filter-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>


                {/* ================= TABLE ================= */}

                <div className="users-table-wrapper">

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredUsers.length > 0 &&
                                            selectedUsers.length === filteredUsers.length
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedUsers(filteredUsers.map((user) => user._id));
                                            } else {
                                                setSelectedUsers([]);
                                            }
                                        }}
                                    />
                                </th>

                                <th>User Details</th>

                                <th>Role</th>

                                <th>Department</th>

                                <th>Mobile Number</th>

                                <th>Email</th>

                                <th>Status</th>

                                <th>Last Login</th>

                                <th>Action</th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="users-loading"
                                    >
                                        Loading users...
                                    </td>
                                </tr>

                            ) : filteredUsers.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="users-empty"
                                    >
                                        No users found
                                    </td>
                                </tr>

                            ) : (

                                filteredUsers.map((user) => (

                                    <tr key={user._id}>

                                        {/* CHECKBOX */}

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUsers((prev) => [
                                                            ...prev,
                                                            user._id
                                                        ]);
                                                    } else {
                                                        setSelectedUsers((prev) =>
                                                            prev.filter((id) => id !== user._id)
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>


                                        {/* USER */}

                                        <td>

                                            <div className="table-user">

                                                <div className="table-user-avatar">
                                                    {user.profilePicture ? (
                                                        <img
                                                            src={user.profilePicture}
                                                            alt={user.name}
                                                        />
                                                    ) : (
                                                        getInitials(user.name)
                                                    )}
                                                </div>

                                                <div className="table-user-info">

                                                    <strong>
                                                        {user.name}
                                                    </strong>

                                                    <small>
                                                        {user._id?.slice(-8)}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* ROLE */}

                                        <td>

                                            <span
                                                className={`user-role-badge ${getRoleClass(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role?.replaceAll(
                                                    "_",
                                                    " "
                                                )}
                                            </span>

                                        </td>


                                        {/* DEPARTMENT */}

                                        <td>
                                            <span className="table-text">
                                                {getDepartment(user.role)}
                                            </span>
                                        </td>


                                        {/* MOBILE */}

                                        <td>
                                            <span className="table-text">
                                                {user.mobile || "-"}
                                            </span>
                                        </td>


                                        {/* EMAIL */}

                                        <td>
                                            <span className="table-text email-text">
                                                {user.email || "-"}
                                            </span>
                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`user-status-badge ${getStatusClass(
                                                    user.status
                                                )}`}
                                            >
                                                {user.status}
                                            </span>

                                        </td>


                                        {/* LAST LOGIN */}

                                        <td>

                                            <div className="last-login">

                                                {user.lastLogin ? (
                                                    <>
                                                        <strong>
                                                            {new Date(
                                                                user.lastLogin
                                                            ).toLocaleDateString(
                                                                "en-IN"
                                                            )}
                                                        </strong>

                                                        <small>
                                                            {new Date(
                                                                user.lastLogin
                                                            ).toLocaleTimeString(
                                                                "en-IN",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </small>
                                                    </>
                                                ) : (
                                                    <span>-</span>
                                                )}

                                            </div>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <div className="user-table-actions">

                                                <button
                                                    className="user-action-view"
                                                    title="View User"
                                                    onClick={() => handleViewUser(user._id)}
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    className="user-action-edit"
                                                    title="Edit User"
                                                    onClick={() => handleEditUser(user._id)}
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    className="user-action-delete"
                                                    title="Delete User"
                                                    onClick={() =>
                                                        handleDeleteUser(user._id, user.name)
                                                    }
                                                    disabled={deletingUser}
                                                >
                                                    <UserX size={17} />
                                                </button>

                                                <button title="More">
                                                    <MoreVertical size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="users-table-footer">

                    <span>
                        Showing {filteredUsers.length} of{" "}
                        {users.length} entries
                    </span>

                    <div className="users-pagination">

                        <button disabled>
                            ‹
                        </button>

                        <button className="active">
                            1
                        </button>

                        <button>
                            2
                        </button>

                        <button>
                            3
                        </button>

                        <span>...</span>

                        <button>
                            ›
                        </button>

                    </div>

                </div>

            </div>

            {/* ================= ADD USER MODAL ================= */}

            {showAddUser && (
                <div
                    className="add-user-modal-overlay"
                    onClick={() => setShowAddUser(false)}
                >
                    <div
                        className="add-user-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}

                        <div className="add-user-modal-header">

                            <div>
                                <h3>Add New User</h3>

                                <p>
                                    Create a new user account.
                                </p>
                            </div>
                        </div>


                        {/* FORM */}

                        <form
                            className="add-user-form"
                            onSubmit={handleAddUser}
                        >

                            {/* NAME */}

                            <div className="add-user-form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={userForm.name}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter full name"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="add-user-form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={userForm.email}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter email address"
                                    required
                                />

                            </div>


                            {/* MOBILE */}

                            <div className="add-user-form-group">

                                <label>
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    name="mobile"
                                    value={userForm.mobile}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter mobile number"
                                    required
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="add-user-form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={userForm.password}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter password"
                                    required
                                />

                            </div>


                            {/* ROLE */}

                            <div className="add-user-form-group">

                                <label>
                                    Role
                                </label>

                                <select
                                    name="role"
                                    value={userForm.role}
                                    onChange={handleUserFormChange}
                                    required
                                >
                                    <option value="DIRECTOR">
                                        Director
                                    </option>

                                    <option value="MANAGER">
                                        Manager
                                    </option>

                                    <option value="ACCOUNTANT">
                                        Accountant
                                    </option>

                                    <option value="SALES_EXECUTIVE">
                                        Sales Executive
                                    </option>

                                    <option value="STORE_CASHIER">
                                        Store Cashier
                                    </option>

                                    <option value="DEALER">
                                        Dealer
                                    </option>

                                    <option value="PAINTER">
                                        Painter
                                    </option>
                                </select>

                            </div>


                            {/* ADDRESS */}

                            <div className="add-user-form-group">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={userForm.address}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter address"
                                />

                            </div>


                            {/* STATE */}

                            <div className="add-user-form-group">

                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={userForm.state}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter state"
                                />

                            </div>


                            {/* DISTRICT */}

                            <div className="add-user-form-group">

                                <label>
                                    District
                                </label>

                                <input
                                    type="text"
                                    name="district"
                                    value={userForm.district}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter district"
                                />

                            </div>


                            {/* CITY */}

                            <div className="add-user-form-group">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={userForm.city}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter city"
                                />

                            </div>


                            {/* PIN CODE */}

                            <div className="add-user-form-group">

                                <label>
                                    PIN Code
                                </label>

                                <input
                                    type="text"
                                    name="pinCode"
                                    value={userForm.pinCode}
                                    onChange={handleUserFormChange}
                                    placeholder="Enter PIN code"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="add-user-form-actions">

                                <button
                                    type="button"
                                    className="add-user-cancel-btn"
                                    onClick={() => setShowAddUser(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="add-user-submit-btn"
                                    disabled={creatingUser}
                                >
                                    {creatingUser
                                        ? "Creating..."
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* ================= VIEW USER MODAL ================= */}

            {showViewUser && (
                <div
                    className="view-user-modal-overlay"
                    onClick={() => setShowViewUser(false)}
                >
                    <div
                        className="view-user-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}

                        <div className="view-user-modal-header">

                            <div>
                                <h3>User Details</h3>
                                <p>Complete user information</p>
                            </div>

                            <button
                                className="view-user-close-btn"
                                onClick={() => setShowViewUser(false)}
                            >
                                ×
                            </button>

                        </div>


                        {viewLoading ? (

                            <div className="view-user-loading">
                                Loading user details...
                            </div>

                        ) : selectedUser ? (

                            <div className="view-user-content">

                                {/* PROFILE */}

                                <div className="view-user-profile">

                                    <div className="view-user-avatar">

                                        {selectedUser.profilePicture ? (
                                            <img
                                                src={selectedUser.profilePicture}
                                                alt={selectedUser.name}
                                            />
                                        ) : (
                                            selectedUser.name
                                                ?.split(" ")
                                                .map((word) => word[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()
                                        )}

                                    </div>

                                    <div>
                                        <h2>{selectedUser.name}</h2>

                                        <p>
                                            {selectedUser.email}
                                        </p>

                                        <span className="view-user-role">
                                            {selectedUser.role?.replaceAll("_", " ")}
                                        </span>
                                    </div>

                                </div>


                                {/* BASIC INFORMATION */}

                                <div className="view-user-section">

                                    <h4>Basic Information</h4>

                                    <div className="view-user-grid">

                                        <div>
                                            <label>Full Name</label>
                                            <strong>{selectedUser.name || "-"}</strong>
                                        </div>

                                        <div>
                                            <label>Email</label>
                                            <strong>{selectedUser.email || "-"}</strong>
                                        </div>

                                        <div>
                                            <label>Mobile</label>
                                            <strong>{selectedUser.mobile || "-"}</strong>
                                        </div>

                                        <div>
                                            <label>Role</label>
                                            <strong>
                                                {selectedUser.role?.replaceAll("_", " ") || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>Status</label>

                                            <strong
                                                className={`view-status ${selectedUser.status?.toLowerCase()}`}
                                            >
                                                {selectedUser.status || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>KYC Status</label>

                                            <strong
                                                className={`view-kyc ${selectedUser.kycStatus
                                                    ?.toLowerCase()
                                                    .replaceAll("_", "-")}`}
                                            >
                                                {selectedUser.kycStatus?.replaceAll("_", " ") || "-"}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* ADDRESS */}

                                <div className="view-user-section">

                                    <h4>Address Information</h4>

                                    <div className="view-user-grid">

                                        <div>
                                            <label>Address</label>
                                            <strong>{selectedUser.address || "-"}</strong>
                                        </div>

                                        <div>
                                            <label>State</label>
                                            <strong>{selectedUser.state || "-"}</strong>
                                        </div>

                                        <div>
                                            <label>District</label>
                                            <strong>{selectedUser.district || "-"}</strong>
                                        </div>

                                        <div>
                                            <label>City</label>
                                            <strong>{selectedUser.city || "-"}</strong>
                                        </div>

                                        <div>
                                            <label>PIN Code</label>
                                            <strong>{selectedUser.pinCode || "-"}</strong>
                                        </div>

                                    </div>

                                </div>


                                {/* KYC */}

                                <div className="view-user-section">

                                    <h4>KYC Information</h4>

                                    <div className="view-user-grid">

                                        <div>
                                            <label>Aadhaar Number</label>
                                            <strong>
                                                {selectedUser.kyc?.aadhaarNumber || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>PAN Number</label>
                                            <strong>
                                                {selectedUser.kyc?.panNumber || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>Bank Account</label>
                                            <strong>
                                                {selectedUser.kyc?.bankAccountNumber || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>IFSC Code</label>
                                            <strong>
                                                {selectedUser.kyc?.ifscCode || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>GST Number</label>
                                            <strong>
                                                {selectedUser.kyc?.gstNumber || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>Shop Act Licence</label>
                                            <strong>
                                                {selectedUser.kyc?.shopActLicenceNumber || "-"}
                                            </strong>
                                        </div>

                                    </div>


                                    {selectedUser?.kycStatus === "PENDING" && (
                                        <div className="kyc-action-buttons">

                                            <button
                                                type="button"
                                                className="kyc-approve-btn"
                                                disabled={kycActionLoading}
                                                onClick={() =>
                                                    handleKycApprove(selectedUser._id)
                                                }
                                            >
                                                Approve KYC
                                            </button>

                                            <button
                                                type="button"
                                                className="kyc-reject-btn"
                                                disabled={kycActionLoading}
                                                onClick={() =>
                                                    handleKycReject(selectedUser._id)
                                                }
                                            >
                                                Reject KYC
                                            </button>

                                            <button
                                                type="button"
                                                className="kyc-correction-btn"
                                                disabled={kycActionLoading}
                                                onClick={() =>
                                                    handleKycCorrection(selectedUser._id)
                                                }
                                            >
                                                Request Correction
                                            </button>

                                        </div>
                                    )}

                                </div>


                                {/* EMERGENCY CONTACT */}

                                <div className="view-user-section">

                                    <h4>Emergency Contact</h4>

                                    <div className="view-user-grid">

                                        <div>
                                            <label>Name</label>
                                            <strong>
                                                {selectedUser.kyc?.emergencyContact?.name || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>Mobile</label>
                                            <strong>
                                                {selectedUser.kyc?.emergencyContact?.mobile || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <label>Relation</label>
                                            <strong>
                                                {selectedUser.kyc?.emergencyContact?.relation || "-"}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="view-user-footer">

                                    <button
                                        onClick={() => setShowViewUser(false)}
                                        className="view-user-close-bottom"
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        ) : null}

                    </div>
                </div>
            )}

            {/* ================= EDIT USER MODAL ================= */}

            {showEditUser && (
                <div
                    className="edit-user-modal-overlay"
                    onClick={() => setShowEditUser(false)}
                >
                    <div
                        className="edit-user-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}

                        <div className="edit-user-modal-header">

                            <div>
                                <h3>Edit User</h3>

                                <p>
                                    Update user account information.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="edit-user-close-btn"
                                onClick={() => setShowEditUser(false)}
                            >
                                ×
                            </button>

                        </div>


                        {editLoading ? (

                            <div className="edit-user-loading">
                                Loading user details...
                            </div>

                        ) : editingUser ? (

                            <form
                                className="edit-user-form"
                                onSubmit={handleUpdateUser}
                            >

                                {/* NAME */}

                                <div className="edit-user-form-group">
                                    <label>Full Name</label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>


                                {/* EMAIL */}

                                <div className="edit-user-form-group">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>


                                {/* MOBILE */}

                                <div className="edit-user-form-group">
                                    <label>Mobile Number</label>

                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={editForm.mobile}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>


                                {/* ROLE */}

                                <div className="edit-user-form-group">
                                    <label>Role</label>

                                    <select
                                        name="role"
                                        value={editForm.role}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="DIRECTOR">Director</option>

                                        <option value="MANAGER">Manager</option>

                                        <option value="ACCOUNTANT">
                                            Accountant
                                        </option>

                                        <option value="SALES_EXECUTIVE">
                                            Sales Executive
                                        </option>

                                        <option value="STORE_CASHIER">
                                            Store Cashier
                                        </option>

                                        <option value="DEALER">Dealer</option>

                                        <option value="PAINTER">Painter</option>
                                    </select>
                                </div>


                                {/* STATUS */}

                                <div className="edit-user-form-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={editForm.status}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="ACTIVE">
                                            Active
                                        </option>

                                        <option value="INACTIVE">
                                            Inactive
                                        </option>

                                        <option value="BLOCKED">
                                            Blocked
                                        </option>

                                        <option value="PENDING">
                                            Pending
                                        </option>
                                    </select>
                                </div>


                                {/* ADDRESS */}

                                <div className="edit-user-form-group">
                                    <label>Address</label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={editForm.address}
                                        onChange={handleEditFormChange}
                                    />
                                </div>


                                {/* STATE */}

                                <div className="edit-user-form-group">
                                    <label>State</label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={editForm.state}
                                        onChange={handleEditFormChange}
                                    />
                                </div>


                                {/* DISTRICT */}

                                <div className="edit-user-form-group">
                                    <label>District</label>

                                    <input
                                        type="text"
                                        name="district"
                                        value={editForm.district}
                                        onChange={handleEditFormChange}
                                    />
                                </div>


                                {/* CITY */}

                                <div className="edit-user-form-group">
                                    <label>City</label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={editForm.city}
                                        onChange={handleEditFormChange}
                                    />
                                </div>


                                {/* PIN CODE */}

                                <div className="edit-user-form-group">
                                    <label>PIN Code</label>

                                    <input
                                        type="text"
                                        name="pinCode"
                                        value={editForm.pinCode}
                                        onChange={handleEditFormChange}
                                    />
                                </div>


                                {/* BUTTONS */}

                                <div className="edit-user-form-actions">

                                    <button
                                        type="button"
                                        className="edit-user-cancel-btn"
                                        onClick={() => setShowEditUser(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="edit-user-submit-btn"
                                        disabled={updatingUser}
                                    >
                                        {updatingUser
                                            ? "Updating..."
                                            : "Save Changes"}
                                    </button>

                                </div>

                            </form>

                        ) : null}

                    </div>
                </div>
            )}

        </div>
    );
};


/* ================= DEPARTMENT ================= */

const getDepartment = (role) => {

    switch (role) {

        case "SUPER_ADMIN":
            return "Administration";

        case "DIRECTOR":
            return "Management";

        case "MANAGER":
            return "Sales";

        case "SALES_EXECUTIVE":
            return "Sales";

        case "ACCOUNTANT":
            return "Finance";

        case "STORE_CASHIER":
            return "Store";

        case "DEALER":
            return "Dealer Management";

        case "PAINTER":
            return "Painter Management";

        default:
            return "-";
    }
};

export default UserManagement;