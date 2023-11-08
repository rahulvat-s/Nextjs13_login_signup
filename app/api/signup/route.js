import User from "../../../models/userModel";
import { connectToDB } from "../../../config/database";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Received request body:  {"name":"Charu prabha","email":"charuprabha228@gmail.com","password":"123456","otp":"12345","pic":""}
export const POST = async (request) => {
  try {
    await connectToDB();

    // Log the request body to see what's being received
    const requestBody = await request.text();
    console.log("Received request body: ", requestBody);

    // Parse JSON data from the request
    const { name, email, password, otp, pic } = JSON.parse(requestBody);

    // If 'pic' is not provided in the request, set a default value
    const picValue = pic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // If the email already exists, return an error response
      return new Response("Email already exists", { status: 400 });
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword, otp, pic: picValue });
    await newUser.save();
      // Generate a JWT token with user data
      const token = jwt.sign({ email: newUser.email, name: newUser.name, pic: newUser.pic }, 'your-secret-key', {
        expiresIn: '1h', // You can adjust the token expiration time
      });
      const responseData = { newUser, token };
    // Return a success response
    return new Response(JSON.stringify(token), { status: 200 });
  } catch (error) {
    return new Response("Failed to create a new user", { status: 500 });
  }
}
