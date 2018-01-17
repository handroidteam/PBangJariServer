const Ceo           = require('../../models/ceo');
const Pcbang        = require('../../models/pcbang');

const getAllPCBang = (req, res) => { //모든 피방 조회
    var selects = {
        'pcBangName': 1,
        'tel': 1,
        'address': 1,
        'location': 1
    };

    Pcbang.find({}, selects, (err, pcbangs) => {
        if (err) res.status(404).end();
        else if (!pcbangs) res.status(403).json({
            message: 'no ceo'
        });
        else res.status(200).json(pcbangs);
    });
};

const postCreatePCBang = (req, res) => { // 피방 생성
    console.log('CEO' + req.params.ceoId + 'requested create PCBang');
    Pcbang.createPCBang(req);
    res.status(201).json({
        success: true
    });
};

const getPCBangList = (req, res) => {
    var ceoSelects = 'ceoId';
    var pbangSelects = 'pcBangName pcBangTel pcBangAdress pcBangIPAddress';

    Pcbang.findOne({
        '_id': req.params.ceoId
    }, pbangSelects).populate('ceoId', ceoSelects).exec((err, pbang) => {
        if (err) res.status(404).end();
        else if (!pbang) res.status(404).json({
            message: 'no pbang'
        });
        else res.status(200).json(pbang);
    });
};

const deletePCBang = (req, res) => { // 피방 삭제
    Pcbang.findByIdAndRemove(req.params.pcBangId, (err) => {
        if (err) res.status(404).end();
        else Ceo.update({
            'pcBang._id': req.params.pcBangId
        }, {
            $pull: {
                'pcBang': req.params.pcBangId
            }
        }, (err) => {
            if (err) res.status(404).end();
            else res.status(200).json({
                message: 'delete sucess'
            });
        });
    });
};

module.exports = {
    getAllPCBang, 
    postCreatePCBang, 
    getPCBangList, 
    deletePCBang
};