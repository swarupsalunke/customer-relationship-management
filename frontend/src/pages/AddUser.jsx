import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserRound,
  MapPin,
  UsersRound,
  LockKeyhole,
  FileText,
  ArrowLeft,
  Save,
  Upload,
  Eye,
  EyeOff,
  CalendarDays, 
  ChevronDown,
  UserPlus,
} from "lucide-react";

import "../css/addUser.css";

const AddUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // ADD / EDIT MODE
  // ==========================================

  const isEditMode = Boolean(id);

  const [activeTab, setActiveTab] =
    useState("Personal Details");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [profilePreview, setProfilePreview] =
    useState("");

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    gender: "",

    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",

    role: "",
    reportingTo: "",
    department: "",

    loginType: "",
    status: "ACTIVE",

    password: "",
    confirmPassword: "",

    permissions: [],

    notes: "",

    profilePicture: "",
  });

  // ==========================================
  // USER SUMMARY
  // ==========================================

  const [userSummary, setUserSummary] = useState({
    createdAt: null,
    updatedAt: null,
  });

  // ==========================================
  // OPTIONS
  // ==========================================

  const permissionList = [
    "Dashboard Access",
    "User Management",
    "Product Management",
    "Price Management",
    "Order Management",
    "Store Management",
    "Lead Management",
    "QR Management",
    "Reports Access",
    "Analytics Access",
    "Inventory Management",
    "Finance Management",
    "Manufacturing",
    "HR Management",
    "System Settings",
    "Dispatch Management",
    "Commission Management",
    "Reward Management",
    "Scheme Management",
  ];

  const roleOptions = [
    "SUPER_ADMIN",
    "DIRECTOR",
    "MANAGER",
    "SALES_EXECUTIVE",
    "ACCOUNTANT",
    "STORE_CASHIER",
    "DEALER",
    "PAINTER",
  ];

  const departmentOptions = [
    "Administration",
    "Sales",
    "Dealer Management",
    "Finance",
    "Inventory",
    "Painter Management",
    "Support",
    "HR",
    "Manufacturing",
  ];

  const countryOptions = [
    "India",
  ];

  const stateOptions = [
    "Maharashtra",
    "Gujarat",
    "Madhya Pradesh",
    "Karnataka",
    "Delhi",
    "Rajasthan",
    "Uttar Pradesh",
  ];

  const loginTypeOptions = [
    "Email",
    "Mobile",
    "Email & Mobile",
  ];

  const genderOptions = [
    "Male",
    "Female",
    "Other",
  ];

  // ==========================================
  // FETCH USER FOR EDIT
  // ==========================================

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id, isEditMode]);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
          method: "GET",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch user"
        );
      }

      const user = data.user;

      if (!user) {
        throw new Error("User data not found");
      }

      // ==========================================
      // FORMAT DATE FOR INPUT
      // ==========================================

      let formattedDateOfBirth = "";

      if (user.dateOfBirth) {
        const date = new Date(user.dateOfBirth);

        if (!Number.isNaN(date.getTime())) {
          formattedDateOfBirth = date
            .toISOString()
            .split("T")[0];
        }
      }

      // ==========================================
      // SET FORM DATA
      // ==========================================

      setFormData({
        name: user.name || "",
        userId: user.userId || "",
        mobile: user.mobile || "",
        email: user.email || "",

        dateOfBirth: formattedDateOfBirth,
        gender: user.gender || "",

        addressLine1: user.addressLine1 || "",
        addressLine2: user.addressLine2 || "",

        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pinCode: user.pinCode || "",

        role: user.role || "",
        reportingTo: user.reportingTo || "",
        department: user.department || "",

        loginType: user.loginType || "",
        status: user.status || "ACTIVE",

        // Password intentionally empty in edit mode
        password: "",
        confirmPassword: "",

        permissions: Array.isArray(user.permissions)
          ? user.permissions
          : [],

        notes: user.notes || "",

        profilePicture:
          user.profilePicture || "",
      });

      // Existing profile picture
      if (user.profilePicture) {
        setProfilePreview(
          user.profilePicture.startsWith("http")
            ? user.profilePicture
            : `http://localhost:5000${user.profilePicture}`
        );
      }

      // Summary
      setUserSummary({
        createdAt: user.createdAt || null,
        updatedAt: user.updatedAt || null,
      });
    } catch (error) {
      console.error(
        "Fetch user error:",
        error
      );

      alert(
        error.message ||
          "Failed to load user details."
      );

      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // PROFILE PHOTO
  // ==========================================

  const handleProfilePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl =
      URL.createObjectURL(file);

    setProfilePreview(previewUrl);

    setFormData((prev) => ({
      ...prev,
      profilePicture: previewUrl,
    }));
  };

  // ==========================================
  // PERMISSIONS
  // ==========================================

  const togglePermission = (permission) => {
    setFormData((prev) => {
      const alreadySelected =
        prev.permissions.includes(permission);

      return {
        ...prev,

        permissions: alreadySelected
          ? prev.permissions.filter(
              (item) => item !== permission
            )
          : [
              ...prev.permissions,
              permission,
            ],
      };
    });
  };

  const selectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [...permissionList],
    }));
  };

  const clearAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  // ==========================================
  // SAVE / UPDATE USER
  // ==========================================

  const handleSaveUser = async (e) => {
    e.preventDefault();

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (
      formData.password ||
      formData.confirmPassword
    ) {
      if (
        formData.password !==
        formData.confirmPassword
      ) {
        alert(
          "Password and Confirm Password do not match."
        );
        return;
      }
    }

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (
      !formData.name ||
      !formData.userId ||
      !formData.mobile ||
      !formData.role
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    // Password required only while adding
    if (
      !isEditMode &&
      !formData.password
    ) {
      alert("Password is required.");
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      // ==========================================
      // PAYLOAD
      // ==========================================

      const payload = {
        name: formData.name,
        userId: formData.userId,
        mobile: formData.mobile,
        email: formData.email,

        dateOfBirth:
          formData.dateOfBirth || null,

        gender: formData.gender,

        addressLine1:
          formData.addressLine1,

        addressLine2:
          formData.addressLine2,

        city: formData.city,
        state: formData.state,
        country: formData.country,
        pinCode: formData.pinCode,

        role: formData.role,

        reportingTo:
          formData.reportingTo,

        department:
          formData.department,

        loginType:
          formData.loginType,

        status:
          formData.status,

        permissions:
          formData.permissions,

        notes:
          formData.notes,

        profilePicture:
          formData.profilePicture,
      };

      // Password only sent when:
      // 1. Creating a user
      // 2. User entered a new password while editing
      if (
        !isEditMode ||
        formData.password
      ) {
        payload.password =
          formData.password;
      }

      // ==========================================
      // ADD / EDIT URL
      // ==========================================

      const url = isEditMode
        ? `http://localhost:5000/api/users/${id}`
        : "http://localhost:5000/api/users";

      const method = isEditMode
        ? "PUT"
        : "POST";

      // ==========================================
      // API REQUEST
      // ==========================================

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditMode
              ? "Failed to update user"
              : "Failed to create user")
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      alert(
        isEditMode
          ? "User updated successfully."
          : "User created successfully."
      );

      navigate("/users");
    } catch (error) {
      console.error(
        isEditMode
          ? "Update user error:"
          : "Create user error:",
        error
      );

      alert(
        error.message ||
          (isEditMode
            ? "Failed to update user."
            : "Failed to create user.")
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EMPTY TAB
  // ==========================================

  const renderEmptyTab = () => {
    return (
      <div className="add-user-empty-state">
        <FileText size={48} />

        <h3>No data found</h3>

        <p>
          This section is currently not available.
        </p>
      </div>
    );
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (isEditMode && loading) {
    return (
      <div className="add-user-page">
        <div className="add-user-empty-state">
          <h3>Loading user details...</h3>

          <p>
            Please wait while the user data is
            being loaded.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="add-user-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="add-user-header">

        <div className="add-user-title-area">

          <div className="add-user-title-icon">
            {isEditMode ? (
              <UserRound size={30} />
            ) : (
              <UserPlus size={30} />
            )}
          </div>

          <div>

            <h1>
              {isEditMode
                ? "Edit User"
                : "Add User"}
            </h1>

            <div className="add-user-breadcrumb">

              <span>
                Dashboard
              </span>

              <span>›</span>

              <span>
                User Management
              </span>

              <span>›</span>

              <span>
                {isEditMode
                  ? "Edit User"
                  : "Add User"}
              </span>

            </div>

          </div>

        </div>

        <div className="add-user-header-actions">

          <button
            type="button"
            className="add-user-back-btn"
            onClick={() =>
              navigate("/users")
            }
          >
            <ArrowLeft size={18} />

            Back
          </button>

          <button
            type="submit"
            form="add-user-form"
            className="add-user-save-btn"
            disabled={saving}
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : isEditMode
              ? "Update User"
              : "Save User"}
          </button>

        </div>

      </div>

      {/* ========================================
          TABS
      ======================================== */}

      <div className="add-user-tabs">

        {[
          "Personal Details",
          "Work Details",
          "Permissions",
          "Other Details",
        ].map((tab) => (

          <button
            key={tab}
            type="button"
            className={
              activeTab === tab
                ? "add-user-tab active"
                : "add-user-tab"
            }
            onClick={() =>
              setActiveTab(tab)
            }
          >
            {tab}
          </button>

        ))}

      </div>

      {/* ========================================
          EMPTY TABS
      ======================================== */}

      {activeTab !== "Personal Details" ? (

        renderEmptyTab()

      ) : (

        <form
          id="add-user-form"
          onSubmit={handleSaveUser}
          className="add-user-form"
        >

          {/* ======================================
              PERSONAL + ADDRESS
          ====================================== */}

          <div className="add-user-grid">

            {/* PERSONAL INFORMATION */}

            <section className="add-user-card">

              <div className="add-user-card-header">

                <div className="add-user-card-icon">
                  <UserRound size={22} />
                </div>

                <h2>
                  Personal Information
                </h2>

              </div>

              <div className="add-user-fields">

                {/* FULL NAME */}

                <div className="add-user-field full">

                  <label>
                    Full Name{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

                {/* USER ID */}

                <div className="add-user-field full">

                  <label>
                    User ID{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="userId"
                    placeholder="Enter user ID"
                    value={formData.userId}
                    onChange={handleChange}
                  />

                </div>

                {/* MOBILE */}

                <div className="add-user-field full">

                  <label>
                    Mobile Number{" "}
                    <span>*</span>
                  </label>

                  <div className="mobile-input">

                    <button
                      type="button"
                      className="country-code"
                    >
                      +91

                      <ChevronDown
                        size={15}
                      />
                    </button>

                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div className="add-user-field full">

                  <label>
                    Email ID
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email ID"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

                {/* DOB */}

                <div className="add-user-field">

                  <label>
                    Date of Birth
                  </label>

                  <div className="input-icon-right">

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={
                        formData.dateOfBirth
                      }
                      onChange={handleChange}
                    />

                    <CalendarDays
                      size={18}
                    />

                  </div>

                </div>

                {/* GENDER */}

                <div className="add-user-field">

                  <label>
                    Gender
                  </label>

                  <div className="select-wrapper">

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select gender
                      </option>

                      {genderOptions.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                    />

                  </div>

                </div>

                {/* PROFILE PHOTO */}

                <div className="add-user-field full">

                  <label>
                    Profile Photo
                  </label>

                  <div className="profile-upload-area">

                    <div className="profile-preview">

                      {profilePreview ? (

                        <img
                          src={profilePreview}
                          alt="Profile preview"
                        />

                      ) : (

                        <UserRound
                          size={42}
                        />

                      )}

                    </div>

                    <label className="upload-photo-btn">

                      <Upload size={17} />

                      Upload Photo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleProfilePhoto
                        }
                        hidden
                      />

                    </label>

                  </div>

                </div>

              </div>

            </section>

            {/* ADDRESS DETAILS */}

            <section className="add-user-card">

              <div className="add-user-card-header">

                <div className="add-user-card-icon">
                  <MapPin size={22} />
                </div>

                <h2>
                  Address Details
                </h2>

              </div>

              <div className="add-user-fields">

                {/* ADDRESS LINE 1 */}

                <div className="add-user-field full">

                  <label>
                    Address Line 1
                  </label>

                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="Enter address line 1"
                    value={
                      formData.addressLine1
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* ADDRESS LINE 2 */}

                <div className="add-user-field full">

                  <label>
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Enter address line 2"
                    value={
                      formData.addressLine2
                    }
                    onChange={handleChange}
                  />

                </div>

                {/* CITY */}

                <div className="add-user-field">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />

                </div>

                {/* STATE */}

                <div className="add-user-field">

                  <label>
                    State
                  </label>

                  <div className="select-wrapper">

                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select state
                      </option>

                      {stateOptions.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                    />

                  </div>

                </div>

                {/* COUNTRY */}

                <div className="add-user-field">

                  <label>
                    Country
                  </label>

                  <div className="select-wrapper">

                    <select
                      name="country"
                      value={
                        formData.country
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Select country
                      </option>

                      {countryOptions.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                    />

                  </div>

                </div>

                {/* PINCODE */}

                <div className="add-user-field">

                  <label>
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pinCode"
                    placeholder="Enter pincode"
                    value={formData.pinCode}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </section>

          </div>

          {/* ======================================
              ROLE + ACCOUNT
          ====================================== */}

          <div className="add-user-grid">

            {/* ROLE */}

            <section className="add-user-card">

              <div className="add-user-card-header">

                <div className="add-user-card-icon">
                  <UsersRound size={22} />
                </div>

                <h2>
                  Role & Reporting
                </h2>

              </div>

              <div className="add-user-fields">

                {/* ROLE */}

                <div className="add-user-field full">

                  <label>
                    User Role{" "}
                    <span>*</span>
                  </label>

                  <div className="select-wrapper">

                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select role
                      </option>

                      {roleOptions.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                    />

                  </div>

                </div>

                {/* REPORTING */}

                <div className="add-user-field full">

                  <label>
                    Reporting To
                  </label>

                  <div className="select-wrapper">

                    <select
                      name="reportingTo"
                      value={
                        formData.reportingTo
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Select reporting manager
                      </option>

                    </select>

                    <ChevronDown
                      size={18}
                    />

                  </div>

                </div>

                {/* DEPARTMENT */}

                <div className="add-user-field full">

                  <label>
                    Department
                  </label>

                  <div className="select-wrapper">

                    <select
                      name="department"
                      value={
                        formData.department
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Select department
                      </option>

                      {departmentOptions.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* ACCOUNT DETAILS */}

            <section className="add-user-card">

              <div className="add-user-card-header">

                <div className="add-user-card-icon">
                  <UserRound size={22} />
                </div>

                <h2>
                  Account Details
                </h2>

              </div>

              <div className="add-user-fields">

                {/* LOGIN TYPE */}

                <div className="add-user-field">

                  <label>
                    Login Type
                  </label>

                  <div className="select-wrapper">

                    <select
                      name="loginType"
                      value={
                        formData.loginType
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Select login type
                      </option>

                      {loginTypeOptions.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronDown
                      size={18}
                    />

                  </div>

                </div>

                {/* STATUS */}

                <div className="add-user-field">

                  <label>
                    Status
                  </label>

                  <div className="status-switch-row">

                    <button
                      type="button"
                      className={
                        formData.status ===
                        "ACTIVE"
                          ? "status-switch active"
                          : "status-switch"
                      }
                      onClick={() =>
                        setFormData(
                          (prev) => ({
                            ...prev,

                            status:
                              prev.status ===
                              "ACTIVE"
                                ? "INACTIVE"
                                : "ACTIVE",
                          })
                        )
                      }
                    >

                      <span />

                    </button>

                    <span>
                      {formData.status ===
                      "ACTIVE"
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="add-user-field">

                  <label>
                    Password{" "}
                    {!isEditMode && (
                      <span>*</span>
                    )}
                  </label>

                  <div className="password-input">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder={
                        isEditMode
                          ? "Leave blank to keep current password"
                          : "Enter password"
                      }
                      value={
                        formData.password
                      }
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) =>
                            !prev
                        )
                      }
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="add-user-field">

                  <label>
                    Confirm Password{" "}
                    {!isEditMode && (
                      <span>*</span>
                    )}
                  </label>

                  <div className="password-input">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder={
                        isEditMode
                          ? "Leave blank to keep current password"
                          : "Confirm password"
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) =>
                            !prev
                        )
                      }
                    >

                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* ======================================
              PERMISSIONS
          ====================================== */}

          <section className="add-user-card permissions-card">

            <div className="add-user-card-header permissions-header">

              <div className="add-user-card-icon">
                <LockKeyhole size={22} />
              </div>

              <h2>
                Permissions
              </h2>

              <div className="permission-actions">

                <button
                  type="button"
                  onClick={
                    selectAllPermissions
                  }
                >
                  Select All
                </button>

                <span>|</span>

                <button
                  type="button"
                  onClick={
                    clearAllPermissions
                  }
                >
                  Clear All
                </button>

              </div>

            </div>

            <div className="permissions-grid">

              {permissionList.map(
                (permission) => (

                  <label
                    key={permission}
                    className="permission-item"
                  >

                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(
                        permission
                      )}
                      onChange={() =>
                        togglePermission(
                          permission
                        )
                      }
                    />

                    <span className="custom-checkbox">
                      ✓
                    </span>

                    <span>
                      {permission}
                    </span>

                  </label>

                )
              )}

            </div>

          </section>

          {/* ======================================
              NOTES + SUMMARY
          ====================================== */}

          <div className="add-user-bottom-grid">

            {/* NOTES */}

            <section className="add-user-card notes-card">

              <div className="add-user-card-header">

                <div className="add-user-card-icon">
                  <FileText size={22} />
                </div>

                <h2>
                  Notes / Remarks
                </h2>

              </div>

              <div className="notes-wrapper">

                <textarea
                  name="notes"
                  maxLength={500}
                  placeholder="Enter notes or remarks..."
                  value={formData.notes}
                  onChange={handleChange}
                />

                <span>
                  {formData.notes.length} / 500
                </span>

              </div>

            </section>

            {/* SUMMARY */}

            <section className="add-user-card summary-card">

              <div className="add-user-card-header">

                <div className="add-user-card-icon">
                  <UserRound size={22} />
                </div>

                <h2>
                  User Details Summary
                </h2>

              </div>

              <div className="summary-list">

                <div>

                  <strong>
                    Created On
                  </strong>

                  <span>
                    {formatDate(
                      userSummary.createdAt
                    )}
                  </span>

                </div>

                <div>

                  <strong>
                    Created By
                  </strong>

                  <span>
                    -
                  </span>

                </div>

                <div>

                  <strong>
                    Last Updated On
                  </strong>

                  <span>
                    {formatDate(
                      userSummary.updatedAt
                    )}
                  </span>

                </div>

                <div>

                  <strong>
                    Last Updated By
                  </strong>

                  <span>
                    -
                  </span>

                </div>

              </div>

            </section>

          </div>

        </form>

      )}

    </div>
  );
};

export default AddUser;