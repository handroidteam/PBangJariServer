var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var pcBangSchema = new Schema({
  ceoId: {
    type: Schema.Types.ObjectId,
    ref: 'ceo',
    require: true
  },
  pcBangName: {
    type: String,
    require: true
  },
  pcBangTel: {
    type: String
  },
  pcBangAdress: {
    postCode: String,
    roadAddress: String,
    detailAddress: String
  },
  pcBangIPAddress: {
    first: {
      type: Number
    },
    second: {
      type: Number
    },
    third: {
      type: Number
    }
  }
});
module.exports = mongoose.model('pcbang', pcBangSchema);
