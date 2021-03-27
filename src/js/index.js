/**
 * CHECK LIST
 * @version 1.1.0
 */

const TODO_DATA = 'todo_data';

const todoData = loadStorageData();
const todoList = document.getElementById('todo-list');
const itemAddButton = document.getElementById('add-btn');

// [D] Light Box
const lightBox = document.getElementById('light-box');
const lightBoxCloseBtn = document.querySelectorAll('.js-close');
const lightBoxSaveBtn = document.querySelector('.js-save');
const lightBoxDeleteBtn = document.querySelector('.js-delete');
const lightBoxInput = document.getElementById('light-box-input');

// [D] Toast Popup 
const toastPopup = document.getElementById('toast-popup');

setList(todoData);

itemAddButton.addEventListener('click', () => showLightBox('add'));

Array.from(lightBoxCloseBtn).map((v) => {
    v.addEventListener('click', hideLightBox);
});

lightBoxSaveBtn.addEventListener('click', handlerPopupSave);
lightBoxDeleteBtn.addEventListener('click', handlerDelete);
lightBoxInput.addEventListener('keypress', ({ key }) => {
    if (key === 'Enter') {
        handlerPopupSave();
    }
})


function setList(data) {
    if (todoList.childElementCount >= 1 ) {
        todoList.innerHTML = '';
    }

    data.map((v) => {
        todoList.appendChild(createItem(v));
    });
}

function createItem(data) {
    const wrap = document.createElement('div');
    const checkboxWrap = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const textInput = document.createElement('input');

    const copyBtn = document.createElement('button');
    const copyBtnIcon = document.createElement('img');

    checkbox.type = 'checkbox';
    checkbox.id = 'chk-' + data.id;
    checkbox.checked = data.isChecked;
    label.setAttribute('for', 'chk-' + data.id);
    checkboxWrap.classList.add('checkbox-wrap');
    if (data.isChecked) {
        checkboxWrap.classList.add('checked');
    }
    checkboxWrap.appendChild(checkbox);
    checkboxWrap.appendChild(label);
    
    textInput.dataset.id = data.id;
    textInput.value = data.text;
    textInput.setAttribute('readonly', true);
    textInput.classList.add('item-text');

    copyBtnIcon.src = 'public/img/icon_copy.png';
    copyBtn.classList.add('copy-btn');
    copyBtn.appendChild(copyBtnIcon);

    wrap.appendChild(checkboxWrap);
    wrap.appendChild(textInput);
    wrap.appendChild(copyBtn);

    if (data.isChecked) {
        wrap.classList.add('checked');   
    }

    textInput.addEventListener('click', ({ target }) => showLightBox('edit', target));
    checkbox.addEventListener('change', handlerChangeChk);
    copyBtn.addEventListener('click', handlerCopy);

    return wrap;
}

function handlerCopy(e) {
    const target = e.target.parentNode.previousSibling;
    target.select();
    document.execCommand("copy");

    showToastPopup('복사 완료');
}

function handlerPopupSave() {
    if (lightBox.classList.contains('add')) {
        handlerAdd();
    }

    if (lightBox.classList.contains('edit')) {
        handlerEdit();
    }
}

function saveStorageData() {
    console.log('saveStorageData');
    const str = JSON.stringify(todoData);
    console.log('str', str);
    
    localStorage.setItem(TODO_DATA, str);
}

function loadStorageData() {
    const item = localStorage.getItem(TODO_DATA) || '[]';
    return JSON.parse(item);
}

function handlerAdd() {
    const val = lightBoxInput.value;
    const idx = todoData.length - 1;

    // [D] DB 연동시에는 id 생성하는 부분 삭제
    const addId = todoData[idx] ? todoData[idx].id + 1 : 0;
    
    if (!val || !val.trim()) {
        return alert('텍스트를 입력해주세요.');
    }

    addItem(addId, val);

    lightBoxInput.value = '';

    hideLightBox();
    saveStorageData();
    showToastPopup('추가 완료');
}

function handlerEdit() {
    const id = lightBoxInput.dataset.id;
    const val = lightBoxInput.value;
    const target = getTargetElement(id);

    if (!val || !val.trim()) {
        return alert('텍스트를 입력해주세요.');
    }

    target.value = val;

    editItem(id, val);

    hideLightBox();
    saveStorageData();
    showToastPopup('수정 완료');
}

function handlerDelete() {
    const id = lightBoxInput.dataset.id;

    deleteItem(id);
    hideLightBox();
    saveStorageData();
    showToastPopup('삭제 완료');
}

function addItem(id, val) {
    let data = {};

    data = {
        id: id,
        isChecked: false,
        text: val,
    };

    todoData.push(data);
    todoList.appendChild(createItem(data));
}

function editItem(id, val) {
    todoData.map((v) => {
        if (v.id === Number(id)) {
            v.text = val;
        }
    });
}

function deleteItem(id) {
    const target = getTargetElement(id).parentNode;

    target.parentNode.removeChild(target);
    
    todoData.map((v, i) => {
        if (v.id === Number(id)) {
            todoData.splice(i, 1);
        }
    });
}

function getTargetElement(id) {
    const targets = document.querySelectorAll('.item-text');

    return Array.from(targets)
                .filter((v) => v.dataset.id === id)[0];
}

function handlerChangeChk({ target }) {
    const id = Number(target.id.split('chk-')[1]);
    const targetData = todoData.find((v) => v.id === id);

    if (!targetData) return;
    const { parentNode } = target;
    targetData.isChecked = !targetData.isChecked; 

    parentNode.classList.toggle('checked', targetData.isChecked);
    saveStorageData();
}

function showToastPopup(message) {
    console.log('showToastPopup', message);

    toastPopup.innerText = message;
    toastPopup.classList.add('active');

    setTimeout(() => {
        closeToastPopup();
    }, 1000);
}

function closeToastPopup() {
    console.log('closeToastPopup');
    toastPopup.classList.remove('active');
}

/**
 * 팝업 show
 * @param {string} className - add / edit 
 */
function showLightBox(className, target) {
    lightBoxSaveBtn.innerText = className === 'add' ? '저장' : '수정';

    if (className === 'edit') {
        if (!target) {
            return console.error('target 이 없습니다.');
        }

        lightBoxInput.dataset.id = target.dataset.id;
        lightBoxInput.value = target.value;
    }

    lightBox.classList.add('opened', className);
    lightBoxInput.focus();
}

/** 팝업 hide */
function hideLightBox() {
    if (lightBox.classList.contains('add')) {
        lightBox.classList.remove('add');
    }

    if (lightBox.classList.contains('edit')) {
        lightBox.classList.remove('edit');
        lightBoxInput.removeAttribute('data-id');
    }

    lightBoxInput.value = '';
    lightBox.classList.remove('opened');
}


// TODO: 
// -  Empty Data