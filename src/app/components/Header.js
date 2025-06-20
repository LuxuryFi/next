"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../header.module.css";

const menuData = [
  {
    label: "Giới Thiệu",
    submenu: [
      "Về Times Edu",
      "Phương Pháp Đào Tạo",
      "Sứ Mệnh, Tầm Nhìn, Giá Trị Cốt Lõi",
      "Giảng Viên",
    ],
  },
  {
    label: "Gia Sư",
    submenu: [
      "Gia Sư Tiếng Anh Online",
      "Gia Sư IGCSE",
      "Gia Sư AS & A Level",
      "Gia Sư IB",
      "Gia Sư SAT",
      "Gia Sư AP",
      "Gia Sư Cambridge Primary",
      "Gia Sư Cambridge Lower Secondary",
    ],
  },
  {
    label: "Luyện Thi",
    submenu: [
      "Luyện Thi IGCSE",
      "Luyện Thi IB",
      "Luyện Thi AP",
      "Luyện Thi AS/ A Level",
      "Luyện Thi SAT",
      "Luyện Thi Tiếng Anh Chuyên Cấp",
    ],
  },
];

const Header = () => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const mobileMenuRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const openMenu = (label) => {
    clearTimeout(closeTimeoutRef.current);
    setHoveredMenu(label);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringButton && !isHoveringDropdown) {
        setHoveredMenu(null);
      }
    }, 150);
  };

  const toggleMobileSubmenu = (label) => {
    setMobileSubmenuOpen((prev) => (prev === label ? null : label));
  };

  // Đóng menu mobile khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
        setMobileSubmenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.hotline}>Hotline: 0362 038 998</div>

        {/* Hamburger button for mobile */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(true)}
        >
          ☰
        </button>

        <nav className={styles.menu}>
          {menuData.map((item, idx) => (
            <div
              key={idx}
              className={styles.menuItem}
              onMouseEnter={() => {
                setIsHoveringButton(true);
                openMenu(item.label);
              }}
              onMouseLeave={() => {
                setIsHoveringButton(false);
                handleMouseLeave();
              }}
            >
              <span>{item.label}</span>

              {hoveredMenu === item.label && (
                <div
                  className={styles.dropdown}
                  onMouseEnter={() => {
                    setIsHoveringDropdown(true);
                    clearTimeout(closeTimeoutRef.current);
                  }}
                  onMouseLeave={() => {
                    setIsHoveringDropdown(false);
                    handleMouseLeave();
                  }}
                >
                  <ul>
                    {item.submenu.map((sub) => (
                      <li key={sub}>
                        <a
                          href="#"
                          className={styles.dropdownLink}
                          onClick={() => setHoveredMenu(null)}
                        >
                          {sub}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile menu side drawer */}
      <div
        ref={mobileMenuRef}
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <button
          className={styles.closeBtn}
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>
        <ul>
          {menuData.map((item) => (
            <li key={item.label}>
              <div
                className={styles.mobileMenuParent}
                onClick={() => toggleMobileSubmenu(item.label)}
              >
                {item.label}
                <span style={{ float: "right" }}>
                  {mobileSubmenuOpen === item.label ? "▲" : "▼"}
                </span>
              </div>
              {mobileSubmenuOpen === item.label && (
                <ul>
                  {item.submenu.map((sub) => (
                    <li key={sub}>
                      <a href="#">{sub}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
