var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var pcMapSchema = new Schema(
    {
        pcBangId: {
            type: Schema.Types.ObjectId,
            ref: 'pcBang',
            require: true
        },
        floor: {
            type: Number,
            default: 1
        },
        pcTableSize: {
            horizontal: {
                type: Number,
                require: true
            },
            vertical: {
                type: Number,
                require: true
            }
        },
        pcNumberArray: [{
            type: Number
        }],
        pcPlaceArray: [{
            type: Number
        }],
        pcIPArray: [{
            type: String
        }],
        pcFlagArray: [{
            type: Boolean
        }],
        lastSearch: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('pcmap', pcMapSchema);
