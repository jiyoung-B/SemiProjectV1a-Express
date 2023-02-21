const express = require('express');
const path = require('path');
const Member = require('../models/Member');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('member', {title: 'member'});
});

router.get('/join', (req, res) => {
    res.render('join', {title: '회원가입'});
});
router.post('/join',  (req, res, next) => {
    // 폼으로 전송된 데이터들은 req.body, req.body.폼이름 등으로 확인 가능
     console.log(req.body);
     //console.log(req.body.uid, req.body.name, req.body.email);
   let {uid, pwd, pwd2, name, email} = req.body; // 변수의 개수가 맞아야해.
    console.log(uid, pwd, name, email);
    new Member(uid, pwd, name, email).insert();

    res.redirect(303, '/member/login');
});

router.get('/login', (req, res) => {
    res.render('login', {title: '회원로그인'});
});

router.post('/login', async(req, res) => {
    let { uid, pwd} = req.body;
    let viewName = '/member/loginfail';
    let isLogin = new Member().login(uid, pwd).then(result => result);
    // console.log(await isLogin); // 로그인 가능한 값은 1, 비정상은 0
    if (await isLogin > 0 ){
        viewName = '/member/myinfo'
        req.session.userid = uid; // 입력받은 아이디를 세션변수로 등록
    }
    res.redirect(303, viewName);
    //res.render('login', {title: '회원로그인'});
});

router.get('/logout', (req, res) => {
    req.session.destroy( () => req.session);
    res.redirect(303, '/');
});

router.get('/myinfo', async (req, res) => {
    if(req.session.userid){ // 세션변수 userid가 존재한다면
        let member = new Member().selectOne(req.session.userid).then((mb) => mb);
        res.render('myinfo', {title: '회원정보', mb: await member});
    }else {
        res.redirect(303, '/member/login');
    }
});

module.exports = router;