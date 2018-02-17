const PCmap         = require('../../models/pcmap');

const getPCStatus = (pcMapId, searchDate) => {
    PCmap.findOne({ '_id': pcMapId }, (err, pcmap) => {
        if(err) {
            // 에러 처리
            res.status(500).end();
        } else if(!pcmap) {
            // PC방 지도가 없을 때
            res.status(204).json(
                {
                    message: 'no map'
                }
            );
        } else {
            // PC방 지도가 있을 때
            if(lastSearch.getSeconds()+10 > searchDate) {
                res.status(204).json(
                    {
                        pcmap,
                        message: 'send after 10 seconds'
                    }
                );
            } else {
                var hosts = [];
                pcmap.pcIPArray.forEach((v, i) => {
                    ping.sys.probe(v, (isAlive) => {
                        var pcStatus = isAlive ? 1 : 0;
                        hosts[i] = pcStatus;
                        if (pcmap.pcIPArray.length == hosts.length) {
                            console.log(hosts);
                            console.log(PCmap.pcIPArray);
                            pcmap.update({
                                $set: {
                                    'pcFlagArray': hosts,
                                    'lastSearch': searchDate,
                                }
                            }, (err) => {
                                if(err) {
                                    res.status(404).end();
                                } else {
                                    PCmap.findOne({
                                        '_id': req.params.pcMapId
                                    }, (err, pcmap) => {
                                        res.status(200).json(pcmap);
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }
    });
};

// PC맵 조회
const getPCMapDetail = (req, res) => { // pcmap 조회
    console.log('***** PCMap was requested by PCBangId => "' + req.params.pcBangId + '" *****');
    PCmap.findPCMapsByPCBangId(req)
        .then((pcmaps) => {
            if(pcmaps.length === 0)
                return res.status(404).json({
                    message: 'No PCMap was found'
                });
            else
                return res.status(200).json(pcmaps);
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};

// PC맵 생성
const postCreatePCMap = (req, res) => {
    console.log('***** PCMap creating was requested by PCBangId => "' + req.params.pcBangId + '" *****');
    PCmap.createPCMap(req)
        .then(() => {
            res.redirect('/ceo');
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};

// PC맵 업데이트
const postUpdatePCMap = (req, res) => { // pcmap 업데이트
    var updateMap = {
        'floor': req.body.floor,
        'pcTableSize.horizontal': req.body.horizontal,
        'pcTableSize.vertical': req.body.vertical,
        'pcNumberArray':req.body.pcNumberArray,
        'pcPlaceArray':req.body.pcPlaceArray,
        'pcIPArray':req.body.pcIPArray,
        'pcFlagArray':req.body.pcFlagArray
    };

    PCmap.update({
        '_id': req.params.pcMapId
    }, {
        $set: {
            updateMap
        }
    }, (err) => {
        if (err) res.status(404).end();
        else res.status(200).json({
            message: 'update sucess'
        });
    });
};

const deletePCMap = (req, res) => { // pcmap 삭제
    PCmap.remove({
        '_id': req.params.pcMapId
    }, (err) => {
        if (err) res.status(404).end();
        else res.status(200).json({
            message: 'delete sucess!'
        });
    });
};

module.exports = {
    getPCStatus,
    getPCMapDetail,
    postCreatePCMap,
    postUpdatePCMap,
    deletePCMap
};