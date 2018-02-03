const Ceo           = require('../../models/ceo');


// 모든 CEO 조회
const getAllCeo = (req, res) => {
    Ceo.findAllCeo()
        .then((ceos) => {
            if(ceos.length === 0) {
                return res.status(404).json({
                    message: 'No CEO was found'
                });
            } else {
                return res.status(200).json(ceos);
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
};

// 특정 CEO 삭제
const deleteCeo = async function (req, res) {
    await Ceo.deleteCeoByKakaoID(req.params.ceoId);
    res.status(200).json({
        success: true
    });
};

module.exports = {
    getAllCeo, deleteCeo
};