/**
 * 继承原型
 * @param {*} Child 
 * @param {*} Parent 
 */
function inherit(Child, Parent) {
    let o = Object.create(Parent.prototype)
    Child.prototype = o 
    o.constructor = Child 
}

module.exports = {
    inherit
}