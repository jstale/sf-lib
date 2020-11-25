const handler = require('serve-handler');
const http = require('http'),
      httpProxy = require('http-proxy');


var proxy = httpProxy.createProxyServer({changeOrigin: true});
const PORT = process.env.PORT || 5000;

const server = http.createServer((request, response) => {
  if(request.url.indexOf("/book/") > -1 || request.url.indexOf("/search/") > -1){
    console.log("proxy");
    return proxy.web(request, response, {
        target: 'https://www.goodreads.com/'
    });
  }

  return handler(request, response, {
    cleanUrls: true,
    public: "build",
    "rewrites": [
        { "source": "books/**", "destination": "/index.html" }
      ]
  });
})
 
server.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}` );
});