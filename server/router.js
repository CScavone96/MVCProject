const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/game', mid.requiresLogin, controllers.Game.gamePage);
  app.post('/addCredit', mid.requiresLogin, controllers.Game.addCredit);
  app.post('/upgradeSpam', mid.requiresLogin, controllers.Account.upgradeSpam);
  app.post('/upgradeAvatar', mid.requiresLogin, controllers.Account.upgradeAvatar);
  app.post('/tweetBad', mid.requiresLogin, controllers.Tweet.makeBad);
  app.post('/tweetLow', mid.requiresLogin, controllers.Tweet.makeLow);
  app.get('/getTweets', mid.requiresLogin, controllers.Tweet.getTweets);
  app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.post('/passChange', mid.requiresLogin, controllers.Account.passChange);
  app.get('/help', mid.requiresLogin, controllers.Game.help);
  app.get('/404', controllers.Game.notFound);
  app.get('*', (req, res) => {
    res.redirect('/404');
  });
};

module.exports = router;
