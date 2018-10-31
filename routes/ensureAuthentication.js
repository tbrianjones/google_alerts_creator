module.exports = {
  ensureAuthentication: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log(req.isAuthenticated());
    return res.redirect('/');
  }
};
