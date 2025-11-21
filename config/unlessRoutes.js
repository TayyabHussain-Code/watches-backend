module.exports = {
  authenticateRoutes: {
    path: [
      { url: "/api/auth/login", method: "POST" },
      { url: "/api/product/get", method: "GET" },
      { url: /^\/api\/product\/get\/[a-zA-Z0-9\-]+$/, method: "GET" },
      { url: /^\/api\/product\/get-by-category\/[a-zA-Z0-9\-]+$/, method: "GET" },
      { url: "/api/product/add-to-cart", method: "POST" },
      { url: /^\/api\/product\/update-cart-item\/[a-zA-Z0-9\-]+$/, method: "PATCH" },
      { url: "/api/product/show-cart-item", method: "POST" },
      { url: /^\/api\/product\/remove-cart-item\/[a-zA-Z0-9\-]+$/, method: "DELETE" },
      { url: "/api/product/checkout", method: "POST" },
      { url: /^\/api\/product\/cancel-order\/[a-zA-Z0-9\-]+$/, method: "PATCH" },
      { url: "/api/category/get", method: "GET" },
      { url: /^\/api\/category\/get\/[a-zA-Z0-9\-]+$/, method: "GET" },
      { url: "/", method: "GET" },
      { url: "/api/link/get", method: "GET" },
      { url: /^\/api\/link\/get\/[a-zA-Z0-9\-]+$/, method: "GET" },
      { url: "/api/review/add", method: "POST" },
      { url: "/api/brand/get", method: "GET" },
       { url: /^\/api\/brand\/get\/[a-zA-Z0-9\-]+$/, method: "GET" },
    ],
  },
};
