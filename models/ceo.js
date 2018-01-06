const mongoose = require('mongoose');
const { Schema } = mongoose;

const ceoSchema = new Schema(
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
        modifiedDate: {
            type: Date,
            default: ''
        },
    }
);

ceoSchema.statics.findCeoByKakaoID = function(id) {
    return this.findOne( { sns: 'kakao' }, { distinguishID: id } );
};

ceoSchema.statics.createCeoDB = function({ displayName, provider, id, accessToken}) {
    const ceo = new this({
        name: displayName,
        sns: provider,
        distinguishID: id,
        token: accessToken
    });
    return ceo.save();
};

module.exports = mongoose.model('ceo', ceoSchema);
