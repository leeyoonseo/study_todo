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
    changeMode();
});

listDeleteCloseBtn.addEventListener('click', () => {
    changeMode();
    setList(todoData);
});

listDeleteSaveBtn.addEventListener('click', onClickListSave);

Array.from(lightBoxCloseBtn).map((v) => {
    v.addEventListener('click', hideLightBox);
});

lightBoxSaveBtn.addEventListener('click', onClickLightBoxSave);
lightBoxDeleteBtn.addEventListener('click', onClickLightBoxDelete);
lightBoxInput.addEventListener('keypress', ({ key }) => {
    if (key === 'Enter') {
        onClickLightBoxSave();
    }
})

// [D] init
setList(todoData);

function onClickItemWrap(e) {
    let target = e.target;

    if (target.nodeName !== 'DIV') {
        target = target.parentNode;
    }

    target.parentNode.removeChild(target);
}

function onClickItemCopy(e) {
    let parent = e.target.parentNode;

    if (parent.nodeName !== 'DIV') {
        parent = parent.parentNode;
    }

    const target = Array.from(parent.childNodes).filter((v) => v.classList.contains('item-text'))[0];
    const tempElem = document.createElement('textarea');
    
    document.body.appendChild(tempElem);
    tempElem.value = target.innerText;
    tempElem.select();
    document.execCommand("copy");

    showToastPopup('복사 완료');
    document.body.removeChild(tempElem);
}

function onClickLightBoxSave() {
    if (lightBox.classList.contains('add')) {
        handlerAddItem();
    }

    if (lightBox.classList.contains('edit')) {
        handlerEditItem();
    }
}

function handlerAddItem() {
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

function handlerEditItem() {
    const id = lightBoxInput.dataset.id;
    const val = lightBoxInput.value;
    const target = findTarget(id);

    if (!val || !val.trim()) {
        return alert('텍스트를 입력해주세요.');
    }

    target.innerText = val;

    editItem(id, val);

    hideLightBox();
    saveStorageData();
    showToastPopup('수정 완료');
}

function onClickLightBoxDelete() {
    const id = lightBoxInput.dataset.id;

    deleteItem(id);
    hideLightBox();
    saveStorageData();
    showToastPopup('삭제 완료');
    setEmptyData();
}

function onClickListSave() {
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
    changeMode();
    saveStorageData();
}

function onClickItemCheckbox({ target }) {
    const id = Number(target.id.split('chk-')[1]);
    const targetData = todoData.find((v) => v.id === id);

    if (!targetData) return;

    const { parentNode } = target;
    targetData.isChecked = !targetData.isChecked; 

    parentNode.classList.toggle('checked', targetData.isChecked);
    saveStorageData();
}

function setList(data) {
    todoList.innerHTML = '';

    setEmptyData();

    data.map((v) => {
        todoList.appendChild(createItemElements(v));
    });
}

function createItemElements(data) {
    const { id, isChecked, text } = data;

    const wrap = document.createElement('div');
    const checkboxWrap = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const todoText = document.createElement('span');

    const copyBtn = document.createElement('button');
    const copyBtnIcon = document.createElement('img');

    checkbox.type = 'checkbox';
    checkbox.id = 'chk-' + id;
    checkbox.checked = isChecked;
    label.setAttribute('for', 'chk-' + id);
    checkboxWrap.classList.add('checkbox-wrap');
    isChecked && checkboxWrap.classList.add('checked');
    
    todoText.dataset.id = id;
    todoText.innerText = text;
    todoText.setAttribute('readonly', true);
    todoText.classList.add('item-text');

    copyBtnIcon.src = '../img/icon_copy.png';
    copyBtn.classList.add('item-copy-btn');

    wrap.classList.add('list-item');
    
    checkboxWrap.appendChild(checkbox);
    checkboxWrap.appendChild(label);
    copyBtn.appendChild(copyBtnIcon);
    wrap.appendChild(checkboxWrap);
    wrap.appendChild(todoText);
    wrap.appendChild(copyBtn);

    todoText.addEventListener('click', ({ target }) => {
        if (todoList.classList.contains('mode-delete')) return;
        showLightBox('edit', target);
    });

    wrap.addEventListener('click', (e) => {
        if (!todoList.classList.contains('mode-delete')) return;
        onClickItemWrap(e);
    });

    checkbox.addEventListener('change', onClickItemCheckbox);
    copyBtn.addEventListener('click', onClickItemCopy);

    return wrap;
}

function addItem(id, val) {
    let data = {};

    data = {
        id: id,
        isChecked: false,
        text: val,
    };

    todoData.push(data);
    todoList.appendChild(createItemElements(data));
}

function editItem(id, val) {
    todoData.map((v) => {
        if (v.id === Number(id)) {
            v.text = val;
        }
    });
}

function deleteItem(id) {
    const target = findTarget(id).parentNode;
    target.parentNode.removeChild(target);
    
    todoData.map((v, i) => {
        if (v.id === Number(id)) {
            todoData.splice(i, 1);
        }
    });
}

function findTarget(id) {
    const targets = document.querySelectorAll('.item-text');

    return Array.from(targets)
                .filter((v) => v.dataset.id === id)[0];
}

function changeMode() {
    const target = document.querySelector('.js-list-btns');
    target.classList.toggle('active', !target.classList.contains('active'));
    todoList.classList.toggle('mode-delete', target.classList.contains('active'));
}

/**
 * Empty Data
 */
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

    icon.src = '../img/icon_cloud-pink.png';
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

/**
 * Storage
 * @returns todoData
 */
function loadStorageData() {
    return JSON.parse(localStorage.getItem(TODO_DATA) || '[]');
}

function saveStorageData() {
    localStorage.setItem(TODO_DATA, JSON.stringify(todoData));
}

/**
 * Toast Popup
 * @param {string} message - 노출할 메세지
 */
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
 * Light Box
 * @param {string} className - add / edit 
 */
function showLightBox(className, target) {
    lightBoxSaveBtn.innerText = className === 'add' ? '저장' : '수정';

    if (className === 'edit') {
        if (!target) {
            return console.error('target 이 없습니다.');
        }

        lightBoxInput.dataset.id = target.dataset.id;
        lightBoxInput.value = target.innerText;
    }

    lightBox.classList.add('opened', className);
    lightBoxInput.focus();
}

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