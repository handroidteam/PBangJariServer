var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        sns: String,    // 로그인 방법에 따라 결정 ex)kakao
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
        markPCBang: [   // 즐겨찾기 한 PC방 저장
            {
                type: Schema.Types.ObjectId,
                ref: 'pcBang'
            }
        ],
    }
);
module.exports = mongoose.model('user', userSchema);
