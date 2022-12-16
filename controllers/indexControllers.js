const indexGet = (req, res) => {
  res.render('welcome');
};

const dashboardGet = (req, res) => {
  res.render('dashboard', { name: req.user });
};

module.exports = {
  indexGet,
  dashboardGet,
};
