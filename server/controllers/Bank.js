const models = require('../models');
const Console = require('console').Console;
const Bank = models.Bank;
const cost = 100;
const makerPage = (req, res) => {
  Bank.BankModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), banks: docs });
  });
};

const makeBank = (req, res) => {
    models.Account.AccountModel.findOne({"username": req.session.account.username}, function(err,docs){
    const credits = docs.credits;

    if (parseInt(credits) < cost) {
      return res.status(400).json({ error: 'Credits are required' });
    }
    
    const query = {"username": req.session.account.username};
    const newCredits = {$inc: {credits: -cost}};
    models.Account.AccountModel.update(query, newCredits, function(err, doc){     
        const bankData = {
          owner: req.session.account._id,
        };

        const newBank = new Bank.BankModel(bankData);

        const bankPromise = newBank.save();

        bankPromise.then(() => res.status(200).json({ message: 'Bank created.' }));

        bankPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          return res.status(400).json({ error: 'Bank already exists.' });
        }
        return res.status(400).json({ error: 'An error occured.' });
       });
       return bankPromise;
       });
   }); 
};

//module.exports.makerPage = makerPage;
module.exports.make = makeBank;
