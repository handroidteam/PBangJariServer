var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var userSchema = new Schema(
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
        lastModified: {
            type: Date,
            default: '없음'
        },
        markPCBang: [
            {
                type: Schema.Types.ObjectId,
                ref: 'pcBang'
            }
        ],
    }
);
module.exports = mongoose.model('user', userSchema);
