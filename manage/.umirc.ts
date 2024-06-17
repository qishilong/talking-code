import { defineConfig } from "@umijs/max";
const path = require("path");

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: "Talking Code",
    pure: true,
    loading: true
  },
  dva: {},
  routes: [
    {
      path: "/",
      access: "NormalAdmin",
      redirect: "/home"
    },
    {
      name: "首页",
      path: "/home",
      component: "./Home",
      access: "NormalAdmin",
      icon: "HomeOutlined"
    },
    {
      name: " 管理员",
      path: "/admin",
      icon: "UserOutlined",
      access: "SuperAdmin",
      routes: [
        {
          path: "adminList",
          name: "管理员列表",
          access: "SuperAdmin",
          component: "./Admin"
        },
        {
          path: "addAdmin",
          name: "添加管理员",
          access: "SuperAdmin",
          component: "@/pages/Admin/addAdmin"
        }
      ]
    },
    {
      name: " 用户",
      path: "/user",
      access: "NormalAdmin",
      icon: "TeamOutlined",
      routes: [
        {
          path: "userList",
          name: "用户列表",
          access: "NormalAdmin",
          component: "./User"
        },
        {
          path: "addUser",
          name: "添加用户",
          access: "NormalAdmin",
          component: "./User/addUser"
        },
        {
          path: "editUser/:id",
          name: "编辑用户",
          access: "NormalAdmin",
          component: "./User/editUser",
          hideInMenu: true
        }
      ]
    },
    {
      name: "书籍",
      path: "/book",
      access: "NormalAdmin",
      icon: "ReadOutlined",
      routes: [
        {
          path: "bookList",
          name: "书籍列表",
          access: "NormalAdmin",
          component: "./Book"
        },
        {
          path: "addBook",
          name: "添加书籍",
          access: "NormalAdmin",
          component: "./Book/addBook"
        },
        {
          path: "editBook/:id",
          name: "编辑书籍信息",
          access: "NormalAdmin",
          component: "./Book/editBook",
          hideInMenu: true
        }
      ]
    },
    {
      name: "文章",
      path: "/article",
      access: "NormalAdmin",
      icon: "EditOutlined",
      routes: [
        {
          path: "articleList",
          name: "文章列表",
          access: "NormalAdmin",
          component: "./Article"
        },
        {
          path: "addArticle",
          name: "添加文章",
          access: "NormalAdmin",
          component: "./Article/addArticle"
        },
        {
          path: "articleList/:id",
          name: "文章详情",
          access: "NormalAdmin",
          component: "./Article/articleDetail",
          hideInMenu: true
        },
        {
          path: "editArticle/:id",
          name: "编辑文章",
          access: "NormalAdmin",
          component: "./Article/editArticle",
          hideInMenu: true
        }
      ]
    },
    {
      name: "推荐",
      path: "/recommend",
      icon: "GiftOutlined",
      routes: [
        {
          path: "recommendList",
          name: "推荐详情",
          access: "NormalAdmin",
          component: "./Recommend"
        },
        {
          path: "editRecommend",
          name: "修改推荐详情",
          access: "NormalAdmin",
          component: "./Recommend/EditRecommend"
        }
      ]
    },
    {
      name: " 问答",
      path: "/issue",
      icon: "ProfileOutlined",
      access: "NormalAdmin",
      component: "./Issue"
    },
    {
      name: " 问答详情",
      path: "/issue/:id",
      component: "./Issue/issueDetail",
      access: "NormalAdmin",
      hideInMenu: true
    },
    {
      name: "评论",
      path: "/commentList",
      component: "./Comment",
      access: "NormalAdmin",
      icon: "CalendarOutlined"
    },
    {
      name: "类型",
      path: "/typeList",
      component: "./Type",
      access: "NormalAdmin",
      icon: "AppstoreOutlined"
    },
    {
      path: "/login",
      component: "./Login",
      menuRender: false
    }
  ],
  proxy: {
    "/api": {
      target: "http://127.0.0.1:1818",
      changeOrigin: true
    },
    "/static": {
      target: "http://127.0.0.1:1818",
      changeOrigin: true
    },
    "/res": {
      target: "http://127.0.0.1:1818",
      changeOrigin: true
    }
  },
  npmClient: "yarn",
  chainWebpack(config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunk: "all",
          minSize: 3000,
          minChunk: 2,
          maxAsyncRequests: 5, // 同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
          maxInitialRequests: 3, // 首页加载的时候引入的文件最多3个
          name: true,
          automaticNameDelimiter: ".", //连接符
          cacheGroups: {
            cacheVendors: {
              name: "vendors", //|antd|@ant-design|react|react-dom |@toast-ui\/\react-editor|@toast-ui /^.*node_modules[\\/
              test: /[\\/]node_modules[\\/](lodash|axios|antd|@ant-design|react|react-dom|react-canvas-nest|@toast-ui\/\react-editor|@toast-ui)/,
              chunk: "all",
              minChunks: 2,
              priority: 9
            },
            asyncCommons: {
              // 其余异步加载包
              chunks: "async",
              minChunks: 2,
              name: "asyncCommons",
              priority: 8
            },
            commons: {
              // 其余同步加载包
              chunks: "all",
              minChunks: 2,
              name: "commons",
              priority: 7
            }
          }
        }
      }
    });
  },

  deadCode: {
    patterns: [path.resolve(__dirname, "./src")]
  },
  // phantomDependency: {},

  codeSplitting: {
    jsStrategy: "granularChunks"
  },
  hash: true,
  jsMinifier: "terser",
  externals: {
    // react: 'window.React',
    // 'react-dom': 'window.ReactDOM',
    moment: "window.moment"
    // antd: 'window.antd',
    // '@toast-ui/react-editor': 'commonjs Editor',
    // '@toast-ui/editor': 'commonjs Editor',
  },
  links: [
    // {
    //   href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.4.0/reset.min.css',
    //   rel: 'stylesheet',
    // },
    // {
    //   href: 'https://cdn.jsdelivr.net/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.css',
    //   rel: 'stylesheet',
    // },
  ],
  headScripts: [
    // 'https://cdn.jsdelivr.net/npm/react@18.1.0/umd/react.production.min.js',
    // 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.1.0/umd/react-dom.production.min.js',
    "https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js"
    // 'https://cdn.jsdelivr.net/npm/@toast-ui/react-editor@3.2.3/dist/toastui-react-editor.min.js',
    // 'https://cdn.jsdelivr.net/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.js',
    // 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.4.0/antd-with-locales.min.js',
  ],
  analyze: {
    analyzerMode: "server",
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: "stats.json",
    logLevel: "info",
    defaultSizes: "parsed" // stat  // gzip
  }
});
