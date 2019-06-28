const genrateModel = require("./genrateModel");

let operations = (function() {
  let args = process.argv;
  if (args[2] == "_create") {
    if (args[3] == "Model") {
      if (args[4] != "_name") {
        console.log("no parameter _name is passed");
        return;
      }
      if (!args[5] || args[5] == "_attributes") {
        console.log("no parameter model name is passed");
        return;
      }
      if (args[6] != "_attributes") {
        console.log("no parameter _attributes is passed");
        return;
      }
      if (!args[7] || args[7].indexOf(":") == -1) {
        console.log("invalid or empty attributes passed");
        return;
      }
      let data = {};
      let attributes = args[7].split(",");
      attributes.forEach(key => {
        let temp = key.split(":");
        data[temp[0]] = temp[1];
      });
      // console.log(data);
      let response = genrateModel(args[5], data);
      console.log(response);
    } else {
      console.log(`invalid argument : ${args[3]}`);
    }
  } else {
    console.log(`invalid argument : ${args[3]}`);
  }
})();
