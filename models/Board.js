const oracledb = require('../models/Oracle');
const ppg = 15; // 전역변수로 쓰면 더 편리하게 쓸 수 있어. 지금은 허술?
let boardsql = {
    insert: ' insert into board2(bno, title, userid, contents) values(bno.nextval, :1, :2, :3) ',
    select: ' select bno, title, userid, views, ' +
            ` to_char(regdate, 'YYYY-MM-DD') regdate ` +
            'from board2 order by bno desc',

    paging1: ` select * from (select bno, title, userid, views, to_char(regdate, 'YYYY-MM-DD') regdate, `
            + ` row_number() over (order by bno desc) rowno from board2 `,
    paging2: ` ) bd2 where rowno >= :1 and rowno < :2 `,

    selectOne: ' select board2.*, ' +
                `to_char(regdate, 'YYYY-MM-DD HH24:MI:SS') ` +
                ' regdate2 from board2 where bno = :1 ',
    selectCount: ' select count(bno) cnt from board2 ',
    viewOne: ' update board2 set views = views + 1 where bno = :1 ',
    update: ' update board2 set title = :1 , contents = :2, ' +
            ' regdate = current_timestamp where bno = :3 ',
    delete: ' delete from board2 where bno = :1 '


}
// 동적쿼리 생성 함수
const makeWhere = (ftype, fkey) => {
    let where = ` where title = '${fkey}' `;
    if(ftype == 'userid') where = ` where userid = '${fkey}' `;
    else if(ftype == 'contents') where = ` where contents like '%${fkey}%' `; // contents는 =으로 검색 안되니 like %로 한다!
    return where;
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

    async select(stnum, ftype, fkey) { // 게시판 목록 출력
        let conn = null;
        let params = [stnum, stnum + ppg];
        let bds = []; // 결과 저장용
        let allcnt = -1;
        let where = '';

        if(fkey != undefined) where = makeWhere(ftype, fkey); // 밖에서 만들어오면 좋지만 개념자체는 동적쿼리니까 sql문에 넣었습니다.

        try{
            conn = await oracledb.makeConn();
            allcnt = await this.selectCount(conn, where); // 총 게시글 수 계산
            let idx = allcnt - stnum + 1;
            /**
             * select * from (select board2.*, row_number() over (order by bno desc) rowno from board2 where title = '오로라')
             * bd2 where rowno >=11 and rowno <16;
            */
                // makeWhere(ftype, fkey)(
            let result = await conn.execute(boardsql.paging1 + where + boardsql.paging2, params, oracledb.options);
            //파라미터는 값만 가져올 수 잇어. :1, :2 등. 컬럼명 자체를 매개변수로 받아올순 없다.
            let rs = result.resultSet;
            let row = null;

            while ((row = await rs.getRow())){
                let bd = new Board(row.BNO, row.TITLE, row.USERID,
                            row.REGDATE, null, row.VIEWS);
                bd.idx = idx--; // 글번호 컬럼
                bds.push(bd);
            }
        }catch(e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
        let result ={'bds': bds, 'allcnt': allcnt}
        return result;
    }
    async selectCount(conn, where) { // 총 게시물 수 계산
        let params = [];
        let cnt = -1; // 결과 저장용
        try{
            let result = await conn.execute(boardsql.selectCount + where, params, oracledb.options);
            let rs = result.resultSet;
            let row = null;
            if ((row = await rs.getRow())) cnt = row.CNT;
        }catch(e){
            console.log(e);
        }

        return cnt;
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
