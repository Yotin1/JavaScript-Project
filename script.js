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
    for (let j of Object.keys(data.crafting)) {
      console.log(j);
      for (let k in data.scripCosts) {
        let option = document.createElement("option");
        option.value = data.crafting.values[j] + (Number(k) + 1).toString();
        option.textContent = `${data.crafting.names[j]} ${(Number(k) + 1).toString()}`;
        i.append(option);
      }
    }
  }
}
