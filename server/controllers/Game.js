const models = require('../models');

const Bank = models.Bank;

const gamePage = (req, res) => {
  var dat;
  Bank.BankModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    bank = docs;
  });
  //const acc = req.session.account;
  var cred = 0;
  //collectIncome(req, res);
  var interval = setInterval(collectIncome.bind(null, req, res), 1000);
  models.Account.AccountModel.findOne({"username": req.session.account.username}, function(err,docs){
      cred = docs.credits;
      //console.log(cred);
      return res.render('app', { csrfToken: req.csrfToken(), banks: bank, credits: cred });
  });
  //return res.render('app', { csrfToken: req.csrfToken(), data: dat, credits: cred });
};

const collectIncome = (req, res) => {
    Bank.BankModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    banks = docs;
    var income = 0;
    for(var i = 0; i < banks.length; i++){
       income = income + 1; 
    }
    if(income > 0)
    {
        const query = {"username": req.session.account.username};
        const newCredits = {$inc: {credits: income}};
        models.Account.AccountModel.update(query, newCredits, function(err, doc){
            //if (err) return res.status(400).json({ error: 'An error occured.' });
            // return res.status(200).json({ message: 'Clicked.' });
        }); 
    }
  });
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
    const query = {"username": req.session.account.username};
    const newCredits = {$inc: {credits: 1}};
    models.Account.AccountModel.update(query, newCredits, function(err, doc){
        if (err) return res.status(400).json({ error: 'An error occured.' });
        return res.status(200).json({ message: 'Clicked.' });
    }); 
};

module.exports.gamePage = gamePage;
module.exports.make = makeBank;
module.exports.addCredit = addCredit;
