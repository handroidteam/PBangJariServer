const mongoose = require('mongoose');
const { Schema } = mongoose;

const ceoSchema = new Schema(
    {
        sns: String,            // 로그인 방법에 따라 결정 ex)kakao
        name: String,           // CEO 이름
        profileID: String,      // 카카오 계정 - profile.id
        token: String,          // 카카오 계정 - accessToken
        ownPCBang: [{           // CEO가 소유한 PC방 리스트
            type: String
        }],
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
        },
    }
);

ceoSchema.statics.findCeoByKakaoID = function(id) {
    return this.findOne( { sns: 'kakao' }, { profileID: id } );
};

ceoSchema.statics.createCeoDB = function({ displayName, provider, id, accessToken}) {
    const ceo = new this({
        name: displayName,
        sns: provider,
        profileID: id,
        token: accessToken
    });
    return ceo.save();
};

module.exports = mongoose.model('ceo', ceoSchema);
