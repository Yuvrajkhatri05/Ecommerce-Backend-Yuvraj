const mongoose = require("mongoose");
const User = require("./Models/User");

async function test() {
    try {
        await mongoose.connect("mongodb://localhost:27017/ecom"); // Assuming default local url or whatever it is, wait, let's just use what's in env
        
        const newUser = await User.create({
            fullName: "Test User",
            password: "password123",
            mobileNo: "1234567890",
            email: "test_script_" + Date.now() + "@test.com"
        });
        console.log("Success:", newUser);
    } catch (e) {
        console.error("Error creating user:", e);
    } finally {
        mongoose.disconnect();
    }
}
test();
