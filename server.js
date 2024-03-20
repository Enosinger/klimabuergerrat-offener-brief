const express = require("express");
const path = require("path");
const app = express();

//  Define funtion that redirects to https if necessary
function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
// Use the function on the express app
app.use(requireHTTPS);
// Instruct the epxress app where to find the application code
app.use(express.static(__dirname + "/dist/klimabuergerrat-offener-brief"));
// Point the express app to the angular index.html
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname + "/dist/klimabuergerrat-offener-brief/index.html")
  );
});
// Serve the express app on the port configured in the env variables - or on 8080 if not specified
app.listen(process.env.PORT || 8080);