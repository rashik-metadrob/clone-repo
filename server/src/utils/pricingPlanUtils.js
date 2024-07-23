const _ = require('lodash')
const { PRICING_PLAN_FEATURES_KEY, PRICING_PLAN_VALUE } = require('./constant')

const buildPricingPlansInfomations = (features, isDrobA) => {
    const items = []

    if(!isDrobA){
        let feature = _.find(features, {key: PRICING_PLAN_FEATURES_KEY.NUM_OF_STORES_DRAFT})
        if(feature){
            items.push(`Draft ${_.get(feature, ['value'])} Shownrooms`) 
        }
    
        // Hard code
        items.push(`Gallery media Type Image + 3D`)
    
        feature = _.find(features, {key: PRICING_PLAN_FEATURES_KEY['3D_PRODUCT_LIBRARY_ACCESS']})
        if(feature){
            items.push(`${_.get(feature, ['value'], '')} 3D Library access`) 
        }
    
        feature = _.find(features, {key: PRICING_PLAN_FEATURES_KEY.MULTIPLAYER})
        if(feature){
            items.push(`Multiplayer - ${_.get(feature, ['value'], false) ? 'Yes' : 'No'}`) 
        }
    
        feature = _.find(features, {key: PRICING_PLAN_FEATURES_KEY.WHITE_LABELLING})
        if(feature){
            items.push(`White Labelling - ${_.get(feature, ['value'], false) ? 'Yes' : 'No'}`) 
        }
    } else {
        let feature = _.find(features, {key: PRICING_PLAN_FEATURES_KEY.NUM_OF_STORES_DRAFT})
        if(feature){
            items.push(`Draft ${_.get(feature, ['value'])} Shownrooms`) 
        }

        // Hard code
        items.push(`Gallery media Type Image + 3D`)

        feature = _.find(features, {key: PRICING_PLAN_FEATURES_KEY['3D_PRODUCT_LIBRARY_ACCESS']})
        if(feature){
            items.push(`${_.get(feature, ['value'], '')} 3D Library access`) 
        }

        items.push(`Drag & Drop Functionality.`)

        items.push(`Add your E-commerce link to products.`)
    }
    

    return items
}

module.exports = {
    buildPricingPlansInfomations
}