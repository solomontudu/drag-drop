const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// fileter arrays to remove empty items
function filterArrays(array) {
  const filterdArray = array.filter((item) => item !== null);
  return filterdArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  console.log(`index:${index}, column:${column}`);
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
    updatedOnLoad = true;
  }

  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });
  backlogListArray = filterArrays(backlogListArray);

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 1, item, index);
  });
  progressListArray = filterArrays(progressListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 2, item, index);
  });
  onHoldListArray = filterArrays(onHoldListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 3, item, index);
  });
  completeListArray = filterArrays(completeListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// update item - delete if necessary, or update array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;

  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// add to column list
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// show add item input bos
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// hide input item box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// allow arrays to reflect drag and drop items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);

  progressListArray = Array.from(progressList.children).map(
    (i) => i.textContent
  );

  completeListArray = Array.from(completeList.children).map(
    (i) => i.textContent
  );

  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);

  updateDOM();
}

// when item starts dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// dropping item in colume
function drop(e) {
  e.preventDefault();
  // remove background color/padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // dragging complete
  dragging = false;
  rebuildArrays();
}

// when item enters the columb area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// column allows for items to drop
function allowDrop(e) {
  e.preventDefault();
}

// onload
updateDOM();
