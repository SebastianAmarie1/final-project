
const io = require("socket.io")(8900, {
    cors:{
        origin:["http://localhost:3000","http://localhost:3001", "http://localhost:3002"],
        methods: [ "GET", "POST" ] 
    }
})

let usersHash = {}


//SOCKET
io.on("connection", (socket) => {
    console.log(socket.id, "MYSOCKET")
    console.log(usersHash)
 
///////////////////////// Messaging System ///////////////////
            //adding a user to the usersArray//

    
    socket.on("addUser", (data) => {
        console.log(socket.id, "RAN ADD USER")
        if(data.userId == undefined || data.name == undefined){
            console.log("No User Data Sent To Socket")
        } else {
            usersHash[data.userId] = [socket.id, data.name]
        }
    })

    socket.on("sendMessage", ({ userId, recieverId, text }) => {
        console.log(usersHash[recieverId][0], usersHash[recieverId][1])
        console.log(usersHash[userId][0], "|" , socket.id)
        io.to(usersHash[recieverId][0]).emit("getMessage", {
            senderId: userId,
            recieverId: recieverId, 
            text
        })
    })


///////////////////////// Video System ///////////////////

    

///////////////// DISCONNECTIONS ////////////////////////////////

    socket.on("rmvUser", (data) => {delete usersHash[data.userId]})
    socket.on("disconnect", (data) => {console.log("a user has disconnected")})
})

