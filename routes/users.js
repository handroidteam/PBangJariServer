var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/allUser', (req, res) => { //모든 유저 조회
  User.find({}, (err, users) => {
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

// router.get('/user/load/:userId', (req, res) => { //유저 정보 불러오기
//   var selects = {
//     "userId": 1,
//     "userName": 1,
//     "age": 1,
//     "email": 1,
//     "tel": 1
//   }
//   User.findById(req.params.userId, (err, user) => {
//     if (err) res.status(404).end();
//     else if (!user) res.status(403).json({
//       message: "no user"
//     });
//     else res.status(200).json(user);
//   })
// });
//
// router.put('/user/update/:userId', (req, res) => { //유저 정보 변경
//   var updateUser = {
//     userName: req.body.userName,
//     age: req.body.age,
//     email: req.body.email,
//     tel: req.body.tel
//   }
//   User.findByIdAndUpdate(req.params.userId, {
//     $set: updateUser
//   }, (err) => {
//     if (err) res.status(404).end();
//     else res.status(200).json({message:"update sucess"});
//   })
// // });
//
// router.delete('/user/delete/:userId', (req, res) => { //유저 삭제
//   User.findByIdAndRemove(req.params.userId, (err) => {
//     if (err) res.status(404).end();
//     else res.status(200).json({
//       message: "delete sucess!"
//     });
//   })
// });

router.put('/user/putMark/:userId', (req, res) => { //유저 피방 즐겨찾기 추가
  User.findByIdAndUpdate(req.params.userId, {
    $push: {
      "markPCBang": req.body.markPCBang
    }
  }, (err, user) => {
    if (err) res.status(404).end();
    else if (!user) res.status(403).json({
      message: "no user"
    });
    else res.status(200).json(user);
  })
});

module.exports = router;
