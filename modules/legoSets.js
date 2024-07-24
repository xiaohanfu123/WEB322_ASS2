require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectModule: require("pg"),
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    num_parts: {
      type: Sequelize.INTEGER,
    },
    theme_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Theme,
        key: "id",
      },
    },
    img_url: {
      type: Sequelize.STRING,
    },
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

Set.belongsTo(Theme, { foreignKey: "theme_id" });

function initialize() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        console.log("Connected to DB...");
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.findAll({ include: ["Theme"] })
      .then((sets) => {
        resolve(sets);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      where: { set_num: setNum },
      include: ["Theme"],
    })
      .then((set) => {
        if (set.length === 0) {
          reject(new Error("Unable to find requested set"));
        } else {
          resolve(set[0]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: ["Theme"],
      where: {
        "$Theme.name$": {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    })
      .then((sets) => {
        if (sets.length === 0) {
          reject(new Error("Unable to find requested sets"));
        } else {
          resolve(sets);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function addSet(setData) {
  return new Promise((resolve, reject) => {
    Set.create(setData) //setData is like {
      // "name": "Lego Set Name",
      // "year": 2022,
      // "num_parts": 1000,
      // "img_url": "http://example.com/image.jpg",
      // "theme_id": 1,
      // "set_num": "12345"
      // }
      .then(() => {
        resolve(); // Resolve the promise without any data on success
      })
      .catch((err) => {
        reject(err.errors[0].message); // Reject the promise with a human-readable error message
      });
  });
}

function editSet(set_num, setData) {
  return new Promise((resolve, reject) => {
    Set.update(setData, {
      where: { set_num: set_num },
    })
      .then((result) => {
        let [updatedRows] = result; //first element of returned array from update() is the number modified.

        if (updatedRows > 0) {
          resolve(`${updatedRows} updated!`);
        } else {
          reject("Nothing updated..");
        }
      })
      .catch((err) => {
        reject("An error occurred: " + err.errors[0].message);
      });
  });
}

function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll()
      .then((themes) => resolve(themes))
      .catch((err) => reject(err));
  });
}

function deleteSet(set_num) {
  return new Promise((resolve, reject) => {
    Set.destroy({
      //'destroy return a int representing number of records deleted.'
      where: { set_num: set_num },
    })
      .then((deleted) => {
        if (deleted == 0) {
          reject("No set found with the provided set number");
        }
        resolve();
      })
      .catch((err) => reject(err.errors[0].message));
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  getAllThemes,
  deleteSet,
  editSet
};
