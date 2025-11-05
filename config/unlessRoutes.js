module.exports = {
  authenticateRoutes: {
    path: [
      { url: "/api/auth/login", method: "POST" },
      { url: "/api/product/get", method: "GET" },
      { url: /^\/api\/product\/get\/[a-zA-Z0-9\-]+$/, method: "GET" },
       { url: /^\/api\/product\/get-by-category\/[a-zA-Z0-9\-]+$/, method: "GET" },
      { url: "/api/product/add-to-cart", method: "POST" },
      { url: "/api/product/show-cart-item", method: "POST" },
      { url: /^\/api\/product\/remove-cart-item\/[a-zA-Z0-9\-]+$/, method: "DELETE" },
       { url: "/api/product/checkout", method: "POST" },
       { url: /^\/api\/product\/cancel-order\/[a-zA-Z0-9\-]+$/, method: "PATCH" },
       { url: "/api/category/get", method: "GET" },
       { url: /^\/api\/category\/get\/[a-zA-Z0-9\-]+$/, method: "GET" },
      
      // { url: "/^\/api\/v1\/test\/*/", method: "PATCH" },
    ],
  },
};
