"use client";

import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../../components/common/DefaultHeader";
import HeaderSidebar from "../../../components/common/HeaderSidebar";
import MobileMenu from "../../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import SingleProDetails from "@/app/components/shop/shop-single/SingleProDetails";
import ProductContentTabs from "@/app/components/shop/shop-single/pro-tab-content";
import RelatedProducts from "@/app/components/shop/shop-single/RelatedProducts";
import React, { useEffect, useState } from "react";

const ShopSingle = ({ params }) => {
  const { id } = params; // Extract product ID from URL parameters
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch product data based on the 'id'
      fetch(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/api/products/${id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched product data:", data);
          setProduct(data);
        })
        .catch((error) => console.error("Error fetching product:", error));
        console.log(product);
    }
  }, [id]);

  if (!product) {
    return <div>Loading product...</div>; // Fallback UI while loading
  }

  return (
    <div className="wrapper">
      {/* Sidebar Panel */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <HeaderSidebar />
      </div>
      {/* Sidebar Panel End */}

      {/* Main Header */}
      <DefaultHeader />
      <MobileMenu />

      {/* Inner Page Breadcrumb */}
      <section className="inner_page_breadcrumb style2 bgc-f9">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb_content style2">
                <h2 className="breadcrumb_title">Shop Single</h2>
                <p className="subtitle">Shop Single</p>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Shop Single
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Single Content */}
      <section className="shop-single-content pt0 pb40 ovh bgc-f9">
        <div className="container">
          <div className="row">
            <SingleProDetails product={product} />
            <div className="col-lg-12">
              <ProductContentTabs product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="our-shop pt0 bgc-f9 pb90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="main-title text-center">
                <h2>Related Products</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="recent_property_slider_home5 dots_none nav_none">
                <RelatedProducts productId={id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <div
        className="sign_up_modal modal fade"
        id="logInModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex={-1}
        aria-hidden="true"
      >
        <LoginSignupModal />
      </div>
    </div>
  );
};

export default ShopSingle;
