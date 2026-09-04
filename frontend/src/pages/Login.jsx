import { useState } from "react";
import { loginUser } from "../services/authService";
import { Eye, EyeOff, User, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";

const Login = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);

            console.log("Login response:", data);

            // JWT token save
            localStorage.setItem("token", data.token);

            // User information save
            localStorage.setItem("user", JSON.stringify(data.user));

            // Dashboard par redirect
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            const message =
                error.response?.data?.message ||
                "Unable to login. Please try again.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-page">

            {/* Left Side */}
            <div className="auth-left">

                <div className="brand-logo">
                    <span>Oneplus</span>
                    <strong>Spark</strong>
                    <small>PAINTS</small>
                </div>

                <div className="welcome-content">
                    <p className="welcome-small">Welcome to</p>

                    <h1>
                        <span>Oneplus Spark</span> CRM
                    </h1>

                    <p className="welcome-description">
                        Manage your entire business from a single platform
                    </p>

                    <div className="feature-grid">
                        <div>▥ Sales Management</div>
                        <div>▥ Manufacturing</div>
                        <div>◔ Reports & Analytics</div>

                        <div>♧ Dealer Management</div>
                        <div>▣ Inventory Management</div>
                        <div>◈ Schemes & Offers</div>

                        <div>🎁 Painter Rewards</div>
                        <div>₹ Finance & Accounts</div>
                        <div>♙ Lead Management</div>
                    </div>
                </div>

                <div className="product-preview">
                    <div className="dashboard-placeholder">
                        <span>Oneplus Spark</span>
                        <h3>CRM Dashboard</h3>

                        <div className="mini-cards">
                            <div>₹12,45,000<br /><small>Total Sales</small></div>
                            <div>156<br /><small>Total Orders</small></div>
                            <div>28<br /><small>New Dealers</small></div>
                        </div>

                        <div className="mini-chart">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                    <div className="paint-can">
                        <span>Oneplus</span>
                        <strong>Spark</strong>
                        <small>PAINTS</small>
                        <b>PREMIUM</b>
                        <p>EXTERIOR EMULSION</p>
                    </div>
                </div>

                <div className="auth-left-footer">
                    Version 1.0.0
                </div>
            </div>

            {/* Right Side */}
            <div className="auth-right">

                <div className="login-card">

                    <div className="login-logo">
                        <span>Oneplus</span>
                        <strong>Spark</strong>
                        <small>PAINTS</small>
                    </div>

                    <h2>Welcome Back!</h2>

                    <p className="login-subtitles">
                        Sign in to continue to your CRM Dashboard.
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="form-groups">
                            <label>Username / Email</label>

                            <div className="input-wrappers">
                                <User size={20} />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter username or email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-groups">
                            <label>Password</label>

                            <div className="input-wrappers">
                                <Lock size={20} />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="login-options">

                            <label className="remember">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />

                                <span>Remember Me</span>
                            </label>

                            <Link to="/forgot-password">
                                Forgot Password?
                            </Link>

                        </div>

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "LOGGING IN..." : "LOGIN"}
                        </button>

                    </form>

                    <div className="or-divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>

                    {/* Security Features */}
                    <div className="security-features">

                        <div className="security-item">
                            <ShieldCheck />
                            <div>
                                <strong>Secure Login</strong>
                                <span>Your data is safe</span>
                            </div>
                        </div>

                        <div className="security-item">
                            <Smartphone />
                            <div>
                                <strong>OTP Authentication</strong>
                                <span>Extra layer of security</span>
                            </div>
                        </div>

                        <div className="security-item">
                            <Lock />
                            <div>
                                <strong>SSL Protected</strong>
                                <span>256-bit encryption</span>
                            </div>
                        </div>

                    </div>

                    {/* Help */}
                    <div className="help-box">
                        <div>
                            <strong>Need help?</strong>
                            <span>Contact Administrator</span>
                        </div>

                        <div>
                            <strong>support@oneplussparkpaints.com</strong>
                            <span>+91 12345 67890</span>
                        </div>
                    </div>

                    <footer>
                        © 2026 Oneplus Spark Paints. All rights reserved.
                        <br />
                        <span>Privacy Policy</span>
                        <span>Terms & Conditions</span>
                    </footer>

                </div>
            </div>

        </div>
    );
};

export default Login;