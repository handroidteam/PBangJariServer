const Pcbang        = require('../../models/pcbang');

// 모든 PC방 조회
const getAllPCBang = (req, res) => {
    Pcbang.findAllPCBang(req, res);
};

// PC방 생성
const postCreatePCBang = (req, res) => {
    console.log('***** CEO "' + req.params.ceoId + '" requested create PCBang *****');
    Pcbang.createPCBang(req, res);
};

// PC방 상세 조회 페이지
const getPCBangDetail = (req, res) => {
    Pcbang.findPCBangById(req, res);
};

// 특정 PC방 삭제
const deletePCBang = (req, res) => {
    Pcbang.deletePCBangById(req, res);
};

module.exports = {
    getAllPCBang, 
    postCreatePCBang, 
    getPCBangDetail, 
    deletePCBang
};