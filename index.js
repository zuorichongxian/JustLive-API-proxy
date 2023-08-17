var express = require("express");
const proxy = require("http-proxy-middleware");
const app = express();
app.set("port", "3000");//监听3000端口，地址为 http://localhost:3000

app.all("*", function (req, res, next) {
    // 解决跨域问题
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (req.method == "OPTIONS") {
        res.send(200);
    } else {
        next();
    }
});

//普通请求
const httpProxy = proxy.createProxyMiddleware("/", {
    target: "http://live.yj1211.work",// http代理跨域目标接口
    changeOrigin: true,
    logLevel: "debug",
});
//长链接
const wsProxy = proxy.createProxyMiddleware("/", {
    target: "wss://XXX",// ws代理跨域目标接口
    changeOrigin: true, 
    ws: true, 
    logLevel: "debug",
});

app.use(httpProxy);
app.use(wsProxy);

const server = app.listen(app.get("port"), () => {
        console.log(`反向代理已开启，端口：${app.get("port")}`);
    });
//长链接请求判断(区分普通请求和长链接)
server.on('upgrade', wsProxy.upgrade); 