const apiBenchmark = require('./libs/api-benchmark')
// const fs = require('fs')

const anvilToken = '' // Anvil token for current tests
// TODO: Make it save token from first test and use it in second

const anvilReferer = '' // Signin referer
const anvilOrigin = ''
const anvilNonce = ''

const clientId = '' // 123-456-789...
const clientEmail = '' // name@email.cz
const clientPassword = '' // Heslo1234
const clientProvider = 'password'


const service = {
    anvilService: "https://anvil-devel.voipex.eu" // Anvil endpoint uri
}

const routes = {
    signinTest: {
        method: 'post',
        route: '/signin',
        expectedStatusCode: 302,
        headers: {
            'Referer': anvilReferer,
            'Origin': anvilOrigin,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            email: clientEmail,
            password: clientPassword,
            provider: clientProvider,
            response_type: 'id_token token',
            client_id: clientId,
            redirect_uri: 'https://client1.local/connect/anvil/callback',
            scope: 'openid profile realm email',
            nonce: anvilNonce
        }
    },
    loggedTest: {
        method: 'get',
        route: '/',
        expectedStatusCode: 200,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + anvilToken
        }
    }
}

apiBenchmark.measure(service, routes, {
    debug: true,
    runMode: 'parallel',
    maxConcurrentRequests: 100,
    delay: 0,
    maxTime: 60,
    minSamples: 100,
    stopOnError: false
}, function (err, results) {
    const signInTest = results.anvilService.signinTest
    const loggedInTest = results.anvilService.loggedTest

    const isSignInOk = signInTest.response && signInTest.response.header && signInTest.response.header.location
    const isLoggedOk = loggedInTest.response && loggedInTest.response.body && JSON.parse(loggedInTest.response.body).version

    console.log('Sign in test', isSignInOk ? 'PASSED' : 'FAILED')
    console.log('Logged in test', isLoggedOk ? 'PASSED' : 'FAILED')

    // This just saves HTML prety graph
    // apiBenchmark.getHtml(results, function(error, html){
    //   fs.writeFileSync('benchmarks_anvil.html', html)
    // })
})
