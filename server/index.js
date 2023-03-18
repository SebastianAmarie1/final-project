
const express = require("express") // establish connection with express
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const multer = require("multer");
const { Buffer } = require('buffer');
const format = require('pg-format');
const cors = require("cors")
const app = express();
const port = 5000
const pool = require("./db")
require('dotenv').config();

//middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
})) //cors ensures we send the right headers
app.use(express.json())//gives us access to request.body and we can get JSON data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const salt = bcrypt.genSaltSync(10);
//Routes
// methods
function toBase64(pic){
    const imageData = Buffer.from(Array.from(pic))
    const base64 = imageData.toString('base64');
    return `data:image/jpeg;base64,${base64}`
}

const accessKey = process.env.ACCESS_KEY
const refreshKey = process.env.REFRESH_KEY

app.get("/api/testing", async(req, res) => { // listens to get request from frontend 
    try {
        res.json({"Testing": "This API is Working"})//sends a JSON response with value Testing
    } catch (err) {
        console.error(err.message) //logs error
    }
})


/************** LOGIN SYSTEM ****************************/
//registering a user
app.post("/api/register", async(req, res) => {
    try {
        const { username, fName, lName, email, pwd, phonenumber, region, gender, time_created } = req.body
        const password = bcrypt.hashSync(pwd, salt)
        const query = "INSERT INTO users (username, fname, lname, email, pwd, phonenumber, region, gender, time_created) VALUES (%L, %L, %L, %L, %L, %L, %L, %L, %L) RETURNING *"
        const escapedQuery = format(query, username, fName, lName, email, password, phonenumber, region, gender, time_created)
        const newUser = await pool.query(escapedQuery)
        res.json(newUser.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

app.post("/api/checkue", async(req, res) => {
    try {
        const { username, email } = req.body

        let checkUsername = null
        if (username !== null) {
            const Uquery = "SELECT * FROM users WHERE username = %L"
            const escapedUQuery = format(Uquery, username)
            checkUsername = await pool.query(escapedUQuery)
        }

        const Equery = "SELECT * FROM users WHERE email = %L"
        const escapedEQuery = format(Equery, email) 
        const checkEmail = await pool.query(escapedEQuery)

        if ( checkUsername && checkUsername.rows[0] && checkEmail.rows[0]){
            res.json({ check: false, message: "Username And Email Are Taken By Another User." })
        }
        else if (checkUsername && checkUsername.rows[0]){
            res.json({ check: false, message: "Username Is Taken By Another User." })
        }
        else if (checkEmail.rows[0]){
            res.json({ check: false, message: "Email Is Taken By Another User." })
        } else {
            res.json({ check: true })
        }
    } catch (error) {
        console.log(error)
    }
})

//Login System
const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.users_id,
        username: user.username,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        friendslist: user.friendslist,
        phonenumber: user.phonenumber,
        gender: user.gender
    }, 
    accessKey, 
    { expiresIn: "15m"})
}
const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.users_id,
        username: user.username,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        friendslist: user.friendslist,
        phonenumber: user.phonenumber,
        gender: user.gender
    }, 
    refreshKey) 
}

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(authHeader){
        const token = authHeader.split(" ")[1]

        jwt.verify(token, accessKey, (err, user) => {
            if(err){
                return res.status(401).json("Token is not valid")
            }
            req.user = user;
            next();
        })
    } else {
        res.status(401).json("You are not authenticated")
    }
}


app.post("/api/login", async(req, res) => {

    const { username, password } = req.body; //gets username and password from body
    //add last_login
    last_login = new Date()

    const query = "SELECT * FROM users WHERE username = %L"
    const escapedQuery = format(query, username)
    const user = await pool.query(escapedQuery)

    if(user.rows[0]) {
        bcrypt.compare(password, user.rows[0].pwd, async(err, result) => {
            if (err){
                res.json({"status": "Error Logging In"})
            } 
            else if (result) {
                
                //generating a access token with the user id and wether the user is admin. sevret key is used to compare keys.
                const accessToken = generateAccessToken(user)
                const refreshToken = generateRefreshToken(user)
                
                const {users_id, username, fname, lname, email, phonenumber, profile_pic, bio, hobbie1, hobbie2, hobbie3, fact1, fact2, lie, friendslist, gender, region} = user.rows[0]
                
                try {
                    const Uquery = "UPDATE users SET refreshtoken = %L, accesstoken = %L, last_login = %L, active = %L WHERE users_id = %L"
                    const escapedUQuery = format(Uquery, refreshToken, accessToken, last_login, true, users_id)
                    await pool.query(escapedUQuery)
                } catch (error) {
                    console.log(error)
                }
            
                let pfp = null
                if (profile_pic) {
                    pfp = toBase64(profile_pic)
                }
                
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: 'strict',
                    path: "/"
                });
                
                req.session.refreshToken = refreshToken
                
                res.json({
                    users_id,
                    username,
                    fname,
                    lname,
                    email,
                    phonenumber,
                    pfp: pfp,
                    bio,
                    hobbie1,
                    hobbie2,
                    hobbie3,
                    fact1,
                    fact2,
                    lie,
                    accessToken,
                    friendslist,
                    gender,
                    region,
                    "status": "Login Successful"
                })
            } else {
                res.json({"status": "Passwords Dont Match"})
                return
            }
        })
    } else {
        res.json({"status": "Username doesnt exist"})
    }
})

app.post("/api/login/refresh", async(req, res) => {//used to generate a refresh token
    //take the refresh token and id from the user
    const { id } = req.body

    if (!req.session.refreshToken) return res.status(401).json("You are not authenticated")
    
    const query = "SELECT * FROM users WHERE users_id = %L"
    const escapedQuery = format(query, id) 
    const user = await pool.query(escapedQuery)

    if (!user.rows[0]){
        return res.status(403).json("Refresh token is not valid")
    }
    //if everything is good creates a new access token, refresh token and sends to user
    jwt.verify(req.session.refreshToken, refreshKey, async(err, user) => {
        err && console.log(err)
        
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        try {
            const Uquery = "UPDATE users SET refreshtoken = %L WHERE users_id = %L RETURNING *"
            const escapedUQuery = format(Uquery, newRefreshToken, id)
            await pool.query(escapedUQuery)
        } catch (error) {
            console.log(error)
        }

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            path: "/"
        });
        
        req.session.refreshToken = newRefreshToken

        res.status(200).json({
            accessToken: newAccessToken
        })
    })
})

//Log Out
app.post("/api/logout",verify,  async (req, res) => { // needs a verify function
    const { id } = req.body;

    try {
        const query = "UPDATE users SET refreshtoken = %L, accesstoken = %L, active = %L WHERE users_id = %L RETURNING *"
        const escapedQuery = format(query, "", "", false, id)
        await pool.query(escapedQuery)
    } catch (error) {
        console.log(error)
    }
    res.status(200).json("You Logged Out Successfully")
})

/********************************* PROFILE *********************************/
// edit details
app.put("/api/edit_details", verify, async (req, res) => {
    try {
        const { id, fname, lname, email, phone, region } = req.body;
        
        const query = "UPDATE users SET fname = %L, lname = %L, email = %L, phonenumber = %L, region = %L WHERE users_id = %L RETURNING *"
        const escapedQuery = format(query, fname, lname, email, phone, region, id)
        await pool.query(escapedQuery)
        
        const Uquery = "SELECT * FROM users WHERE users_id = %L"
        const escapedUQuery = format(Uquery, id)
        const newUser = await pool.query(escapedUQuery)
        
        res.status(200).json({
            user: newUser.rows[0]
        })
    } catch (error) {
        console.log(error)
    }
})
// edit profile
app.put("/api/edit_profile", verify, async (req, res) => {
    try {
        const { id, bio, hobbie1, hobbie2, hobbie3, fact1, fact2, lie } = req.body;

        const query = "UPDATE users SET bio = %L, hobbie1 = %L, hobbie2 = %L, hobbie3 = %L, fact1 = %L, fact2 = %L, lie = %L WHERE users_id = %L RETURNING *"
        const escapedQuery = format(query, bio, hobbie1, hobbie2, hobbie3, fact1, fact2, lie, id)
        await pool.query(escapedQuery)

        const Uquery = "SELECT * FROM users WHERE users_id = %L"
        const escapedUQuery = format(Uquery, id)
        const newUser = await pool.query(escapedUQuery)
        
        res.status(200).json({
            user: newUser.rows[0]
        })
    } catch (error) {
        console.log(error)
    }
})

app.put("/api/profile_pic", verify, upload.single("file"), async (req, res) => {
    try {
        const file = req.file
        if(!file){
            return res.status(400).json({
                status: "error",
                message: "File not found"
            });
        }

        const fileBuffer = file.buffer

        const query = "UPDATE users SET profile_pic = %L WHERE users_id = %L"
        const escapedQuery = format(query, fileBuffer, req.body.id)
        await pool.query(escapedQuery)

        const Uquery = "SELECT * FROM users WHERE users_id = %L"
        const escapedUQuery = format(Uquery, req.body.id)
        const newUser = await pool.query(escapedUQuery)
    
        const pfp = toBase64(newUser.rows[0].profile_pic)

        res.status(200).json({
            profile_pic: pfp,
        })
    } catch (error) {
        console.log(error)
    }
})


/******************************* FRIENDS ***************************************/
//Follow a user
app.post("/api/follow", verify, async (req, res) => {
    try {
        const { id, followedUser } = req.body

        const query = "SELECT friendslist FROM users WHERE users_id = %L"
        const escapedQuery = format(query, id)
        const friends = await pool.query(escapedQuery)
        
        flag = true
        if (friends.rows[0].friendslist){
            friends.rows[0].friendslist.forEach((value) => {
                if (value == followedUser){
                    flag = false
                }
            })
        }
        if (flag) {
            const Uquery = "update users set friendslist = array_append(friendslist, %L) where users_id = %L"
            const escapedUQuery = format(Uquery, followedUser, id)
            await pool.query(escapedUQuery)
            console.log("RAN FOLLOW", id)
            const Squery = "SELECT * FROM users WHERE users_id = %L"
            const escapedSQuery = format(Squery, id)
            const user = await pool.query(escapedSQuery)
            
            res.status(200).json({msg:"You Added This User Successfully", flag: true, user: user.rows[0]})
            if (id < followedUser){
                createConversation(id, followedUser)
            }
        }
        else {
            res.status(200).json({msg:"Already A Friend", flag: false})
        }
    } catch (error) {
        console.log(error)
    }
})

app.post("/api/unfollow", verify, async (req, res) => {
    try {
        const { id, newList } = req.body

        const query = "update users set friendslist = %L where users_id = %L"
        const escapedQuery = format(query, newList, id)
        const newUser = await pool.query(escapedQuery)

        res.json(newUser)
    } catch (error) {
        console.log(error)
    }
})

/*********************************** MESSAGING***********************************/
//make Conversations
    
const createConversation = async(id, pid) => {

    const query = "SELECT * FROM conversations where %L = ANY(members) AND %L = ANY(members)"
    const escapedQuery = format(query, id, pid)
    const conversations = await pool.query(escapedQuery)

    if(conversations.rows[0]){
        console.log("Conversation already started")
    } else if (id === pid){
        console.log("Cannot start conversation with self")
    } else {
        try {
            const Uquery = "INSERT INTO conversations (members, time_created) VALUES (ARRAY [%L, %L], %L) RETURNING *"
            const escapedUQuery = format(Uquery, id, pid, new Date())
            await pool.query(escapedUQuery)
        } catch (err) {
            console.error(err.message)
        }
    }
}

//get specific Conversation
app.post("/api/retrieve_conversations", verify, async(req, res) => {
    try {
        const { id } = req.body
        //sort the conversations from most active to least and return it.

        const query = "SELECT * FROM conversations WHERE %L = ANY(members)"
        const escapedQuery = format(query, id)
        let conversations = await pool.query(escapedQuery)
        
        const sortedConversations = conversations.rows.sort((a, b) => {
            if (a.last_message_date === null) {
              return new Date(b.time_created) - new Date(a.time_created);
            }
            return new Date(b.last_message_date) - new Date(a.last_message_date);
          })
        
        // get the convos and turn the members ids to objects.
        conversations = await Promise.all(sortedConversations.map(async (current) => {
            
            const Uquery = "SELECT * FROM users WHERE users_id = %L"
            const escapedUQuery = format(Uquery, current.members[0])

            const Squery = "SELECT * FROM users WHERE users_id = %L"
            const escapedSQuery = format(Squery, current.members[1])

            let [User1, User2] = await Promise.all([
                await pool.query(escapedUQuery),
                await pool.query(escapedSQuery)
            ])

            let User1pic
            let User2pic

            if(User1.rows[0].profile_pic){
                User1pic = toBase64(User1.rows[0].profile_pic)
            }
            if(User2.rows[0].profile_pic){
                User2pic = toBase64(User2.rows[0].profile_pic)
            }

            User1 = {...User1.rows[0], profile_pic: User1pic}
            User2 = {...User2.rows[0], profile_pic: User2pic}

            const newMembers = [User1, User2]

            return {
                ...current,
                members: newMembers,
            }
        }))
        res.json(conversations)
    } catch (err) {
        console.error(err.message)
    }
})

//make Message
app.post("/api/create_message", verify, async(req, res) => { 
    try {
        const { conversation_id, senderId, recieverId, message, time_sent } = req.body

        const query = "INSERT INTO messages (conversation_id, senderId, recieverId, message, time_sent ) VALUES (%L, %L, %L, %L, %L) RETURNING *"
        const escapedQuery = format(query, conversation_id, senderId, recieverId, message, time_sent)
        await pool.query(escapedQuery)
        
        const Uquery = "UPDATE conversations SET last_message = %L, last_message_date = %L WHERE conversation_id = %L"
        const escapedUQuery = format(Uquery, message, time_sent, conversation_id)
        await pool.query(escapedUQuery)

        const Squery = "SELECT active FROM users WHERE users_id = %L"
        const escapedSQuery = format(Squery, recieverId)
        const activity = await pool.query(escapedSQuery)
  
        res.json(activity.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get Messages
app.post("/api/retrieve_messages", verify, async(req, res) => {
    try {
        const { conversation_id, senderId } = req.body

        const query = "SELECT * FROM messages WHERE conversation_id = %L AND senderid = %L AND seen = false"
        const escapedQuery = format(query, conversation_id, senderId)
        let messages = await pool.query(escapedQuery)
        
        //turn all messages to seen
        await Promise.all(
            messages.rows.map(async (message) => {
                const Uquery = "UPDATE messages SET seen = true WHERE message_id = %L"
                const escapedUQuery = format(Uquery, message.message_id)
                await pool.query(escapedUQuery)
            })
          )

        //return the messages in order by date.
        const Squery = "SELECT * FROM messages WHERE conversation_id = %L"
        const escapedSQuery = format(Squery, conversation_id)
        messages = await pool.query(escapedSQuery)
        
        let sortedMessages

        await Promise.all(
            sortedMessages = messages.rows.sort((a, b) => {
                // Compare the time_sent properties of the two objects
                return new Date(a.time_sent) - new Date(b.time_sent);
            })
        )

        res.json(sortedMessages)
    } catch (err) {
        console.error(err.message)
    }
})

/*********************** GENERAL USE ****************************************/
//get Messages
app.post("/api/retrieve_user", verify, async(req, res) => {
    try {
        const { usersId } = req.body

        const query = "SELECT * FROM users WHERE users_id = %L"
        const escapedQuery = format(query, usersId)
        const newUser = await pool.query(escapedQuery)

        console.log(newUser.rows[0], "new user")
        if (newUser.rows[0].profile_pic){
            newUser.rows[0].profile_pic = toBase64(newUser.rows[0].profile_pic)
        }

        res.json(newUser.rows[0])
    } catch (err) { 
        console.error(err.message)
    }
})

//get userfriends
app.post("/api/retrieve_friends", verify, async(req, res) => {
    try {
        const { id } = req.body
        //sort the conversations from most active to least and return it.

        const query = "SELECT friendslist FROM users WHERE users_id = %L"
        const escapedQuery = format(query, id)
        let friends = await pool.query(escapedQuery)
        
        friends = friends.rows[0].friendslist
        let friendslist = []
        
        if (friends){
            friends = await Promise.all(friends.map(async (current) => {

                const query = "SELECT * FROM users WHERE users_id = %L"
                const escapedQuery = format(query, current)
                let User1 = await pool.query(escapedQuery)

                let User1pic
    
                if(User1.rows[0].profile_pic){
                    User1pic = toBase64(User1.rows[0].profile_pic)
                }
    
                User1 = {...User1.rows[0], profile_pic: User1pic}
                let tempList = []
                tempList.push(User1)
                
                return tempList
            }))
            friendslist = [].concat(...friends)
        }

        res.json(friendslist)
    } catch (err) {
        console.error(err.message)
    }
})

// used to start the server
app.listen(port, () =>{
    console.log(`Server has started on port ${port}`)
})