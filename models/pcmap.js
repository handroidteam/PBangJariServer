var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var pcMapSchema = new Schema(
    {
        pcBangId: {
            type: String,
            require: true
        },
        floor: {                // 맵 구현 층 (기본 : 1)
            type: Number,
            default: 1,
            require: true
        },
        TableSize: {            // 자리 배치 사이즈 (한 층 가로, 세로)
            horizontal: {
                type: Number,
                require: true
            },
            vertical: {
                type: Number,
                require: true
            }
        },
        pcNumberArray: [{       // PC번호
            type: Number
        }],
        pcPlaceArray: [{        // 좌석번호
            type: Number
        }],
        pcIPArray: [{           // PC 각 IP
            type: String
        }],
        pcFlagArray: [{         // 켜진 IP 확인
            type: Boolean
        }],
        lastSearch: {           // PC 전원 마지막 확인 시간
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('pcmap', pcMapSchema);
