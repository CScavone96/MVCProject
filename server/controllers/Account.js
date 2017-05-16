const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

const changePassPage = (req, res) => {
  res.render('password', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/game' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    console.log(req.body.pass);
    console.log(req.body.pass2);
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      avatarPower: 0,
      avatar: -1,
      spamPower: 1,
      impressions: 0,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: 'game' });
    });
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const query = { username: req.session.account.username };
    const newPassword = { password: hash };
    const newSalt = { salt };
    return models.Account.AccountModel.update(query, newPassword,
          () => models.Account.AccountModel.update(query,
          newSalt, () => res.json({ redirect: 'game' })));
  });
};

const getAccount = (request, response) => {
  const req = request;
  const res = response;
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const accounts = [docs];
    return res.json({ account: accounts });
  });
};

const upgradeSpam = (request, response) => {
  const req = request;
  const res = response;
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const query = { username: req.session.account.username };
    const cost = docs.spamPower * docs.spamPower * 75;
    if (docs.impressions >= cost) {
      const newPow = docs.spamPower + 1;
      const newPower = { spamPower: newPow, $inc: { impressions: -cost } };
      return models.Account.AccountModel.update(query, newPower,
      () => models.Account.AccountModel.update(query,
      () => res.json(
        {
          redirect: 'game',
        })));
    }

    return res.status(400).json({ error: 'Need more impressions' });
  });
};


const upgradeAvatar = (request, response) => {
  const req = request;
  const res = response;
  return Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    let newAva = docs.avatar;
    while (newAva === docs.avatar) {
      newAva = Math.floor(Math.random() * (86 - 1)) + 1;
    }
    const newAvatar = { avatar: newAva };
    const query = { username: req.session.account.username };
    const cost = (docs.avatarPower + 1) * (docs.avatarPower + 1) * 1000;
    if (docs.impressions >= cost) {
      const newPow = docs.avatarPower + 1;
      const newPower = { avatarPower: newPow, $inc: { impressions: -cost } };
      return models.Account.AccountModel.update(query, newPower,
      () => models.Account.AccountModel.update(query, newAvatar,
      () => res.json(
        {
          redirect: 'game',
        })));
    }

    return res.status(400).json({ error: 'Need more impressions' });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.changePass = changePassPage;
module.exports.passChange = changePassword;
module.exports.signup = signup;
module.exports.getAccount = getAccount;
module.exports.getToken = getToken;
module.exports.upgradeSpam = upgradeSpam;
module.exports.upgradeAvatar = upgradeAvatar;
