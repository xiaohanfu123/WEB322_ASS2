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
express.urlencoded({ extended: true });
app.use(express.json());
app.set("views", path.join(__dirname, "views")); //set path of 'views'
app.set("view engine", "ejs");

legoData.initialize();
const HTTP_PORT = 3000;

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.get("/", (req, res) => {
  res.render("home");
}); // M

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/lego/addSet", (req, res) => {
  legoData
    .getAllThemes()
    .then((themes) => {
      res.render("addSet", { themes });
    })
    .catch((error) => {
      console.error("Error fetching themes:", error);
      res.status(500).render("500", { msg: "Internal Server Error" });
    });
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;

  if (theme) {
    legoData
      .getSetsByTheme(theme)
      .then((filteredSets) => {
        res.render("sets", { sets: filteredSets, page: "/lego/sets" }); //passing in filtered theme by 'getSetByTheme'
      })
      .catch((err) => {
        res.status(404).render("404", { msg: "Unable to find requested sets" });
      });
  } else {
    legoData
      .getAllSets()
      .then((legoSets) => {
        res.render("sets", { sets: legoSets, page: "/lego/sets" }); //all the EJS variables must be passed here
      })
      .catch((err) => {
        console.error("Error fetching all sets:", err);
        res.status(404).render("404", { msg: "Unable to find all sets" });
      });
  }
});

app.post("/lego/addSet", (req, res) => {
  const setData = req.body; // Captures all form data submitted by the user

  legoData
    .addSet(setData)
    .then(() => {
      res.redirect("/lego/sets"); // Redirect to the list of sets or another appropriate page
    })
    .catch((error) => {
      console.error("Error adding new set:", error);
      res.render("500", {
        msg: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    });
});

app.get("/lego/sets/:num_demo", (req, res) => {
  const setNum = req.params.num_demo;
  legoData
    .getSetByNum(setNum)
    .then((set) => {
      res.render("set", { page: "", set: set });
    })
    .catch((err) => {
      res.status(404).render("404", { msg: "Unable to find requested set" });
    });
});

app.get("/lego/editSet/:num", (req, res) => {
  const setNum = req.params.num;

  legoData
    .getSetByNum(setNum)
    .then((setData) => {
      legoData
        .getAllThemes()
        .then((themes) => {
          res.render("editSet", { themes: themes, set: setData });
        })
        .catch((err) => {
          console.error("Error fetching themes:", err);
          res.status(404).render("404", { msg: "Unable to find themes data." });
        });
    })
    .catch((err) => {
      console.error("Error fetching set data:", err);
      res
        .status(404)
        .render("404", { msg: "Unable to find the requested set." });
    });
});

app.post("/lego/editSet", (req, res) => {
  const set_num = req.body.set_num; // Capture the set_num from the form data
  const setData = req.body; // Capture the form data in setData

  legoData
    .editSet(set_num, setData) // Pass set_num and setData as parameters to the editSet function
    .then(() => {
      res.redirect("/lego/sets"); // Redirect to the list of sets or another appropriate page
    })
    .catch((error) => {
      console.error("Error editing set:", error);
      res.render("500", {
        msg: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    });
});

app.get("/lego/deleteSet/:num", (req, res) => {
  let setNum = req.params.num;
  legoData
    .deleteSet(setNum)
    .then(() => {
      res.redirect("/lego/sets");
    })
    .catch((err) => {
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

app.use((req, res) => {
  res.status(404).render("404", {
    msg: "I'm sorry, we're unable to find what you're looking for.",
  });
}); //middleware 404 functions , will catch all the routes then render 404

module.exports = app;
