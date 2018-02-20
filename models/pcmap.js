const mongoose      = require('mongoose');
const { Schema }    = mongoose;

const pcMapSchema = new Schema(     // PC방 자리배치 정보
    {
        pcBangId: {
            type: String,
            require: true
        },
        pcMapTable: [               // 자리 배치 사이즈 (한 층 가로, 세로)
            {
                sector: {           // 몇 층의 자리 배치도인지?
                    type: String,
                    require: true
                },
                col: {
                    type: Number,   // 가로 크기
                    require: true
                },
                row: {              // 세로 크기
                    type: Number,
                    require: true
                }
            }
        ],
        pcInfo: [                   // PC 정보
            {
                sector: {           // PC가 위치한 층
                    type: String
                },
                pcNumber: {         // PC 번호
                    type: Number
                },
                pcPlace: {          // 좌석 번호 (위치가 어딘지)
                    type: Number
                },
                pcIP: {             // IP
                    First: Number,
                    Second: Number,
                    Third: Number,
                    Fourth: Number,
                },
                availableFlag: {    // 사용 가능한 PC인지 확인
                    type: Number    // 0 -> 점검중, 1 -> On, 2 -> Off
                }
            }
        ],
        lastSearchDate: {           // 마지막 Ping Test 시간
            type: Date,
            default: Date.now
        }
    }
);

////////////////// 외부 사용 가능 함수 //////////////////
// PC방 고유 ID로 해당 PC방의 PCMap을 가져오는 함수
pcMapSchema.statics.findPCMapsByPCBangId = function(req) {
    const key = {
        'pcBangId': req.params.pcBangId
    };

    return this.find( key );
};

// PC맵 DB 생성 함수
pcMapSchema.statics.createPCMap = function(req) {
    const newPCMap = new this({
        pcBangId: req.body.pcBangId,
        pcMapTable: req.body.pcMapTable,
        pcInfo: req.body.pcInfo
    });

    return newPCMap.save();
};

// PC맵 수정 함수
pcMapSchema.statics.updatePCMap = function(req) {
    const key = {
        'pcBangId': req.params.pcBangId,
    };

    const updatedInfo = {
        'pcMapTable': req.body.pcMapTable,
        'pcInfo': req.body.pcInfo,
    };

    return this.update( key, { $set: updatedInfo } );
};

// PC IP 입력(수정) 함수
pcMapSchema.statics.updatePCIP = function(req) {
    const key = {
        '_id': req.params.pcMapId,
    };

    const updatedInfo = {
        'pcInfo': req.body.pcInfo,
    };

    return this.update( key, { $set: updatedInfo } );
};

// 

module.exports = mongoose.model('pcmap', pcMapSchema);
