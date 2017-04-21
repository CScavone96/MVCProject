const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let BankModel = {};

const convertId = mongoose.Types.ObjectId;

const BankSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// BankSchema.statics.toAPI = (doc) => ({
  // credits: doc.credits,
// });

BankSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return BankModel.find(search).select('credits').exec(callback);
};

BankModel = mongoose.model('Bank', BankSchema);
module.exports.BankModel = BankModel;
module.exports.BankSchema = BankSchema;
