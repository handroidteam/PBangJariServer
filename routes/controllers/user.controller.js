const User          = require('../../models/user');

const getAllUser = (req, res) => { //모든 유저 조회
    var selects = {
        'nickname': 1,
        'email': 1
    };
    User.find({}, selects, (err, users) => {
        if (err) res.status(404).end();
        else if (!users) res.status(403).json({
            message: 'no user'
        });
        else res.status(200).json(users);
    });
};

const postSignUser = (req, res) => { //유저 가입
    User.findOne({
        'uuid': req.body.uuid
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
                    message: 'no user'
                });
                else res.status(200).json(user);
            });
        } else res.status(200).json(user);
    });
};

module.exports = {
    getAllUser,
    postSignUser
};