function inherit(child, Parent) {
    let o = Object.create(Parent.prototype) // 以父类原型复制一个对象

    child.prototype = o // 子类原型指向这个对象

    o.constructor = child // 赋值构造函数，子类原型指向子类构造函数

}

module.exports = {
    inherit
}