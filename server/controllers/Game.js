const models = require('../models');

const Tweet = models.Tweet;


const collectIncome = (req, res) => {
  Tweet.TweetModel.findByOwner(req.session.account._id, (err, docs) => {
    const tweets = docs;
    return models.Account.AccountModel.findOne(
    { username: req.session.account.username }, (error, newdocs) => {
      const avaPower = newdocs.avatarPower;
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      let income = 0;
      for (let i = 0; i < tweets.length; i++) {
        income = income + parseInt(tweets[i].income + avaPower, 10);
      }
      if (income > 0) {
          // console.log(income);
        const query = { username: req.session.account.username };
        const newCredits = { $inc: { impressions: income } };
        return models.Account.AccountModel.update(query, newCredits, () => {});
      }
      return 0;
    });
  });
};

const renderApp = (btweetCount, ltweetCount, i, twts, twets, req, res) => {
  Tweet.TweetModel.findById(twts[i].id, 'income textContents createdData', (err, dcs) => {
    let imp = 0;
    const bcount = btweetCount;
    const lcount = ltweetCount;
    if (dcs.income === 1) {
      bcount.count++;
    }
    if (dcs.income === 2) {
      lcount.count++;
    }
    twets.push(dcs);
    twets.sort((a, b) => new Date(b.createdData) - new Date(a.createdData));
    if (i === twts.length - 1) {
      models.Account.AccountModel.findOne({ username: req.session.account.username }
            , (error, newdocs) => {
              imp = newdocs.impressions;
              const bcst = btweetCount.count * btweetCount.count * 10;
              const lcst = ltweetCount.count * ltweetCount.count * 50;
              const accName = newdocs.username;
              return res.render('app', { csrfToken: req.csrfToken(),
                bcost: bcst, lcost: lcst, tweets: twets, impressions: imp, accountName: accName });
            });
    }
  });
};

let interval = null;
const gamePage = (req, res) => {
  clearInterval(interval);
  interval = null;
  Tweet.TweetModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const twts = docs;
    const twets = [];
    let imp = 0;
    const badCount = { count: 1 };
    const lowCount = { count: 1 };
    if (interval === null) {
      interval = setInterval(collectIncome.bind(null, req, res), 1000);
    }
    // console.log(`interval is ${interval}`);
    if (twts.length === 0) {
      return models.Account.AccountModel.findOne(
      { username: req.session.account.username }, (error, newdocs) => {
        imp = newdocs.impressions;
        const bcst = badCount.count * badCount.count * 10;
        const lcst = lowCount.count * lowCount.count * 50;
        const accName = newdocs.username;
        return res.render('app', { csrfToken: req.csrfToken(),
          bcost: bcst, lcost: lcst, tweets: twets, impressions: imp, accountName: accName });
      });
    }
    for (let i = 0; i < twts.length; i++) {
      if (i === twts.length - 1) {
        return renderApp(badCount, lowCount, i, twts, twets, req, res);
      }
      renderApp(badCount, lowCount, i, twts, twets, req, res);
    }
    return null;
  });
  // const acc = req.session.account;
};

const notFoundPage = (req, res) => res.render('notFound');

const helpPage = (req, res) => res.render('help', { csrfToken: req.csrfToken() });

const addCredit = (req, res) => {
  const query = { username: req.session.account.username };
  let spamPow = 0;
  models.Account.AccountModel.findOne({ username: req.session.account.username }
            , (error, newdocs) => {
              spamPow = newdocs.spamPower;
              const newCredits = { $inc: { impressions: spamPow } };
              models.Account.AccountModel.update(query, newCredits, (err) => {
                if (err) return res.status(400).json({ error: 'An error occured.' });
                return res.status(200).json({ message: 'Clicked.' });
              });
            });
};

module.exports.gamePage = gamePage;
module.exports.notFound = notFoundPage;
module.exports.addCredit = addCredit;
module.exports.help = helpPage;
