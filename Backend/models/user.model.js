import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

   email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  validate: [validator.isEmail, "Invalid email"],
},

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

/* ==============================
   HASH PASSWORD BEFORE SAVE
================================ */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* ==============================
   COMPARE PASSWORD
================================ */

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
