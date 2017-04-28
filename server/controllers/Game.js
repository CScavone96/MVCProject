const models = require('../models');

const Tweet = models.Tweet;


const collectIncome = (req, res) => {
  Tweet.TweetModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const tweets = docs;
    let income = 0;
    for (let i = 0; i < tweets.length; i++) {
      income = income + 1;
    }
    if (income > 0) {
      const query = { username: req.session.account.username };
      const newCredits = { $inc: { impressions: income } };
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
  Tweet.TweetModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const twts = docs;
    let twets = [];
    let imp = 0;
    let btweetCount = 1;
    let ltweetCount = 1;
    if (interval === null) {
      interval = setInterval(collectIncome.bind(null, req, res), 1000);
    }
    if(twts.length === 0){
        return models.Account.AccountModel.findOne({ username: req.session.account.username }
            , (error, newdocs) => {
              imp = newdocs.impressions;
              const bcst = btweetCount * btweetCount * 25;
              const lcst = ltweetCount * ltweetCount * 100;
              let accName = newdocs.username;
              return res.render('app', { csrfToken: req.csrfToken(),
                bcost: bcst, lcost: lcst, tweets: twets, impressions: imp, accountName: accName });
            }); 
    }
    for (let i = 0; i < twts.length; i++) {
      Tweet.TweetModel.findById(twts[i].id, 'income textContents createdData', function (err, dcs) {
        if(dcs.income === 1){
          btweetCount = btweetCount + 1;
        }
        if(dcs.income === 2){
          ltweetCount = ltweetCount + 1;
        }
        twets.push(dcs);
        twets.sort(function(a,b){
          return new Date(b.createdData) - new Date(a.createdData);
        });
        if(i === twts.length -1){
           return models.Account.AccountModel.findOne({ username: req.session.account.username }
            , (error, newdocs) => {
              imp = newdocs.impressions;
              const bcst = btweetCount * btweetCount * 25;
              const lcst = ltweetCount * ltweetCount * 100;
              let accName = newdocs.username;
              return res.render('app', { csrfToken: req.csrfToken(),
                bcost: bcst, lcost: lcst, tweets: twets, impressions: imp, accountName: accName });
            }); 
        }
      });
    }
  });
  // const acc = req.session.account;
};

const notFoundPage = (req, res) => {
    return res.render('notFound');
};

const helpPage = (req, res) => {
    return res.render('help', { csrfToken: req.csrfToken() });
};

const addCredit = (req, res) => {
  const query = { username: req.session.account.username };
  const newCredits = { $inc: { impressions: 1 } };
  models.Account.AccountModel.update(query, newCredits, (err) => {
    if (err) return res.status(400).json({ error: 'An error occured.' });
    return res.status(200).json({ message: 'Clicked.' });
  });
};

module.exports.gamePage = gamePage;
module.exports.notFound = notFoundPage;
module.exports.addCredit = addCredit;
module.exports.help = helpPage;
