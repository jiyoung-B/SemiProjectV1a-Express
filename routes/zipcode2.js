const express = require('express');
const Board = require("../models/Board");
const router = express.Router();
const Zipcode = require('../models/Zipcode');

router.get('/', async (req, res) => {
    let sido = req.query.sido;
    let gugun = req.query.gugun;
    let dong = req.query.dong;
    let [guguns, dongs, zips] = [null, null, null];

    let sidos = new Zipcode().getSido().then((sido) => sido);
    //console.log(await sidos);
    if(sido !== undefined) // 시구군 검색
        guguns = new Zipcode().getGugun(sido).then((gugun) => gugun);
    //console.log(await guguns);
    if(sido !== undefined && gugun !== undefined) // 읍면동 검색
        dongs = new Zipcode().getDong(sido, gugun).then((dong) => dong);
    //console.log(await dongs);
    if(sido !== undefined && gugun !== undefined && dong !== undefined) // 우편번호 검색
        zips = new Zipcode().getZipcode(sido, gugun, dong).then((zip)=>zip)


    res.render('zipcode', {title: '시군구동 찾기',
        sidos: await sidos, guguns: await guguns, dongs: await dongs,// 얘는 sql값????
        sido : sido,  gugun: gugun, dong: dong, zips: await zips}); // 조회해서 선택한 값이 넘어감
});


module.exports = router