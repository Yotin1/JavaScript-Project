// * gets data from .json file
async function getData() {
  let x = await fetch("./data.json");
  let y = await x.json();
  return y;
}

// * stores .json data
let JSONData = [];
// * runs on webpage load
document.addEventListener("DOMContentLoaded", async function () {
  JSONData = await getData();
  console.log(JSONData);
  // * stores value of role selection
  role = roleOption.value;
  // * sets the number of materia types for that role
  noMateriaTypes = Object.entries(JSONData[role]).length - 1;
  // * loads the available materia options based on the selected role
  for (let i of materiaOptions) {
    setMateriaOptions(i);
  }
  // * loads data from local storage
  loadLocalStorage();
  materiaCount();
});

function loadLocalStorage() {
  // * sets value of the appropriate element for each key in local storage
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    document.getElementById(key).value = localStorage.getItem(key);
    if (!document.getElementById(key).value) {
      document.getElementById(key).value = "none";
    }
  }
}

// * saves data to local storage
function saveLocalStorage(e) {
  // console.log(e);
  localStorage.setItem(e.target.id, e.target.value);
}

// * an array containing the select menus for the overmeld amounts of each gear
const overmeldSelect = [
  document.getElementById("mainOvermelds"),
  document.getElementById("secondaryOvermelds"),
  document.getElementById("headOvermelds"),
  document.getElementById("chestOvermelds"),
  document.getElementById("glovesOvermelds"),
  document.getElementById("legsOvermelds"),
  document.getElementById("feetOvermelds"),
  document.getElementById("earsOvermelds"),
  document.getElementById("neckOvermelds"),
  document.getElementById("wristsOvermelds"),
  document.getElementById("lFingerOvermelds"),
  document.getElementById("rFingerOvermelds"),
];

// * adds an event listener to react to a user selecting an overmeld option
for (let i of overmeldSelect) {
  i.addEventListener("change", saveLocalStorage);
}

// * creates an array containing the select elements for the materia options for a gear slot
function createSelectArray(prefix) {
  let array = [];
  for (let i = 0; i < 5; i++) {
    array.push(document.getElementById(`${prefix}${i + 1}`));
  }
  return array;
}

// * array containing arrays of materia select elements for every gear slot
const materiaOptions = [
  createSelectArray("main"),
  createSelectArray("secondary"),
  createSelectArray("head"),
  createSelectArray("chest"),
  createSelectArray("gloves"),
  createSelectArray("legs"),
  createSelectArray("feet"),
  createSelectArray("ears"),
  createSelectArray("neck"),
  createSelectArray("wrists"),
  createSelectArray("lFinger"),
  createSelectArray("rFinger"),
];

// * adds event listeners to each materia select element
for (let gearSlot of materiaOptions) {
  for (let materiaSelect of gearSlot) {
    materiaSelect.addEventListener("change", saveLocalStorage);
  }
}

// * delaring the role option variable and variable containing the number of materia for that role
const roleOption = document.getElementById("role");
let role, noMateriaTypes;
// * event listener for the role select element
roleOption.addEventListener("change", function (e) {
  // * updates role variable
  role = roleOption.value;
  // * sets the number of materia types for that role
  noMateriaTypes = Object.entries(JSONData[role]).length - 1;
  console.log(role);
  // * saves role value to local storage
  saveLocalStorage(e);
  // * updates the available materia options by removing the old options and adding the new options
  for (let gearSlot of materiaOptions) {
    for (let materiaSelect of gearSlot) {
      for (let materiaOption = materiaSelect.options.length - 1; materiaOption > 0; materiaOption--) {
        materiaSelect.remove(materiaOption);
      }
    }
    setMateriaOptions(gearSlot);
  }
  // * saves materia options to the local storage
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) !== "role") {
      let key = localStorage.key(i);
      document.getElementById(key).value = localStorage.getItem(key);
      if (!document.getElementById(key).value) {
        document.getElementById(key).value = "none";
      }
    }
  }
});

// * loads the relevant materia options based on the role value
function setMateriaOptions(array) {
  for (let materiaSelect of array) {
    for (let [key, value] of Object.entries(JSONData[role])) {
      if (key !== "name") {
        for (let i = 1; i <= JSONData.scripCosts.length; i++) {
          let option = document.createElement("option");
          option.value = key + i.toString();
          option.textContent = `${value} ${i}`;
          materiaSelect.append(option);
        }
      }
    }
  }
}

// * Counts the number of materia selected
function materiaCount() {
  // * defines array storing the total amounts of each materia
  let materiaTotals = [];
  for (let i = 0; i < noMateriaTypes; i++) {
    materiaTotals.push(Array(12).fill(0));
  }
  console.log(materiaTotals);
  for (let gearSlot of materiaOptions) {
    for (let j of gearSlot) {
      let name = j.value.match(/\D+/);
      let num = j.value.match(/\d+/);
      // if (num) {
      //   newJSONData[role][name[0]].totals[Number(num[0]) - 1] += 1;
      // }
    }
  }
}
