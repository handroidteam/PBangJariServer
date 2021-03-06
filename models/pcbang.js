const mongoose      = require('mongoose');
const { Schema }    = mongoose;

const pcBangSchema = new Schema(
    {
        registered: {                   // CEO 등록 완료?
            type: Boolean,
            default: false
        },
        licenseNumber: {                // 사업자 등록번호
            type: String,
        },
        pcBangName: {                   // PC방 이름 (한글 우선)
            type: String,
            require: true
        },
        tel: {                          // 전화번호 0000-0000-0000
            type: String,
            require: true
        },
        address: {                      // 우편번호, 도로명, 상세주소
            roadAddress: String,
            detailAddress: String,
            hidden: String,
        },
        location: {                     // 위도, 경도
            lat: Number,
            lon: Number
        },
        adminIPAddress: [               // 사용하는 IP 주소 입력 (도메인 앞 세자리)
            {
                ipFirst: Number,
                ipSecond: Number,
                ipThird: Number
            }
        ],
        pcSpec: {                       // PC 스펙 (프론트에서 미리 틀 걸러야함)
            CPU: {
                type: String,
                require: true
            },
            RAM: {
                type: String,
                require: true
            },
            VGA: {
                type: String,
                require: true
            }
        },
        pcBangImage: [                  // PC방 이미지
            {
                data: Buffer,
                contentType: String
            }
        ],
        ratingScore: {
            type: Number,
            default: 0
        },
        userReview: [                   // 리뷰
            {
                reviewSubject: String,  // 리뷰 제목
                reviewContent: String,  // 리뷰 설명
                rating: {               // 리뷰 점수
                    type: Number,
                    default: 0
                },
                writtenDate: {          // 리뷰 작성 날짜
                    type: Date,
                    default: Date.now
                },
                writtenBy: String,      // 리뷰 작성 유저
            }
        ],
        event: [                        // 이벤트 관련
            {
                eventName: String,      // 이벤트 이름
                eventGame: String,      // 진행되는 게임
                eventFrom: Date,        // 시작하는 날짜
                eventTo: Date,          // 끝나는 날짜
                eventDesc: String,      // 이벤트 상세
                eventBy: String,        // 주최
                eventImg: [             // 이벤트 이미지
                    {
                        data: Buffer,
                        contentType: String,
                    }
                ],
            }
        ],
        createdDate: {
            type: Date,
            default: Date.now,
            require: true,
        },
        createdBy: {
            type: String,
            default: 'Administrator',
            require: true,
        },
        modifiedDate: {
            type: Date,
            default: Date.now,
        },
        modifiedBy: {
            type: String,
        }
    }
);


////////////////// 외부 사용 가능 함수 //////////////////
// PC방 DB 전체 조회 함수
pcBangSchema.statics.findAllPCBang = function() {
    const proj = {
        'pcBangName': 1,
        'tel': 1,
        'address': 1,
        'location': 1
    };

    return this.find( {}, proj );
};

// PC방 DB 생성 함수
pcBangSchema.statics.createPCBang = function(req) {
    const newPCBang = new this({
        registered: true,
        licenseNumber: req.body.licenseNumber,
        pcBangName: req.body.pcBangName,
        tel: req.body.tel,
        address: req.body.address,
        location: req.body.location,
        adminIPAddress: req.body.adminIPAddress,
        pcSpec: req.body.pcSpec,
        pcBangImage: req.body.pcBangImage,
        createdDate: req.body.createdDate,
        createdBy: req.params.ceoId
    });

    return newPCBang.save();
};

// PC방 고유 ID로 PC방 상세 정보 가져오는 함수 (App)
pcBangSchema.statics.findPCBangById = function(req) {
    const key = {
        '_id': req.params.pcBangId
    };
    const proj = {
        'pcBangName': 1,
        'tel': 1,
        'address': 1,
        'ratingScore': 1,
        'location': 1,
        'event': 1,
        'pcSpec': 1,
        'userReview': 1,
    };

    return this.find( key, proj );
};

// PC방 고유 ID로 PC방 가입 정보(Form Data)불러오는 함수 (Web)
pcBangSchema.statics.findPCBangForm = function(req) {
    const key = {
        '_id': req.params.pcBangId
    };
    const proj = {
        'licenseNumber': 1,
        'pcBangName': 1,
        'tel': 1,
        'address': 1,
        'location': 1,
        'adminIPAddress': 1,
        'pcSpec': 1,
        'pcBangImage': 1,
        'modifiedDate': 1
    };

    return this.find( key, proj );
};

// PC방 고유 ID로 PC방에 등록된 IP를 가져오는 함수
pcBangSchema.statics.findPCBangIP = function(req) {
    const key = {
        '_id': req.params.pcBangId
    };
    const proj = {
        'adminIPAddress': 1,
    };

    return this.find( key, proj );
};

// PC방 고유 ID로 PC방 정보 수정하는 함수
pcBangSchema.statics.updatePCBang = function(req) {
    const key = {
        '_id': req.params.pcBangId,
    };

    const now = new Date();
    const updatedInfo = {
        'licenseNumber': req.body.licenseNumber,
        'pcBangName': req.body.pcBangName,
        'tel': req.body.tel,
        'address': req.body.address,
        'location': req.body.location,
        'adminIPAddress': req.body.adminIPAddress,
        'pcSpec': req.body.pcSpec,
        'pcBangImage': req.body.pcBangImage,
        'modifiedBy': req.session.passport.user,
        'modifiedDate': now,
    };

    return this.update( key, { $set: updatedInfo } );
};

// PC방 고유 ID로 PC방을 찾아 삭제하는 함수
pcBangSchema.statics.deletePCbangById = function(req) {
    const key = {
        'id': req.params.pcBangId
    };
    return this.findByIdAndRemove( key );
};

// 경도, 위도를 받아서 PC방 목록 출력하는 함수
pcBangSchema.statics.findPCBangsByLonLat = function(req) {
    const leftLon = req.body.leftLon;
    const rightLon = req.body.rightLon;
    const topLat = req.body.topLat;
    const bottomLat = req.body.bottomLat;
    const comp = {
        'location.lon': { $lt: rightLon, $gt: leftLon },
        'location.lat': { $lt: topLat, $gt: bottomLat }
    };

    return this.find( comp );
};

module.exports = mongoose.model('pcbang', pcBangSchema);
