module.exports = {
    login: require('./user'),
    brand: require('./brand'),
    category: require('./category'),
    paramsIdValidation: require('./paramsIdValidation'),
    product : require('./product').create,
    productUpdate : require('./product').update,
}