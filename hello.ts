// This is an industrial-grade general-purpose greeter function:
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");

`

TS使用 npm install -g typescript安装ts
全局

如果局部安装就用npx tsc node_module

不对，是npm install -D typescript
这会装到依赖里面

然后是TS的功能
由于JS缺乏类型注释，就导致你调用另一个类的时候需要记住所有方法，导致大型项目复杂度爆炸

而TS通过两种方式：

class {
    property: number;
}

interface aninterface {
    property: number;
}

type atype = true | false | "atype" | string[];

这种方式可以定义类型，比如选择某种值，或者设置泛型

Array<string> generics

然后通过这两种方式，让类 export class Aclass implements ClassDefinition {
};

用这种方式进行类的类型声明，
这样有几个好处，一个是对类进行注释，然后如果说之后导入了别的类

import type {ClassDefinition} from "myclass"

就可以在调用方法的时候抛出错误了，这样就方便很多

然后还有个错误传播的机制，如果你定义处和调用处都用了一个类型定义，那改了实现也会把实现部分抛出错误，这样就可以显式地抛出修改传播，
这样的话其实就可以考虑说只引用类，不要把修改封装到顶部，不过封装到顶部阻止修改传播也是有效的，即使有TS


`