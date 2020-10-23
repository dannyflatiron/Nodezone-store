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
    constructor(title, imageUrl, description, price) {
        this.title = title,
        this.description = description,
        this.imageUrl = imageUrl,
        this.price = price
    }

    save() {
        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (error) => {
                console.log(error)
            })
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }
}