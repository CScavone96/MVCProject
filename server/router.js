const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/game', mid.requiresLogin, controllers.Game.gamePage);
  // app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  // app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.post('/addCredit', mid.requiresLogin, controllers.Game.addCredit);
  app.post('/tweetBad', mid.requiresLogin, controllers.Tweet.makeBad);
  app.post('/tweetLow', mid.requiresLogin, controllers.Tweet.makeLow);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.post('/passChange', mid.requiresLogin, controllers.Account.passChange);
  app.get('/help', mid.requiresLogin, controllers.Game.help);
  app.get('/404', controllers.Game.notFound);
  app.get('*',function (req, res) {
        res.redirect('/404');
    });
};

module.exports = router;
