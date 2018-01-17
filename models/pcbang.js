var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

// PC방 정보의 경우 CEO 등록 후에는 CEO만 수정 가능하도록
var pcBangSchema = new Schema(
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
            postCode: String,
            roadAddress: String,
            detailAddress: String,
        },
        location: {                     // 위도, 경도
            lon: String,
            lat: String
        },
        nearStation: [                  // 주변 지하철역
            {
                type: String
            }
        ],
        adminIPAddress: [               // 사용하는 IP 주소 입력 (도메인 앞 세자리)
            {
                type: String,
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
        userReview: [                   // 리뷰
            {
                reviewSubject: String,  // 리뷰 제목
                reviewContent: String,  // 리뷰 설명
                rating: [               // 평가 점수
                    {
                        type: Number,
                        default: 0
                    }
                ],
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
            default: ''
        },
        modifiedBy: {
            type: Date,
            default: ''
        }
    }
);


////////////////// 외부 사용 가능 함수 //////////////////
// PC방 생성 함수
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

    return newPCBang.save( (err) => {
        if(err) throw err;
    } );
};


module.exports = mongoose.model('pcbang', pcBangSchema);
