"use client";
import menuItems from "@/data/menuItems";
import { isParentActive } from "@/utils/isMenuActive";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MainMenu = () => {
    const path = usePathname();

    return (
        <>
            {menuItems.map((menuItem, index) => (
                <li className="dropitem" key={index}>
                    <Link
                        className={isParentActive(menuItem.subMenu, path) ? "active" : ""}
                        href={menuItem.path || "#"}
                    >
                        <span className="title">{menuItem.label}</span>
                        {menuItem.subMenu && <span className="arrow"></span>}
                    </Link>
                    {menuItem.subMenu && (
                        <ul className="sub-menu">
                            {menuItem.subMenu.map((subItem, subIndex) => (
                                <li key={subIndex} className="dropitem">
                                    {subItem.subMenu ? (
                                        <>
                                            <a
                                                className={
                                                    isParentActive(
                                                        subItem.subMenu,
                                                        path
                                                    )
                                                        ? "active"
                                                        : ""
                                                }
                                                href="#"
                                            >
                                                {subItem.label}
                                            </a>
                                            <span className="arrow"></span>
                                            <ul className="sub-menu">
                                                {subItem.subMenu.map(
                                                    (
                                                        nestedSubItem,
                                                        nestedSubIndex
                                                    ) => (
                                                        <li key={nestedSubIndex}>
                                                            <Link
                                                                className={
                                                                    path ===
                                                                    nestedSubItem.path
                                                                        ? "active"
                                                                        : ""
                                                                }
                                                                href={
                                                                    nestedSubItem.path
                                                                }
                                                            >
                                                                {
                                                                    nestedSubItem.label
                                                                }
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </>
                                    ) : (
                                        <Link
                                            href={subItem.path}
                                            className={
                                                path === subItem.path
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            {subItem.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </>
    );
};

export default MainMenu;
