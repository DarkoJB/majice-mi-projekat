const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const Controller = vertex.Controller
const Shirt = require('../models/Shirt')

class ShirtController extends Controller {
  constructor () {
    super(Shirt, process.env)
  }

	get(params) {
		return new Promise((resolve, reject) => {
			Shirt.find(params, Controller.parseFilters(params))
			.then(shirts => {
				resolve(Shirt.convertToJson(shirts))
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	getById(id) {
		return new Promise((resolve, reject) => {
			Shirt.findById(id)
			.then(shirt => {
				if (shirt == null){
					throw new Error(Shirt.resourceName + ' ' + id + ' not found.')
				}

				resolve(shirt.summary())
			})
			.catch(err => {
				reject(new Error(Shirt.resourceName + ' ' + id + ' not found.'))
			})
		})
	}

  post (body){
    return new Promise((resolve, reject) =>{
      if(body.name != null){
        body.slug = vertex.utils.slugVersion(body.name, 6)
      }

      Shirt.create(body)
      .then(shirt => {
        resolve(shirt.summary())
      })
      .catch(err => {
        reject(err)
      })
    })
  }

	put(id, params) {
		return new Promise((resolve, reject) => {
			let payload = null

			Shirt.findByIdAndUpdate(id, params, {new:true})
			.then(shirt => {
				resolve(shirt.summary())
			})
			.catch(err => {
				reject(err)
			})
		})
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			Shirt.findByIdAndRemove(id)
			.then(() => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}
}

module.exports = new ShirtController()

