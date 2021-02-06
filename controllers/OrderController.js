const { Controller } = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const order = require('../models/order')

class orderController extends Controller {
  constructor () {
    super(order, process.env)
  }

  async get (params) {
    const orders = await order.find(params, Controller.parseFilters(params))
    return order.convertToJson(orders)
  }

  async getById (id) {
    const order = await order.findById(id)
    if (order == null) {
      throw new Error(`${order.resourceName} ${id} not found.`)
    }

    return order.summary()
  }

  async post (body) {
    const order = await order.create(body)
    return order.summary()
  }

  async put (id, params) {
    const order = await order.findByIdAndUpdate(id, params, { new: true })
    return order.summary()
  }

  async delete (id) {
    const order = await order.findByIdAndRemove(id)
    return order
  }
}

module.exports = new orderController()

