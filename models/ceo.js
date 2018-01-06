var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var ceoSchema = new Schema(
    {
        sns: String,
        name: String,
        distinguishID: String,
        token: String,
        createdDate: {
            type: Date,
            default: Date.now
        },
        lastVisited: {
            type: Date,
            default: Date.now
        },
        modifiedDate: {
            type: Date,
            default: ''
        },
    }
);

module.exports = mongoose.model('ceo', ceoSchema);
