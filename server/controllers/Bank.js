const models = require('../models');

const Bank = models.Bank;
const cost = 100;

const getBankCost = (req, res) => {
  models.Bank.BankModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const banks = docs;
    let bankCount = 1;
    for (let i = 0; i < banks.length; i++) {
      bankCount = bankCount + 1;
    }
    return bankCount;
  });
};


const makeBank = (req, res) => {
  models.Bank.BankModel.findByOwner(req.session.account._id, (er, docos) => {
    if (er) {
      console.log(er);
      return res.status(400).json({ error: 'An error occured' });
    }
    const banks = docos;
    let bankCount = 1;
    for (let i = 0; i < banks.length; i++) {
      bankCount = bankCount + 1;
    }
    models.Account.AccountModel.findOne({ username: req.session.account.username }, (err, docs) => {
      const credits = docs.credits;

      if (parseInt(credits, 10) < (cost * bankCount * bankCount)) {
        return res.status(400).json({ error: 'Credits are required' });
      }

      const query = { username: req.session.account.username };
      const newCredits = { $inc: { credits: -(cost * bankCount * bankCount) } };
      return models.Account.AccountModel.update(query, newCredits, () => {
        const bankData = {
          owner: req.session.account._id,
        };
        const newBank = new Bank.BankModel(bankData);

        const bankPromise = newBank.save();

        bankPromise.then(() => res.status(200).json({ message: 'Bank created.' }));

        bankPromise.catch((error) => {
          console.log(error);
          if (err.code === 11000) {
            return res.status(400).json({ error: 'Bank already exists.' });
          }
          return res.status(400).json({ error: 'An error occured.' });
        });
        return bankPromise;
      });
    });
  });
};

module.exports.make = makeBank;
