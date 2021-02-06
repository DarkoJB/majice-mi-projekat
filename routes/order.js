const express = require('express')
const router = express.Router()
const paypal = require('@paypal/checkout-server-sdk')
const controllers = require('../controllers')
const paypalClient = (credentials, env) => {
    const {clientId, clientSecret} = credentials

    const {SandboxEnvironment, LiveEnvironment, PayPalHttpClient} = paypal.core
    const ppEnvironment = (env ==='dev') ? new SandboxEnvironment(clientId, clientSecret) : new LiveEnvironment(clientId, clientSecret)
    //ako zelimo da naplata bude u Live-u onda dev menjamo u prod

    return new PayPalHttpClient(ppEnvironment)
}

router.post('/create', async (req, res, next)=>{
    const { shirtId } = req.body
    const shirtCtr = controllers.shirt.instance()
    const shirt = await shirtCtr.getById(shirtId)

    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units:[
            {
                amount: {
                    currency_code: 'USD',
                    value: `${shirt.price}`,
                }
            }
        ]
    })

    try {
        const credentials = {
            clientId: process.env.PP_CLIENT_ID,
            clientSecret: process.env.PP_CLIENT_SECRET
        }
        const order = await paypalClient(credentials, 'dev').execute(request)
        res.json({
            orderID: order.result.id
        })
    } catch (error) {
        res.json({
            confirmation: 'fail',
            message: error.message
        })
    }
})

router.post('/complete', async (req, res, next) =>{
    //console.log(JSON.stringify(req.body))
    const {shirtId, paypalOrderId, customerEmail} = req.body
    res.json(req.body)
    const orderController = controllers.order.instance()
    const order = await orderCtr.post({
        shirtId,
        paypalOrderId,
        customerEmail
    })
})

router.get('/create', (req, res, next)=>{
    res.json({
        confirmation: 'success',
        data: 'Ovo je ruta za narudzbinu'
    })
})

module.exports = router