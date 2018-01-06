var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

// PC방 정보의 경우 CEO 등록 후에는 CEO만 수정 가능하도록
var pcBangSchema = new Schema(
    {
        // CEO 등록된 PC방인지 확인
        inherited: {
            type: Boolean,
            default: false,
        },
        pcBangName: {
            type: String,
            require: true
        },
        tel: {
            type: String,
            require: true,
        },
        address: {
            postCode: String,
            roadAddress: String,
            detailAddress: String,
            require: true,
        },
        // PC방 메인 PC IP 주소
        adminIpAddress: {
            first: {
                type: Number
            },
            second: {
                type: Number
            },
            third: {
                type: Number
            },
            fourth: {
                type: Number
            },
        },
        // 이벤트 관련
        event: [
            {
                eventName: String,
                eventGame: String,
                eventFrom: Date,
                eventTo: Date,
                eventDesc: String,
                eventBy: String,
                eventImg: [
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
