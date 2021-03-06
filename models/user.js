const mongoose      = require('mongoose');
const { Schema }    = mongoose;

const userSchema = new Schema(
    {
        sns: String,        // 로그인 방법에 따라 결정 ex)kakao
        name: String,
        profileID: String,
        accesstoken: String,
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
