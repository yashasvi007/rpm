const { resolve, join } = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs");

let getType = name => {
  let type = {
    string: "String",
    String: "String",
    int: "Number",
    number: "Number",
    Number: "Number",
    Boolean: "Boolean",
    Bool: "Boolean",
    Buffer: "Buffer",
    id: "Schema.Types.ObjectId",
    decimal: "Schema.Types.Decimal128",
    date: "Date",
    Date: "Date",
    "[[Number]]": "[[Number]]",
    "[Number]": "[Number]",
    "[String]": "[String]",
    "[Date]": "[Date]",
    "[id]": "[Schema.Types.ObjectId]"
  };
  return type[name];
};

let genrateModule = (modelName, attr) => {
  let file = resolve(__dirname, "../app/models", modelName + ".js");
  if (existsSync(file)) return "File Allready Exists!!";
  let attrStr = "";
  for (let key in attr) {
    attrStr += `
                ${key}:{
                    type:${getType(attr[key])}
                  },`;
  }
  let data = `const mongoose = require('mongoose');

    const ${modelName}Schema = new mongoose.Schema({
    ${attrStr}
        createdAt:{
            type:Date,
            default:Date.now
        }
    });
    
    citySchema.statics = {
        async findByIdAsync(id){
            let result = await this.findById(id)
            return result;
        }
    };
    
    module.exports = mongoose.model('${modelName.charAt(0).toUpperCase() +
      modelName.slice(1)}', ${modelName}Schema );`;
  writeFileSync(file, data);
  if (existsSync(file)) return `${modelName} model generated successfully`;
};

module.exports = genrateModule;
