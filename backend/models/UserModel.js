import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "Please add a first name"] },
  lastName: { type: String, required: [true, "Please add a last name"] },
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    unique: true,
    match: [/^\d{10}$/, "Please add a valid phone number"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
});
userSchema.pre("validate", function (next) {
  console.log("Validating User schema...");
  console.log(" boyyyyy");

  console.log(this);
  console.log(this.email, this.phoneNumber);
  if (!this.email && !this.phoneNumber) {
    this.invalidate("email", "Either email or phone number is required.");
    this.invalidate("phone", "Either email or phone number is required.");
  }
  next();
});
//export default mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
