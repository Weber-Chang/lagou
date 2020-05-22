# 简答题

1. ![image-20200521123743465](/Users/Yue/Library/Application Support/typora-user-images/image-20200521123743465.png)

最终结果是10

说明：首先var声明方式属于全局声明，i为Number属于原始数据类型，存储在栈内存中，而function是函数，属于引用数据类型，存储在堆内存，在栈内存上仅存储一个指向堆内存的地址，内部console.log(i)的i存储的是一个指针指向栈内存的i。

当for循环结束后，a\[6\]()进行函数调用，函数内部便会通过指针将栈内存中全局变量i当前的值打印出来，所以是打印出10。

2. ![image-20200521132155526](/Users/Yue/Library/Application Support/typora-user-images/image-20200521132155526.png)

   结果是ReferenceError: Cannot access 'tmp' before initialization
   
   说明：let和var都是声明变量的方式，不同的是let有块级作用域，并且不会发生变量提升，题目中console.log（tmp）在if的块级作用域中，而接下来一行才是let声明，由于let不会发生变量提升，故会报错
   
3. ![image-20200522062800636](/Users/Yue/Library/Application Support/typora-user-images/image-20200522062800636.png)

   var arr = [12, 34, 32, 89, 4]
   var iMin = Math.min(...arr)
   console.log(iMin)

4. ![image-20200522063626276](/Users/Yue/Library/Application Support/typora-user-images/image-20200522063626276.png)
   var：最传统的变量声明方式，存在变量提升，声明后全局可用

   let：ES6变量声明方式，有块级作用域，不存在变量提升

   const：ES6常量声明方式，声明赋值后不可改变，有块级作用域，不存在变量提升

5. ![image-20200522064040589](/Users/Yue/Library/Application Support/typora-user-images/image-20200522064040589.png)

   上面代码中，`setTimeout`的参数是一个箭头函数，这个箭头函数的定义生效是在`fn`函数生成时，箭头函数导致`this`总是指向函数定义生效时所在的对象，所以输出的是`20`

6. ![image-20200522064924873](/Users/Yue/Library/Application Support/typora-user-images/image-20200522064924873.png)

   Symbol 用途是标识对象属性、作为类的私有属性

7. ![image-20200522064937633](/Users/Yue/Library/Application Support/typora-user-images/image-20200522064937633.png)

   首先，深拷贝和浅拷贝是针对引用数据类型的

   浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。

   深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

8. ![image-20200522064948778](/Users/Yue/Library/Application Support/typora-user-images/image-20200522064948778.png)

   JS异步编程是相对于同步来讲的，由于js是单线程的，遇到耗时任务时同步代码会等待耗时操作完成并阻塞下面的代码执行，而异步不会阻塞下面代码的执行，异步是将耗时操作的代码扔给webapi，等webapi处理完再塞回到js线程中，然后继续运行

   EventLoop：负责监听调用栈和消息队列Quene，当消息队列发生变化，Event loop就会监听到，调用栈为空的时候就会把消息队列第一位的内容压入调用栈去执行，如此循环往复

   宏任务和微任务都是js事件循环机制的内容，宏任务是按顺序执行，当一个宏任务执行完后会去找当前任务下是否有微任务，有则先执行完全部微任务再进行下一个宏任务。

   常见的宏任务：整体代码script，setTimeout，setInterval

   常见的微任务：Promise，process.nextTick

9. ![image-20200522065001062](/Users/Yue/Library/Application Support/typora-user-images/image-20200522065001062.png)

   ```javascript
   const promise = new Promise((res, rej) => {
   	setTimeout(() => {
   		var a = 'hello'
   		res(a)
   	}, 10)
   })
   promise
   	.then(result => new Promise((res, rej) => {
   		setTimeout(() => {
   			var b = 'lagou'
   			res(result + b)
   		}, 10)
   	}))
   	.then(result => {
   		setTimeout(() => {
   			var c = 'I ❤️ U'
   			console.log(result + c)
   		}, 10)
   	})
   ```

10. ![image-20200522065014813](/Users/Yue/Library/Application Support/typora-user-images/image-20200522065014813.png)

    TypeScript 是 JavaScript 的超集，包含了 JavaScript 的所有元素，可以载入 JavaScript 代码运行，并扩展了 JavaScript 的语法，如静态类型、类、模块、接口和类型注解

11. ![image-20200522065024764](/Users/Yue/Library/Application Support/typora-user-images/image-20200522065024764.png)

    优点：1.增强代码的可读性，可维护性和扩展性，能让其他同事仅看代码也能理解原作者想要实现的功能和变量的含义

    2.兼容好，可以直接在.ts上面写js代码，大部分均能兼容

    3.用户人群多，拥有获取的社区和问答网站

    4.提供了ES6的支持并能兼容低版本的浏览器

    5.能在编写代码的时候就能检测到错误而不是在编译的时候

    缺点：1.学习成本高，写法等偏后端，对前端工程师并不是特别友好

    2.如果需要对旧项目增加ts，短期内的开发成本较高

    3.有小部分js的写法不兼容，如下：

    ```javascript
    function contact() {
        this.name = "Jackie Ge"
    
        return {
            cname: this.name,
            getCname() {
                return this.cname
            }
        }
    }
    
    var c = new contact
    console.log(c.cname, c.getCname())
    ```

    4.总是强制让写很多接口，很繁琐
