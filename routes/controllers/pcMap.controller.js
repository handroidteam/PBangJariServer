const Pcmap         = require('../../models/pcmap');
const ping          = require('ping');

const getPCStatus = (req, res) => {
    Pcmap.findPCMapsByPCBangId(req)
        .then((pcmaps) => {
            if(pcmaps.length === 0)
                return res.status(404).json({
                    message: 'No PCMap was found'
                });
            else {
                // var date = new Date();
                // if(date > pcmaps[0].lastSearchDate + 60)

                let ipArray = []; // Ping 테스트 정보 저장 배열
                const ipString = (value, index) => {
                    ipArray[index] = value.pcIP.First + '.' + value.pcIP.Second + '.' + value.pcIP.Third + '.' + value.pcIP.Fourth;
                };

                pcmaps[0].pcInfo.forEach(ipString);
                
                // let hosts = ['121.140.201.91', '121.140.201.92'];
                ipArray.forEach(function(host){
                    ping.sys.probe(host, function(isAlive){
                        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
                        console.log(msg);
                    });
                });
            }
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });

    // Pcmap.findOne({ '_id': pcMapId }, (err, pcmap) => {
    //     if(err) {
    //         // 에러 처리
    //         res.status(500).end();
    //     } else if(!pcmap) {
    //         // PC방 지도가 없을 때
    //         res.status(204).json(
    //             {
    //                 message: 'no map'
    //             }
    //         );
    //     } else {
    //         // PC방 지도가 있을 때
    //         if(lastSearch.getSeconds()+10 > searchDate) {
    //             res.status(204).json(
    //                 {
    //                     pcmap,
    //                     message: 'send after 10 seconds'
    //                 }
    //             );
    //         } else {
    //             var hosts = [];
    //             pcmap.pcIPArray.forEach((v, i) => {
    //                 ping.sys.probe(v, (isAlive) => {
    //                     var pcStatus = isAlive ? 1 : 0;
    //                     hosts[i] = pcStatus;
    //                     if (pcmap.pcIPArray.length == hosts.length) {
    //                         console.log(hosts);
    //                         console.log(Pcmap.pcIPArray);
    //                         pcmap.update({
    //                             $set: {
    //                                 'pcFlagArray': hosts,
    //                                 'lastSearch': searchDate,
    //                             }
    //                         }, (err) => {
    //                             if(err) {
    //                                 res.status(404).end();
    //                             } else {
    //                                 Pcmap.findOne({
    //                                     '_id': req.params.pcMapId
    //                                 }, (err, pcmap) => {
    //                                     res.status(200).json(pcmap);
    //                                 });
    //                             }
    //                         });
    //                     }
    //                 });
    //             });
    //         }
    //     }
    // });
};

// PC맵 조회
const getPCMapDetail = (req, res) => { // pcmap 조회
    console.log('***** PCMap was requested by PCBangId => "' + req.params.pcBangId + '" *****');
    Pcmap.findPCMapsByPCBangId(req)
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
    Pcmap.createPCMap(req)
        .then(() => {
            res.redirect('/ceo');
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};

// PC맵 수정
const postUpdatePCMap = (req, res) => {
    console.log(req.body.pcInfo);

    Pcmap.updatePCMap(req)
        .then(
            res.redirect('/ceo')
        ).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};

const deletePCMap = (req, res) => { // pcmap 삭제
    Pcmap.remove({
        '_id': req.params.pcMapId
    }, (err) => {
        if (err) res.status(404).end();
        else res.status(200).json({
            message: 'delete sucess!'
        });
    });
};

// PC IP 입력(수정)
const postUpdatePCIP = (req, res) => {

    Pcmap.updatePCIP(req)
        .then(
            res.redirect('/ceo')
        ).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};


module.exports = {
    getPCStatus,
    getPCMapDetail,
    postCreatePCMap,
    postUpdatePCMap,
    deletePCMap,
    postUpdatePCIP,
};