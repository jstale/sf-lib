const handler = require('serve-handler');
const http = require('http'),
      httpProxy = require('http-proxy');


var proxy = httpProxy.createProxyServer({changeOrigin: true});
 
const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options

  console.log(request.url);
  if(request.url.indexOf("/book/") > -1){
    console.log("proxy");
    return proxy.web(request, response, {
        target: 'https://www.goodreads.com/'
    });
  }

  return handler(request, response, {
    cleanUrls: true,
    public: "build"
  });
})
 
server.listen(5000, () => {
  console.log('Running at http://localhost:5000');
});