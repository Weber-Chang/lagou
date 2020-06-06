# 简答题

1. 描述引用计数的工作原理和优缺点。

   原理：给对象中添加一个引用计数器，每当有一个地方引用它时，计数器的值就加1；当引用失效时，计数器值就减1；任何时刻计数器为0的对象就是不可能再被使用的。这也就是需要回收的对象。

   它的优点：

   可立即回收垃圾

   最大暂停时间短

   不需要沿指针查找

   

   它的缺点：

   计数器值的增减处理频繁

   计数器需要占用很多位

   循环引用无法回收

   

2. 描述标记整理算法的工作流程

   标记整理算法是将复制算法和标记清除算法结合的产物。

   当我们进行标记清除之后，就可能会产生内存碎片。在内存整理之前，所有的碎片空间都无法容纳完整的对象，而在内存整理之后，碎片空间被合并成一个大的空间，也能容纳下新对象

3. 描述V8中新生代存储区垃圾回收的流程

   新生代Scavenge为新生代采用的算法，是一种采用复制的方式实现的垃圾回收算法。它将堆内存分为from（处于使用状态）和to（处于闲置状态）两个空间。当我们分配对象时,先是在 From 空间中进行分配。当开始进行垃圾回收时,会检查 From 空间中的存活对象,这 些存活对象将被复制到 To 空间中,而非存活对象占用的空间将会被释放。完成复制后,From 空 间和To空间的角色发生对换。该算法是牺牲空间换时间

4. 描述增量标记算法在何时使用，及工作原理

    增量收集算法的基础仍是传统的标记清除和复制算法。增量收集算法通过对进程间冲突的妥善处理，允许垃圾收集进程以分阶段的方式完成标记、清理或复制工作。增量算法的具体机制可以用不同，但其思想都是把堆栈分为多个域，每次仅从一个域收集垃圾，从而造成较小的应用程序中断。

   何时使用？应在那些更重视缩短最大暂停时间而不是最大吞吐量的应用程序

   

   # 代码题

   1. 基于以下代码完成下面四个练习

      练习1：

      使用函数组合fp.flowRight()重新实现下面这个函数

      let isLastInStock = function(cars) {

      ​	// 获取最后一条数据

      ​	let last_car = fp.last(cars)

      ​	// 获取最后一条数据的in_stock属性值

      ​	return fp.prop('in_stock', last_car)

      }

      答：

      const isLastInStock = fp.flowRight(fp.prop('in_stock'),fp.last)
      console.log(isLastInStock(cars))

      

      练习2：

      使用 fp.flowRight()、fp.prop() 和 fp.first() 获取第一个 car 的 name

      答：

      const getFirstCarName = fp.flowRight(fp.prop('name'),fp.first) console.log(getFirstCarName(cars))

      

      练习3：

      使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现

      let _average = function(xs) {

      ​	return fp.reduce(fp.add, 0, xs) / xs.length

      } *// <- 无须改动*

      let averageDollarValue = function (cars) {
      	let dollar_values = fp.map(function(car) { return car.dollar_value }, cars)
      	return _average(dollar_values)
      }

      答：

      let averageDollarValue = fp.flowRight(_average,fp.map(car=>car.dollar_value))
      console.log(averageDollarValue(cars))
      // 第二种写法
      let averageDollorValue = fp.flowRight(_average, fp.map(fp.curry(fp.props)('dollar_value')))
      console.log(averageDollorValue(cars))
      // 第三种写法
      function compose(f,g){
          return function(value){
            return f(g(value))
          }
        }
        let _average = function(xs){
          fp.reduce(fp.add,0,xs) / xs.length
        }

        let averageDollarValue = function(cars){
          let dollar_values = fp.map(function(car){
            return car.dollar_value
          },cars)
          return dollar_values
        }

        let B = compose(_average,averageDollarValue)

      练习四：

      使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串，把数组中的 name 转换为这种形式：例如：sanitizeNames([“Hello World”]) => [“hello_world”]

      let _underscore = fp.replace(/\W+/g, '_') // <-- 无须改动，并在 sanitizeNames 中使用它

      答：

      let sanitizeNames = fp.flowRight(fp.map(_underscore), fp.map(car => car.name))
      console.log(sanitizeNames(CARS))
      // 第二种写法
      const sanitizeNames = fp.map(car=>{
          car.name = fp.flowRight(_underscore,fp.toLower)(car.name)
          return car
      })
      console.log(sanitizeNames(cars))
      //第三种写法
      let sanitizeNames = fp.flowRight(fp.map(fp.flowRight(fp.toLower, _underscore)))
      console.log(sanitizeNames(['Hello World'])) // [ 'hello_world' ]
      // 第四种写法
       let _underscore = fp.replace(/\W+/g,'_')
       var sanitizeNames = fp.map(item => (
           {
               ...item,
               name: fp.flowRight(_underscore, fp.toLower)(item.name)
           }
       ))
       console.log(sanitizeNames(CARS))
      // 第五种写法
       const sanitizeNames = fp.map(
           fp.flowRight(_underscore,fp.toLower,fp.prop('name'))
         )
       console.log(sanitizeNames(CARS))

      

   2. 基于下面提供的代码，完成后续的四个练习

      // support.js
      class Container {
        static of (value) {
          return new Container(value)
        }
        constructor (value) {
          this._value = value
        }
        map (fn) {
          return Container.of(fn(this._value))
        }
      }

      class Maybe {
        static of (x) {
          return new Maybe(x)
        }
        isNothing () {
          return this._value === null || this._value === undefined
        }
        constructor (x) {
          this._value = x
        }
        map (fn) {
          return this.isNothing ? this : Maybe.of(fn(this._value))
        }
      }

      module.exports = {
        Maybe,
        Container
      }

      练习1：使用 fp.add(x, y) 和 fp.map(f, x) 创建一个能让 functor 里的值增加的函数 ex1

      const fp = require('lodash/fp')
      const { Maybe, Container } = require('./support')

      let maybe = Maybe.of([5, 6, 1])
      let ex1 = // ...你需要实现的位置

      答：

      let ex1 = maybe.map(x => fp.map(fp.add(1), x))
      console.log(ex1)

      

      练习2：实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素

      const fp = require('lodash/fp')

      const { Maybe, Container } = require('./support')

      let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
      let ex2 = // ...你需要实现的位置

      答：

      let ex2 = fp.map(fp.first)
      console.log(xs.map(ex2))
      // 第二种写法
      let ex2 = ()=> xs.map(fp.first)._value
      // 第三种写法
      let ex2 = xs.map(x => fp.first(x) ) 
      console.log(ex2())

      

      练习3：实现一个函数 ex3，使用 safeProp 和 fp.first 找到 user 的名字的首字母

      const fp = require('lodash/fp')

      const { Maybe, Container } = require('./support')

      let safeProp = fp.curry(function (x, o) { return Maybe.of(o[x]) })
      let user = { id: 2, name: "Albert" }
      let ex3 = // ...你需要实现的位置

      答：

      // 第一种写法
      let ex3 = fp.flowRight(fp.map(fp.first), safeProp('name'))
      console.log(ex3(user))
      // 第二种写法
      let ex3 = safeProp('name',user).map(x => fp.first(x))
      console.log(ex3(user))

      

      练习4：使用 Maybe 重写 ex4，不要有 if 语句

      const fp = require('lodash/fp')

      const { Maybe, Container } = require('./support')

      let ex4 = function (n) {
        if (n) { return parseInt(n) }
      }

      答：

      //第一种写法
      let ex4 = fp.flowRight(fp.map(parseInt), Maybe.of)
      console.log(ex4(1)) // 1
      console.log(ex4('7')) // 7
      console.log(ex4(null)) // undefined
      console.log(ex4('null')) // NaN
      console.log(ex4('Abc')) // NaN
      console.log(ex4(undefined)) // undefined

      console.log(ex4({obj:'hhh'})) // NaN

      // 第二种写法
      let ex4 = n=>Maybe.of(n).map(parseInt)
      console.log(ex4)

      

      

      

      

   