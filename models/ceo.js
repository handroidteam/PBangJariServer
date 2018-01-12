const mongoose = require('mongoose');
const { Schema } = mongoose;

const ceoSchema = new Schema(
    {
        sns: String,            // 로그인 방법에 따라 결정 ex)kakao
        name: String,           // CEO 이름
        profileID: String,      // 카카오 계정 - profile.id
        accessToken: String,    // 카카오 계정 - accessToken
        ownPCBang: [
            {                   // CEO가 소유한 PC방 리스트
                type: String
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
        }
    }
);


// 외부 사용 가능 함수
// CEO DB 검색 함수
ceoSchema.statics.findCeoByKakaoID = function(id) {
    return this.findOne( { sns: 'kakao' }, { profileID: id } );
};

ceoSchema.statics.createCeoDB = function({ displayName, provider, id, accessToken}) {
    const ceo = new this({
        name: displayName,
        sns: provider,
        profileID: id,
        accessToken: accessToken
    });
    return ceo.save();
};

module.exports = mongoose.model('ceo', ceoSchema);
