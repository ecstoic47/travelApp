const mongoose = require('mongoose');

const PinSchema = mongoose.Schema({

    username:{
        type:String,
        required: true,
        min:3
    },

    title: {
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
        min:3
    },

    rating:{
        type:Number,
        required:true,
        min:0,
        max:5,
    },
    lat:{
        type:Number,
        required:true
    },

    lon:{
        type: Number,
        required: true
    }    
  },
     { timestamps:true }
);

module.exports = mongoose.model("Pin", PinSchema);