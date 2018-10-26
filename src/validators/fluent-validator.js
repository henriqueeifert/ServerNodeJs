'use strict';

let errors = [];

function ValidationContract() {
    errors = [];
}

ValidationContract.prototype.isRequired = (campo, value, message) => {
    if (!value || value.length <= 0)
        errors.push({ campo: message });
}

ValidationContract.prototype.hasMinLen = (campo, value, min, message) => {
    if (!value || value.length < min)
        errors.push({ campo: message });
}

ValidationContract.prototype.hasMaxLen = (campo, value, max, message) => {
    if (!value || value.length > max)
        errors.push({ campo: message });
}

ValidationContract.prototype.isFixedLen = (campo, value, len, message) => {
    if (value.length != len)
        errors.push({ campo: message });
}

ValidationContract.prototype.isEmail = (campo, value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
        errors.push({ campo: message });
}

ValidationContract.prototype.errors = () => { 
    return errors; 
}

ValidationContract.prototype.clear = () => {
    errors = [];
}

ValidationContract.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = ValidationContract;