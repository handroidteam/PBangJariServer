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
                    type: Number,
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
                    type: Number
                },
                pcNumber: {         // PC 번호
                    type: Number
                },
                pcPlace: {          // 좌석 번호 (위치가 어딘지)
                    type: Number
                },
                pcIP: {             // IP
                    type: String
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
// PC맵 DB 생성 함수
pcMapSchema.statics.createPCMap = function(req, res) {
    const newPCMap = new this({
        pcBangId: req.body.pcBangId,
        pcMapTable: req.body.pcMapTable,
        pcInfo: req.body.pcInfo
    });

    return newPCMap.save( (err) => {
        if(err)
            throw err;
        else
            return res.redirect('/ceo');
    } );
};

// PC방 고유 ID로 해당 PC방의 PCMap을 가져오는 함수
pcMapSchema.statics.findPCMapByPCBangId = function(req, res) {
    const key = {
        '_id': req.params.pcBangId
    };

    this.find( key, (err, pcmaps) => {
        if(err)
            return res.status(500).end();
        else if(!pcmaps)
            return res.status(404).json({
                message: 'No PCMap was found'
            });
        else
            return res.status(200).json(pcmaps);
    });
};

module.exports = mongoose.model('pcmap', pcMapSchema);
