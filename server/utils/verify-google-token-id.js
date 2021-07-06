const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENT_ID);

/*  using official google library to verify token id received from frontend 
    when user clicks on google sign in button in React frontend  */
const googleAuth = async (token) => {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    

    const payload = ticket.getPayload();

    // console.log("google id token payload", payload);

    const {sub, email, name, picture} = payload;

    const googleId = sub;
    return {googleId:googleId, email: email, fullName: name, photoUrl: picture};


}

module.exports = googleAuth;