const oracledb = require('../models/Oracle');
let boardsql = {
    insert: ' insert into board2(bno, title, userid, contents) values(bno.nextval, :1, :2, :3) ',
    select: ' select bno, title, userid, views, ' +
            ` to_char(regdate, 'YYYY-MM-DD') regdate ` +
            'from board2 order by bno desc',
    selectOne: ' select board2.*, ' +
                `to_char(regdate, 'YYYY-MM-DD HH24:MI:SS') ` +
                ' regdate2 from board2 where bno = :1 ',
    viewOne: ' update board2 set views = views + 1 where bno = :1 ',
    update: ' update board2 set title = :1 , contents = :2, ' +
            ' regdate = current_timestamp where bno = :3 ',
    delete: ' delete from board2 where bno = :1 '


}

class Board {

    constructor(bno, title, userid, regdate, contents, views) {
        this.bno = bno;
        this.title = title;
        this.userid = userid;
        this.regdate = regdate;
        this.contents = contents;
        this.views = views;
    }

    async insert() { // 새글쓰기
        let conn = null;
        let params = [this.title, this.userid, this.contents];
        let insertcnt = 0;

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.insert, params);
            await conn.commit();
            if(result.rowsAffected > 0) insertcnt = result.rowsAffected;
        }catch(e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
        return insertcnt;
    }

    async select() { // 게시판 목록 출력
        let conn = null;
        let params = [];
        let bds = []; // 결과 저장용

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.select, params, oracledb.options);
            let rs = result.resultSet;
            let row = null;

            while ((row = await rs.getRow())){
                let bd = new Board(row.BNO, row.TITLE, row.USERID,
                            row.REGDATE, null, row.VIEWS);
                bds.push(bd);
            }
        }catch(e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
        return bds;
    }

    async selectOne(bno) { // 본문조회 생성자를 통해서 받지말고 직접매개변수로받음
        let conn = null;
        let params = [bno];
        let bds = [];

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.selectOne, params, oracledb.options);
            let rs = result.resultSet;
            let row = null;


            while((row = await rs.getRow())){
                let bd = new Board(row.BNO, row.TITLE, row.USERID,
                    row.REGDATE2, row.CONTENTS, row.VIEWS);
                bds.push(bd);
            }
            await conn.execute(boardsql.viewOne, params); // 조회수 증가!
            conn.commit(); // 커밋까지!
        }catch(e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
        return bds;
    }

    async update(bno) {
        let conn = null;
        let params = [this.title, this.contents, bno];
        let updateCnt = 0;


        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.update, params);
            await conn.commit();
            if(result.rowsAffected > 0) updateCnt = result.rowsAffected;
        }catch(e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
        return updateCnt;
    }

    async delete(bno) {
        let conn = null;
        let params = [bno];
        let deletecnt = 0;

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.delete, params);
            await conn.commit();
            if(result.rowsAffected>0) deletecnt = result.rowsAffected;
        }catch(e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
        return deletecnt;
    }

}
module.exports = Board;
