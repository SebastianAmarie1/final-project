
const express = require('express');
const app = express();
const io = require("socket.io")(8900, {
    cors:{
        origin:["http://localhost:3000","http://localhost:3001", "http://localhost:3002"],
        methods: [ "GET", "POST" ] 
    }
})

let usersHash = {}
let rooms = []
let activeRooms = []

//SOCKET
io.on("connection", (socket) => {

    console.log(socket.id, "S")

    socket.on('printUsers', () => {
        console.log(socket.id)
        console.log(usersHash)
    })
 
///////////////////////// Adding Users //////////////////////////

    socket.on('addUser', (data) => {
        if(data.userId == undefined || data.name == undefined){
            console.log("No User Data Sent To Socket")
        } else {
            usersHash[data.userId] = {socketId: socket.id, username:data.name}
            console.log(usersHash, "USER HASH UPDATED")
        }
    })

///////////////////////// Messaging System ///////////////////////


    socket.on('sendMessage', (data) => {

        io.to(usersHash[data.recieverId].socketId).emit("messageRecieved", {
            senderId: data.senderId,
            recieverId: data.recieverId,
            message: data.message,
        })
    })


///////////////////////// Video System ///////////////////

    

///////////////// DISCONNECTIONS ////////////////////////////////

    socket.on("rmvUser", (data) => {delete usersHash[data.userId]})
    socket.on("disconnect", () => {console.log("a user has disconnected")})
})

