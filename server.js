/********************************************************************************
 * WEB322 – Assignment 03
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: ___HANFU XIAO______ Student ID: ____033503145__________ Date: ___6/9/2024___________
 *
 * Published URL: ______https://web-322-ass-2.vercel.app/_____________
 ********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));
legoData.initialize();
const HTTP_PORT = 3000;

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/home.html"));
}); // M

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;

  if (theme) {
    legoData
      .getSetsByTheme(theme)
      .then((thisTheme) => {
        res.send(thisTheme);
      })
      .catch((err) => {
        res.status(404).sendFile(path.join(__dirname, "views/404.html"));
      });
  } else {
    legoData
      .getAllSets()
      .then((sets) => {
        res.send(sets);
      })
      .catch((err) => {
        res.status(404).sendFile(path.join(__dirname, "views/404.html"));
      });
  }
});

app.get("/lego/sets/:num_demo", (req, res) => {

const setNum = req.params.num_demo;
  legoData
    .getSetByNum(setNum)
    .then((set) => {
      res.send(set);
    })
    .catch((err) => {
        res.status(404).sendFile(path.join(__dirname, "views/404.html"));
    });
});

module.exports = app;