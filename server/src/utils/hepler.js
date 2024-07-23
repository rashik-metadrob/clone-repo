const { uuid } = require('uuidv4');
const DATA_HELPER = {
    convertObjectToModel: (object) => {
        let data = object;
        if(object.toObject){
            data = object.toObject()
        }

        data.id = data._id || data.id;
        delete data._v

        return data
    },
    uuidv4: () => {
        return uuid()
    }
}

module.exports = {
    DATA_HELPER
}