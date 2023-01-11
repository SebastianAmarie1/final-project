
const express = require("express") // establish connection with express
const app = express();
const port = 5000
const cors = require("cors")
const pool = require("./db")
const jwt = require("jsonwebtoken");


//middleware
app.use(cors()) //cors ensures we send the right headers
app.use(express.json())//gives us access to request.body and we can get JSON data

//Routes
//registering a user
app.post("/api/register", async(req, res) => {
    try {
        const { username, fName, lName, email, pwd, phonenumber, region, gender, time_created } = req.body //gets the description from the body
        const newUser = await pool.query("INSERT INTO users (username, fname, lname, email, pwd, phonenumber, region, gender, time_created) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [username, fName, lName, email, pwd, phonenumber, region, gender, time_created]) //create a query where you insert 
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
        const checkUsername = await pool.query("SELECT * FROM users WHERE username = $1 ", [username])
        const checkEmail = await pool.query("SELECT * FROM users WHERE email = $1 ", [email])

        if (checkUsername.rows[0] && checkEmail.rows[0]){
            res.json({ check: false, message: "Username And Email Are Taken By Another User." })
        }
        else if (checkUsername.rows[0]){
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
    "mySecretAccessKey", 
    { expiresIn: "10s"})//change my secret to a env.file
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
    "mySecretRefreshKey") 
}

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(authHeader){
        const token = authHeader.split(" ")[1]

        jwt.verify(token, "mySecretAccessKey", (err, user) => {
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
    
    const user = await pool.query("SELECT * FROM users WHERE username = $1 AND pwd = $2", [username, password])

    if(user.rows[0]) {
        //generating a access token with the user id and wether the user is admin. sevret key is used to compare keys.
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        const {users_id, username, fname, lname, email, phonenumber, friendslist, gender, region} = user.rows[0]
        try {
            const updateUser = await pool.query("UPDATE users SET refreshtoken = $1, accesstoken = $2, last_login = $3, active = $4 WHERE users_id = $5", [refreshToken, accessToken, last_login, true, users_id])
        } catch (error) {
            console.log(error)
        }

        res.json({
            users_id,
            username,
            fname,
            lname,
            email,
            phonenumber,
            accessToken,
            refreshToken,
            friendslist,
            gender,
            region,
        })
    }
    else{
        res.status(400).json("Username or Password incorrect!")
    }
})

app.post("/api/refresh", async(req, res) => {//used to generate a refresh token
    //take the refresh token and id from the user
    const { id, refreshToken } = req.body

    if (!refreshToken) return res.status(401).json("You are not authenticated")
 
    const user = await pool.query("SELECT * FROM users WHERE users_id = $1", [id])

    if (!user.rows[0]){
        return res.status(403).json("Refresh token is not valid")
    }
    //if everything is good creates a new access token, refresh token and sends to user
    jwt.verify(refreshToken, "mySecretRefreshKey", async(err, user) => {
        err && console.log(err)
        
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        try {
            const updateUser = await pool.query("UPDATE users SET refreshtoken = $1 WHERE users_id = $2 RETURNING *", [newRefreshToken, id])
        } catch (error) {
            console.log(error)
        }

        res.status(200).json({
            accessToken: newAccessToken, refreshToken: newRefreshToken
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

//get all users
app.get("/api/allusers", async(req, res) => { // ", verify, (req,res)"
    try {
        const allUsers = await pool.query("SELECT * FROM users")
        res.json(allUsers.rows)
    } catch (err) {
        console.error(err.message)
    }
})

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
            res.status(200).json({msg:"You Added This User Successfully", flag: true, user: user})
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

// Messaging System

//get specific Conversation
app.post("/api/retrieve_conversations", verify, async(req, res) => {
    try {
        const { id } = req.body
        //sort the conversations from most active to least and return it.
        const conversations = await pool.query("SELECT * FROM conversations WHERE $1 = ANY(members)", [id])
        
        const sortedConversations = conversations.rows.sort((a, b) => {
            if (a.last_message_date === null) {
              return new Date(b.time_created) - new Date(a.time_created);
            }
            return new Date(b.last_message_date) - new Date(a.last_message_date);
          })
        
        res.json(sortedConversations)
    } catch (err) {
        console.error(err.message)
    }
})

//make Conversations
app.post("/api/create_conversation", verify, async(req, res) => { // create a if the conversation already exists, you dont create another instance of conversation
    
    const { userDetails, partnerDetails } = req.body

    const conversations = await pool.query("SELECT * FROM conversations where $1 = ANY(members) AND $2 = ANY(members)", [userDetails.id, partnerDetails.id])
    if(conversations.rows[0]){
        res.status(400).json("Conversation already started")
    } else if (userDetails.id === partnerDetails.id){
        res.status(400).json("Cannot start conversation with self")
    } else {
        try {
            const conversation = await pool.query("INSERT INTO conversations (members, time_created, members_names) VALUES (ARRAY [$1, $2], $3, ARRAY [$4, $5]) RETURNING *", [userDetails.id, partnerDetails.id, new Date(), userDetails.username, partnerDetails.username])
            res.json(conversation.rows[0])
        } catch (err) {
            console.error(err.message)
        }
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

//get a specific users
app.get("/users/:id", verify, async(req, res) => {//:id specifies what column to get
    try {
        const { id } = req.params
        const user = await pool.query("SELECT * FROM users WHERE users_id = $1", [id])
        res.json(user.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//update a user
app.put("/users",verify, async(req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const updateUser = await pool.query("UPDATE users SET description = $1 WHERE users_id = $2", [description, id])
        res.json("User Was updated")
    } catch (err) {
        console.error(err.message)
    }
})

// used to start the server
app.listen(port, () =>{
    console.log(`Server has started on port ${port}`)
})