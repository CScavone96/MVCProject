const models = require('../models');

const Bank = models.Bank;


const collectIncome = (req, res) => {
  Bank.BankModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const banks = docs;
    let income = 0;
    for (let i = 0; i < banks.length; i++) {
      income = income + 1;
    }
    if (income > 0) {
      const query = { username: req.session.account.username };
      const newCredits = { $inc: { credits: income } };
      return models.Account.AccountModel.update(query, newCredits, () => {
            // if (err) return res.status(400).json({ error: 'An error occured.' });
            // return res.status(200).json({ message: 'Clicked.' });
      });
    }
    return 0;
    // return res.status(200).json({ message: 'No income' });
  });
};

let interval = null;
const gamePage = (req, res) => {
  Bank.BankModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const bank = docs;
    let cred = 0;
    let bankCount = 1;
    for (let i = 0; i < bank.length; i++) {
      bankCount = bankCount + 1;
    }
    const bcst = bankCount * bankCount * 100;
    if (interval === null) {
      interval = setInterval(collectIncome.bind(null, req, res), 1000);
    }
    return models.Account.AccountModel.findOne({ username: req.session.account.username }
    , (error, newdocs) => {
      cred = newdocs.credits;
      return res.render('app', { csrfToken: req.csrfToken(),
        bcost: bcst, banks: bank, credits: cred });
    });
  });
  // const acc = req.session.account;
};

const makeBank = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required' });
  }

  const bankData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newBank = new Bank.BankModel(bankData);

  const bankPromise = newBank.save();

  bankPromise.then(() => res.json({ redirect: '/game' }));

  bankPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Bank already exists.' });
    }
    return res.status(400).json({ error: 'An error occured.' });
  });

  return bankPromise;
};

const addCredit = (req, res) => {
  const query = { username: req.session.account.username };
  const newCredits = { $inc: { credits: 1 } };
  models.Account.AccountModel.update(query, newCredits, (err) => {
    if (err) return res.status(400).json({ error: 'An error occured.' });
    return res.status(200).json({ message: 'Clicked.' });
  });
};

module.exports.gamePage = gamePage;
module.exports.make = makeBank;
module.exports.addCredit = addCredit;
