const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let TweetModel = {};

const convertId = mongoose.Types.ObjectId;


const TweetSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  income: {
    type: Number,
    min: 0,
    required: true,
  },

  username: {
    type: String,
    required: true,
    trim: true,
    default: 'Default text',
  },

  textContents: {
    type: String,
    required: true,
    trim: true,
    default: 'Default text',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

TweetSchema.statics.toAPI = (doc) => ({
  income: doc.income,
  text: doc.text,
});


TweetSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TweetModel.find(search).select('income textContents username').exec(callback);
};

TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports.TweetModel = TweetModel;
module.exports.TweetSchema = TweetSchema;
