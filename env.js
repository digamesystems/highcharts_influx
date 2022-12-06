/** InfluxDB v2 URL */

const url = process.env['INFLUX_URL'] || 'https://europe-west1-1.gcp.cloud2.influxdata.com'
    /** InfluxDB authorization token */

const token = process.env['INFLUX_TOKEN'] || 'xtS0Ene1fl3cfwXiwJdE_Mt-UfHm3NnIFqqNMhfV1DAC4CyzfOgB-Lw9Bs3oaALvSqXIkoYF3tS09KyMAdF1_g=='
    /** Organization within InfluxDB  */

const org = process.env['INFLUX_ORG'] || 'cecd03d4a68d21b0'
    /**InfluxDB bucket used in examples  */

const bucket = process.env['BUCKET'] || 'sensor_data'
//     // ONLY onboarding example
//     /**InfluxDB user  */
// const username = 'my-user'
//     /**InfluxDB password  */
// const password = 'my-password'


module.exports = {
    url,
    token,
    org,
    bucket,
    // username,
    // password,
}