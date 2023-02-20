const processWrite = () => {
    let frm = document.write;

    if (frm.title.value === '') alert('제목?');
    else if (frm.contents.value === '') alert('본문?');
    else if (frm.uid.value !== ''){
        frm.method = 'post';
        frm.submit();
    }
};

let writebtn = document.querySelector('#writebtn');
writebtn.addEventListener('click', processWrite);