/**
 * CHECK LIST
 * @version 1.1.0
 */

//   /**
//    * 로컬스토리지에서 사용 할 이름 출력
//    * @param {string} listType - toDoList , category 구분
//    */
//   function getListName(listType) {
//     return listType === 'toDoList' ? 'my-todo-list' : 'my-category-list';
//   }

const todoData = [
    {
        id: 0,
        isChecked: true,
        text: '아침 챙겨먹기',
    },
    {
        id: 1,
        isChecked: false,
        text: '퇴근하고 수영가기',
    },
];

const todoList = document.getElementById('todo-list');
const itemAddButton = document.getElementById('add-btn');
const popup = document.getElementById('popup');
const popupCloseButton = document.querySelectorAll('.js-close');
const popupSaveButton = document.querySelector('.js-save');
const popupEditButton = document.querySelector('.js-edit');
const popupInput = document.getElementById('popup-input');

load();

itemAddButton.addEventListener('click', () => showPopup('add'));

for (let i = 0; i < popupCloseButton.length; i ++) {
    popupCloseButton[i].addEventListener('click', hidePopup);
}

popupSaveButton.addEventListener('click', handlerPopupSave);
popupInput.addEventListener('keypress', ({ key }) => {
    if (key === 'Enter') {
        handlerPopupSave();
    }
})


function load() {
    // TODO: 로컬스토리지에서 데이터 가져오기

    setList(todoData);
}


function setList(data) {
    if (todoList.childElementCount >= 1 ) {
        console.log('있다.')
        todoList.innerHTML = '';
    }

    data.map((v) => {
        todoList.appendChild(createItem(v));
    });
}

// function updateList(data) {
//     console.log('updateList', data);
// }

function createItem(data) {
    const wrap = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const text = document.createElement('span');

    const copyBtn = document.createElement('button');
    const copyBtnIcon = document.createElement('img');

    checkbox.type = 'checkbox';
    checkbox.id = 'chk-' + data.id;
    checkbox.checked = data.isChecked;
    label.setAttribute('for', 'chk-' + data.id);
    
    text.innerText = data.text;
    text.classList.add('item-text');

    copyBtnIcon.src = 'public/img/icon_copy.png';
    copyBtn.classList.add('copy-btn');
    copyBtn.appendChild(copyBtnIcon);

    wrap.appendChild(checkbox);
    wrap.appendChild(label);
    wrap.appendChild(text);
    wrap.appendChild(copyBtn);

    if (data.isChecked) {
        wrap.classList.add('checked');   
    }

    text.addEventListener('click', () => showPopup('edit'));
    checkbox.addEventListener('change', handlerChangeChk);

    return wrap;
}

function handlerPopupSave() {
    if (popup.classList.contains('add')) {
        addItem();
    }

    if (popup.classList.contains('edit')) {
        editItem();
    }
}

function addItem() {
    console.log('addItem');
    const val = popupInput.value;
    let data = {};

    if (!val || !val.trim()) {
        return alert('텍스트를 입력해주세요.');
    }

    data = {
        id: todoData.length,
        isChecked: false,
        text: val,
    };

    popupInput.value = '';

    todoData.push(data);
    todoList.appendChild(createItem(data));
    console.log(todoData)

    hidePopup();
}

function editItem() {
    console.log('editItem');
    
}

function deleteItem() {

}

function handlerChangeChk({ target }) {
    console.log('onChangeCheck');

    const id = Number(target.id.split('chk-')[1]);
    const targetData = todoData.find((v) => v.id === id);

    if (!targetData) return;
    const { parentNode } = target;
    targetData.isChecked = !targetData.isChecked; 

    parentNode.classList.toggle('checked', targetData.isChecked);
}

/**
 * 팝업 show
 * @param {string} className - add / edit 
 */
function showPopup(className) {
    popupSaveButton.innerText = className === 'add' ? '저장' : '수정';

    if (className === 'edit') {
        
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
    }

    popup.classList.remove('opened');
}
