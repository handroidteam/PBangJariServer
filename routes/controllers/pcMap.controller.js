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

const getPCMapList = (req, res) => { // pcmap 조회
    PCmap.find({
        'pcBangId': req.params.pcBangId
    }, (err, pcmaps) => {
        if (err) res.status(404).end();
        else if (!pcmaps) res.status(403).json({
            message: 'no pcmaps'
        });
        else res.status(200).json(pcmaps);
    });
};

const postCreatePCMap = (req, res) => { //pcmap 생성
    var mapArray = [];
    var newMap = new PCmap({
        'pcBangId': req.params.pcBangId,
        'floor': req.body.floor,
        'pcTableSize.horizontal': req.body.horizontal,
        'pcTableSize.vertical': req.body.vertical,
        'pcNumberArray':req.body.pcNumberArray,
        'pcPlaceArray':req.body.pcPlaceArray,
        'pcIPArray':req.body.pcIPArray,
        'pcFlagArray':req.body.pcFlagArray
    });

    newMap.save((err, pcmap) => {
        if (err) res.status(404).end();
        else if (!pcmap) res.status(403).json({
            message: 'no map'
        });
        else res.status(200).json(pcmap);
    });
};

const putUpdatePCMap = (req, res) => { // pcmap 업데이트
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
    getPCMapList,
    postCreatePCMap,
    putUpdatePCMap,
    deletePCMap
};