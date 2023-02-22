const express = require('express');
const Board = require("../models/Board");
const router = express.Router();
const Zipcode = require('../models/Zipcode');

router.get('/', async (req, res) => {
    res.render('zipcode2', {title: '시구군동 찾기 v2'})
});

router.get('/sido', async (req, res) => {
    let sidos = new Zipcode().getSido().then((sido) => sido);
    res.send(JSON.stringify(await sidos)); // 조회결과를 JSON형식으로 전송
});
// path variable
// REST API에서 사용하는 방식으로 경로를 변수처럼 사용하는 기법
// express 프레임워크에서 /:변수명 형식으로 사용하고
// 변수 값을 가져오려면 req.params.변수명을 사용함
router.get('/gugun/:sido', async (req, res) => {
    let sido = req.params.sido;
    let guguns = new Zipcode().getGugun(sido).then((gugun) => gugun);
    res.send(JSON.stringify(await guguns));
});

router.get('/dong/:sido/:gugun', async (req, res) => {
    let sido = req.params.sido;
    let gugun = req.params.gugun;
    let dongs = new Zipcode().getDong(sido, gugun).then((dong) => dong);
    res.send(JSON.stringify(await dongs));
});

router.get('/zip/:sido/:gugun/:dong', async (req, res) => {
    let sido = req.params.sido;
    let gugun = req.params.gugun;
    let dong = req.params.dong;
    let zips = new Zipcode().getZipcode(sido, gugun, dong).then((zip) => zip);
    res.send(JSON.stringify(await zips));
});


module.exports = router