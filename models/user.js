var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        sns: String,
        name: String,
        distinguishID: String,
        token: String,
        lastvisited: Date,
        markPCBang: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pcBang'
            }
        ],
        createDate: {
            type: Date,
            default: Date.now
        }
    }
);
module.exports = mongoose.model('user', userSchema);
