const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const modelClass = require(path.join(__dirname, file));

    let model;

    // ✅ Case 1: BaseModel wali class
    if (modelClass && typeof modelClass.initModel === "function") {
      model = modelClass.initModel(sequelize);
    }
    // ✅ Case 2: sequelize-cli generated function
    else if (typeof modelClass === "function" && !(modelClass.prototype instanceof Sequelize.Model)) {
      model = modelClass(sequelize, Sequelize.DataTypes);
    }

    if (model) {
      db[model.name] = model;
    }
  });

// associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
