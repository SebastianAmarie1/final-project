
const express = require('express');
const app = express();
const io = require("socket.io")(8900, {
    cors:{
        origin:["http://localhost:3000","http://localhost:3001", "http://localhost:3002"],
        methods: [ "GET", "POST" ] 
    }
})

let usersHash = {}
let rooms = [] // rooms waiting to be fulfilled.
let activeRooms = {} //there are 2 users in a room.

let roomId = 0

const deleteRooms = (roomId) => {
    rooms = rooms.filter((obj) => obj.roomId !== roomId)
}

const deleteRoomsById = (Id) => {
    rooms = rooms.filter((obj) => obj.first !== Id)
}

const checkRooms = (roomId) => {
    inArray = false
    rooms.forEach((value) => {
        if(value.roomId === roomId){
            inArray = true
        }
    })
    return inArray
}

const checkAvailableRoom = (id, gender, socket, signal) =>{
    let available = false

    for (let i =0 ; i < rooms.length; i++){
        if(rooms[i].gender !== gender) {
            available = true
            socket.join(rooms[i].roomId)
            io.to(socket.id).emit("setRoomId", {
                roomId: rooms[i].roomId,
            })
        
            activeRooms[rooms[i].roomId] = {first: rooms[i].first, second: id}
            deleteRooms(rooms[i].roomId)
            break
        }
    }

    return available
}

io.on("connection", (socket) => {

    console.log(rooms, "R")

    socket.on('printUsers', () => {
        console.log(rooms)
        console.log(activeRooms)
    })
 
///////////////////////// Adding Users //////////////////////////

    socket.on('addUser', (data) => {
        if(data.userId == undefined || data.name == undefined){
            console.log("No User Data Sent To Socket")
        } else {
            usersHash[data.userId] = {socketId: socket.id, username:data.name}
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

///////////////////////// Video System ////////////////////////////

socket.on('search', ({id, gender, signal}) => { // user_id, gender
    deleteRoomsById(id)
    if (rooms.length <= 0 | !checkAvailableRoom(id, gender, socket, signal)) {// create a unique room.
        const roomName =`room${roomId}`
        roomId = roomId + 1
        rooms.push({roomId: roomName, first: id, gender: gender})
        socket.join(roomName)

        io.to(socket.id).emit("setRoomId", {
            roomId: roomName,
        })

        console.log(rooms, "Rooms")
    }
})

///////////////// DISCONNECTIONS /////////////////////////////////

    socket.on('leaveRoom', ({roomId}) => { // user_id, gender
        if (checkRooms(roomId)) {
            deleteRooms(roomId)
        } else if (activeRooms[roomId]){
            delete activeRooms[roomId]
        }
        socket.leave(roomId)

        console.log(rooms)
    })
    socket.on("rmvUser", (data) => {
        delete usersHash[data.userId]
        deleteRoomsById(data.userId)
    })
    socket.on("disconnect", () => {console.log("a user has disconnected")})
})

