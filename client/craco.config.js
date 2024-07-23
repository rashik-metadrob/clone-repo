module.exports = {
  devServer: {
    // https: {
    //   key: fs.readFileSync("C:/Users/User/localhost-key.pem"),
    //   cert: fs.readFileSync("C:/Users/User/localhost.pem"),
    //   ca: fs.readFileSync("C:/Users/User/AppData/Local/mkcert/rootCA.pem"),
    // },
    client: {
      // webSocketURL: "wss://localhost:8080/ws",
      // webSocketURL: "ws://curious-formerly-gnu.ngrok-free.app/ws",
      webSocketURL: "wss://testing.metadrob.com/ws",
      //webSocketURL: "wss://curious-formerly-gnu.ngrok-free.app/ws",
      logging: 'verbose'
    },
    proxy: {
      "/v1": {
        target: "https://testing.metadrob.com",
        secure: false,
        // bypass: function (req, res, proxyOptions) {
        //   if (req.headers.accept.indexOf('html') !== -1) {
        //     console.log('Skipping proxy for browser request.');
        //     return '/index.html';
        //   }
        // },
      },
      "/shopify": {
        target: "https://testing.metadrob.com",
        secure: false,
      },
      "/uploads": {
        target: "https://testing.metadrob.com",
        secure: false,
      },
    },
  },
};
