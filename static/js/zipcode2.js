const makeopt = (elm, text) => {
    let opt = document.createElement('option');
    let txt = document.createTextNode(text);
    opt.appendChild(txt);
    elm.appendChild(opt);
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
    fetch('/zipcode2/gugun/' + sido.value)     /***주의****/
        .then(response => response.text())
        .then(text => setGugun(text));
};
const setDong = () => {
    let objs = JSON.parse(dongs); // 문자열 => 객체로 바꿈

    objs.forEach(obj => {
        makeopt(dong, obj.dong);
    })
}
const getDong = () => {
    fetch('/zipcode2/dong/:gugun/:sido')
        .then(response => response.text())
        .then(text => setDong(text));
};
const getZipcode = () => {
};

let sido = document.querySelector('#sido');
let gugun = document.querySelector('#gugun');
let dong = document.querySelector('#dong');

sido.addEventListener('change', getGugun);
gugun.addEventListener('change', getDong);
dong.addEventListener('change', getZipcode);

getSido();


