// import other routes
const userRoutes = require('./API.js');


const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });
   
    
    // error handlers
    
    // development error handler
    // will print stacktrace
  
    // production error handler
    // no stacktraces leaked to user

    // // other routes
    userRoutes(app, fs);

};

module.exports = appRouter;