const mongoose      = require('mongoose');
const { Schema }    = mongoose;

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


////////////////// 외부 사용 가능 함수 //////////////////
// CEO DB 조회 함수 (passport용)
ceoSchema.statics.findCeoByKakaoID = function(id) {
    return this.findOne( { sns: 'kakao', profileID: id } ).exec();
};

// 모든 CEO 조회 (API용)
ceoSchema.statics.findAllCeo = function() {
    const proj = {
        'name': 1,
        'ownPCBang': 1,
    };

    return this.find( {}, proj ).exec();
};

// CEO DB 조회 함수 (CEO 페이지용)
ceoSchema.statics.findCeoById = function(id) {
    return this.findById({});
};

// CEO DB 생성 함수 (최초 로그인 시 사용)
ceoSchema.statics.createCeoDB = function({ displayName, provider, id, accessToken}) {
    const newCeo = new this({
        name: displayName,
        sns: provider,
        profileID: id,
        accessToken: accessToken
    });
    return newCeo.save();
};

// CEO가 PC방 등록 시 사용하는 함수
ceoSchema.statics.addPCBangId = function(ceoid, pcbangid) {
    const query = {
        '_id': ceoid
    };
    const what = {
        $push: { 
            'ownPCBang': pcbangid
        }
    };
    return this.update( query, what ).exec();
};

// CEO 삭제 함수
ceoSchema.statics.deleteCeoByKakaoID = function(id) {
    return this.remove( {sns: 'kakao', profileID: id }, (err) => {
        if(err) throw err;
    } );
};

module.exports = mongoose.model('ceo', ceoSchema);