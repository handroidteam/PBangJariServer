const Pcbang        = require('../../models/pcbang');
const Ceo           = require('../../models/ceo');

// 모든 PC방 조회
const getAllPCBang = (req, res) => {
    Pcbang.findAllPCBang(req, res)
        .then((pcbangs) => {
            if(pcbangs.length === 0)
                return res.status(404).json({
                    message: 'No PCBang was found'
                });
            else
                return res.status(200).json(pcbangs);
        }).catch((err) => {
            // console.log(err);
            res.status(500).end();
        });
};

// PC방 생성
// 테스트가 끝나면 params 대신 session 사용할 것
const postCreatePCBang = (req, res) => {
    console.log('***** CEO "' + req.params.ceoId + '" requested create PCBang *****');
    Pcbang.createPCBang(req)
        .then((newpcbang) => {
            Ceo.addPCBangId(req.params.ceoId, newpcbang._id);
        }).then(
            res.redirect('/ceo')
        ).catch((err)=> {
            console.log(err);
            res.status(500).end();
        });
};

// PC방 상세 조회 페이지
const getPCBangDetail = (req, res) => {
    Pcbang.findPCBangById(req)
        .then((pcbangresult) => {
            if(pcbangresult.length === 0)
                return res.status(404).json({
                    message: 'No PCBang was found'
                });
            else
                return res.status(200).json(pcbangresult);
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};

// 특정 PC방 삭제
const deletePCBang = (req, res) => {
    Pcbang.deletePCBangById(res)
        .then(() => {
            res.status(200).json({
                message: 'Deleted successfully'
            });
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};

// 범위 내의 PC방 찾기
const getPCBangsInHere = (req, res) => {
    Pcbang.findPCBangsByLonLat(req)
        .then((pcbangs) => {
            if(pcbangs.length === 0)
                return res.status(404).json({
                    message: 'No PCBang was found'
                });
            else
                return res.status(200).json(pcbangs);
        }).catch( (err) => {
            console.log(err);
            res.status(500).end();
        });
};

module.exports = {
    getAllPCBang, 
    postCreatePCBang, 
    getPCBangDetail, 
    deletePCBang,
    getPCBangsInHere
};