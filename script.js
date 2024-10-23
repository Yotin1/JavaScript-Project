async function getData() {
  let x = await fetch("./data.json");
  let y = await x.json();
  return y;
}

let JSONData = [];
document.addEventListener("DOMContentLoaded", async function () {
  JSONData = await getData();
  console.log(JSONData);
  for (let i of materiaOptions) {
    setMateriaOptions(i, JSONData);
  }
});

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

function createSelectArray(prefix) {
  let array = [];
  for (let i = 0; i < 5; i++) {
    array.push(document.getElementById(`${prefix}${i + 1}`));
  }
  return array;
}

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

function setMateriaOptions(array, data) {
  for (let i of array) {
    for (let [key, value] of Object.entries(data.crafter)) {
      if (key !== "name") {
        for (let j in value.totals) {
          let option = document.createElement("option");
          option.value = key + (Number(j) + 1).toString();
          option.textContent = `${value.name} ${(Number(j) + 1).toString()}`;
          i.append(option);
        }
      }
    }
  }
}
