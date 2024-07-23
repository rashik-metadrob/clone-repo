const ADDRESS_TYPE = {
    SHIPPING_ADDRESS: 0,
    BILLING_ADDRESS: 1
}
const allAddressTypes = {
    0: "SHIPPING_ADDRESS",
    1: "BILLING_ADDRESS",
};

const addressTypes = Object.keys(allAddressTypes).map(el => +el);

module.exports = {
    addressTypes,
    allAddressTypes,
    ADDRESS_TYPE
};