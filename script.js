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
    if (key !== "name" && key !== "classNum") {
      materiaTypes.push(key);
    }
  }
  // * loads the available materia options based on the selected role
  for (let i of materiaOptions) {
    setMateriaOptions(i);
  }
  // * loads data from local storage
  loadLocalStorage();
  for (let gearSlot in overmeldSelect) {
    updateOvermelds(overmeldSelect[gearSlot]);
    for (let materiaSlot in materiaOptions[gearSlot]) {
      calculateChance(gearSlot, materiaSlot);
    }
  }
  materiaCount();
  // calculateChance(0, 0);
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

function updateOvermelds(element) {
  for (let i = 10; i >= 2; i -= 2) {
    if (i > 10 - 2 * element.value) {
      element.parentElement.children[i].style.borderColor = "red";
    } else {
      element.parentElement.children[i].style.borderColor = "deepskyblue";
    }
  }
}

// * adds an event listener to react to a user selecting an overmeld option
for (let i in overmeldSelect) {
  // i.addEventListener("change", saveLocalStorage);
  // i.addEventListener("change", materiaCount);
  overmeldSelect[i].addEventListener("change", function (e) {
    let gearSlot = overmeldSelect.indexOf(e.target);
    saveLocalStorage(e);
    updateOvermelds(e.target);
    for (let materiaSlot in materiaOptions[gearSlot]) {
      calculateChance(gearSlot, materiaSlot);
    }
    materiaCount();
  });
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

function createChanceArray(prefix) {
  let array = [];
  for (let i = 0; i < 5; i++) {
    array.push(document.getElementById(`${prefix}${i + 1}Chance`));
  }
  return array;
}

const materiaChances = [
  createChanceArray("main"),
  createChanceArray("secondary"),
  createChanceArray("head"),
  createChanceArray("chest"),
  createChanceArray("gloves"),
  createChanceArray("legs"),
  createChanceArray("feet"),
  createChanceArray("ears"),
  createChanceArray("neck"),
  createChanceArray("wrists"),
  createChanceArray("lFinger"),
  createChanceArray("rFinger"),
];

function calculateChance(gearSlot, materiaSlot) {
  let materia = materiaOptions[gearSlot][materiaSlot].value;
  let tier, chance;
  materia.match(/\d+/) ? (tier = materia.match(/\d+/)[0]) : (tier = 0);
  switch (Math.min(5, tier)) {
    case 1:
      chance =
        JSONData.overmeldChances.t1[Math.max(0, Number(materiaSlot) - 4 + Number(overmeldSelect[gearSlot].value))];
      break;
    case 2:
      chance =
        JSONData.overmeldChances.t2[Math.max(0, Number(materiaSlot) - 4 + Number(overmeldSelect[gearSlot].value))];
      break;
    case 3:
      chance =
        JSONData.overmeldChances.t3[Math.max(0, Number(materiaSlot) - 4 + Number(overmeldSelect[gearSlot].value))];
      break;
    case 4:
      chance =
        JSONData.overmeldChances.t4[Math.max(0, Number(materiaSlot) - 4 + Number(overmeldSelect[gearSlot].value))];
      break;
    case 5:
      chance =
        JSONData.overmeldChances.t5[Math.max(0, Number(materiaSlot) - 4 + Number(overmeldSelect[gearSlot].value))];
      break;
    default:
      chance = null;
  }
  if (chance) {
    materiaChances[gearSlot][materiaSlot].textContent = `${Math.floor(chance * 100)}%`;
  } else {
    materiaChances[gearSlot][materiaSlot].textContent = "-";
  }
}

// * adds event listeners to each materia select element
for (let gearSlot in materiaOptions) {
  for (let materiaSlot in materiaOptions[gearSlot]) {
    // materiaSlot.addEventListener("change", saveLocalStorage);
    // materiaSlot.addEventListener("change", materiaCount);
    materiaOptions[gearSlot][materiaSlot].addEventListener("change", function (e) {
      saveLocalStorage(e);
      calculateChance(gearSlot, materiaSlot);
      materiaCount();
      // calculateChance(materiaOptions.indexOf(gearSlot), materiaSlot);
    });
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
    if (key !== "name" && key !== "classNum") {
      materiaTypes.push(key);
    }
  }
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
      if (materiaTypes.includes(key)) {
        for (let i = 1; i <= JSONData.scripCosts.length; i++) {
          const option = document.createElement("option");
          option.value = key + i.toString();
          option.textContent = `${value} ${i}`;
          materiaSelect.append(option);
        }
      }
    }
  }
}

// * declare results section elements
const materiaList = document.getElementById("materiaList");
const materiaResult = document.getElementById("materiaResult");
const materiaNum = document.getElementById("materiaNum");
const scrip1Result = document.getElementById("scrip1Result");
const scrip1Num = document.getElementById("scrip1Num");
const scrip2Result = document.getElementById("scrip2Result");
const scrip2Num = document.getElementById("scrip2Num");
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
        let chance = parseFloat(materiaChances[i][j].textContent) / 100;
        if (i < 2) {
          materiaTotals[materiaTypes.indexOf(type[0])][Number(tier[0]) - 1] += JSONData[role].classNum / chance;
        } else {
          materiaTotals[materiaTypes.indexOf(type[0])][Number(tier[0]) - 1] += 1 / chance;
        }
      }
    }
  }
  // * removes previous materia total elements
  for (let entry = materiaList.childElementCount - 1; entry >= 0; entry--) {
    materiaList.children[entry].remove();
  }
  // * adds materia total to table if its count > 0
  for (let type in materiaTotals) {
    for (let tier in materiaTotals[type]) {
      if (materiaTotals[type][tier] > 0) {
        const resultEntry = document.createElement("tr");
        const resultName = document.createElement("td");
        resultName.classList.add("left");
        const resultData = document.createElement("td");
        resultData.classList.add("right");
        resultName.textContent = `${JSONData[role][materiaTypes[type]]} ${Number(tier) + 1} -`;
        resultData.textContent = +materiaTotals[type][tier].toFixed(2);
        materiaList.append(resultEntry);
        resultEntry.append(resultName);
        resultEntry.append(resultData);
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
  materiaResult.textContent = "Total Materia -";
  materiaNum.textContent = +materiaTotal.toFixed(2);
  scrip1Result.textContent = `${JSONData.scrips[0]} Scrips -`;
  scrip1Num.textContent = +scripTotal[0].toFixed(2);
  scrip2Result.textContent = `${JSONData.scrips[1]} Scrips -`;
  scrip2Num.textContent = +scripTotal[1].toFixed(2);
}

const clearMateriaBtn = document.getElementById("clearMateriaBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

function clearOvermelds() {
  for (let overmeld of overmeldSelect) {
    overmeld.value = "0";
    updateOvermelds(overmeld);
  }
}

function clearMateria() {
  for (let gearSlot in materiaOptions) {
    for (let materiaSlot in materiaOptions[gearSlot]) {
      materiaOptions[gearSlot][materiaSlot].value = "none";
      calculateChance(gearSlot, materiaSlot);
    }
  }
}

clearMateriaBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear Materia?")) {
    clearMateria();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      let key = localStorage.key(i);
      if (!key.includes("Overmelds")) {
        localStorage.removeItem(key);
      }
    }
    materiaCount();
  }
});

clearAllBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear everything?")) {
    clearOvermelds();
    clearMateria();
    localStorage.clear();
    materiaCount();
  }
});
