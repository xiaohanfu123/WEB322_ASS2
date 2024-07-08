/********************************************************************************
 * WEB322 – Assignment 04
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: ___HANFU XIAO______ Student ID: ____033503145__________ Date: __7/6/2024___________
 *
 * Published URL: ______https://web-322-ass-2-2v90lkdcj-xiaohanfu123s-projects.vercel.app/_____________
 ********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.set('views',path.join(__dirname,"views")); //set path of 'views'
app.set("view engine", "ejs");

legoData.initialize();
const HTTP_PORT = 3000;

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.get("/", (req, res) => {
  res.render('home');
}); // M

app.get("/about", (req, res) => {
  res.render('about')});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme; //req.query is a key-value pair after ? like /lego/sets?theme=123 . '123' is the value of key 'theme' , now it's assigning 123 to variable theme.

  if (theme) {
    legoData
      .getSetsByTheme(theme)
      .then((filteredSets) => {
        res.render("sets", { sets: filteredSets, page: "/lego/sets" }); //passing in filtered theme by 'getSetByTheme' 
    })
      .catch((err) => {
        res.status(404).render('404'),{msg:'Unable to find requested sets'};
      });
  } else {
    legoData
      .getAllSets()
      .then((legoSets) => {
        res.render("sets", {sets: legoSets, page: "/lego/sets"}) //all the EJS variables must be passed here
      })
      .catch((err) => {
        res.status(404).render('404'),{msg:'Unable to find requested sets'};
      });
  }
});

app.get("/lego/sets/:num_demo", (req, res) => {
  const setNum = req.params.num_demo;
  legoData
    .getSetByNum(setNum)
    .then((set) => {
      res.render('set',{page:'',set:set});
    })
    .catch((err) => {
      res.status(404).render('404',{msg:'Unable to find requested set'});
    });
});

app.use((req, res) => {
  res.status(404).render('404',{msg:"I'm sorry, we're unable to find what you're looking for."});
}); //middleware 404 functions , will catch all the routes then render 404


module.exports = app;
