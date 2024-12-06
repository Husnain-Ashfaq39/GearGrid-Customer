'use client';
import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const HeaderSidebar = () => {
    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            className="offcanvas-body text-white"
            style={{ 
                backgroundColor: "#1A202C", 
                fontSize: 16,
                padding: "2rem",
                height: "100vh",
                overflowY: "auto"
            }}
        >
            <div className="siderbar_left_home active">
                <button
                    className="sidebar_switch sidebar_close_btn float-end"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    style={{ 
                        backgroundColor: "transparent", 
                        border: 0,
                        padding: "10px",
                        marginBottom: "20px"
                    }}
                >
                    <motion.span
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 180 }}
                        exit={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ color: "white", fontSize: 24 }}
                    >
                        <FaTimes />
                    </motion.span>
                </button>

                <div className="footer_contact_widget" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
                    <h3 className="title" style={{ 
                        fontSize: "24px", 
                        fontWeight: "600",
                        marginBottom: "1.5rem",
                        color: "#E2E8F0"
                    }}>
                        Quick contact info
                    </h3>
                    <p style={{ 
                        lineHeight: "1.8",
                        color: "#A0AEC0",
                        marginBottom: "2rem"
                    }}>
                        Currently working in Islamabad, Pakistan. We are selling
                        our services to valued customers and will be available
                        to other countries soon. For quick contact, please
                        call or email us. We are here to assist you 24/7.
                    </p>
                </div>

                <div className="footer_contact_widget" style={{ marginBottom: "2.5rem" }}>
                    <h5 className="title" style={{ 
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "1.5rem",
                        color: "#E2E8F0",
                        letterSpacing: "1px"
                    }}>
                        CONTACT
                    </h5>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                            display: "flex", 
                            alignItems: "center",
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)"
                        }}
                    >
                        <FaPhone style={{ marginRight: 15, color: "#4FD1C5", fontSize: 20 }} />
                        <div className="footer_phone" style={{ color: "#E2E8F0" }}>+923161980-294</div>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                            display: "flex", 
                            alignItems: "center",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)"
                        }}
                    >
                        <FaEnvelope style={{ marginRight: 15, color: "#4FD1C5", fontSize: 20 }} />
                        <p style={{ margin: 0, color: "#E2E8F0" }}>AbdulQudoos7113@gmail.com</p>
                    </motion.div>
                </div>

                <div className="footer_about_widget" style={{ marginBottom: "2.5rem" }}>
                    <h5 className="title" style={{ 
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "1.5rem",
                        color: "#E2E8F0",
                        letterSpacing: "1px"
                    }}>
                        OFFICE
                    </h5>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                            display: "flex", 
                            alignItems: "flex-start",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)"
                        }}
                    >
                        <FaMapMarkerAlt style={{ marginRight: 15, color: "#4FD1C5", fontSize: 20, marginTop: "4px" }} />
                        <p style={{ margin: 0, color: "#E2E8F0", lineHeight: "1.6" }}>
                            Islamabad, Pakistan —<br />
                            F11 Street 8
                        </p>
                    </motion.div>
                </div>

                <div className="footer_contact_widget">
                    <h5 className="title" style={{ 
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "1.5rem",
                        color: "#E2E8F0",
                        letterSpacing: "1px"
                    }}>
                        OPENING HOURS
                    </h5>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                            display: "flex", 
                            alignItems: "flex-start",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)"
                        }}
                    >
                        <FaClock style={{ marginRight: 15, color: "#4FD1C5", fontSize: 20, marginTop: "4px" }} />
                        <p style={{ margin: 0, color: "#E2E8F0", lineHeight: "1.8" }}>
                            Monday – Friday: 09:00AM – 09:00PM<br />
                            Saturday: 09:00AM – 07:00PM<br />
                            Sunday: Closed
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HeaderSidebar;
