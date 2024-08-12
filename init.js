const mongoose = require("mongoose");
const Chat = require("./models/chat.js");


main()
.then(()=>{
    console.log('Database connection is successful')
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats= [
    {
        from:"musaddique",
        to:"Shoaib",
        message:"Hie How are you",
        created_at: new Date()
    },
    {
        from:"musaddique",
        to:"Huzaifa",
        message:"Hie How are you",
        created_at: new Date()
    },
    {
        from:"musaddique",
        to:"aabidin",
        message:"Hie How are you",
        created_at: new Date()
    }
];

Chat.insertMany(allChats);