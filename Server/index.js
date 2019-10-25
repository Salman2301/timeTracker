const fs = require("file-system");

// run();

// function run() {
//   let res = addCategory("category new.");
//   console.log(res);
// }

function getData() {
  let data = fs.readFileSync("./data.json", "utf-8");
  return data;
}

function updateData(data) {
  data = JSON.stringify(data, null, 4);
  fs.writeFileSync("./data.json", data);
  return;
}

function updatedLastTask(lastTask) {
  let data = getData();
  data = JSON.parse(data);
  data.lastChecked = new Date().toISOString();
  console.log("lastTask : ", lastTask);
  data.lastTask = lastTask;
  // update the tracking time
  updateData(data);
  return getData();
}

function addCategory(cat) {
  let data = getData();
  data = JSON.parse(data);
  if (data.categories.indexOf(cat) === -1) data.categories.push(cat);
  updateData(data);
  getData();
  return getData();
}

function removeCategory(cat) {
  let data = getData();
  data = JSON.parse(data);
  data.categories = data.categories.filter(_ => _ !== cat);
  updateData(data);
  getData();
  return getData();
}

module.exports = {
  getData: getData(),
  updatedLastTask: task => updatedLastTask(task),
  addCategory: cat => addCategory(cat),
  removeCategory: cat => removeCategory(cat)
};
