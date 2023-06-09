let express=require('express')
let app=express();
let bodyParser=require('body-parser');
let mongoose=require('mongoose');

app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());

const dbUrl='mongodb://localhost:27017/sports';
const options= {useNewUrlParser:true,
useUnifiedTopology:true}

const mongo=mongoose.connect(dbUrl,options);

mongo.then(()=>{
  console.log('connected to database');
},error=>{
  console.log(error);
})

var schema=mongoose.Schema({
  name:String,
  rushingYards:Number,
  touchdownsThrown:Number,
  sacks:Number,
  fieldGoalsMade:Number,
  fieldGoalsMissed:Number,
  catchesMade:Number,
  id:Number
});

const model=mongoose.model("players",schema);

app.post("/add",async (req,res)=>{
  const player=new model({
    name:req.body.name,
        rushingYards:req.body.rushingYards,
        touchdownsThrown:req.body.touchdownsThrown,
        sacks:req.body.sacks,
        fieldGoalsMade:req.body.fieldGoalsMade,
        fieldGoalsMissed:req.body.fieldGoalsMissed,
        catchesMade:req.body.catchesMade,
        id:req.body.id
  });
  const val=await player.save();
  res.send("Added player");
})

app.patch("/update/:id",async (req,res)=>{
  
  try{  
  const player=await model.findOne({id:req.params.id});
    if(req.body.name)
      player.name=req.body.name;
    
    if(req.body.catchesMade)
      player.catchesMade=req.body.catchesMade;
    await player.save();
  }
  catch{
    res.send("no player exists");
  }
    
})

app.delete("/delete/:id",async (req,res)=>{
  try{
    await model.deleteOne({id:req.params.id});
    res.status(204).send();
  }
  catch(error){
    res.send(error);
  }
})

app.get("/findqueries",async (req,res)=>{
  try{
    const highestTouchDowns=await model.find({}).sort({touchdownsThrown:-1}).limit(1);
    const highestRushingYards=await model.find({}).sort({rushingYards:-1}).limit(1);
    const leastRushingYards=await model.find({}).sort({rushingYards:1}).limit(1);
    const highestSacks=await model.find({}).sort({sacks:-1}).limit(1);
    const fieldGoalsDesc=await model.find({}).sort({fieldGoalsMade:-1}).limit(1);
    let str=`Query results are\n Player with Highest Touch Downs: ${highestTouchDowns}\n
     Player with Highest Rushing Yards: ${highestRushingYards}\n
     Player with Least Rushing Yards: ${leastRushingYards}\n
     Player with Highest Sacks: ${highestSacks}\n
     Player with Highest field Goals made: ${fieldGoalsDesc}\n`
     res.send(str);
  }
  catch{
    res.send(error);
  }
})

var port=8080;
app.listen(port,function(){
  console.log("Running on Port"+port);
})