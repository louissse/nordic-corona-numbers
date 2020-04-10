let dataObject = require('./data.json'); 



let ctx = document.getElementById('coronaChart');
let labels = generateLabels(dataObject.countries[1].totalDeaths);
let liniar = false;


let denmark = dataObject.countries[0];
let sweden = dataObject.countries[1];
let norway = dataObject.countries[2];


//generates labels for a single country
function generateLabels(data){
    let labels = Array.from(Array(data.length + 10).keys());
    // let labelnumber = 0;
    // _.forEach(data, function(value){
    //     labels.push(labelnumber);
    //     labelnumber++
    // })
    return labels;
}