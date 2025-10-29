module.exports = {
  authenticateRoutes: {
    path: [
      { url: "/sign-up", method: "POST" },
      { url: "/login", method: "POST" },
      { url: "/otp", method: "POST" },
      
      // { url: "/^\/api\/v1\/test\/*/", method: "PATCH" },
    ],
  },
};
