function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//Builds a HighCharts chart in the specified container with a multi-dimensional array of data
function setupChart(container, mutatedArray, title, subtitle, yaxisTitle){
    const queryParamsPresent = parseInt(getParameterByName('xmin')) && parseInt(getParameterByName('xmax'));
    return Highcharts.stockChart(container, {
        rangeSelector: {
            selected: 9,
            buttons: [{
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'hour',
                count: 3,
                text: '3h'
            }, {
                type: 'hour',
                count: 6,
                text: '6h'
            }, {
                type: 'day',
                count: 1,
                text: '1d'
            }, {
                type: 'day',
                count: 2,
                text: '2d'
            }, {
                type: 'day',
                count: 7,
                text: '7d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }],
        },        
        colors: ['#5A91F0', '#53A828', '#887AE2', '#CC9C00', '#EB6A57'],
        chart: {
            zoomType: 'x',
            backgroundColor: '#282B2F',
            type: 'spline',
            style: {
                fontColor: '#DFDFE0'
            },
        },
        xAxis: {
            type: 'datetime',
            tickColor: '#DFDFE0',
            lineColor: '#DFDFE0',
            min: queryParamsPresent ? parseInt(getParameterByName('xmin')) : null,
            max: queryParamsPresent ? parseInt(getParameterByName('xmax')) : null,
            labels: {
                style: {
                    color: '#DFDFE0'
                }
            },
            style: {
                color: '#DFDFE0'
            }  
        },
        yAxis: {
            lineColor: '#DFDFE0',
            tickColor: '#DFDFE0',
            labels: {
                style: {
                    color: '#DFDFE0'
                }
            },
            gridLineColor: '#DFDFE0',
            title: {
                text: yaxisTitle,
                style: {
                    color: '#DFDFE0'
                }
            }
        },
        legend: {
            enabled: true,
            itemStyle: {
                color: '#DFDFE0'
            },
        },
        plotOptions: {
            series: {
                linewidth: 0.5,
                turboThreshold: 0,   
            }
        },
        series: mutatedArray,
        title: {
            text: title,
            style: {
                color: '#DFDFE0'
            }
        },
        subtitle: {
            text: subtitle,
            style: {
                color: '#DFDFE0'
            }
        },
    });

}


// Web API to grab Sensor data. -- Data may be queried by field (measurement type, e.g. "temperature") and the 
// Device's MAC address. 
const fetchData = (field, macaddress) => {
    return fetch(`/api/v1/sensor/${field}/${macaddress}`)
        .then(res => {
            if (res.status !== 200) {
                console.log(res);
            }
            return res;
        })
        .then(res => res.json())
        .catch(error => console.log(error));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const fetchSensorDataAndPlot = (measurementField, macaddresses, containerName) => {
    return Promise.all(
        macaddresses.map(macAddress => fetchData(measurementField, macAddress))
        )
        .then(parsedRes => {

            const mutatedArray = parsedRes.map(arr => {
                return Object.assign({}, {
                    name: arr[0].macaddress + " (" + arr[0].model +")",
                    data: arr.map(obj => Object.assign({}, {
                        x: (moment(obj._time).unix()) * 1000,
                        y: obj._value
                    }))
                });
            });

            // Create the chart
            setupChart(containerName, mutatedArray, capitalizeFirstLetter(measurementField) + ' v. Time', '', capitalizeFirstLetter(measurementField));
            
        })
        .catch(error => console.log(error));

    
};

measurement = getParameterByName('measurement');

switch (measurement) {
    case 'temperature':
        macAddresses = ['A8:46:9D:1A:EA:D4',"CC:9C:3E:FF:FD:8B","CC:9C:3E:FF:FE:6D"];       
        break;
    case 'humidity':
        macAddresses = ['A8:46:9D:1A:EA:D4',"CC:9C:3E:FF:FD:8B","CC:9C:3E:FF:FE:6D"]; 
        break;
    case 'tvoc':
        macAddresses = ["CC:9C:3E:FF:FD:8B","CC:9C:3E:FF:FE:6D"]; 
        break;
    case 'pm2_5':
        macAddresses = ["CC:9C:3E:FF:FD:8B","CC:9C:3E:FF:FE:6D"];   
        break;
    default:
        macAddresses = ['A8:46:9D:1A:EA:D4',"CC:9C:3E:FF:FD:8B","CC:9C:3E:FF:FE:6D"]; 
        measurement = 'temperature';

}

fetchSensorDataAndPlot(measurement, macAddresses,'container');

console.log("xmin: " + typeof(parseInt(getParameterByName('xmin')))); 
console.log("xmax: " + typeof(parseInt(getParameterByName('xmax'))));

