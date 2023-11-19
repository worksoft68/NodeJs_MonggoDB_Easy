module.exports = async(req, res, next) => {
    res.setHeader("Content-Type", "text/html");
  next();
}