const Ceo           = require('../../models/ceo');

const getAllCeo = (req, res) => { //모든 CEO 조회
    var selects = {
        'name': 1
    };

    Ceo.find({}, selects, (err, ceos) => {
        if(err)
            return res.status(404).end();
        else if(!ceos)
            return res.status(403).json({
                message: 'No ceo was found'
            });
        else
            return res.status(200).json(ceos);
    });
};

const deleteCeo = async function (req, res) { // CEO 삭제
    await Ceo.deleteCeoByKakaoID(req.params.ceoId);
    res.status(200).json({
        success: true
    });
};

module.exports = {
    getAllCeo, deleteCeo
};