const oracledb = require('../models/Oracle');
let membersql = {
    insertsql : ' insert into member(mno, userid, passwd, name, email) ' +
                 ' values (mno.nextval, :1, :2, :3, :4) ',
    loginsql : ' select count(userid) cnt from member ' +  // count(*) 하지마. 아이디/비번 중 뭐 틀렸는지 애매하게 돌려주기
                'where userid = :1 and passwd = :2 ',
}

class Member {

    constructor(userid, passwd, name, email) {
        this.userid = userid;
        this.passwd = passwd;
        this.name = name;
        this.email = email;
    }
    // 회원 정보 저장
    async insert(){
        let conn = null;
        let params = [this.userid, this.passwd, this.name, this.email];
        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(membersql.insertsql, params);
            await conn.commit();
            if(result.rowsAffected > 0) console.log('회원정보 저장 성공!'); // 회원정보가 생기면, 콘솔출력
            console.log(result);
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn(conn);
        }
    }

    async selectOne(uid, pwd) { // 로그인 처리
        let conn = null;
        let params = [uid, pwd];

        let isLogin = 0;

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(membersql.loginsql, params, oracledb.options);
            let rs = result.resultSet;
            let row = null;

            while((row = await rs.getRow())){
                isLogin = row.CNT;
            }
            conn.commit();
        }catch(e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
        return isLogin;
    }

    // 멤버 전체조회

    // 멤버 상세조회

}
module.exports = Member;