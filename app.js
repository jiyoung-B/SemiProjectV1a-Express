// express 모듈과 기타 미들웨어 모듈 사용 선언
const express = require('express');
const path = require('path');
const logger = require('morgan');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser'); // 폼 처리기
const session = require('express-session');
const oracledb = require('./models/Oracle');

// 라우팅 모듈 설정
const indexRouter = require('./routes/index');
const memberRouter = require('./routes/member');
const boardRouter = require('./routes/board');
const zipcodeRouter = require('./routes/zipcode');
const zipcode2Router = require('./routes/zipcode2');

// express 객체 생성 및 포트 변수 선언
const app = express();
const port = process.env.PORT || 3000; // 환경변수로 포트가 설정되어 있지않으면 3000번 사용


// 템플릿 엔진 등록 및 설정
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'layout',
    helpers: require('./helpers/handlebars-helper'),
}));
app.set('views', path.join(__dirname, 'views')); // 디렉토리 만들기
app.set('view engine', 'hbs');

// 세션
const maxAge = 1000 * 30; // 유지시간
const sessionObj = { // 세션 정보 저장한 객체 생성
    resave: false, saveUninitialized: false,
    secret: 'process.env.COOKIE_SECRET', // 양념친 솔트키
    cookie: { httpOnly: true, secure: false, }, // 배포시에는 secure : true
    name: 'session-cookie',
    maxAge: maxAge
};
app.use(session(sessionObj));

// 라우팅 없이 바로 호출 가능하도록 static 폴더 설정
app.use(express.static(path.join(__dirname, 'static')));

// 서버 작동 현황 표시 - 로그 출력
app.use(logger('dev'));

// 미들웨어 관련 설정
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

oracledb.initConn();

// 생성한 세션을 모든 페이지에서 접근 가능하게 함
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

// 라우팅 모듈 등록 - 클라이언트 요청 처리 핵심 파트
app.use('/', indexRouter);
app.use('/member', memberRouter);
app.use('/board', boardRouter);
app.use('/zipcode', zipcodeRouter);
app.use('/zipcode2', zipcode2Router);

// 404, 500 응답코드에 대한 라우팅 처리 정의
app.use((req, res) => {
    res.status(404);
   // res.send(path.join(__dirname, 'public', '404.html'));
    res.send('404 - 페이지가 없어요!');
});

app.use((err, req, res, next) => {
    console.log(err); // 오류메세지 출력
    res.status(500);
    res.send(path.join('500-서버 내부 오류 발생했어요!'));
});

// 위에서 설정한 사항을 토대로 express 서버 실행
app.listen(port, () => {
    console.log('SemiProjectV1a 서버 실행중 ...')
})


