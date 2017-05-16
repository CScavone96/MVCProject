const models = require('../models');

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


const Tweet = models.Tweet;

const sendAjax = (request, response, url) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.responseType = 'document';
  xhr.send();
  return xhr.responseText;
};

const getTweets = (request, response) => {
  const req = request;
  const res = response;

  return Tweet.TweetModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const tweetArr = docs;
    const tweetArrr = tweetArr.reverse();
    return res.json({ tweets: tweetArrr });
  });
};

const makeBadTweet = (req, res) => models.Tweet.TweetModel.findByOwner(
  req.session.account._id, (er, docos) => {
    const cost = 10;
    if (er) {
      console.log(er);
      return res.status(400).json({ error: 'An error occured' });
    }
    const tweets = docos;
    const tweetCount = { count: 1 };
    if (tweets.length === 0) {
      return models.Account.AccountModel.findOne({
        username: req.session.account.username }, (err, docs) => {
        const impressions = docs.impressions;
        if (parseInt(impressions, 10) < (cost * tweetCount.count * tweetCount.count)) {
          return res.status(400).json({ error: 'Impressions are required' });
        }

        const query = { username: req.session.account.username };
        const newCredits = { $inc: { impressions: -(cost * tweetCount.count * tweetCount.count) } };
        let tweetText = 'test tweet plz ignore';
        tweetText = sendAjax(req, res, 'https://api.randomuser.me/');
        const jsonTweet = JSON.parse(tweetText);
        const tweetEndings = [' dude im on this website now', ' promote this account',
          ' follow if u know whats good for you', ' what up fam', ' funny seeing you on here',
          ' are you still in school',
          ' i thought you were in prison', ' wanna get food sometime', ' r u single??',
          ' who are you again?', ' please follow me',
          ' follow me back', ' please follow.', ' follow me I post bad content',
          ' if you are under 18 please dont follow', ' how does this website work',
          " i'm back", ' lol', ' i love you', ' please someone answer me',
          " if u could just click the 'follow' button please", ' pls respond'];
        const tweetEnding = tweetEndings[Math.floor(Math.random() * tweetEndings.length)];
        tweetText = `@${jsonTweet.results[0].login.username}${tweetEnding}`;
        return models.Account.AccountModel.update(query, newCredits, () => {
          const tweetData = {
            owner: req.session.account._id,
            username: req.session.account.username,
            income: 1,
            textContents: tweetText,
          };

          const newTweet = new Tweet.TweetModel(tweetData);

          const tweetPromise = newTweet.save();

          tweetPromise.then(() => res.status(200).json({ message: 'Tweet created.' }));

          tweetPromise.catch((error) => {
            console.log(error);
            if (err.code === 11000) {
              return res.status(400).json({ error: 'Tweet already exists.' });
            }
            return res.status(400).json({ error: 'An error occured.' });
          });
          return tweetPromise;
        });
      });
    }
    for (let i = 0; i < tweets.length; i++) {
      if (tweets[i].income === 1) {
        tweetCount.count++;
      }
      if (i === tweets.length - 1) {
        models.Account.AccountModel.findOne({
          username: req.session.account.username }, (err, docs) => {
          const impressions = docs.impressions;
          // console.log(tweetCount);
          if (parseInt(impressions, 10) < (cost * tweetCount.count * tweetCount.count)) {
            return res.status(400).json({ error: 'Impressions are required' });
          }

          const query = { username: req.session.account.username };
          const newCredits =
          { $inc: { impressions: -(cost * tweetCount.count * tweetCount.count) } };
          let tweetText = 'test tweet plz ignore';
          tweetText = sendAjax(req, res, 'https://api.randomuser.me/');
          const jsonTweet = JSON.parse(tweetText);
          const tweetEndings = [' dude im on this website now', ' promote this account',
            ' follow if u know whats good for you', ' what up fam',
            ' funny seeing you on here', ' are you still in school',
            ' i thought you were in prison', ' wanna get food sometime',
            ' r u single??', ' who are you again?', ' please follow me',
            ' follow me back', ' please follow.', ' follow me I post bad content',
            ' if you are under 18 please dont follow', ' how does this website work',
            " i'm back", ' lol', ' i love you', ' please someone answer me',
            " if u could just click the 'follow' button please",
            ' pls respond'];
          tweetText =
          `@${jsonTweet.results[0].login.username}${tweetEndings
          [Math.floor(Math.random() * tweetEndings.length)]}`;
          return models.Account.AccountModel.update(query, newCredits, () => {
            const tweetData = {
              owner: req.session.account._id,
              username: req.session.account.username,
              income: 1,
              textContents: tweetText,
            };

            const newTweet = new Tweet.TweetModel(tweetData);

            const tweetPromise = newTweet.save();

            tweetPromise.then(() => res.status(200).json({ message: 'Tweet created.' }));

            tweetPromise.catch((error) => {
              console.log(error);
              if (err.code === 11000) {
                return res.status(400).json({ error: 'Tweet already exists.' });
              }
              return res.status(400).json({ error: 'An error occured.' });
            });
            return tweetPromise;
          });
        });
      }
    }
    return null;
  });

const makeLowTweet = (req, res) => models.Tweet.TweetModel.findByOwner(
  req.session.account._id, (er, docos) => {
    const cost = 50;
    if (er) {
      console.log(er);
      return res.status(400).json({ error: 'An error occured' });
    }
    const tweets = docos;
    const tweetCount = { count: 1 };
    if (tweets.length === 0) {
      return models.Account.AccountModel.findOne({
        username: req.session.account.username }, (err, docs) => {
        const impressions = docs.impressions;
        if (parseInt(impressions, 10) < (cost * tweetCount.count * tweetCount.count)) {
          return res.status(400).json({ error: 'Impressions are required' });
        }

        const query = { username: req.session.account.username };
        const newCredits = { $inc: { impressions: -(cost * tweetCount.count * tweetCount.count) } };
        let tweetText = 'test tweet plz ignore';
        tweetText = sendAjax(req, res, 'http://catfacts-api.appspot.com/api/facts');
        const jsonTweet = JSON.parse(tweetText);
        tweetText = jsonTweet.facts[0].substring(0, 140);
        return models.Account.AccountModel.update(query, newCredits, () => {
          const tweetData = {
            owner: req.session.account._id,
            username: req.session.account.username,
            income: 2,
            textContents: tweetText,
          };

          const newTweet = new Tweet.TweetModel(tweetData);

          const tweetPromise = newTweet.save();

          tweetPromise.then(() => res.status(200).json({ message: 'Tweet created.' }));

          tweetPromise.catch((error) => {
            console.log(error);
            if (err.code === 11000) {
              return res.status(400).json({ error: 'Tweet already exists.' });
            }
            return res.status(400).json({ error: 'An error occured.' });
          });
          return tweetPromise;
        });
      });
    }

    for (let i = 0; i < tweets.length; i++) {
      if (tweets[i].income === 2) {
        tweetCount.count++;
      }
      if (i === tweets.length - 1) {
        return models.Account.AccountModel.findOne({
          username: req.session.account.username }, (err, docs) => {
          const impressions = docs.impressions;
          if (parseInt(impressions, 10) < (cost * tweetCount.count * tweetCount.count)) {
            return res.status(400).json({ error: 'Impressions are required' });
          }

          const query = { username: req.session.account.username };
          const newCredits = { $inc:
          { impressions: -(cost * tweetCount.count * tweetCount.count) } };
          let tweetText = 'test tweet plz ignore';
          tweetText = sendAjax(req, res, 'http://catfacts-api.appspot.com/api/facts');
          const jsonTweet = JSON.parse(tweetText);
          tweetText = jsonTweet.facts[0].substring(0, 140);
          return models.Account.AccountModel.update(query, newCredits, () => {
            const tweetData = {
              owner: req.session.account._id,
              username: req.session.account.username,
              income: 2,
              textContents: tweetText,
            };

            const newTweet = new Tweet.TweetModel(tweetData);

            const tweetPromise = newTweet.save();

            tweetPromise.then(() => res.status(200).json({ message: 'Tweet created.' }));

            tweetPromise.catch((error) => {
              console.log(error);
              if (err.code === 11000) {
                return res.status(400).json({ error: 'Tweet already exists.' });
              }
              return res.status(400).json({ error: 'An error occured.' });
            });
            return tweetPromise;
          });
        });
      }
    }

    return null;
  });

const makeGifTweet = (req, res) => models.Tweet.TweetModel.findByOwner(
  req.session.account._id, (er, docos) => {
    if (!req.body.tag) {
      return res.status(400).json({ error: 'Tag is required' });
    }
    const cost = 100;
    if (er) {
      console.log(er);
      return res.status(400).json({ error: 'An error occured' });
    }
    const tweets = docos;
    const tweetCount = { count: 1 };
    if (tweets.length === 0) {
      return models.Account.AccountModel.findOne({
        username: req.session.account.username }, (err, docs) => {
        const impressions = docs.impressions;
        if (parseInt(impressions, 10) < (cost * tweetCount.count * tweetCount.count)) {
          return res.status(400).json({ error: 'Impressions are required' });
        }

        const query = { username: req.session.account.username };
        const newCredits = { $inc: { impressions: -(cost * tweetCount.count * tweetCount.count) } };
        let tweetText = 'test tweet plz ignore';
        tweetText = sendAjax(req, res, `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${req.body.tag}`);
        const jsonTweet = JSON.parse(tweetText);
        tweetText = jsonTweet.data.image_url;
        return models.Account.AccountModel.update(query, newCredits, () => {
          const tweetData = {
            owner: req.session.account._id,
            username: req.session.account.username,
            income: 5,
            textContents: tweetText,
          };

          const newTweet = new Tweet.TweetModel(tweetData);

          const tweetPromise = newTweet.save();

          tweetPromise.then(() => res.status(200).json({ message: 'Tweet created.' }));

          tweetPromise.catch((error) => {
            console.log(error);
            if (err.code === 11000) {
              return res.status(400).json({ error: 'Tweet already exists.' });
            }
            return res.status(400).json({ error: 'An error occured.' });
          });
          return tweetPromise;
        });
      });
    }
    for (let i = 0; i < tweets.length; i++) {
      if (tweets[i].income === 5) {
        tweetCount.count++;
      }
      if (i === tweets.length - 1) {
        return models.Account.AccountModel.findOne({
          username: req.session.account.username }, (err, docs) => {
          const impressions = docs.impressions;
          if (parseInt(impressions, 10) < (cost * tweetCount.count * tweetCount.count)) {
            return res.status(400).json({ error: 'Impressions are required' });
          }

          const query = { username: req.session.account.username };
          const newCredits = { $inc:
          { impressions: -(cost * tweetCount.count * tweetCount.count) } };
          let tweetText = 'test tweet plz ignore';
          tweetText = sendAjax(req, res,
          `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${req.body.tag}`);
          const jsonTweet = JSON.parse(tweetText);
          tweetText = jsonTweet.data.image_url;
          return models.Account.AccountModel.update(query, newCredits, () => {
            const tweetData = {
              owner: req.session.account._id,
              username: req.session.account.username,
              income: 5,
              textContents: tweetText,
            };

            const newTweet = new Tweet.TweetModel(tweetData);

            const tweetPromise = newTweet.save();

            tweetPromise.then(() => res.status(200).json({ message: 'Tweet created.' }));

            tweetPromise.catch((error) => {
              console.log(error);
              if (err.code === 11000) {
                return res.status(400).json({ error: 'Tweet already exists.' });
              }
              return res.status(400).json({ error: 'An error occured.' });
            });
            return tweetPromise;
          });
        });
      }
    }
    return null;
  });
module.exports.makeBad = makeBadTweet;
module.exports.makeLow = makeLowTweet;
module.exports.makeGif = makeGifTweet;
module.exports.getTweets = getTweets;
