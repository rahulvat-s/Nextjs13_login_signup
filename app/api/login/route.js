import User from "../../../models/userModel";
import { connectToDB } from "../../../config/database";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Received request body: {"email":"charuprabha228@gmail.com","password":"123456"}
export const POST = async (request) => {
    try {
        await connectToDB();

        // Log the request body to see what's being received
        const requestBody = await request.text();
        console.log("Received request body: ", requestBody);

        // Parse JSON data from the request
        const { email, password } = JSON.parse(requestBody);

        // Find the user by email in the database
        const user = await User.findOne({ email });

        if (!user) {
            // If the user doesn't exist, return an error response
            return new Response("User not found", { status: 404 });
        }

        // Check if the provided password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // If the password doesn't match, return an error response
            return new Response("Incorrect password", { status: 401 });
        }
        // Generate a JWT token upon successful login
        const token = jwt.sign({ email: user.email, name: user.name, pic: user.pic  }, 'ghfgtdrfedws', {
            expiresIn: '1h', // You can adjust the token expiration time
        });
        console.log("token: " + token);
        // Store the token in local storage
        // localStorage.setItem('token', token);
        // If the credentials are correct, you can generate a token or return user data
        // Here, we'll return the user data as an example
        // return new Response(JSON.stringify(user), { status: 200 });
            // Return the user data and the token in the response
    const responseData = { user, token };
    return new Response(JSON.stringify(token), { status: 200 });

    } catch (error) {
        return new Response("Failed to log in", { status: 500 });
    }
}