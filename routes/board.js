const express = require('express');
const path = require('path');
const router = express.Router();
const Board = require('../models/Board');

router.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'board.html'));
    res.render('board', {title: '게시판'});
});

router.get('/list', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'list.html'));
    res.render('board/list', {title: '게시판 목록'});
});

router.get('/write', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'write.html'));
    res.render('board/write', {title: '게시판 새글쓰기'});
});

router.post('/write', async (req, res) => {
    let viewName = '/board/failWrite';
    let { title, uid, contents } = req.body;
    let rowcnt = new Board(null, title, uid, null, contents, null).insert().then((result) => result);
    if(await rowcnt > 0) viewName = '/board/list';
    console.log('로우카운트 : ' , rowcnt);
    res.redirect(303, viewName);
});
// 데이터받아다가, insert 에서 처리후, list 로 넘어가야겠죵

router.get('/view', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'view.html'));
    res.render('board/view', {title: '게시판 본문보기'});
});

router.get('/delete', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'delete.html'));
    res.render('delete', {title: '게시글 삭제'});
});

router.get('/update', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'update.html'));
    res.render('board/update', {title: '게시글 수정'});
});

module.exports = router;