const makeopt = (elm, text) => {
    let opt = document.createElement('option');
    let txt = document.createTextNode(text);
    opt.appendChild(txt);
    elm.appendChild(opt);
};
const makeAddr = (elm, text) => {
    let p = document.createElement('p');
    let txt = document.createTextNode(text);
    p.appendChild(txt);
    elm.appendChild(p);
};
const setSido = (sidos) => {
    let objs = JSON.parse(sidos); // 문자열 => 객체로 바꿈
    objs.forEach(obj => {
        makeopt(sido, obj.sido);
    })
};
const getSido = () => {
    fetch('/zipcode2/sido')
        .then(response => response.text())
        .then(text => setSido(text));
};
const setGugun = (guguns) => {
    let objs = JSON.parse(guguns); // 문자열 => 객체로 바꿈

    while(gugun.lastChild){
        gugun.removeChild(gugun.lastChild);
    }
    makeopt(gugun, '-- 시군구 --');
    objs.forEach(obj => {
        makeopt(gugun, obj.gugun);
    })
}
const getGugun = () => {
    fetch(`/zipcode2/gugun/${sido.value}`)     /***주의****/
        .then(response => response.text())
        .then(text => setGugun(text));
};
const setDong = (dongs) => {
    let objs = JSON.parse(dongs); // 문자열 => 객체로 바꿈

    while(dong.lastChild){
        dong.removeChild(dong.lastChild);
    }
    makeopt(dong, '-- 읍면동 --');
    objs.forEach(obj => {
        makeopt(dong, obj.dong);
    })
}
const getDong = () => {
    fetch(`/zipcode2/dong/${sido.value}/${gugun.value}`)
        .then(response => response.text())
        .then(text => setDong(text));
};

const setZipcode = (zips) => {
    let objs = JSON.parse(zips); // 문자열 => 객체로 바꿈

    while(zipcode.lastChild){
        zipcode.removeChild(zipcode.lastChild);
    }

    objs.forEach((obj, idx) => {
        let addr = `${obj.zipcode} ${obj.sido} ${obj.gugun}` +
                    `${obj.dong} ${obj.ri} ${obj.bunji}`;
        makeAddr(zipcode, addr);
    })

}
const getZipcode = () => {
    fetch(`/zipcode2/zip/${sido.value}/${gugun.value}/${dong.value}`)
        .then(response => response.text())
        .then(text => setZipcode(text));
};

let sido = document.querySelector('#sido');
let gugun = document.querySelector('#gugun');
let dong = document.querySelector('#dong');
let zipcode = document.querySelector('#zipcode');


sido.addEventListener('change', getGugun);
gugun.addEventListener('change', getDong);
dong.addEventListener('change', getZipcode);

getSido();


