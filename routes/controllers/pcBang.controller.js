const Pcbang        = require('../../models/pcbang');
const Ceo           = require('../../models/ceo');

// 모든 PC방 조회
const getAllPCBang = (req, res) => {
    Pcbang.findAllPCBang(req, res);
};

// PC방 생성
const postCreatePCBang = (req, res) => {
    console.log('***** CEO "' + req.params.ceoId + '" requested create PCBang *****');
    Pcbang.createPCBang(req).then((newpcbang) => {
        var newpcbangid = newpcbang._id;
        console.log(newpcbangid);

        Ceo.addPCBangId(req.params.ceoId, newpcbangid, res);
        
        // .then((err) => {
        //     console.log('test');
        //     if(err)
        //         return res.status(500).end();
        //     else
        //         return res.stauts(201).json({
        //             message: 'PCBang was created'
        //         });

        // }); 
    });
};

// PC방 상세 조회 페이지
const getPCBangDetail = (req, res) => {
    Pcbang.findPCBangById(req, res);
};

// 특정 PC방 삭제
const deletePCBang = (req, res) => {
    Pcbang.deletePCBangById(req, res);
};

// 범위 내의 PC방 찾기
const getPCBangsInHere = (req, res) => {
    Pcbang.findPCBangsByLonLat(req, res);
};

module.exports = {
    getAllPCBang, 
    postCreatePCBang, 
    getPCBangDetail, 
    deletePCBang,
    getPCBangsInHere
};