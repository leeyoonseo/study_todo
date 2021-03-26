/**
 * CHECK LIST
 * @version 1.1.0
 */

const TODO_DATA = 'todo_data';

const todoData = loadStorageData();
const todoList = document.getElementById('todo-list');
const itemAddButton = document.getElementById('add-btn');
const popup = document.getElementById('popup');
const popupCloseButton = document.querySelectorAll('.js-close');
const popupSaveButton = document.querySelector('.js-save');
const popupDeleteButton = document.querySelector('.js-delete');
const popupInput = document.getElementById('popup-input');

setList(todoData);

itemAddButton.addEventListener('click', () => showPopup('add'));

Array.from(popupCloseButton).map((v) => {
    v.addEventListener('click', hidePopup);
});

popupSaveButton.addEventListener('click', handlerPopupSave);
popupDeleteButton.addEventListener('click', deleteItem);
popupInput.addEventListener('keypress', ({ key }) => {
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

    textInput.addEventListener('click', ({ target }) => showPopup('edit', target));
    checkbox.addEventListener('change', handlerChangeChk);
    copyBtn.addEventListener('click', copyText);

    return wrap;
}

function copyText(e) {
    const target = e.target.parentNode.previousSibling;
    target.select();
    document.execCommand("copy");
}

function handlerPopupSave() {
    if (popup.classList.contains('add')) {
        addItem();
    }

    if (popup.classList.contains('edit')) {
        editItem();
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

function addItem() {
    console.log('addItem');
    let data = {};
    const val = popupInput.value;
    const idx = todoData.length - 1;

    // [D] DB 연동시에는 id 생성하는 부분 삭제
    const newId = todoData[idx] ? todoData[idx].id + 1 : 0;
    
    if (!val || !val.trim()) {
        return alert('텍스트를 입력해주세요.');
    }

    data = {
        id: newId,
        isChecked: false,
        text: val,
    };

    popupInput.value = '';

    todoData.push(data);
    todoList.appendChild(createItem(data));

    hidePopup();
    saveStorageData();
}

function editItem() {
    const id = popupInput.dataset.id;
    const val = popupInput.value;
    const target = getTargetElement(id);

    target.value = val;

    todoData.map((v) => {
        if (v.id === Number(id)) {
            v.text = val;
        }
    });

    hidePopup();
    saveStorageData();
}

function deleteItem() {
    const id = popupInput.dataset.id;
    const target = getTargetElement(id).parentNode;

    console.log('target', target.parentNode.removeChild(target));

    todoData.map((v, i) => {
        if (v.id === Number(id)) {
            todoData.splice(i, 1);
        }
    });

    console.log('todo', todoData)
    hidePopup();
    saveStorageData();
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

/**
 * 팝업 show
 * @param {string} className - add / edit 
 */
function showPopup(className, target) {
    popupSaveButton.innerText = className === 'add' ? '저장' : '수정';

    if (className === 'edit') {
        if (!target) {
            console.error('target 이 없습니다.');
            return;
        }

        popupInput.dataset.id = target.dataset.id;
        popupInput.value = target.innerText;
    }

    popup.classList.add('opened', className);
    popupInput.focus();
}

/** 팝업 hide */
function hidePopup() {
    if (popup.classList.contains('add')) {
        popup.classList.remove('add');
    }

    if (popup.classList.contains('edit')) {
        popup.classList.remove('edit');
        popupInput.removeAttribute('data-id');
    }

    popupInput.value = '';
    popup.classList.remove('opened');
}