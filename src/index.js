console.log('Hello Webpack Project.');
const _ = require('lodash');
const Chart = require('chart.js');
const $ = require('jquery');

//Updated with data untill 23/3 2020
let dataObject = require('./data.json'); 

import 'bootstrap';
import './scss/style.scss';
import './deathChart'

let ctx = document.getElementById('coronaChart');
let labels = generateLabels(dataObject.countries[1].totalDeaths);
let liniar = false;


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
            dayZero: denmark.dayZero,
            borderColor: "#f0134d",
            backgroundColor: "#f0134d",
            borderWidth: 2,
            pointHoverBorderWidth: 3,
            pointBackgroundColor: 'rgba(0, 0, 0, 0.1)',
            pointBorderColor: "#f0134d",
            pointRadius: 6,
            pointHoverRadius: 7,
            showLine: false,

        },
        {
            label:sweden.name, // + " (first death "+ sweden.dayZero +" )",
            data: sweden.totalDeaths,
            fill: false,
            dayZero: sweden.dayZero,
            borderColor: "#512b58",
            backgroundColor: "#512b58",
            borderWidth: 2,
            pointHoverBorderWidth: 3,
            pointBackgroundColor: 'rgba(0, 0, 0, 0.1)',
            pointBorderColor: "#512b58",
            pointRadius: 6,
            pointHoverRadius: 7,
            showLine: false,
        },
        {
            label:norway.name, //+ " (first death "+ norway.dayZero +" )",
            data: norway.totalDeaths,
            fill: false,
            dayZero: norway.dayZero,
            borderColor: "#0c7b93",
            backgroundColor: "#0c7b93",
            borderWidth: 2,
            pointHoverBorderWidth: 3,
            pointBackgroundColor: 'rgba(0, 0, 0, 0.1)',
            pointBorderColor: "#0c7b93",
            pointRadius: 6,
            pointHoverRadius: 7,
            showLine: false,
        }
    ]
}

let denmarkModelProps = generateModel(labels, denmark.model.b, denmark.model.k)
let swedenModelProps = generateModel(labels, sweden.model.b, sweden.model.k)
let norwayModelProps = generateModel(labels, norway.model.b, norway.model.k)

let denmarkModel = {
    label: "exp fit to the last 7 days. Total deaths in Denmark doubles every " + denmarkModelProps.T2 + " days",
    data: denmarkModelProps.yValues,
    fill: false,
    borderColor: "#f0134d",
    backgroundColor: "#ffffff",
    borderWidth: 3,
    pointHoverBorderWidth: 2,
    pointBackgroundColor: "#f0134d",
    //pointBorderColor: "#f0134d",
    pointRadius: 0,
    pointHoverRadius: 0,
    showLine: true,
    borderDash: [3, 5]
    //steppedLine: true
}
let swedenModel = {
    label: "exp fit to the last 7 days. Total deaths in Sweden doubles every " + swedenModelProps.T2 + " days",
    data: swedenModelProps.yValues,
    fill: false,
    borderColor: "#512b58",
    backgroundColor: "#ffffff",
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
    label: "exp fit to the last 7 days. Total deaths in Denmark doubles every " + norwayModelProps.T2 + " days",
    data: norwayModelProps.yValues,
    fill: false,
    borderColor: "#0c7b93",
    backgroundColor: "#ffffff",
    borderWidth: 3,
    pointHoverBorderWidth: 2,
    pointBackgroundColor: "#ffffff",
    //pointBorderColor: "#0c7b93",
    pointRadius: 0,
    pointHoverRadius: 0,
    showLine: true,
    borderDash: [3, 5]
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
        aspectRatio: 1.3,
        responsive: true,
        title: {
            display: true,
            text:'Total deaths',
            fontSize: 16
        }
    }
    //Options for scales
    function test(){
        return liniar? 200: 1000;
    }
    let scales = {
        
            yAxes:[ {
                type: liniar? 'linear': 'logarithmic',
                scaleLabel: {
                    display: true,
                    labelString: '#of people'
                  },
                ticks: {
                    max: test()
                }
                
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Time (days) since first death'
                },
            
            }]
        
    }
    // Options for legend
    let legend = {
         //align: 'start',   
        position: 'top', 
        labels: {
            boxWidth: 30,
            padding: 20,
            usePointStyle: false,
            filter: function(label) {
                let returnValue = false;
                if(label.text !== 'noLabel'){
                    returnValue = true;
                } 
                return true;
            },
            generateLabels(chart) {
                const datasets = chart.data.datasets;
                const options = chart.options.legend || {};
                const usePointStyle = options.labels && options.labels.usePointStyle;
    
                return chart._getSortedDatasetMetas().map((meta) => {
                    const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
    
                    return {
                        text: datasets[meta.index].label,
                        fillStyle: datasets[meta.index].backgroundColor, //style.backgroundColor,
                        hidden: meta.hidden,
                        lineCap: style.borderCapStyle,
                        lineDash: style.borderDash,
                        lineDashOffset: style.borderDashOffset,
                        lineJoin: style.borderJoinStyle,
                        lineWidth: style.borderWidth,
                        strokeStyle: style.borderColor,
                        pointStyle: style.pointStyle,
                        rotation: style.rotation,
    
                        // Below is extra data used for toggling the datasets
                        datasetIndex: meta.index
                    };
                }, this);
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
            mode: 'nearest',
            intersect: true,
            displayColors: false,
            callbacks: {
                label: function(tooltipItem, data) {
                    let country = data.datasets[tooltipItem.datasetIndex].label.split(' ')
                    let label =country[0] + ": " + tooltipItem.yLabel + " deaths";
                    return label;
                },
                title: function(tooltipItem, data){
                    let test = tooltipItem[0].datasetIndex;
                    let date = new Date(calculateDate(data.datasets[tooltipItem[0].datasetIndex].dayZero, tooltipItem[0].xLabel));
                     let title = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();
                    return title;
                }

            }
    }

     let hover = {
         mode: 'nearest'
     }

    let otherOptions = {
         scales,
         legend,
         layout,
         tooltips,
         hover
    }
    _.merge(options, otherOptions)

    return options;
}

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

function generateModel(xlabels, b, k){
    let yvalues = [];
    let T2;
    _.forEach(xlabels, function(value){
        let y = b*Math.exp(k*value);
        yvalues.push(y);
    });
    T2 = Math.log(2)/k;
    return {
        yValues: yvalues,
        T2: T2.toFixed(1)
    };
}

function calculateDate(dayZero, numberDays){
    let dateString = dayZero.split('-');
    let dayZeroNew = new Date(dateString[2], dateString[1] -1, dateString[0]);
    let returnDate = new Date();
    return returnDate.setDate(dayZeroNew.getDate() + numberDays);
}

$( "#logScaleButton" ).click(function() {
    liniar = !liniar;
    coronaDeathChart.options.scales.yAxes[0].type = liniar? 'linear' : 'logarithmic';
    coronaDeathChart.options.scales.yAxes[0].ticks.max = liniar? 200 : 1000 ;
    coronaDeathChart.options.scales.yAxes[0].ticks.maxTicksLimit = liniar? 20 : 13 ;
    coronaDeathChart.update(); 
});



