let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  // 暫時不想將form資料傳出去
  e.preventDefault();

  // get the input values
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  if (todoText === "" || todoMonth === "" || todoDate === "") {
    alert("Please input something for text, month and date.");
    // 此處的return 是想結束add這個event listener 裡的function，不希望他執行下面的函數
    return;
  }

  if (todoText !== "" && todoMonth !== "" && todoDate !== "") {
    // create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.textContent = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.textContent = todoMonth + " / " + todoDate;

    todo.appendChild(text);
    todo.appendChild(time);

    // create green check and red trash can
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML =
      '<i class="fa-sharp fa-solid fa-square-check"></i>';

    completeButton.addEventListener("click", (e) => {
      let todoItem = e.target.parentElement;
      // 使用toggle當作done css樣式開關
      todoItem.classList.toggle("done");
    });

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    trashButton.addEventListener("click", (e) => {
      let todoItem = e.target.parentElement;
      todoItem.style.animation = "scaleDown 0.4s forwards";

      // remove from local storage
      let text = todoItem.children[0].textContent;
      let listArr = JSON.parse(localStorage.getItem("list"));
      listArr.forEach((item, index) => {
        if (text === item.todoText) {
          listArr.splice(index, 1);
          // 執行完再儲存回去
          localStorage.setItem("list", JSON.stringify(listArr));
        }
      });

      // 等縮小動畫執行完刪除
      todoItem.addEventListener("animationend", () => {
        todoItem.remove();
      });
    });

    // 加上動畫效果，已經取名叫 " scaleUp "
    todo.style.animation = "scaleUp 0.5s forwards";

    // create an object for localStorage
    let myTodo = {
      todoText: todoText,
      todoMonth: todoMonth,
      todoDate: todoDate,
    };
    // Store data into an array of objects
    let myList = localStorage.getItem("list");
    // 開始時key 是list 這個myList裡頭並沒有裝東西，會回傳null
    if (myList === null) {
      localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
      // 若mylist裡頭有值，加入array裡儲存回去
      let myListArr = JSON.parse(myList);
      myListArr.push(myTodo);
      // 再儲存回去localStorage
      localStorage.setItem("list", JSON.stringify(myListArr));
    }

    // 送出清單後清空input 欄位
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";
    section.appendChild(todo);
  }
});

// 網站開啟時讀取localStorage的資料
loadData();

function loadData() {
  let myList = localStorage.getItem("list");
  // 若myList內有data希望呈現在頁面上
  if (myList !== null) {
    let myListArr = JSON.parse(myList);
    myListArr.forEach((item) => {
      // 製作todolist
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.textContent = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.textContent = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      // 加上complete button 和 trash button
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML =
        '<i class="fa-sharp fa-solid fa-square-check"></i>';

      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        // 使用toggle當作done css樣式開關
        todoItem.classList.toggle("done");
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.4s forwards";

        // 等縮小動畫執行完刪除
        todoItem.addEventListener("animationend", () => {
          // remove from local storage
          let text = todoItem.children[0].textContent;
          let listArr = JSON.parse(localStorage.getItem("list"));
          listArr.forEach((item, index) => {
            if (text === item.todoText) {
              listArr.splice(index, 1);
              // 執行完再儲存回去
              localStorage.setItem("list", JSON.stringify(listArr));
            }
          });
          todoItem.remove();
        });
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  }
}

// merge sort
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    // 因為localStorage是以字串儲存，要把值轉為number比較
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j += 1;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i += 1;
    } else if (Number(arr1[i].todoMonth) === Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j += 1;
      } else {
        result.push(arr1[i]);
        i += 1;
      }
    }
  }
  //若比完兩個array 其中一個array還有剩餘的值時，就他擺在result最後面
  while (i < arr1.length) {
    result.push(arr1[i]);
    i += 1;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j += 1;
  }
  return result;
}
// Divide and Conqueor
function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(left), mergeSort(right));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArr = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArr));

  // remove data
  let len = section.children.length;
  // 因為children回傳的是HTML collection，沒有辦法使用forEach()
  for (let i = 0; i < len; i += 1) {
    section.children[0].remove();
    // 刪掉第0後續會遞補，所以刪掉第0個
  }

  // load new data
  loadData();
});
