const processJoin = () => {
    let frm = document.join;

    if (frm.uid.value === '') alert('아이디?');
    else if (frm.pwd.value === '') alert('비밀번호?');
    else if (frm.repwd.value === '') alert('비밀번호확인?');
    else if (frm.name.value === '') alert('이름?');
    else if (frm.email.value === '') alert('이메일?');
    else {
        frm.method = 'post';
        frm.submit();
    }

};

let joinbtn = document.querySelector('#joinbtn');
joinbtn.addEventListener('click', processJoin);