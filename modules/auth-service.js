const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: String,
  loginHistory: [{ dateTime: Date, userAgent: String }],
});

let User;

let initialize = () => {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(process.env.MONGODB); //'db' is the entry Point of this individual connection.
    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("usersFound", userSchema);
      resolve();
    });
  });
};

let registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) {
        reject(`There was an error encrypting the password: ${err}`);
      }
      userData.password = hash;
      let newUser = new User(userData);

      newUser
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          if (err && err.code === 11000) {
            reject("User Name already taken");
          } else {
            reject(`There was an error creating the user: ${err}`);
          }
        });
    });
  });
};
let checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName })
      .then((usersFound) => {
        if (usersFound.length === 0) {
          reject("Unable to find user: " + userData.userName);
        } else {
          const user = usersFound[0];

          bcrypt
            .compare(userData.password, user.password)
            .then((result) => {
              if (!result) {
                reject(`Incorrect Password for user: ${userData.userName}`);
              } else {
                if (user.loginHistory.length === 8) {
                  user.loginHistory.pop();
                }
                user.loginHistory.unshift({
                  dateTime: new Date().toString(),
                  userAgent: userData.userAgent,
                });

                User.updateOne(
                  { _id: user._id },
                  { $set: { loginHistory: user.loginHistory } }
                )
                  .then(() => {
                    resolve(user);
                  })
                  .catch((err) => {
                    reject("Failed to update user login history: " + err);
                  });
              }
            })
            .catch((err) => {
              reject("Error comparing passwords: " + err);
            });
        }
      })
      .catch((err) => {
        reject(`Database error: ${err}`);
      });
  });
};
module.exports = {
  initialize,
  registerUser,
  checkUser,
};
