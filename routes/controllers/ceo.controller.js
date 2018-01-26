const Ceo           = require('../../models/ceo');


// 모든 CEO 조회
const getAllCeo = (req, res) => {
    var selects = {
        'name': 1
    };

    Ceo.find({}, selects, (err, ceos) => {
        if(err)
            return res.status(404).end();
        else if(!ceos)
            return res.status(403).json({
                message: 'No CEO was found'
            });
        else
            return res.status(200).json(ceos);
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