const express       = require('express');
const router        = express.Router();

const ceoAPI        = require('./controllers/ceo.controller');
const userAPI       = require('./controllers/user.controller');
const pcBangAPI     = require('./controllers/pcBang.controller');
const pcMapAPI      = require('./controllers/pcMap.controller');


// CEO API
router.get('/ceo/getAll', ceoAPI.getAllCeo);
router.delete('/ceo/delete/:ceoId', ceoAPI.deleteCeo);

// User API
router.get('/user/getAll', userAPI.getAllUser);
router.post('/user/signUp', userAPI.postSignUser);

// PCBang API
router.get('/pcBang/getAll', pcBangAPI.getAllPCBang);
router.post('/pcBang/create/:ceoId', pcBangAPI.postCreatePCBang);
router.get('/pcBang/getDetail/:pcBangId', pcBangAPI.getPCBangDetail);
router.delete('/pcBang/delete/:pcBangId', pcBangAPI.deletePCBang);

// PCMap API
router.get('/pcMap/status/:pcBangId', pcMapAPI.getPCStatus);
router.get('/pcMap/list/:pcBangId', pcMapAPI.getPCMapList);
router.post('/pcMap/create/:pcBangId', pcMapAPI.postCreatePCMap);
router.put('/pcMap/update/:pcBangId', pcMapAPI.putUpdatePCMap);
router.delete('/pcMap/delete/:pcBangId', pcMapAPI.deletePCMap);

module.exports = router;