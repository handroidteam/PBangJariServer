var express     = require('express');
var router      = express.Router();
var ping        = require('ping');

var Ceo         = require('../models/ceo');
var PCbang      = require('../models/pcbang');
var PCmap       = require('../models/pcmap');
var User        = require('../models/user');

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

router.get('/user/getAll', (req, res) => {
    var selects = {
        'nickname': 1,
        'email': 1
    };
    User.find({}, selects, (err, users) => {
        if(err)
            res.status(404).end();
        else if(!users)
            res.status(403).json(
                {
                    message: 'no user'
                }
            );
        else {
            res.status(200).json(users);
        }
    });
});

