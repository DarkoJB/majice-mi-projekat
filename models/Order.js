const { Model } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })

const props = {
  shirtId: {type: String, default: ''},
  paypalOrderId: {type: String, default: ''},
  customerEmail: {type: String, default: ''},
  schema: { type: String, default: 'order', immutable: true },
  timestamp: { type: Date, default: new Date(), immutable: true }
}

class Order extends Model {
  constructor () {
    super()
    this.schema(props)
  }
}

module.exports = Order
