const oracledb = require('./Oracle');
zipcodesql = {
    sidosql : ' select distinct sido from ZIPCODE2013 order by sido ',
    gugunsql : ' select distinct gugun from ZIPCODE2013 where sido = :1 order by gugun ',
    dongsql : ' select distinct dong from ZIPCODE2013 where sido = :1 and gugun = :2 order by dong ',
    zipsql : ' select * from ZIPCODE2013 where sido = :1 and gugun = :2 and dong = :3 order by zipcode '

}
class Zipcode {
    constructor() {
    }
    // sidosql : ' select distinct sido from ZIPCODE2013 order by sido ',
    async getSido(){
        let conn = null;
        let params = [];
        let sidos = [];

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.sidosql, params, oracledb.options)
            let rs = result.resultSet;

            let row = null;
            while ((row = await rs.getRow())){
                let sido = {'sido': row.SIDO}; // 값이 작으니까 생성자 안 통하고 그냥 값을 넣었어.
                // let sido = new Zipcode(row.SIDO);
                sidos.push(sido);
            }
        } catch (e){
            console.log(e)
        } finally {
            await oracledb.closeConn(conn);
        }
        return sidos;
    }
    async getGugun(sido) {
        let conn = null;
        let params = [sido];
        let guguns = [];

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.gugunsql, params, oracledb.options);
            let rs = result.resultSet;

            let row = null
            while ((row = await rs.getRow())) {
                let gugun = {'gugun': row.GUGUN}
                guguns.push(gugun);
            }
        } catch (e) {
            console.log(e)
        } finally {
            await oracledb.closeConn(conn);

        }
        return guguns;
    }
    async getDong(sido, gugun) {
        let conn = null;
        let params = [sido, gugun];
        let dongs = [];

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.dongsql, params, oracledb.options);
            let rs = result.resultSet;

            let row = null
            while ((row = await rs.getRow())) {
                let dong = {'dong': row.DONG};
                dongs.push(dong);
            }
        } catch (e) {
            console.log(e)
        } finally {
            await oracledb.closeConn(conn);

        }
        return dongs;
    }
    async getZipcode(sido, gugun, dong) {
        let conn = null;
        let params = [sido, gugun, dong];
        let zips = [];

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.zipsql, params, oracledb.options);
            let rs = result.resultSet;

            let row = null
            while ((row = await rs.getRow())) {
                let zip = {'zipcode': row.ZIPCODE, 'sido' : row.SIDO,
                'gugun': row.GUGUN, 'dong': row.DONG, 'ri':row.RI,
                'bunji': row.BUNJI};
                zips.push(zip);
            }
        } catch (e) {
            console.log(e)
        } finally {
            await oracledb.closeConn(conn);
        }
        return zips;
    }

};

module.exports = Zipcode;