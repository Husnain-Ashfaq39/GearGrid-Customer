/* eslint-disable react/prop-types */
"use client";
import Aos from "aos";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import "aos/dist/aos.css";
import "../public/scss/main.scss";
import ScrollToTop from "./components/common/ScrollTop";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from '@emotion/is-prop-valid';
import React from "react";
import './global.css'
if (typeof window !== "undefined") {
  import("bootstrap");
}

const inter = Inter({ subsets: ["latin"] });

const Body = styled.body`
  font-family: ${inter.family};
  font-size: ${inter.fontSize};
  margin: 0;
  padding: 0;
`;

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({
      duration: 1200,
    });
  }, []);

  return (
    <html lang="en">
      <StyleSheetManager shouldComponentUpdate={true} shouldForwardProp={isPropValid}>
        <Body cz-shortcut-listen="false">
          {children}
          <ScrollToTop />
        </Body>
      </StyleSheetManager>
    </html>
  );
}
