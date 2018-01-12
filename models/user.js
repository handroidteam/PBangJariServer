var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        sns: String,        // 로그인 방법에 따라 결정 ex)kakao
        name: String,
        profileID: String,
        accesstoken: String,
        markPCBang: [       // 즐겨찾기 한 PC방 저장
            {
                type: String,
            }
        ],
        createdDate: {
            type: Date,
            default: Date.now
        },
        lastVisitedDate: {
            type: Date,
            default: Date.now
        },
        lastModifiedDate: {
            type: Date,
            default: ''
        },
    }
);



module.exports = mongoose.model('user', userSchema);
