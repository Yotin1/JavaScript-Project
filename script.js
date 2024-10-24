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
  // * stores value of role selection
  role = roleOption.value;
  // * stores the types of materia for a chosen role
  materiaTypes = [];
  for (let key of Object.keys(JSONData[role])) {
    if (key != "name") {
      materiaTypes.push(key);
    }
  }
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
  i.addEventListener("change", materiaCount);
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
    materiaSelect.addEventListener("change", materiaCount);
  }
}

// * delaring the role option variable and variable containing the number of materia for that role
const roleOption = document.getElementById("role");
let role, materiaTypes;
// * event listener for the role select element
roleOption.addEventListener("change", function (e) {
  // * updates role variable
  role = roleOption.value;
  // * stores the types of materia for a chosen role
  materiaTypes = [];
  for (let key of Object.keys(JSONData[role])) {
    if (key != "name") {
      materiaTypes.push(key);
    }
  }
  console.log(materiaTypes);
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
  // * runs materia count function
  materiaCount();
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

// * declare results section elements
let materiaList = document.getElementById("materiaList");
let materiaResult = document.getElementById("materiaResult");
let scrip1Result = document.getElementById("scrip1Result");
let scrip2Result = document.getElementById("scrip2Result");
// * Counts the number of materia selected
function materiaCount() {
  // * defines array storing the total amounts of each materia
  let materiaTotals = [];
  for (let i = 0; i < materiaTypes.length; i++) {
    materiaTotals.push(Array(12).fill(0));
  }
  // * loops over every materia select element and tallys the materia type and tier
  for (let i in materiaOptions) {
    for (let j in materiaOptions[i]) {
      let type = materiaOptions[i][j].value.match(/\D+/);
      let tier = materiaOptions[i][j].value.match(/\d+/);
      if (tier) {
        let chance = 1;
        switch (tier[0]) {
          case "1":
            chance = JSONData.overmeldChances.t1[Math.max(0, Number(j) - 4 + Number(overmeldSelect[i].value))];
            break;
          case "2":
            chance = JSONData.overmeldChances.t2[Math.max(0, Number(j) - 4 + Number(overmeldSelect[i].value))];
            break;
          case "3":
            chance = JSONData.overmeldChances.t3[Math.max(0, Number(j) - 4 + Number(overmeldSelect[i].value))];
            break;
          case "4":
            chance = JSONData.overmeldChances.t4[Math.max(0, Number(j) - 4 + Number(overmeldSelect[i].value))];
            break;
          default:
            chance = JSONData.overmeldChances.t5[Math.max(0, Number(j) - 4 + Number(overmeldSelect[i].value))];
            break;
        }
        materiaTotals[materiaTypes.indexOf(type[0])][Number(tier[0]) - 1] += 1 / chance;
      }
    }
  }
  // * removes previous materia total elements
  for (let entry = materiaList.childElementCount - 1; entry >= 0; entry--) {
    materiaList.children[entry].remove();
  }
  // * adds materia total elements if its count > 0
  for (let type in materiaTotals) {
    for (let tier in materiaTotals[type]) {
      if (materiaTotals[type][tier] > 0) {
        let resultEntry = document.createElement("p");
        resultEntry.textContent = `${JSONData[role][materiaTypes[type]]} ${Number(tier) + 1} - ${
          materiaTotals[type][tier]
        }`;
        materiaList.append(resultEntry);
      }
    }
  }
  let materiaTotal = 0;
  let scripTotal = [0, 0];
  for (let type of materiaTotals) {
    for (let i in type) {
      materiaTotal += type[i];
      if (i >= type.length - 1) {
        scripTotal[1] += type[i] * JSONData.scripCosts[i];
      } else {
        scripTotal[0] += type[i] * JSONData.scripCosts[i];
      }
    }
  }
  materiaResult.textContent = `Total Materia - ${materiaTotal}`;
  scrip1Result.textContent = `${JSONData.scrips[0]} Scrips - ${scripTotal[0]}`;
  scrip2Result.textContent = `${JSONData.scrips[1]} Scrips - ${scripTotal[1]}`;
}
