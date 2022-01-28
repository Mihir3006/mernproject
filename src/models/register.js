const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const employeeschema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email alredy exist"]
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// generating tokens
employeeschema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)        //id of usser which is active
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}

// middle ware must be before modle definition
employeeschema.pre("save", async function (next) {

    if (this.isModified("password")) {

        console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`The current password is ${this.password}`);
    }

    next();
})

const register = new mongoose.model("registers", employeeschema)

module.exports = register;
