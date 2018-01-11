var mongoose = require('mongoose');

mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var pcMapSchema = new Schema(
    {
        pcBangId: {
            type: String,
            require: true
        },
        tableSize: {                // 자리 배치 사이즈 (한 층 가로, 세로)
            col: {
                type: Number,       // 가로 크기
                require: true
            },
            row: {                  // 세로 크기
                type: Number,
                require: true
            }
        },
        pc: [
            {
                floor: {            // PC 위치(층)
                    type: Number
                },
                pcNumber: {         // PC 번호
                    type: Number
                },
                pcPlace: {          // 좌석번호
                    type: Number
                },
                pcIP: {             // IP
                    type: String
                },
                pcFlag: {           // 켜진 PC 확인
                    type: Boolean
                }
            }
        ],
        lastSearchDate: {           // 마지막 Ping Test 시간
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('pcmap', pcMapSchema);
