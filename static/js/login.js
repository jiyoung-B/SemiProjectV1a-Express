let frm = document.login;
const processLogin = () => {

    if (frm.uid.value === '') alert('아이디는?');
    else if (frm.pwd.value === '') alert('비번은?');
    else {
        frm.method = 'post';
        frm.submit();
    }
};

let loginbtn = document.querySelector('#loginbtn');
loginbtn.addEventListener('click', processLogin);