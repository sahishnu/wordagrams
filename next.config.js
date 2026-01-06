const path = require("path");

// Load .env.dev file for development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(__dirname, ".env.dev"),
  });
}

module.exports = {
  reactStrictMode: true,
};
