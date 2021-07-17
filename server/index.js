require('dotenv').config()
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session');
const googleAuth = require('./utils/verify-google-token-id');
const util = require("util");
const sharedsession = require("express-socket.io-session");
const mongoose = require("mongoose");
const User = require("./models/user");
const validateEmail = require("./utils/validate-email").validateEmail;

const ioRedis = require("ioredis");
const connectRedis = require('connect-redis');

const port = process.env.SERVER_PORT;

const app = express();

const server = require('http').Server(app);


/*************** mongodb setup **************************/

mongoose.connect(process.env.MONGO_CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', ()=>{  
    console.log("connected to MongoDB cloud ");
  });
  
  /* if error while connecting */
  mongoose.connection.on('error', (err)=>{
     console.log("Mongoose connection error has occured ",err);
  });
  
  /* if disconnected */
  mongoose.connection.on('disconnected', ()=>{
     console.log("MongoDB cloud is disconnected");
  });

/************** redis setup *****************************/

const RedisStore = connectRedis(session);

//Configure redis client
const redisClient = new ioRedis({
    host: 'localhost',
    port: process.env.REDIS_PORT
});

redisClient.on('error', (err) => {
    console.log('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', () => {
    console.log('Connected to redis successfully');
});

// To empty data as server restarts. For development
redisClient.flushdb((err,res) => {
    if(err)
    {
        console.log("could not flush db");
    }
});

const RedisSessionStore = new RedisStore({ client: redisClient });

//clear session data
RedisSessionStore.clear();

/******************** express server config ******************************/
app.use(cors({
    
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD','DELETE'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Configure session middleware to used by both express and socket io with RedisStore
const sessionMiddleware = session({
  store: RedisSessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  // to prevent empty session objects from being saved to session store
  saveUninitialized: false,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: true, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 60 * 24 // session max age in miliseconds (1 day)
  }
})


app.use(sessionMiddleware);

// middleware to check if session id is same for request by same user
app.use((req,resp,next)=>{
    console.log("express session_id", req.session.id);
    next();
});


/********************* setup socket io server *************************/
const io = require('socket.io')(server,
    {
      //cross origin request from frontend
      cors: {
        origin: "http://localhost:3000",
        // to enable server side to accept cookies in CORS request
        credentials:true
      },
    });
  
    /***************** socket middlewares in order (of execution) **************/

    // this socket middleware should be at the top (as middlewares are executed sequentially)
    // this middleware will give us the same session as express
    io.use(sharedsession(sessionMiddleware, {
        autoSave: true
    }));
  
    // throw error here itself before socket connects (in 'io.on('connection',()=>{}) )
    io.use(async (socket,next) => {

        // this is the same session as in express 'req.session'.
        const socketSession = socket.handshake.session;

        const userSession = await getSessionFromStore(socketSession.id);
        // if user is not present, refuse connection
        if(!userSession || !userSession.user)
        {
            next(new Error("unauthorised event"));
        }
        else
        {
            // check if it's the first socket connection for this user
            if(!userSession.socketId)
            {
                // allow coonection
                await updateSessionInStore(socketSession.id,socket.id)
                // add googleId to redis set of online users
                await addToOnlineUsersList(userSession.user.googleId);
                next();
            }
            else
            {
                // don't allow multiple connections
                next(new Error("already connected"));
            }

        }
    });

/***************** to maintain single session only per user (even if user logins through different devices) ***********/
// we maintain a global database that contains googleId and corresponsing sessionId in addition to session store used by express
// whenever user tries to login with another device (or private window), we delete old session and put new session_id 
// into this database

/* Here 'googleId' used is same as google profile id or 'sub' property. it is unique for each user */
/* https://developers.google.com/identity/sign-in/web/people */


// returns null if googleId does not exists and if googleId exists, it returns 'sessionId'
const getUserSessionIdFromRedis = async(googleId) => {

    try
    {
        const sessionId = await redisClient.hget("user_session",googleId);
        console.log("user session fetched successfully from redis",sessionId);
        return sessionId;
    }
    catch(err){
        throw new Error("severe error : could not get user session data from redis");
    }
    
}


const setUserSessionIdInRedis = async (googleId, sessionId) => {

    try{
    
        await redisClient.hset("user_session",googleId,sessionId);

        console.log("user session data successfully set in redis");

    }
    catch(err)
    {

        throw new Error("severe error : could not set user session data in redis...");
    }


}

const removeUserSessionIdFromRedis = async (googleId) => {

    try{

        await redisClient.hdel("user_session",googleId);
    
        console.log("user session data removed from redis");
        }
        catch(err)
        {
            throw new Error("severe error : could not remove user session data from redis...");
        }
}


// maintains list of online socket users
const addToOnlineUsersList = async (googleId) => {

    try
    {
        // we are interested in only keys, so we set value as '1' for every key
        await redisClient.hset("online_users",googleId,1);
        console.log("google id added to online users list");

    }
    catch(err)
    {
        throw new Error("severe error : could not add user to online users list");
    }
}

// get users online/offline status when provided with an array containing user's googleId
const getFriendsStatus = async (googleIdList) => {

    try
    {

       const friendsStatus = await redisClient.hmget("online_users",googleIdList);
       return friendsStatus;
    }
    catch(err)
    {
        throw new Error("severe error : could not fetch online users list");
    }

}

const removeFromOnlineUsersList = async (googleId) => {

    try
    {
        // remove if exists
        await redisClient.hdel("online_users",googleId);
        console.log("removed user from online users list");

    }
    catch(err)
    {
        throw new Error("severe error : could not remove user from online users list");
    }

}


const getSessionFromStore = async (sessionId) => {

    try
    {
        const getSession = util.promisify(RedisSessionStore.get).bind(RedisSessionStore);
    
        return await getSession(sessionId);
    }
    catch(err)
    {
        throw new Error("severe error : could not fetch user session from store");
    }

}
// now for only setting socketId
const updateSessionInStore = async (sessionId,socketId) => {

    try
    {
        const session = await getSessionFromStore(sessionId);
        if(session)
        {
            const setSession = util.promisify(RedisSessionStore.set).bind(RedisSessionStore);
            await setSession(sessionId,{...session,socketId:socketId});
        }
    }
    catch(err)
    {
        throw new Error("severe error : could not update user session in store");
    }

}
/********************** express routess ***********************/

app.post('/auth/login/', async (req, res) => {

    try
    {
        // handle error in future ... make fullproof
        const userDetails=await googleAuth(req.body.id_token);

        // add user, else update 'lastAccess' prop.
        await User.updateOne(
            { email : userDetails.email },
            { 
                $set : { lastAccess : Date.now() },
                $setOnInsert : { googleId:userDetails.googleId, photoUrl:userDetails.photoUrl, fullName:userDetails.fullName }
            },
            {
                upsert:true
            });

        // check if user has logged in already
        const sessionId = await getUserSessionIdFromRedis(userDetails.googleId);

        if(sessionId)
        {
            // destroy old session
            const destroySession = util.promisify(RedisSessionStore.destroy).bind(RedisSessionStore);
            
            await destroySession(sessionId);

            console.log("old sesssion destroyed");

            // overwrite with new session id for user
            await setUserSessionIdInRedis(userDetails.googleId, req.session.id);

        }
        else
        {   
            // set global login status
            await setUserSessionIdInRedis(userDetails.googleId, req.session.id);
        }

        // this is set only while login
        req.session.user = userDetails;
        req.session.save();

        res.status(200).json({
            error:false,
            user:userDetails
            });
    }
    catch(err)
    {
        res.status(500).json({
            error:true,
            message: err.message
            });
    }
});

app.post('/auth/logout/', async (req, res) => {

    try
    {
        if(req.session.user)
        {
            // remove global login status
            await removeUserSessionIdFromRedis(req.session.user.googleId);

        }
        req.session.destroy();

        res.status(200).json({
            error:false,
            message:'logged out successfully'
            });
       
    }
    catch(err)
    {
        res.status(500).json({
            error:true,
            message: err.message
            });
    }
});

// returns user with given email
app.get('/users/:email/', async (req,res) => {

    try
    {
        if(!req.session.user)
        {
            throw new Error("Please Login again");
        }
        else
        {   // check if valid email
            if(validateEmail(req.params.email))
            {
                const friendDetail = await User.findOne({ email : req.params.email });

                if(friendDetail)
                {   
                    let is_friend = false;
                    const userDetail = await User.findOne({email:req.session.user.email});
                    
                    if(userDetail.friendIds.includes(friendDetail._id))
                    { is_friend = true }

                    res.status(200).json({
                        error:false,
                        data:{
                            googleId:friendDetail.googleId,
                            email:friendDetail.email,
                            fullName:friendDetail.fullName,
                            photoUrl:friendDetail.photoUrl,
                            is_friend:is_friend
                        }
                    });

                }
                else
                {
                    throw new Error("no user exists with given email")
                }
            }
            else
            {
                throw new Error("please enter valid email")
            }
        }
        
    }
    catch(err)
    {
        res.status(400).json({
            error:true,
            message: err.message
            });
    }

});

// check this route
// add user with given email as friend (check if user is trying to add himself as friend)
app.post('/add_friend/:email/', async (req,res) => {

    try
    {
        if(!req.session.user)
        {
            throw new Error("Please Login again");
        }
        // check if valid email
        if(!validateEmail(req.params.email))
        {
            throw new Error("please enter valid email")
        }

        if(req.session.user.email == req.params.email)
        {
            throw new Error("you are already your friend");
        }
        
        const friendDetail = await User.findOne({ email : req.params.email });

        if(friendDetail)
        {
            // ensures friend is only added only once (no duplication)
            await User.updateOne(
                { email: req.session.user.email },
                { $addToSet : { friendIds : friendDetail._id }}
            );

            res.status(200).json({
                error:false,
                message:"successfully added as friend"
            });
        }
        else
        {
            throw new Error("user does not exist")
        }
    }
    catch(err)
    {
        res.status(400).json({
            error:true,
            message: err.message
            });
    }

});

// get all friend with online/offline status
app.get('/friends/', async (req,res) => {

    try
    {
        if(!req.session.user)
        {
            throw new Error("Please Login again");
        }

        const userDetail = await User.findOne({ email: req.session.user.email });
        // const userDetail = await User.findOne({ email: "pie99954@gmail.com" });

        const friends = await User.find({
            _id : { $in : userDetail.friendIds }
        });

        if(friends.length === 0)
        {
            throw new Error("you currently have no friends");
        }
        const friendsIdList = friends.map((friend) => {
            return friend.googleId;
        });

        const friendsStatus = await getFriendsStatus(friendsIdList);

        const friendListWithStatus = friends.map((friend, index) => {

            let status = null;
            if(friendsStatus[index])
            {   status = 1; }
            
            else
            {  status = 0; }

            return {
                googleId : friend.googleId,
                email : friend.email,
                fullName : friend.fullName,
                photoUrl : friend.photoUrl,
                status : status
            };
        });

        res.status(200).json({
            error:false,
            data:friendListWithStatus
        });

    }
    catch(err)
    {
        res.status(400).json({
            error:true,
            message: err.message
            });
    }

});

/********************** socket event handlers *************************/

io.on("connection", (socket) => {
  
    const socketSession = socket.handshake.session;
    
    console.log("socket connected",socket.id);
    
    // The private messaging is now based on the googleId
    // make the Socket instance join the associated room:
    socket.join(socketSession.user.googleId);

    socket.broadcast.emit('JOIN',socketSession.user.googleId);

    socket.on("PM", async ({from,to,content,time}) => {

        console.log("content->",content);
        socket.to(to).emit("PM", 
            {
                from : from,
                to : to,
                content : content,
                time : time
            });
    });

    socket.on("disconnect", async ()=>{


        const sessionId = await getUserSessionIdFromRedis(socketSession.user.googleId);

        if(!sessionId || ( sessionId == socketSession.id ))
        {
            socket.broadcast.emit('LEAVE',socketSession.user.googleId);
            // remove user from online users list
            await removeFromOnlineUsersList(socketSession.user.googleId);

            if(sessionId)
            {
                await updateSessionInStore(socketSession.id,null);

            }
        }
        console.log("socket disconnected finally");

    });
  
  });
  

// don't use app.listen(...)
server.listen(port, () => {
  console.log(`chat server listening at http://localhost:${port}`)
});