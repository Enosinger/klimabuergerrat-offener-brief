const express = require("express");
const path = require("path");
const app = express();

// Force HTTPS on Heroku
function requireHTTPS(req, res, next) {
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV !== "development"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}
app.use(requireHTTPS);

const distPath = path.join(
  process.cwd(),
  "dist",
  "klimabuergerrat-offener-brief",
  "browser"
);
console.log("Resolved dist path:", distPath);
app.use(express.static(distPath));

app.get("/*", function (req, res) {
  const indexPath = path.join(distPath, "index.html");
  console.log("Resolved index.html path:", indexPath);
  res.sendFile(indexPath);
});

// Start server
app.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port", process.env.PORT || 8080);
});
