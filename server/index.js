
const express = require("express") // establish connection with express
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const multer = require("multer");
const { Buffer } = require('buffer');
const escape = require('pg-escape');
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



/************** LOGIN SYSTEM ****************************/
//registering a user
app.post("/api/register", async(req, res) => {
    try {
        const { username, fName, lName, email, pwd, phonenumber, region, gender, time_created } = req.body //gets the description from the body
        const password = bcrypt.hashSync(pwd, salt)
        
        const newUser = await pool.query("INSERT INTO users (username, fname, lname, email, pwd, phonenumber, region, gender, time_created) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [username, fName, lName, email, password, phonenumber, region, gender, time_created]) //create a query where you insert 
        //something inside the description value. $1 is a placeholder and , [description] will specify that that placeholder should be
        //RETURNING * is everytime you do action you will return back the data
        res.json(newUser.rows[0])//This is where the data is located at
    } catch(err) {
        console.error(err.message)
    }
})

app.post("/api/checkue", async(req, res) => {
    try {
        const { username, email } = req.body

        let checkUsername = null
        if (username !== null) {
            checkUsername = await pool.query("SELECT * FROM users WHERE username = $1 ", [username])
        }
        const checkEmail = await pool.query("SELECT * FROM users WHERE email = $1 ", [email])

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

    
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username])

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
                    await pool.query("UPDATE users SET refreshtoken = $1, accesstoken = $2, last_login = $3, active = $4 WHERE users_id = $5", [refreshToken, accessToken, last_login, true, users_id])
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
 
    const user = await pool.query("SELECT * FROM users WHERE users_id = $1", [id])

    if (!user.rows[0]){
        return res.status(403).json("Refresh token is not valid")
    }
    //if everything is good creates a new access token, refresh token and sends to user
    jwt.verify(req.session.refreshToken, refreshKey, async(err, user) => {
        err && console.log(err)
        
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        try {
            const updateUser = await pool.query("UPDATE users SET refreshtoken = $1 WHERE users_id = $2 RETURNING *", [newRefreshToken, id])
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
        const updateUser = await pool.query("UPDATE users SET refreshtoken = $1, accesstoken = $2, active = $3 WHERE users_id = $4 RETURNING *", ["", "", false, id])
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

        await pool.query("UPDATE users SET fname = $1, lname = $2, email = $3, phonenumber = $4, region = $5 WHERE users_id = $6 RETURNING *", [fname, lname, email, phone, region, id])
        const newUser = await pool.query("SELECT * FROM users WHERE users_id = $1", [id])
        
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

        await pool.query("UPDATE users SET bio = $1, hobbie1 = $2, hobbie2 = $3, hobbie3 = $4, fact1 = $5, fact2 = $6, lie = $7 WHERE users_id = $8 RETURNING *", [bio, hobbie1, hobbie2, hobbie3, fact1, fact2, lie, id])
        const newUser = await pool.query("SELECT * FROM users WHERE users_id = $1", [id])
        
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
        await pool.query("UPDATE users SET profile_pic = $1 WHERE users_id = $2", [fileBuffer, req.body.id])
        
        const newUser = await pool.query("SELECT * FROM users WHERE users_id = $1", [req.body.id])
    
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

        const friends = await pool.query("SELECT friendslist FROM users WHERE users_id = $1", [id])
        
        flag = true
        if (friends.rows[0].friendslist){
            friends.rows[0].friendslist.forEach((value) => {
                if (value == followedUser){
                    flag = false
                }
            })
        }
        if (flag) {
            await pool.query("update users set friendslist = array_append(friendslist, $1) where users_id = $2", [followedUser, id])
            const user = await pool.query("SELECT * FROM users WHERE users_id = $1", [id])
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
        const newUser = await pool.query("update users set friendslist = $1 where users_id = $2", [newList, id])
        res.json(newUser)
    } catch (error) {
        console.log(error)
    }
})

/*********************************** MESSAGING***********************************/
//make Conversations
    
const createConversation = async(id, pid) => {
    const conversations = await pool.query("SELECT * FROM conversations where $1 = ANY(members) AND $2 = ANY(members)", [id, pid])
    if(conversations.rows[0]){
        console.log("Conversation already started")
    } else if (id === pid){
        console.log("Cannot start conversation with self")
    } else {
        try {
            await pool.query("INSERT INTO conversations (members, time_created) VALUES (ARRAY [$1, $2], $3) RETURNING *", [id, pid, new Date()])
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
        let conversations = await pool.query("SELECT * FROM conversations WHERE $1 = ANY(members)", [id])
        
        const sortedConversations = conversations.rows.sort((a, b) => {
            if (a.last_message_date === null) {
              return new Date(b.time_created) - new Date(a.time_created);
            }
            return new Date(b.last_message_date) - new Date(a.last_message_date);
          })
        
        // get the convos and turn the members ids to objects.
        conversations = await Promise.all(sortedConversations.map(async (current) => {
            let [User1, User2] = await Promise.all([
                pool.query("SELECT * FROM users WHERE users_id = $1", [current.members[0]]),
                pool.query("SELECT * FROM users WHERE users_id = $1", [current.members[1]])
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
        await pool.query("INSERT INTO messages (conversation_id, senderId, recieverId, message, time_sent ) VALUES ($1, $2, $3, $4, $5) RETURNING *", [conversation_id, senderId, recieverId, message, time_sent])
        await pool.query("UPDATE conversations SET last_message = $1, last_message_date = $2 WHERE conversation_id = $3", [message, time_sent, conversation_id])
        const activity = await pool.query("SELECT active FROM users WHERE users_id = $1", [recieverId])
        res.json(activity.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get Messages
app.post("/api/retrieve_messages", verify, async(req, res) => {
    try {
        const { conversation_id, senderId } = req.body
        let messages = await pool.query("SELECT * FROM messages WHERE conversation_id = $1 AND senderid = $2 AND seen = false", [conversation_id, senderId])
        
        //turn all messages to seen
        await Promise.all(
            messages.rows.map(async (message) => {
                await pool.query("UPDATE messages SET seen = true WHERE message_id = $1", [message.message_id])
            })
          )

        //return the messages in order by date.
        messages = await pool.query("SELECT * FROM messages WHERE conversation_id = $1",[conversation_id]);
        
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

        const newUser = await pool.query("SELECT * FROM users WHERE users_id = $1", [usersId])

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
        let friends = await pool.query("SELECT friendslist FROM users WHERE users_id = $1", [id])
        
        friends = friends.rows[0].friendslist
        let friendslist = []
        
        if (friends){
            friends = await Promise.all(friends.map(async (current) => {
                let User1 = await pool.query("SELECT * FROM users WHERE users_id = $1", [current])
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