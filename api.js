const express = require('express');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
// const socketio = require('socket.io').listen(server);

// Init Nexmo
const nexmo = new Nexmo ({
    apiKey: '', // from 'dashboard.nexmo.com/getting-started-guide'
    apiSecrets:'' // from 'dashboard.nexmo.com/getting-started-guide'
}, {debug:true});

// Init app
const app = express();

//Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//Puplic folder setup
app.use(express.static(__dirname + '/public'));

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Index Route
app.get('/', (req, res)=> {
    res.render('index');
});

// Catch form submit
app.post('/', (req, res)=>{
const number = req.body.number;
const text = req.body.text;

nexmo.message.sendSms(
    '1230354635216515' /* //virtual number */, number, text, {type:'unicode'},
    (err, responseData) => {
        if(err){
            console.log(err);
        }else {
            console.dir(responseData); //up to this point wu should be able to send the message
            // Get data from the response
            const data ={
                id: responseData.messages[0]['message-id'],
                number :responseData.messages[0]['to']
            }

            // Emit to the client
            io.emit('smsStatus', data);
        }
    } 
);
});

// Define port
const port = 3000;

// Set server
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

//Connect to sockect.io

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('connected');
    io.on('disconnect', ()=> {
        console.log('Disconnected');
    })
})





// const express = require('express');
// const app = express();
// const dotenv = require('dotenv').config();
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.SQL_DB_URI);
// const cors = require('cors');

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     })

// app.use('/restaurants/', restaurants);
// app.use('/menu', menu);

// const port = process.env.PORT || 3200;
// app.listen(port, () => {
//     `server running on port ${port}`
// });