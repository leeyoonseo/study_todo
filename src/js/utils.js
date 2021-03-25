// TODO: Storage

//   /**
//    * 데이터 호출
//    * @param {string} listType - toDoList , category 구분
//    */  
//   function loadData(listType) {
//     const localGetIemName = getListName(listType);    
//     const loadArrStr = localStorage.getItem(localGetIemName) || '[]';
//     const loadArrPar = JSON.parse(loadArrStr);
//     return loadArrPar;
//   }

 //   /**
//    * 데이터 저장
//    * @param {array} todoArr - 할 일 데이터
//    * @param {string} listType - toDoList , category 구분
//    */   
//   function saveLocalStorageData(todoArr, listType) {
//     const todoArrStr = JSON.stringify(todoArr);
//     const setItemName = getListName(listType);   
//     localStorage.setItem(setItemName, todoArrStr);
//   }


// 전체삭제
//   /*
//   // 나중에 쓸거임
//   function clearData() {
//     localStorage.clear();
//   }
//   */

function deepCloneObject(obj) {
    if (obj === null || typeof(obj) !== 'object') return obj;
    let copy = obj.constructor();

    for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = deepCloneObject(obj[attr]);
        }
    }

    return copy;
};

window.deepCloneObject;