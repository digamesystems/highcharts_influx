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

            return Highcharts.chart('container', {
                colors: ['#508991', '#175456', '#09BC8A', '#78CAD2'],
                chart: {
                    zoomType: 'x',
                    type: 'spline'
                },
                title: {
                    text: 'MT Sensor Data',
                    style: {
                        'color': '#175456',
                    }
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: 'Temperature (F)'
                    }
                },
                plotOptions: {
                    series: {
                        linewidth: 0.5,
                        turboThreshold: 2000,
                        
                    }
                },
                series: mutatedArray
            });
        })
        .catch(error => console.log(error));
};

fetchAllLocations();