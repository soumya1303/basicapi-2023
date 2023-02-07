const express = require("express");
const app   = express();
const mongoose =require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");

mongoose.set("strictQuery", true);
//mongoose.connect("mongodb://127.0.0.1:27017/astroDB");
mongoose.connect("mongodb://192.168.1.138:27017/astroDB");



const topicSchema = new mongoose.Schema({
    name:String,
    desc:String,
    author:String,
    year:Number,
    university:String
});

const Topic = mongoose.model("Topic", topicSchema);

app.get("/", (req, res)=>{
    res.send("Server started");
});

app.route("/topics")
.get((req, res)=>{

    const option={}
    const projection={
        _id:0
    }
    Topic.find(option, projection, (e, resp)=>{

        if (e!==null ){
            console.log(e);    
        }else{
            console.log(resp);
            res.send(resp);
        }
    });
})
.post((req, res)=>{

    const topic={
        name:_.toLower( req.body.name),
        desc:req.body.desc,
        author:req.body.author,
        year:req.body.year,
        university:req.body.university
    }

    Topic.create(topic, (e, resp)=>{
        if (!e){
            console.log("document created");
            res.send(resp);
        }
        else{
            res.send(e);
        }
    });
});

app.route("/topics/:topicId")
.get((req, res)=>{

    const topicName = _.toLower(req.params.topicId);

    const option={
        name:topicName
    }
    const projection={
        _id:0
    }
    Topic.find(option, projection, (e, resp)=>{

        if (e!==null ){
            console.log(e);    
        }else{
            console.log(resp);
            res.send(resp);
        }
    });
})
.delete((req, res)=>{

    const option={
        name:req.params.topicId
    }
    console.log(option);

    Topic.deleteOne(option, (e, resp)=>{
        if (!e){
            console.log("document deleted");
            res.send(resp);
        }else{
            res.send(e);
        }
    });

})
.put((req, res)=>{ /* this function seems depricated by mongoose. update() with {overwrite:true} no longer works.Updates are performed using updateOne() or updateMany() */

    console.log(req.body);
    console.log(req.params.topicId);
    
    const option = {
        name:req.params.topicId
    }
    const upd={
        name: req.body.name,
        author: req.body.author,
        year:req.body.year
    }

    
    Topic.updateOne(option, upd, (e, resp)=>{

        if (null===e ){
            console.log("document updated");
            res.send(resp);
        }else{
            res.send("Error in updating document");
        }

    });
})
.patch((req, res)=>{

    console.log(req.body);

    const option={
        name:req.params.topicId
    }

    Topic.updateOne(option, req.body, (e, resp)=>{

        if (null===e ){
            console.log("document updated");
            res.send(resp);
        }else{
            res.send("Error in updating document");
        }

    });
})
;

app.listen(PORT, ()=>{
    console.log("Server started...");
});
