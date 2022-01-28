const mongoose = require('mongoose');

// itna to karna hi hai
mongoose.connect('mongodb://localhost:27017/loginData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("connection sucessfull...."))
    .catch((err) => console.log("No connection..."));