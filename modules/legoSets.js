const setData = require("../data/setData");
const themeData = require("../data/themeData");


let sets = [];

function initialize() { // This function needs to be called explicitly to generate array 'sets'
    //It saves time from running 2 for-loops to compare their 'id' in both arrays themeData and setData.
    return new Promise((resolve, reject) => {

        let lookUp = {};
        themeData.forEach(element => {
            lookUp[element.id] = element.name
        });
        //Generating a lookUp table formatted as 
        // {"id":"name"};
        // {"1":"Technic"},{"3","Competition"}......
        sets = [...setData];
        sets.forEach(set => {
            set.theme = lookUp[set.theme_id];
            //Now array 'sets' matches {"theme":"name"}       
        });

        resolve();
    }
    )

}




function getAllSets() { //Return the sets
    return new Promise((resolve, reject) => {

        resolve(sets);

    })
}





function getSetByNum(setNum) {

    return new Promise((resolve, reject) => {
        let set = sets.find(set => {

            return set.set_num == setNum;

        });
        if (set) {
            resolve(set);
        } else {
            reject(`can't find set number: ${setNum}`);
        }

    })

}


function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {


        let filteredArray = sets.filter((set) => {
            // themeData.json contain only 750 objects.
            // any set id exceeding 750 will receive 'null' for theme. Therefore , there is neither 'toLowerCase' or 'includes' methods for 'null'. So confirming that theme not null is required.
            return set.theme && set.theme.toLowerCase().includes(theme.toLowerCase())
        });

        if (filteredArray) {
            resolve(filteredArray)
        } else {
            reject(`theme ${theme} is not found!`)
        }

    })


}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }


