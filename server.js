const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();

legoData.initialize();
const HTTP_PORT =  3000; 

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));


app.get('/', (req, res) => {
    res.send("Assignment 2: Hanfu Xiao - 033503145")

})

app.get('/lego/sets', (req, res) => {
    legoData.getAllSets().then((sets) => {
        res.send(sets).catch((err) => {
            res.send(err);
        })
    })
}

)

app.get('/lego/sets/num-demo', (req, res) => {
    legoData.getSetByNum('005-1').then((set) => {res.send(set)}).catch((err) => {
        res.send(err)
    })
}

)

app.get('/lego/sets/theme-demo', (req, res) => {
    legoData.getSetsByTheme('tech').then((set) =>{res.send(set)}).catch((err) => {
        res.send(err)
    })
}

)