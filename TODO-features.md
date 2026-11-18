1.
添加paper_checker
（AI对话中可以进行引用，主要是搞个选择器，然后可以引用试卷）
然后整个试卷修正页面，保存快照或哈希，然后如果不同，可以进行提交（可以自己写WASM之类的加速）

试卷尽量要结构化，而不能是单文本，因为这样不好管理，然后还会需要一个katex来进行良好的渲染
订正的部分复用多轮对话的那个页面，但是使用一种不同的提示词

工程上关注解耦性，复用性，数据库的第一范式，业务约束，关系代数的表示

这一部分，还需要增加一个记忆卡片的机制

除此之外，数据的管理与组织，需要一种良好定义的数据模型，而这部分，我需要前端与后端的耦合，我需要在TS内进行良好定义，并且在后端里面进行pydantic的验证，随后附带一些错误的良好处理。

session能够让用户持有的密钥足够稀疏，从而能够保证是用户在修改自己的试卷，以及卡片，这就保证了authoritation








2.
关于重构，首先要把frontend部分全部拆到一个目录里面（TS）
里面就用ts, css, img这种风格，里面加features(如paper_checker)
这样做的好处在于，TS可以很方便地使用彼此的代码，互相引用，借助ES MODULE的导入机制
而HTML部分只需要保存一个映射即可（但是是取用的static内的JS），也就是说，把TS放到一块方便互相引用，但是编译还是编译到static内部

然后后端部分做成services








frontend/
│
├── shared/
│   ├── types/
│   │   ├── message.ts
│   │   └── api.ts
│   │
│   ├── components/
│   │   ├── MessagesArea.ts
│   │   ├── Input.ts
│   │   └── ChatPanel.ts
│   │
│   ├── chat/
│   │   ├── Store.ts
│   │   ├── Network.ts
│   │   └── ControlPlane.ts
│   │
│   └── utils/
│       └── ...
│
├── features/
│   ├── chat/
│   │   ├── main.ts
│   │   └── chat.css
│   │
│   └── paper_checker/
│       ├── main.ts
│       ├── PaperChecker.ts
│       └── paper_checker.css
│
└── ...








project/
│
├── app/
│   │
│   ├── blueprints/
│   │   ├── chat/
│   │   └── paper_checker/
│   │
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── chat_service.py
│   │   └── paper_checker_service.py
│   │
│   ├── models/
│   │
│   └── extensions.py
│
├── frontend/
│   │
│   ├── shared/
│   │   ├── components/
│   │   ├── chat/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── features/
│       ├── chat/
│       └── paper_checker/
│
├── static/
│   ├── js/
│   └── css/
│
└── templates/
    ├── chat/
    └── paper_checker/






project/
├── app/
│   ├── blueprints/
│   │   ├── chat/
│   │   └── paper_checker/
│   │
│   └── services/
│
├── frontend/
│   ├── shared/
│   │   ├── chat/
│   │   │   ├── Store.ts
│   │   │   ├── Network.ts
│   │   │   └── ControlPlane.ts
│   │   └── components/
│   │       ├── MessagesArea.ts
│   │       └── Input.ts
│   │
│   └── features/
│       ├── chat/
│       │   └── main.ts
│       └── paper_checker/
│           └── main.ts
│
├── static/
│   └── js/                 # TS 编译输出
│       ├── shared/
│       └── features/
│
└── templates/
    ├── chat/
    │   └── index.html
    └── paper_checker/
        └── index.html