const demoMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "demo") {
    return res.status(403).json({
      success: false,
      message: "Demo access required",
    });
  }

  next();
};

module.exports = demoMiddleware;