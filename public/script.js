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

const fetchAllLocations = () => {
    return Promise.all([  // Grabbing data by macaddress. (hack.)
            fetchData('temperature','A8:46:9D:1A:EA:D4'),
            fetchData("temperature","CC:9C:3E:FF:FD:8B"),
            fetchData('temperature',"CC:9C:3E:FF:FE:6D")
        ])
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

            return Highcharts.stockChart('container', {
                rangeSelector: {
                    selected: 4,
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
                    }
                },
                title: {
                    text: 'MT Sensor Data',
                    style: {
                        color: '#DFDFE0'
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickColor: '#DFDFE0',
                    lineColor: '#DFDFE0',
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
                        text: 'Temperature (F)',
                        style: {
                            color: '#DFDFE0'
                        }
                    }
                },
                legend: {
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
                series: mutatedArray
            });
        })
        .catch(error => console.log(error));
};

fetchAllLocations();