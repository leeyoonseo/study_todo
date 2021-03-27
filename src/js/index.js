/**
 * CHECK LIST
 * @version 1.1.0
 */

const TODO_DATA = 'todo_data';

let todoData = loadStorageData();
const todoList = document.getElementById('todo-list');
const listAddBtn = document.getElementById('add-btn');
const listDeleteBtn = document.getElementById('delete-btn');
const listDeleteCloseBtn = document.getElementById('close-btn');
const listDeleteSaveBtn = document.getElementById('delete-save-btn');

// [D] Light Box
const lightBox = document.getElementById('light-box');
const lightBoxCloseBtn = document.querySelectorAll('.js-close');
const lightBoxSaveBtn = document.querySelector('.js-save-item');
const lightBoxDeleteBtn = document.querySelector('.js-delete-item');
const lightBoxInput = document.getElementById('light-box-input');

// [D] Toast Popup 
const toastPopup = document.getElementById('toast-popup');

listAddBtn.addEventListener('click', () => showLightBox('add'));
listDeleteBtn.addEventListener('click', () => {
    toggleDeleteMode();
});

listDeleteCloseBtn.addEventListener('click', () => {
    toggleDeleteMode();
    setList(todoData);
});

listDeleteSaveBtn.addEventListener('click', handlerDeleteSave);

function handlerDeleteSave() {
    const targets = document.querySelectorAll('.item-text');
    let temp = [];

    for(let i = 0; i < todoData.length; i++) {
        for (let j = 0; j < targets.length; j++) {
            if(todoData[i].id === Number(targets[j].dataset.id)) {
                temp.push(todoData[i]);
                break;
            }
        }
    }

    todoData = temp;
    setList(todoData);
    toggleDeleteMode();
    saveStorageData();
}

function toggleDeleteMode() {
    const target = document.querySelector('.js-list-btns');
    target.classList.toggle('active', !target.classList.contains('active'));
    todoList.classList.toggle('mode-delete', target.classList.contains('active'));
}

Array.from(lightBoxCloseBtn).map((v) => {
    v.addEventListener('click', hideLightBox);
});

lightBoxSaveBtn.addEventListener('click', handlerLightBoxSave);
lightBoxDeleteBtn.addEventListener('click', handlerLightBoxDelete);
lightBoxInput.addEventListener('keypress', ({ key }) => {
    if (key === 'Enter') {
        handlerLightBoxSave();
    }
})

// [D] init
setList(todoData);

function setList(data) {
    todoList.innerHTML = '';

    setEmptyData();

    data.map((v) => {
        todoList.appendChild(createItem(v));
    });
}

function setEmptyData() {
    if (todoData < 1) {
        createEmptyData();
    } else {
        removeEmptyData();
    }
}
function createEmptyData() {
    const icon = document.createElement('img');
    const text = document.createElement('span');
    const iconWrap = document.createElement('div');

    icon.src = 'public/img/icon_cloud-pink.png';
    text.innerText = 'No data';

    iconWrap.classList.add('empty-icon');
    iconWrap.id = 'js-empty-icon';

    iconWrap.appendChild(icon);
    iconWrap.appendChild(text);
    todoList.appendChild(iconWrap);
}

function removeEmptyData(){
    const target = document.getElementById('js-empty-icon');

    if (!target) return;

    target.parentNode.removeChild(target);
}

function createItem(data) {
    const { id, isChecked, text } = data;

    const wrap = document.createElement('div');
    const checkboxWrap = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const textInput = document.createElement('input');

    const copyBtn = document.createElement('button');
    const copyBtnIcon = document.createElement('img');

    checkbox.type = 'checkbox';
    checkbox.id = 'chk-' + id;
    checkbox.checked = isChecked;
    label.setAttribute('for', 'chk-' + id);
    checkboxWrap.classList.add('checkbox-wrap');
    isChecked && checkboxWrap.classList.add('checked');
    
    textInput.dataset.id = id;
    textInput.value = text;
    textInput.setAttribute('readonly', true);
    textInput.classList.add('item-text');

    copyBtnIcon.src = 'public/img/icon_copy.png';
    copyBtn.classList.add('item-copy-btn');

    wrap.classList.add('list-item');
    
    checkboxWrap.appendChild(checkbox);
    checkboxWrap.appendChild(label);
    copyBtn.appendChild(copyBtnIcon);
    wrap.appendChild(checkboxWrap);
    wrap.appendChild(textInput);
    wrap.appendChild(copyBtn);

    textInput.addEventListener('click', ({ target }) => {
        if (todoList.classList.contains('mode-delete')) return;
        showLightBox('edit', target);
    });

    wrap.addEventListener('click', (e) => {
        if (!todoList.classList.contains('mode-delete')) return;
        handlerDelete(e);
    });

    checkbox.addEventListener('change', handlerChangeChk);
    copyBtn.addEventListener('click', handlerCopy);

    return wrap;
}

function handlerDelete(e) {
    let target = e.target;

    if (target.nodeName !== 'DIV') {
        target = target.parentNode;
    }

    // const input = Array.from(target.childNodes).filter((v) => v.nodeName === 'INPUT')[0];
    // const id = input.dataset.id;

    target.parentNode.removeChild(target);
}

function handlerCopy(e) {
    let parent = e.target.parentNode;

    if (parent.nodeName !== 'DIV') {
        parent = parent.parentNode;
    }

    const target = Array.from(parent.childNodes).filter((v) => v.nodeName === 'INPUT')[0];
    target.select();
    document.execCommand("copy");

    showToastPopup('복사 완료');
}

function handlerLightBoxSave() {
    if (lightBox.classList.contains('add')) {
        handlerAdd();
    }

    if (lightBox.classList.contains('edit')) {
        handlerLightBoxEdit();
    }
}

function saveStorageData() {
    localStorage.setItem(TODO_DATA, JSON.stringify(todoData));
}

function loadStorageData() {
    return JSON.parse(localStorage.getItem(TODO_DATA) || '[]');
}

function handlerAdd() {
    const val = lightBoxInput.value;
    const idx = todoData.length - 1;
    const addId = todoData[idx] ? todoData[idx].id + 1 : 0;
    
    if (!val || !val.trim()) {
        return alert('텍스트를 입력해주세요.');
    }

    addItem(addId, val);

    lightBoxInput.value = '';

    hideLightBox();
    saveStorageData();
    showToastPopup('추가 완료');
    setEmptyData();
}

function handlerLightBoxEdit() {
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

function handlerLightBoxDelete() {
    const id = lightBoxInput.dataset.id;

    deleteItem(id);
    hideLightBox();
    saveStorageData();
    showToastPopup('삭제 완료');
    setEmptyData();
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
    toastPopup.innerText = message;
    toastPopup.classList.add('active');

    setTimeout(() => {
        closeToastPopup();
    }, 1000);
}

function closeToastPopup() {
    toastPopup.innerText = '';
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