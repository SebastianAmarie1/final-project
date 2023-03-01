
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

const checkAvailableRoom = (id, gender, socket) =>{
    let available = false

    for (let i =0 ; i < rooms.length; i++){
        if(rooms[i].gender !== gender) {
            available = true
            socket.join(rooms[i].roomId)
            io.to(socket.id).emit("setRoomId", {
                roomId: rooms[i].roomId,
                initiator: true,
            })
        
            activeRooms[rooms[i].roomId] = {first: rooms[i].first, second: id}
            deleteRooms(rooms[i].roomId)
            break
        }
    }

    return available
}

io.on("connection", (socket) => {
 
///////////////////////// Adding Users //////////////////////////

    socket.on('addUser', (data) => {
        if(data.userId == undefined || data.name == undefined){
            console.log("No User Data Sent To Socket")
        } else {
            usersHash[data.userId] = {socketId: socket.id, username:data.name, id:data.userId}
        }
        io.emit('onlineUsers', { onlineUsers: usersHash })
    })

    socket.on('seeOnlineUsers', (data) => {
        io.to(socket.id).emit('recieveOnlineUsers', { onlineUsers: usersHash })
    })
///////////////////////// Messaging System ///////////////////////

    socket.on('sendMessage', (data) => {
        io.to(usersHash[data.recieverId].socketId).emit("messageRecieved", {
            senderId: data.senderId,
            recieverId: data.recieverId,
            message: data.message,
            time_sent: data.time_sent,
        })
    })

///////////////////////// Video System ////////////////////////////

socket.on('search', ({id, gender}) => { // user_id, gender
    deleteRoomsById(id)
    if (rooms.length <= 0 | !checkAvailableRoom(id, gender, socket)) {// create a unique room.
        const roomName =`room${roomId}`
        roomId = roomId + 1
        rooms.push({roomId: roomName, first: id, gender: gender})
        socket.join(roomName)

        io.to(socket.id).emit("setRoomId", {
            roomId: roomName,
            initiator: false,
        })
    }
})

socket.on("callUser", (data) => {
    try {
        users = activeRooms[data.roomId]
        let send 
        if (users.first === data.id){
            send = users.second
        } else{
            send = users.first
        }
    
        io.to(usersHash[send].socketId).emit("answerUser", { signal: data.signal, roomId: data.roomId, partnerId: data.id })
    } catch (error) {
        console.log("FAILED CALL")
        socket.to(data.roomId).emit("callFailed")
    }
})

socket.on("answerCall", (data) => {
    try {
        users = activeRooms[data.roomId]
        let send 
        if (users.first === data.id){
            send = users.second
        } else{
            send = users.first
        }
    
        io.to(usersHash[send].socketId).emit("callAccepted", { signal: data.signal, partnerId: data.id })
    } catch (error) {
        console.log("FAILED CALL")
        socket.to(data.roomId).emit("callFailed")
    }
})

socket.on("endCall", (data) => {
    delete activeRooms[data.roomId]
    socket.broadcast.to(data.roomId).emit("callEnded")
})

socket.on("refreshedCall", (data) => {
    console.log("RAN ")
    socket.broadcast.to(data.roomId).emit("callEnded")
})

socket.on("editVideo", (data) => {
    socket.broadcast.to(data.roomId).emit("changeVideo", { active: data.active })
})

socket.on("responseNextStage", (data) => {
    socket.broadcast.to(data.roomId).emit("responseNextStage", { response: data.response })
})

socket.on("Follow", (data) => {
    console.log("RAN FOLLOW")
    console.log(data.userDetails.username, "user")
    socket.broadcast.to(data.roomId).emit("responseFollow", { response: data.response, userDetails: data.userDetails })
})

///////////////// DISCONNECTIONS /////////////////////////////////

    socket.on('leaveRoom', ({roomId}) => { // user_id, gender
        if (checkRooms(roomId)) {
            deleteRooms(roomId)
        } else if (activeRooms[roomId]){
            delete activeRooms[roomId]
        }
        socket.leave(roomId)
    })
    socket.on("rmvUser", (data) => {
        delete usersHash[data.userId]
        deleteRoomsById(data.userId)
        io.emit('onlineUsers', { onlineUsers: usersHash })
    })
    socket.on("disconnect", () => {console.log("a user has disconnected")})
})

