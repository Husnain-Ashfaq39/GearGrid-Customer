module.exports = [
  {
    label: "Home",
    path: "/",
   
  },
  {
    label: "My Dashboard",
    path: "/dashboard", // Added path for navigation
   
  },
  {
    label: "Blog",
    path: "/blog/blog-grid",
    
  },
  {
    label: "Shop",
    path: "/shop",
    
  },
  {
    label: "More",
    subMenu: [
      {
        label: "About Us",
        path: "/about-us",
      },
      {
        label: "Contact Us",
        path: "/contact",
      },
      {
        label: "Services",
        path: "/service",
      },
      {
        label: "Terms & Conditions",
        path: "/terms-conditions",
      },
    ],
  },
];
