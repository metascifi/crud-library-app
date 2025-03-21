function init() {
  let domStartBtn = document.getElementById("start-add-book-btn");
  let domForm = document.querySelector("#add-book-form");
  let domEditForm = document.querySelector("#edit-book-form");
  let domTableBtn = document.getElementById("table-add-book-btn");
  let backToLib = document.getElementById("back-to-lib-btn");
  let editBackToLib = document.getElementById("edit-back-to-lib-btn");

  domStartBtn.addEventListener("click", () => {
    domStartBtn.classList.toggle("deactivated");
    displayForm();
  })

  domForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formFields = e.target.elements;
    let bookStatusDropdown = document.getElementById("bookstatus-dropdown");
    let dropdownStatus = bookStatusDropdown.querySelector(".dropdown-selected-option");
    let book = new Book(formFields["book-name"].value, formFields["author-name"].value, formFields["page-number"].value, dropdownStatus.textContent);
    addBook(book);
    hideForm();
    displayUserTable();
    })  

    domEditForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formFields = e.target.elements;
      let bookStatusDropdown = document.querySelector("#edit-bookstatus-dropdown");
      let dropdownStatus = bookStatusDropdown.querySelector(".dropdown-selected-option");
      let dropdownOptionList = Array.from(bookStatusDropdown.getElementsByTagName("option")).map((element) => element.textContent);
      let bookObj = new Book(formFields["book-name"].value, formFields["author-name"].value, formFields["page-number"].value, dropdownStatus.textContent);
      editBook(bookObj);
      hideEditForm();
      displayUserTable();
      }) 

    backToLib.addEventListener("click", ()=> {
      hideForm();
      displayUserTable();
    })

    editBackToLib.addEventListener("click", ()=> {
      hideEditForm();
      displayUserTable();
    })

  domTableBtn.addEventListener("click", ()=>{
    hideUserTable();
    displayForm();
  })
}

function displayForm() {
  let domForm = document.querySelector("#add-book-form");
  domForm.style.display = "flex";
  let domFormDropdown = document.getElementById("bookstatus-dropdown");
  addInteractionToDropdown(domFormDropdown);
} 

function displayEditForm(bookID) {
  let domForm = document.querySelector("#edit-book-form");
  let domEditFormDropdown = document.getElementById("edit-bookstatus-dropdown");
  domForm.style.display = "flex";
  let formInputs = Array.from(domForm.getElementsByClassName("paste-ready"));
  let bookValues = Object.values(booksStorage.books[bookID]);
  let bookKeys = Object.keys(booksStorage.books[bookID]);
  for (let i = 0; i < formInputs.length; i++) {
    if (bookKeys[i] === "status") {
      formInputs[i].textContent = bookValues[i];
    } else {
      formInputs[i].value = bookValues[i];
    }
  }
  addInteractionToDropdown(domEditFormDropdown);
} 

function hideForm() {
  let domForm = document.querySelector("#add-book-form");
  domForm.style.display = "none";
  let domFormDropdown = document.getElementById("bookstatus-dropdown");
  removeInteractionFromDropdown(domFormDropdown);
}

function hideEditForm() {
  let domForm = document.querySelector("#edit-book-form");
  domForm.style.display = "none";
  let domEditFormDropdown = document.getElementById("edit-bookstatus-dropdown");
  removeInteractionFromDropdown(domEditFormDropdown);
}

function displayUserTable() {
  let domUserTable = document.getElementById("user-books-table-section");
  domUserTable.style.display = "block";
}

function hideUserTable() {
  let domUserTable = document.getElementById("user-books-table-section");
  domUserTable.style.display = "none";
}

let booksStorage = {
  books: [],
  addBook(book) {
    this.books.push(book);
    this.giveIdToBooks();
  },
  editBook(value, bookId, userProperty) {
    this.books[bookId][userProperty] = value; 
  },
  deleteBook(bookId){
    this.books.splice(bookId, 1);
  },
  giveIdToBooks() {
    for (let i = 0; i < this.books.length; i++){
      this.books[i].bookID = i;
    }
  }
}

class Book  {
  #bookID = 0;
  #editStatus = false;
  constructor (name, author, pagesNum, status) {
  this.name = name;
  this.author = author;
  this.pagesNum = pagesNum;
  this.status = status;
  }

  get bookID() {
    return this.#bookID;
  }

  set bookID (id) {
    this.#bookID = id;
  }

  get editStatus() {
    return this.#editStatus;
  }

  set editStatus(status) {
    this.#editStatus = status;
  }
}


function addBook(book) {
  booksStorage.addBook(book);
  displayNewBookNote(booksStorage.books[booksStorage.books.length - 1]);
}

function editBook(bookObj) {
  let editedBookId;
  for (let i = 0; i < booksStorage.books.length; i++) {
    if (booksStorage.books[i].editStatus === true){
      // !!!! Try to develop more smarter decision with loop if number of keys in book object is big
      booksStorage.books[i].name = bookObj.name;
      booksStorage.books[i].author = bookObj.author;
      booksStorage.books[i].pagesNum = bookObj.pagesNum;
      booksStorage.books[i].status = bookObj.status;
      booksStorage.books[i].editStatus = false;
      editedBookId = booksStorage.books[i].bookID;
    }
  }

  displayEditedBookNote(editedBookId, bookObj);
}

function displayNewBookNote (book) {
  let domBookTable = document.querySelector("tbody");
  let tableRow = document.createElement("tr");
  tableRow.classList.add("user-table-row");
  domBookTable.appendChild(tableRow);
  let idTableCell = document.createElement("td");
  idTableCell.classList.add("id-column");
  tableRow.appendChild(idTableCell);
  displayIdBooks();
  let bookValuesArray = Object.values(book);
  let bookKeysArray = Object.keys(book);

  //Loop extracting book values data into tablecells
  for (let i = 0; i < bookValuesArray.length; i++) {
    let tableCell = document.createElement("td");
    if (bookKeysArray[i] === "status") {
      let newDropdown = createDropdown(bookValuesArray[i], ["Completed", "Not finished"]);
      newDropdown.classList.add("bookNoteRow-dropdown");
      let dropdownSelectedOption = newDropdown.querySelector(".dropdown-selected-option");
      dropdownSelectedOption.classList.add(`bookNote-cell-${bookKeysArray[i]}`);
      tableCell.appendChild(newDropdown);
      addInteractionToDropdown(newDropdown);
    } else if (typeof bookValuesArray[i] === "string") {
      tableCell.textContent = bookValuesArray[i];
      tableCell.classList.add(`bookNote-cell-${bookKeysArray[i]}`);
    }
    tableRow.appendChild(tableCell);
  }

  //Creates delete button on table row
  let deleteTableCell = document.createElement("td");
  tableRow.appendChild(deleteTableCell);
  createDeleteButton(deleteTableCell, "div");

  //Creates edit button on table row
  let editTableCell = document.createElement("td");
  tableRow.appendChild(editTableCell);
  createEditButton(editTableCell, "div");
}

function displayEditedBookNote(bookNoteID, bookObject) {  
  let userTableRowList = Array.from(document.getElementsByClassName("user-table-row"));
  for (let i = 0; i < userTableRowList.length; i++) {
    if (userTableRowList[i].querySelector(".id-column").textContent === String(bookNoteID)) {
      userTableRowList[i].querySelector(".bookNote-cell-name").textContent = bookObject.name;
      userTableRowList[i].querySelector(".bookNote-cell-author").textContent = bookObject.author;
      userTableRowList[i].querySelector(".bookNote-cell-pagesNum").textContent = bookObject.pagesNum;
      userTableRowList[i].querySelector(".bookNote-cell-status").textContent = bookObject.status;
    }
  }; 
}

function createDeleteButton(parentElement, tagName){
  let deleteButton = document.createElement(tagName);
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "Delete";
  parentElement.appendChild(deleteButton);
  deleteButton.addEventListener("click", (e)=> {
    e.target.parentElement.parentElement.remove();
    let elementId = e.target.parentElement.parentElement.querySelector(".id-column").textContent;
    booksStorage.deleteBook(elementId);
    displayIdBooks();
  })
}

function createEditButton(parentElement, tagName){
  let editButton = document.createElement(tagName);
  editButton.classList.add("edit-btn");
  editButton.textContent = "Edit";
  parentElement.appendChild(editButton);
  editButton.addEventListener("click", (e)=> {
    hideUserTable();
    let elementId = e.target.parentElement.parentElement.querySelector(".id-column").textContent;
    booksStorage.books[elementId].editStatus = true;
    displayEditForm(elementId);
  })
}

function displayIdBooks () {
  booksStorage.giveIdToBooks();
  let idCellArray = document.getElementsByClassName("id-column");
  for (let i = 0; i < idCellArray.length; i++) {
    idCellArray[i].textContent = booksStorage.books[i].bookID;
  }
}

function createDropdown(selectedOption, optionList) {
  let dropdownCotnainer = document.createElement("div");
  dropdownCotnainer.classList.add("dropdown");
  let dropdownSelectContainer = document.createElement("div");
  dropdownSelectContainer.classList.add("dropdown-select-container");
  dropdownCotnainer.appendChild(dropdownSelectContainer);
  let dropdownSelectedOption = document.createElement("p");
  dropdownSelectedOption.classList.add("dropdown-selected-option");
  dropdownSelectedOption.textContent = selectedOption;
  dropdownSelectContainer.appendChild(dropdownSelectedOption);
  let dropdownArrow = document.createElement("div");
  dropdownArrow.classList.add("dropdown-arrow");
  dropdownArrow.textContent = '\u{25BC}';
  dropdownSelectContainer.appendChild(dropdownArrow);
  let dropdownMenu = document.createElement("ul");
  dropdownMenu.classList.add("dropdown-menu");
  dropdownCotnainer.appendChild(dropdownMenu);
  optionList.forEach(element => {
    let option = document.createElement("option");
    option.textContent = element;
    dropdownMenu.appendChild(option);
  });
  return dropdownCotnainer;
}   

function addInteractionToDropdown(dropdown) {
    let domDropdownMenu = dropdown.querySelector(".dropdown-menu");
    let optionsList = domDropdownMenu.getElementsByTagName("option");
    domDropdownMenu.style.zIndex = "1";
    dropdown.addEventListener("click", showDropDownMenu);   
    Array.from(optionsList).forEach((option) => {
      option.addEventListener("click", selectDropdownOption)
    });
}

function showDropDownMenu(event) {
  let dropdown = event.currentTarget;
  let domDropdownMenu = dropdown.querySelector(".dropdown-menu");
  domDropdownMenu.classList.toggle("active");
  domDropdownMenu.style.zIndex = `${parseInt(domDropdownMenu.style.zIndex) + 1}`;
  dropdown.querySelector(".dropdown-arrow").classList.toggle("active");
  dropdown.querySelector(".dropdown-select-container").classList.toggle("active");
}

function selectDropdownOption(event) {
  dropdown = event.currentTarget.closest(".dropdown");
  let selectedOption = dropdown.querySelector(".dropdown-selected-option");
  selectedOption.textContent = event.currentTarget.textContent;
  if (Array.from(dropdown.classList).includes("bookNoteRow-dropdown")) {
    let dropdownID = dropdown.parentElement.parentElement.querySelector(".id-column").textContent;
    booksStorage.books[dropdownID].status = event.currentTarget.textContent;
  }  
}

function removeInteractionFromDropdown (dropdown) {
  let domDropdownMenu = dropdown.querySelector(".dropdown-menu");
  let optionsList = domDropdownMenu.getElementsByTagName("option");

  dropdown.removeEventListener("click", showDropDownMenu);
  Array.from(optionsList).forEach((option) => {
    option.removeEventListener("click", selectDropdownOption)
  });
}

init();