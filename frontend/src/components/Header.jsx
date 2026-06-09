import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiUser,
  FiUserPlus,
  FiGift,
  FiCalendar,
  FiClipboard,
  FiX
} from "react-icons/fi";
import { showConfirm, showSuccess } from "./alert";
import "../pages/homepage/Home.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =========================
     CATEGORY DATA
  ========================= */

  const categories = [
    {
      id: 0,
      key: "all",
      name: "Tất cả",
      icon: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
    },
    {
      id: 1,
      key: "card-games",
      name: "Trò chơi thẻ",
      icon: "https://cdn-icons-png.flaticon.com/512/2431/2431978.png",
    },
    {
      id: 2,
      key: "puzzles",
      name: "Xếp hình",
      icon: "https://cdn-icons-png.flaticon.com/512/3565/3565418.png",
    },
    {
      id: 3,
      key: "construction",
      name: "Lắp ráp",
      icon: "https://cdn-icons-png.flaticon.com/512/1867/1867934.png",
    },
    {
      id: 4,
      key: "airplane",
      name: "Máy bay",
      icon: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    },
    {
      id: 5,
      key: "doll",
      name: "Búp bê",
      icon: "https://cdn-icons-png.flaticon.com/512/2662/2662503.png",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey);
    navigate("/");
  };

  /* =========================
     STATE
  ========================= */

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("top");

  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const lastScrollYRef = useRef(0);
  const frameRef = useRef(null);
  const isScrolledRef = useRef(false);
  const scrollDirectionRef = useRef("top");
  const userMenuRef = useRef(null);

  /* =========================
     USER LOGIN STATE
  ========================= */

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      return;
    }

    setUser(null);
    setShowUserMenu(false);
  }, [location.pathname]);

  /* =========================
     CLICK OUTSIDE USER MENU
  ========================= */

  useEffect(() => {
    if (!showUserMenu) return;

    const handlePointerDown = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showUserMenu]);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?",
      "Đăng xuất",
    );

    if (!confirmed) return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setShowUserMenu(false);

    showSuccess("Đăng xuất thành công!");
    navigate("/");
  };

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {
    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollYRef.current;
      const nextIsScrolled = currentScrollY > 18;
      let nextDirection = scrollDirectionRef.current;

      if (currentScrollY <= 12) {
        nextDirection = "top";
      } else if (Math.abs(scrollDelta) >= 8) {
        nextDirection = scrollDelta > 0 ? "down" : "up";
      }

      lastScrollYRef.current = currentScrollY;
      frameRef.current = null;

      if (nextIsScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      if (nextDirection !== scrollDirectionRef.current) {
        scrollDirectionRef.current = nextDirection;
        setScrollDirection(nextDirection);
      }
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* =========================
     PROFILE CLICK
  ========================= */

  const displayName =
    user?.name || user?.username || user?.email?.split("@")[0] || "Tài khoản";

  const avatarInitial = displayName.trim().charAt(0).toUpperCase();

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate("/profile");
  };

  return (
    <div
      className={`sticky-navbar-wrap ${isScrolled ? "is-scrolled" : ""} scroll-${scrollDirection}`}
    >
      <div className="px-3 px-lg-4 py-3 home-header">
        <div className="home-header-bar d-flex align-items-center justify-content-between gap-3">
          <div className="home-brand-wrap">
            <h1 className="brand-logo mb-0">ToyZone</h1>
            <p className="brand-subtitle mb-0">ĐỒ CHƠI TRẺ EM</p>
          </div>

          <div className="home-header-actions d-flex justify-content-end align-items-center gap-2 gap-lg-3">
            {!user && (
              <>
                <Link to="/login" className="auth-link d-none d-lg-inline-flex">
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="auth-link auth-link-solid d-none d-lg-inline-flex"
                >
                  Đăng ký
                </Link>

                <Link to="/login" className="icon-pill d-lg-none">
                  <FiUser />
                </Link>

                <Link to="/register" className="icon-pill d-lg-none">
                  <FiUserPlus />
                </Link>
              </>
            )}

            {user && (
              <div
                className="user-avatar-wrap position-relative"
                ref={userMenuRef}
              >
                <button
                  className={`avatar-trigger ${showUserMenu ? "is-open" : ""}`}
                  onClick={() => setShowUserMenu((prev) => !prev)}
                >
                  <span className="avatar-badge">{avatarInitial}</span>
                  <span className="avatar-meta d-none d-md-flex">
                    <span className="avatar-name">{displayName}</span>
                  </span>
                  <FiChevronDown className="avatar-chevron" />
                </button>

                <div className={`user-dropdown ${showUserMenu ? "show" : ""}`}>
                  <div className="user-dropdown-head">
                    <span className="user-dropdown-badge">{avatarInitial}</span>
                    <p className="user-dropdown-name">{displayName}</p>
                  </div>

                  <div className="user-dropdown-actions">
                    <button
                      className="user-dropdown-item"
                      onClick={handleProfileClick}
                    >
                      <FiUser />
                      <span>Trang cá nhân</span>
                    </button>

                    <button
                      className="user-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/my-toys");
                      }}
                    >
                      <FiGift />
                      <span>Đồ chơi của tôi</span>
                    </button>

                    <button
                      className="user-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/my-bookings");
                      }}
                    >
                      <FiCalendar />
                      <span>Đơn thuê của tôi</span>
                    </button>

                    <button
                      className="user-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/owner-bookings");
                      }}
                    >
                      <FiClipboard />
                      <span>Đơn thuê đồ chơi</span>
                    </button>

                    <button
                      className="user-dropdown-item user-dropdown-item-danger"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button className="icon-pill">
              <FiHeart />
            </button>
            <button
              className="icon-pill d-lg-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-menu py-3 px-3 d-lg-none ${isMobileMenuOpen ? 'd-block' : 'd-none'}`}>
        <div className="d-flex flex-col gap-3">
          <NavLink 
            to="/" 
            end 
            className={({isActive}) => isActive ? "text-[#32d3d2] font-semibold" : "text-slate-600 hover:text-[#32d3d2] transition-colors"}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trang chủ
          </NavLink>

          <NavLink 
            to="/toys" 
            className={({isActive}) => isActive ? "text-[#32d3d2] font-semibold" : "text-slate-600 hover:text-[#32d3d2] transition-colors"}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Thuê đồ chơi
          </NavLink>

          <a 
            href="#about-us" 
            className="text-slate-600 hover:text-[#32d3d2] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Về chúng tôi
          </a>
          <a 
            href="#contact-us" 
            className="text-slate-600 hover:text-[#32d3d2] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Liên hệ
          </a>
        </div>
      </div>

      <div className="main-nav py-0">
        <div className="main-nav-inner d-flex align-items-center justify-content-between flex-wrap">
          <div className="nav-links d-none d-lg-flex align-items-center">
            <NavLink to="/" end>
              Trang chủ
            </NavLink>

            <NavLink to="/toys">Thuê đồ chơi</NavLink>

            <a href="#about-us">Về chúng tôi</a>
            <a href="#contact-us">Liên hệ</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
