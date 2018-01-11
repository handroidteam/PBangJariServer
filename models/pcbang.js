var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

// PC방 정보의 경우 CEO 등록 후에는 CEO만 수정 가능하도록
var pcBangSchema = new Schema(
    {
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
            require: true
        },
        adminIPAddress: [               // 사용하는 IP 주소 입력 (도메인 앞 세자리)
            {
                first: {
                    type: Number
                },
                second: {
                    type: Number
                },
                third: {
                    type: Number
                }
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
            require: true,
        },
        modifiedDate: {
            type: Date,
            // default: '없음'
            // null, 혹은 코드 삭제 테스트 필요
        },
        modifiedBy: {
            type: Date,
            // default: '없음'
        }
    }
);

module.exports = mongoose.model('pcbang', pcBangSchema);
