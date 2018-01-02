var express = require('express');
var router = express.Router();
var Ceo = require('../models/ceo')
var Pbang = require('../models/pcbang');
var PCmap = require('../models/pcmap');
var User = require('../models/user');
var ping = require('ping');

/*---functions 모음---*/
var getPcStatus = function(pcMapId, searchDate) {
  PCmap.findOne({
    "_id": pcMapId
  }, (err, pcmap) => {
    if (err) res.status(500).end();
    else if (!pcmap) res.status(204).json({
      message: "no map"
    });
    else {
      if (lastSearch.getSeconds() + 10 > searchDate) {
        res.status(204).json({
          pcmap,
          message: "send after 10 seconds"
        });
      } else {
        var hosts = [];
        pcmap.pcIPArray.forEach((v, i) => {
          ping.sys.probe(v, (isAlive) => {
            var pcStatus = isAlive ? 1 : 0;
            hosts[i] = pcStatus;
            if (pcmap.pcIPArray.length == hosts.length) {
              console.log(hosts)
              console.log(pcmap.pcIPArray)
              pcmap.update({
                $set: {
                  "pcFlagArray": hosts,
                  "lastSearch": searchDate
                }
              }, (err) => {
                if (err) res.status(404).end();
                else {
                  PCmap.findOne({
                    "_id": req.params.pcMapId
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
}

/*---여기부터는 User 관련---*/

router.get('/allUser', (req, res) => { //모든 유저 조회
  var selects = {
    "nickname": 1,
    "email": 1
  }
  User.find({}, selects, (err, users) => {
    if (err) res.status(404).end();
    else if (!users) res.status(403).json({
      message: "no user"
    });
    else res.status(200).json(users);
  });
});

router.post('/user/signUp', (req, res) => { //유저 가입
  User.findOne({
    "uuid": req.body.uuid
  }, (err, user) => {
    if (err) res.status(404).end();
    else if (!user) {
      var newUser = new User({
        uuid: req.body.uuid,
        email: req.body.email,
        nickname: req.body.nickname
      });

      newUser.save((err, user) => {
        if (err) res.status(404).end();
        else if (!user) res.status(403).json({
          message: "no user"
        });
        else res.status(200).json(user);
      });
    } else es.status(200).json(user);
  });
});

/*---여기부터는 Ceo 관련---*/
router.get('/allCeo', (req, res) => { //모든 CEO 조회
  var selects = {
    "name": 1
  }

  Ceo.find({}, selects, (err, ceos) => {
    if (err) res.status(404).end();
    else if (!ceos) res.status(403).json({
      message: "no ceo"
    });
    else res.status(200).json(ceos);
  });
});

router.delete('/ceo/delete/:ceoId', (req, res) => { //유저 삭제
  console.log(req.params.ceoId)
  Ceo.remove({
    "_id": req.params.ceoId
  }, (err) => {
    if (err) res.status(404).end();
    else res.status(200).json({
      message: "delete sucess!"
    });
  })
});

/*---여기부터는 Pbang 관련---*/
router.get('/allPbang', (req, res) => { //모든 피방 조회
  var selects = {
    "pcBangName": 1,
    "pcBangTel": 1,
    "pcBangAdress": 1,
    "ceoId.ceoId": 1
  }

  Pbang.find({}, selects, (err, ceos) => {
    if (err) res.status(404).end();
    else if (!ceos) res.status(403).json({
      message: "no ceo"
    });
    else res.status(200).json(ceos);
  });
});

router.post('/pcBang/create/:ceoId', (req, res) => { // 피방 생성
  var newPbang = new Pbang({
    "ceoId": req.params.ceoId,
    "pcBangName": req.body.pcBangName,
    "pcBangTel": req.body.pcBangTel,
    "pcBangAdress.postCode": req.body.postCode,
    "pcBangAdress.roadAddress": req.body.roadAddress,
    "pcBangAdress.detailAddress": req.body.detailAddress,
    "pcBangIPAddress.first": req.body.ipFirst,
    "pcBangIPAddress.second": req.body.ipSecond,
    "pcBangIPAddress.third": req.body.ipThird
  });

  Ceo.findById(req.params.ceoId, (err, findedCeo) => {
    if (err) res.status(404).end();
    else if (!findedCeo) res.status(403).json({
      message: "not CEO"
    })
    else {
      newPbang.save((err, pbang) => {
        if (err) res.status(404).end();
        else if (!pbang) res.status(403).json({
          message: "no pbang"
        });
        else res.status(201).json(pbang);
      });
    }
  })
});

router.get('/pcBang/load/:pcBangId', (req, res) => {
  var ceoSelects = "ceoId";
  var pbangSelects = "pcBangName pcBangTel pcBangAdress pcBangIPAddress";

  Pbang.findOne({
    "_id": req.params.pcBangId
  }, pbangSelects).populate("ceoId", ceoSelects).exec((err, pbang) => {
    if (err) res.status(404).end();
    else if (!pbang) res.status(404).json({
      message: "no pbang"
    });
    else res.status(200).json(pbang)
  })
});

router.delete('/pcBang/delete/:pcBangId', (req, res) => { // 피방 삭제
  Pbang.findByIdAndRemove(req.params.pcBangId, (err) => {
    if (err) res.status(404).end();
    else Ceo.update({
      "pcBang._id": req.params.pcBangId
    }, {
      $pull: {
        "pcBang": req.params.pcBangId
      }
    }, (err) => {
      if (err) res.status(404).end();
      else res.status(200).json({
        message: "delete sucess"
      });
    })
  })
});

/*---여기부터는 PCmap 관련---*/

router.get('/allPCmap', (req, res) => { //모든 pcMap 조회
  var pcMapSelects = "totalFloor"
  var pcBangSelects = "pcBangName"

  PCmap.find({}, (err, pcmaps) => {
    if (err) res.status(404).end();
    else if (!pcmaps) res.status(403).json({
      message: "no pcmaps"
    });
    else res.status(200).json(pcmaps);
  })
});

router.post('/pcMap/create/:pcBangId', (req, res) => { //pcmap 생성
  var mapArray = []
  var newMap = new PCmap({
    "pcBangId": req.params.pcBangId,
    "floor": req.body.floor,
    "pcTableSize.horizontal": req.body.horizontal,
    "pcTableSize.vertical": req.body.vertical,
    "pcNumberArray":req.body.pcNumberArray,
    "pcPlaceArray":req.body.pcPlaceArray,
    "pcIPArray":req.body.pcIPArray,
    "pcFlagArray":req.body.pcFlagArray
  })

  newMap.save((err, pcmap) => {
    if (err) res.status(404).end();
    else if (!pcmap) res.status(403).json({
      message: "no map"
    });
    else res.status(200).json(pcmap);
  })
})

router.get('/pcMap/:pcBangId', (req, res) => { // pcmap 조회
  PCmap.find({
    'pcBangId': req.params.pcBangId
  }, (err, pcmaps) => {
    if (err) res.status(404).end();
    else if (!pcmaps) res.status(403).json({
      message: "no pcmaps"
    });
    else res.status(200).json(pcmaps);
  })
})

router.put('/pcMap/update/:pcMapId', (req, res) => { // pcmap 업데이트
  var updateMap = {
    "floor": req.body.floor,
    "pcTableSize.horizontal": req.body.horizontal,
    "pcTableSize.vertical": req.body.vertical,
    "pcNumberArray":req.body.pcNumberArray,
    "pcPlaceArray":req.body.pcPlaceArray,
    "pcIPArray":req.body.pcIPArray,
    "pcFlagArray":req.body.pcFlagArray
  }

  PCmap.update({
    "_id": req.params.pcMapId
  }, {
    $set: {
      updateMap
    }
  }, (err) => {
    if (err) res.status(404).end();
    else res.status(200).json({
      message: "update sucess"
    });
  })
})

router.delete('/pcMap/delete/:pcMapId', (req, res) => { // pcmap 삭제
  PCmap.remove({
    "_id": req.params.pcMapId
  }, (err) => {
    if (err) res.status(404).end();
    else res.status(200).json({
      message: "delete sucess!"
    });
  })
});


module.exports = router;
