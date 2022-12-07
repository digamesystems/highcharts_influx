/** InfluxDB v2 URL */
const url = process.env['INFLUX_URL'] || 'https://europe-west1-1.gcp.cloud2.influxdata.com'

// InfluxDB organization code
const org = process.env['INFLUX_ORG'] || 'cecd03d4a68d21b0'
    
/**InfluxDB bucket used in examples  */

const bucket = process.env['BUCKET'] || 'sensor_data'

module.exports = {
    url,
    org,
    bucket
}