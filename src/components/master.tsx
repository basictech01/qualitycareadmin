"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "./themetoggle";
import Link from "next/link";

const MasterLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [sidebarActive, seSidebarActive] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const location = usePathname(); // Hook to get the current route

    useEffect(() => {
        if (typeof window === "undefined") return;

        // @ts-ignore
        const handleDropdownClick = (event) => {
            event.preventDefault();
            const clickedLink = event.currentTarget;
            const clickedDropdown = clickedLink.closest(".dropdown");

            if (!clickedDropdown) return;

            const isActive = clickedDropdown.classList.contains("open");

            // Close all dropdowns
            const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
            allDropdowns.forEach((dropdown) => {
                dropdown.classList.remove("open");
                const submenu = dropdown.querySelector(".sidebar-submenu");
                if (submenu) {
                    // @ts-ignore
                    submenu.style.maxHeight = "0px"; // Collapse submenu
                }
            });

            // Toggle the clicked dropdown
            if (!isActive) {
                clickedDropdown.classList.add("open");
                const submenu = clickedDropdown.querySelector(".sidebar-submenu");
                if (submenu) {
                    submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
                }
            }
        };

        // Attach click event listeners to all dropdown triggers
        const dropdownTriggers = document.querySelectorAll(
            ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
        );

        dropdownTriggers.forEach((trigger) => {
            trigger.addEventListener("click", handleDropdownClick);
        });

        const openActiveDropdown = () => {
            const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
            allDropdowns.forEach((dropdown) => {
                const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
                submenuLinks.forEach((link) => {
                    if (
                        link.getAttribute("href") === location ||
                        link.getAttribute("to") === location
                    ) {
                        dropdown.classList.add("open");
                        const submenu = dropdown.querySelector(".sidebar-submenu");
                        if (submenu) {
                            // @ts-ignore
                            submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
                        }
                    }
                });
            });
        };

        // Open the submenu that contains the active route
        openActiveDropdown();

        // Cleanup event listeners on unmount
        return () => {
            dropdownTriggers.forEach((trigger) => {
                trigger.removeEventListener("click", handleDropdownClick);
            });
        };
        // @ts-ignore
    }, [location.pathname, location]);

    const sidebarControl = () => {
        seSidebarActive(!sidebarActive);
    };

    const mobileMenuControl = () => {
        setMobileMenu(!mobileMenu);
    };

    return (
        <section className={mobileMenu ? "overlay active" : "overlay "}>
            {/* sidebar */}
            <aside
                className={
                    sidebarActive
                        ? "sidebar active "
                        : mobileMenu
                            ? "sidebar sidebar-open"
                            : "sidebar"
                }
            >
                <button
                    onClick={mobileMenuControl}
                    type='button'
                    className='sidebar-close-btn'
                >
                    <Icon icon='radix-icons:cross-2' />
                </button>
                <div>
                    <Link href='/' className='sidebar-logo'>
                        <img
                            src='/images/light-logo.png'
                            alt='site logo'
                            className='light-logo'
                        />
                        <img
                            src='/assets/images/logo-light.png'
                            alt='site logo'
                            className='dark-logo'
                        />
                        <img
                            src='/assets/images/logo-icon.png'
                            alt='site logo'
                            className='logo-icon'
                        />
                    </Link>
                </div>
                <div className='sidebar-menu-area'>
                    <ul className='sidebar-menu' id='sidebar-menu'>
                        <li className='dropdown'>
                            <Link href='#'>
                                <Icon
                                    icon='solar:home-smile-angle-outline'
                                    className='menu-icon'
                                />
                                <span>Reporting</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                    <Link
                                        href='/dashboard/sales'
                                        className={pathname === "/dashboard/sales" ? "active-page" : ""}
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                                        Sales Statistics
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href='/dashboard/doctor'
                                        className={pathname === "/dashboard/doctor" ? "active-page" : ""}
                                    >
                                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                                        Doctor Statistics
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link
                                href='/doctor'
                                className={pathname === "/doctor" ? "active-page" : ""}
                            >
                                <Icon icon='mage:email' className='menu-icon' />
                                <span>Doctor</span>
                            </Link>
                        </li>
                      
                        {/* Service */}
                        <li className='dropdown'>
                            <Link href='/settings'>
                                <Icon icon='hugeicons:invoice-03' className='menu-icon' />
                                <span>Service</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                    <Link
                                        href='/service/Services'
                                        className={
                                            pathname === "/service/Services" ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href='/service/Category'
                                        className={
                                            pathname === "/service/Category" ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                                        Category
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link
                                href='/marketing'
                                className={pathname === "/marketing" ? "active-page" : ""}
                            >
                                <Icon icon='mage:email' className='menu-icon' />
                                <span>Marketing</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/financial'
                                className={pathname === "/financial" ? "active-page" : ""}
                            >
                                <Icon icon='bi:chat-dots' className='menu-icon' />
                                <span>Financial</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/notification'
                                className={pathname === "/notification" ? "active-page" : ""}
                            >
                                <Icon icon='solar:calendar-outline' className='menu-icon' />
                                <span>Notification</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/review'
                                className={pathname === "/review" ? "active-page" : ""}
                            >
                                <Icon
                                    icon='material-symbols:map-outline'
                                    className='menu-icon'
                                />
                                <span>Review</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/loyalty'
                                className={pathname === "/loyalty" ? "active-page" : ""}
                            >
                                <Icon
                                    icon='material-symbols:map-outline'
                                    className='menu-icon'
                                />
                                <span>Loyalty</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href='/customer'
                                className={pathname === "/customer" ? "active-page" : ""}
                            >
                                <Icon icon='mage:email' className='menu-icon' />
                                <span>Customer</span>
                            </Link>
                        </li>
                        {/* Settings */}
                        <li className='dropdown'>
                            <Link href='/settings'>
                                <Icon icon='hugeicons:invoice-03' className='menu-icon' />
                                <span>Settings</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                    <Link
                                        href='/settings/vat'
                                        className={
                                            pathname === "/settings/vat" ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Vat
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href='/settings/branch'
                                        className={
                                            pathname === "/settings/branch" ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-warning-main w-auto' />
                                        Branch
                                    </Link>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </aside>

            <main
                className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
            >
                <div className='navbar-header'>
                    <div className='row align-items-center justify-content-between'>
                        <div className='col-auto'>
                            <div className='d-flex flex-wrap align-items-center gap-4'>
                                <button
                                    type='button'
                                    className='sidebar-toggle'
                                    onClick={sidebarControl}
                                >
                                    {sidebarActive ? (
                                        <Icon
                                            icon='iconoir:arrow-right'
                                            className='icon text-2xl non-active'
                                        />
                                    ) : (
                                        <Icon
                                            icon='heroicons:bars-3-solid'
                                            className='icon text-2xl non-active '
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={mobileMenuControl}
                                    type='button'
                                    className='sidebar-mobile-toggle'
                                >
                                    <Icon icon='heroicons:bars-3-solid' className='icon' />
                                </button>
                                <form className='navbar-search'>
                                    <input type='text' name='search' placeholder='Search' />
                                    <Icon icon='ion:search-outline' className='icon' />
                                </form>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <div className='d-flex flex-wrap align-items-center gap-3'>
                                {/* ThemeToggleButton */}
                                <ThemeToggleButton />
                                <div className='dropdown'>
                                    <button
                                        className='d-flex justify-content-center align-items-center rounded-circle'
                                        type='button'
                                        data-bs-toggle='dropdown'
                                    >
                                        <img
                                            src='/assets/images/user.png'
                                            alt='image_user'
                                            className='w-40-px h-40-px object-fit-cover rounded-circle'
                                        />
                                    </button>
                                    <div className='dropdown-menu to-top dropdown-menu-sm'>
                                        <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                                            <div>
                                                <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                                                    Shaidul Islam
                                                </h6>
                                                <span className='text-secondary-light fw-medium text-sm'>
                                                    Admin
                                                </span>
                                            </div>
                                            <button type='button' className='hover-text-danger'>
                                                <Icon
                                                    icon='radix-icons:cross-1'
                                                    className='icon text-xl'
                                                />
                                            </button>
                                        </div>
                                        <ul className='to-top-list'>
                                            <li>
                                                <Link
                                                    className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                                                    href='/view-profile'
                                                >
                                                    <Icon
                                                        icon='solar:user-linear'
                                                        className='icon text-xl'
                                                    />{" "}
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                                                    href='/email'
                                                >
                                                    <Icon
                                                        icon='tabler:message-check'
                                                        className='icon text-xl'
                                                    />{" "}
                                                    Inbox
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                                                    href='/company'
                                                >
                                                    <Icon
                                                        icon='icon-park-outline:setting-two'
                                                        className='icon text-xl'
                                                    />
                                                    Setting
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                                                    href='#'
                                                >
                                                    <Icon icon='lucide:power' className='icon text-xl' />{" "}
                                                    Log Out
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Profile dropdown end */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* dashboard-main-body */}
                <div className='dashboard-main-body'>{children}</div>
            </main>
        </section>
    );
};

export default MasterLayout;

