console.log('Hello Webpack Project.');
const _ = require('lodash');
const Chart = require('chart.js');
const $ = require('jquery');

//Updated with data untill 23/3 2020
let dataObject = require('./data.json'); 

import 'bootstrap';
import './scss/style.scss';

let ctx = document.getElementById('coronaChart');
let labels = generateLabels(dataObject.countries[1].totalDeaths);
let liniar = true;


let denmark = dataObject.countries[0];
let sweden = dataObject.countries[1];
let norway = dataObject.countries[2];

let deathData = {
    labels: labels,
    datasets: [
        {
            label:denmark.name, // + " (first death "+ denmark.dayZero +" )",
            data: denmark.totalDeaths,
            fill: false,
            borderColor: "#f0134d",
            borderWidth: 3,
            pointHoverBorderWidth: 2,
            //pointBackgroundColor: "#f0134d",
            pointBorderColor: "#f0134d",
            pointRadius: 7,
            pointRadius: 7,
            pointHoverRadius: 6,
            showLine: false,
        },
        {
            label:sweden.name, // + " (first death "+ sweden.dayZero +" )",
            data: sweden.totalDeaths,
            fill: false,
            borderColor: "#512b58",
            borderWidth: 3,
            pointHoverBorderWidth: 2,
            //pointBackgroundColor: "#512b58",
            pointBorderColor: "#512b58",
            pointRadius: 7,
            pointRadius: 7,
            pointHoverRadius: 6,
            showLine: false,
        },
        {
            label:norway.name, //+ " (first death "+ norway.dayZero +" )",
            data: norway.totalDeaths,
            fill: false,
            borderColor: "#0c7b93",
            borderWidth: 3,
            pointHoverBorderWidth: 2,
            //pointBackgroundColor: "#0c7b93",
            pointBorderColor: "#0c7b93",
            pointRadius: 7,
            pointHoverRadius: 6,
            showLine: false,
        }
    ]
}

let denmarkModel = {
    label: "noLabel",
    data: generateModel(labels, denmark.model.b, denmark.model.k),
    fill: false,
    borderColor: "#f0134d",
    borderWidth: 3,
    pointHoverBorderWidth: 2,
    //pointBackgroundColor: "#f0134d",
    pointBorderColor: "#f0134d",
    pointRadius: 0,
    pointHoverRadius: 0,
    showLine: true,
    borderDash: [3, 5]
    //steppedLine: true
}
let swedenModel = {
    label: "noLabel",
    data: generateModel(labels, sweden.model.b, sweden.model.k),
    fill: false,
    borderColor: "#512b58",
    borderWidth: 3,
    pointHoverBorderWidth: 2,
    //pointBackgroundColor: "#f0134d",
    pointBorderColor: "#512b58",
    pointRadius: 0,
    pointHoverRadius: 0,
    showLine: true,
    borderDash: [3, 5]
    //steppedLine: true
}
let norwayModel = {
    label: "noLabel",
    data: generateModel(labels, norway.model.b, norway.model.k),
    fill: false,
    borderColor: "#0c7b93",
    borderWidth: 3,
    pointHoverBorderWidth: 2,
    //pointBackgroundColor: "#f0134d",
    pointBorderColor: "#0c7b93",
    pointRadius: 0,
    pointHoverRadius: 0,
    showLine: true,
    borderDash: [3, 5]
    //steppedLine: true
}

deathData.datasets.push(denmarkModel);
deathData.datasets.push(swedenModel);
deathData.datasets.push(norwayModel);


//changes from scientific notation to regular when log scale is turned on
Chart.scaleService.updateScaleDefaults('logarithmic', {
    ticks: {
        callback: function(...args) {
            const value = Chart.Ticks.formatters.logarithmic.call(this, ...args);
            if (value.length) {
              return Number(value).toLocaleString()
            }
            return value;
        }
    }
});

//generate the chart
let coronaDeathChart = new Chart(ctx, {
    type: 'line',
    data: deathData,
    options: coronaDeathChartOptions()
})

function coronaDeathChartOptions(){
    //General options
    let options = {
        aspectRatio: 1.5,
        responsive: true,
        title: {
            display: true,
            text:'Total deaths',
            fontSize: 16
        }
    }
    //Options for scales
    let scales = {
        
            yAxes:[ {
                type: liniar? 'linear': 'logarithmic',
                scaleLabel: {
                    display: true,
                    labelString: '#of people'
                  },
                ticks: {
                    max: liniar? 50: 100
                }
                
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Time in days (day zero 11-03-2020)'
                },
            
            }]
        
    }
    // Options for legend
    let legend = {
         //align: 'start',   
        labels: {
            boxWidth: 30,
            padding: 20,
            usePointStyle: false,
            filter: function(label) {
                let returnValue = false;
                if(label.text !== 'noLabel'){
                    returnValue = true;
                } 
                return returnValue;
             }
        }
    }
    // Options for layout
    let layout = {
            padding: {
                left: 0,
                right: 50,
                top: 0,
                bottom: 0
            }
        }
    // Options for tooltips
    let  tooltips = {
            mode: "nearest",
            intersect: true,
            displayColors: false,
            callbacks: {
                label: function(tooltipItem, data) {
                    let country = data.datasets[tooltipItem.datasetIndex].label.split(' ')
                    let label = "Deaths: " + tooltipItem.yLabel;
                    label = country[0] + ": " + tooltipItem.yLabel;
                    return label;
                },
                title: function(tooltipItem, data){
                    let title = "";
                    return title;
                }
            }
    }
    let otherOptions = {
         scales,
         legend,
         layout,
         tooltips
    }
    _.merge(options, otherOptions)

    return options;
}

//generates labels for a single country
function generateLabels(data){
    let labels = Array.from(Array(data.length + 2).keys());
    // let labelnumber = 0;
    // _.forEach(data, function(value){
    //     labels.push(labelnumber);
    //     labelnumber++
    // })
    return labels;
}

function generateModel(xlabels, b, k){
    let yvalues = [];
    _.forEach(xlabels, function(value){
        let y = b*Math.exp(k*value);
        yvalues.push(y);
    });
    return yvalues;
}

$( "#logScaleButton" ).click(function() {
    liniar = !liniar;
    coronaDeathChart.options.scales.yAxes[0].type = liniar? 'linear' : 'logarithmic';
    coronaDeathChart.update(); 
});

$(document).ready(function(){
    // Change text of button element
    let denmarkT2 = Math.log(2)/denmark.model.k;
    let swedenT2 = Math.log(2)/sweden.model.k;
    let norwayT2 = Math.log(2)/norway.model.k;
    $("#denmarkInfo").html("Total deaths in Denmark doubles every " + denmarkT2.toFixed(1) + " days.");
    $("#swedenInfo").html("Total deaths in Sweden doubles every " + swedenT2.toFixed(1) + " days.");
    $("#norwayInfo").html("Total deaths in Norway doubles every " + norwayT2.toFixed(1) + " days.");
});


