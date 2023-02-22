const getGugun = () => {
    let url = '?sido=' + sido.value;
    location.href = url;

}
const getDong = () => {
}

let sido = document.querySelector('#sido');
let gugun = document.querySelector('#gugun');
let dong = document.querySelector('#dong');

// 서버에서 넘겨받은 값 셋팅. 서버가 sido가 넘어왔을 때

sido?.addEventListener('change', getGugun);





