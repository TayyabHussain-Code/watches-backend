module.exports = {
    login: require('./user'),
    brand: require('./brand'),
    category: require('./category'),
    paramsIdValidation: require('./paramsIdValidation'),
    product : require('./product').create,
    productUpdate : require('./product').update,
    cart: require('./cart'),
    checkout: require('./checkout'),
    cancelOrder: require('./cancelOrder').cancelOrder,
    changeOrderStatus: require('./cancelOrder').changeOrderStatus,
    review: require('./review'),
}