//This is where we'll configure the various routes things like the route of the Web site pages 
const express=require('express');

//create an app
var app= express();

//Templating engine : templating engine let us render HTML but do it in a dynamic way 
//where you can inject values like a user name or the current date inside of the template.
//handlebars is a view engine for node js other eg are ejs and pug
//hbs is a wrapper around handlebar 
const hbs= require('hbs');
//adding support for partials, providing absolute path as an input
hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine','hbs');
//use helpers to get value from a function while rendering a page
hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text)=>{
 return text.toUpperCase();
});

const fs= require('fs');

//express middleware : middleware lets you configure how your express application works, hepls to tweek how express usually works
//middleware helps teach express what it usually does not do
//app.use takes middleware function as an input
//all app.use statements run in the order they are written
//Next exists so you can tell express that when your middleware function is done and this is useful because
//you can have as much a middleware as you like register to a single express app.
//if the middleware doesn't call 'next' handlers for each request they're never going to fire
app.use((request,response,next)=>{
    //such functions can hepl in authentiaction, reequest logging and response time etc
    var now=new Date().toString();
    var log=`${now} : ${request.method} ${request.path}`;
    fs.appendFile('server.log',log+'\n',(err)=>{
        if(err){
            console.log('unable to write to server.log');
        }
    });
    next();
});
//the below code will run and stop othe pages from rendering when we are in maintenance mode
// app.use((request,response,next)=>{
//     response.render('maintenance.hbs',{
//         pageTitle:'Sorry we are down for maintenance',
//         message:'we will be back soon !'
//     });
// });

//express.static takes as an input the path we want the user to view
app.use(express.static(__dirname+'/public'));

//route handlers, read as 'when someone makes a /(i.e root call) get call run this function(i.e 2nd argument)'
//express sets reesponse Content-Type by itself
app.get('/',(request,response)=>{
    //response body data
  //  response.send('<h1>hello express !</h1>');
    // response.send({
    //     name:'Apoorva',
    //     likes:['making your life miserable','i enjoy that a lot']
    // });
    //response.renders take the name of the view as the first argument
    response.render('home.hbs',{
        pageTitle:'Home Page',
        welcomeMsg:'Welcome!! to my page'
    });
});

app.get('/about',(request,response)=>{
    response.render('about.hbs',{
        pageTitle:'About Page'
    });
})

app.get('/bad',(request,response)=>{
    response.send({
        errorMessage:'unable to serve the request'
    });
})

//app.listen is going to bind the application to a port on our machine, we can then listen to requests
//2nd argument is optional and takes a function that runs once the server has started
app.listen(3000,()=>{
    console.log('server running on port 3000');
});
 
