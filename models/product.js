const fs = require('fs')
const path = require('path')
const p = path.join(
    path.dirname(require.main.filename), 
    'data', 
    'products.json'
    )
const getProductsFromFile = (cb) => {
    fs.readFile(p, (error, fileContent) => {
        if (error) {
           return cb([])
        }
        cb(JSON.parse(fileContent))
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title,
        this.imageUrl = imageUrl,
        this.description = description,
        this.price = price
    }

    // get products array
    // find index of product from array that matches this
    // ensure immutability of products array
    // replace existing product in products array with this
    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(product => product.id === this.id)
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this
                fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                    console.log(error)
                })
            } else {
                this.id = Math.random().toString()
                products.push(this)
                fs.writeFile(p, JSON.stringify(products), (error) => {
                    console.log(error)
                })
            }
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id)
            cb(product)
        })
    }
}