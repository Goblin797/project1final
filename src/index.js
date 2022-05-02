const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
app.set('view-engine','ejs')
//app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://goblin797:Monkey721@cluster0.skwvd.mongodb.net/kaushik12?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.use('/', route);


app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});