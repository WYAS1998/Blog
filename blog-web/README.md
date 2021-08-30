# 文章创作平台Task

## 一、需求分析

#### 用户登陆、注册

```
1、登陆：用户名、密码非空
2、注册：用户名、密码、确认密码非空
3、注册成功返回登陆
4、登陆成功进入首页
```

#### 首页

```
1、展示当前用户头像，昵称
2、点击"个人中心"按钮进入个人中心页面
3、文章列表，可按发布时间、浏览量排序
4、点击文章组件进入文章详情页
5、支持关键词或标签搜索
```

#### 个人中心

```
1、支持发布、编辑、删除个人文章
2、修改密码与头像
```

#### 文章详情

```
对markdown文章内容解析解析，代码高亮
```

## 二、结构说明

```js
blog-web
	config  // 配置文件
    public  // 公共资源
    scripts  // 脚本文件
    .gitignore  // .gitignore
	README.md  // readme
	src
    	assets  // 静态资源
        
        	img  // 图片
            
            styles  // 全局样式
            
        components  // 组件
        
        	UploadImg  // 上传图片
            
        pages  // 页面
        
        	Login  // 登录
            
            Main  // 首页
            
            	Article  //  文章列表
                
                	ArticleItem  //  文章组件
                    
                    Detail  // 文章详情
                    
                User  // 个人中心
                
                	Edit  // 编辑文章
                    
            Register  // 注册页面
```

## 三、启动项目

```js
1、启动mongodb
2、cd blog-server
3、npm i 
4、npm start //执行编译
5、npm run serve  // 启动blog-server
5、cd blog-web
6、npm i
7、yarn start
```

## 四、踩坑

### mongodb

官网下载，安装提示服务启动失败，原因是系统权限不足

解决办法：

1、提示是否忽略时，进入电脑服务配置"services.msc"

2、找到mongodb server

3、右键点击 > 属性 > 登录  ：选择"本地系统帐户"

4、安装程序点击重试

5、配置系统变量。成功

### antd样式

引入antd时样式没生效，解决办法：在样式文件中添加@import '~antd/dist/antd.css';

### 图片上传

使用mobx进行组件间通信。

### Refused to set unsafe header "Cookie"

原因是在get方法体中强制设置的Header的Cookie属性，被认为是不安全的，去掉即可

### useEffect

```js
// 1
useEffect(()=>{
    console.log(props)
},[]) //仅在挂载和卸载的时候执行

// 2
useEffect(()=>{
    console.log(props.number)
    setNumber(props.number)
}) //所有更新都执行

// 3
useEffect(()=>{
    console.log(count)
},[count]) //count更新时执行

// 4
const Asynchronous : React.FC<PropsType>=({number})=>{
  const [number2,setNumber2] = useState(number);
  useEffect(()=>{
    console.log(number)
    setNumber2(number)
  },[number,setNumber2]) //监听props对象number的更改
  //setNumber2是useState返回的setter，所以不会在每次渲染时重新创建它，因此effect只会运行一次
}

```

### 关于分页加载

1、onChange方法将当前页号，设置给查询索引(pageIndex)，利用useEffect，当页号更新时，加载数据

2、关于setState异步的问题，同样可以使用useEffect解决

### 路由失效（跳转没效果）

解决办法：添加'exact'

### antd checkBox

默认tags勾选的问题：antd  checkbox  放在form.item 中时，设置value属性，不会生效，应该在form头部添加以下属性

```js
initialValues={{
   tags: editArticle.tags,
}}
```

input框同理

### 记住密码

用React-cookie 实现

```js
// 1、引入
import cookie from 'react-cookies'

// 2、保存
let outTime = new Date(new Date().getTime() + 24 * 3600 * 1000);//一天
cookie.save('key', "123",{ path:`/` , expires: outTime });
// note : 保存的时候，第一个参数为key，第二个为value（可以为对象），第三个为路径和过期时间

// 3、删除
cookie.remove('key')

// 4、读取
cookie.load('key')
```

