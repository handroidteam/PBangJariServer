var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var ceoSchema = new Schema({
  sns: String,
  name: String,
  distinguishID: String,
  token: String,
  lastvisited: Date,
  createDate: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('ceo', ceoSchema);
