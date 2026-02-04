import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'
import dotenv from 'dotenv';
import ProductRoute from './routes/productsRoutes.js';
import { sql } from './config/db.js';
import { aj } from './lib/arcjet.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json())
app.use(cors(
    {
        origin:[
            'https://pern-crud-project.onrender.com'
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
       allowedHeaders: ["Content-Type", "Authorization"]
    }
))
app.use(helmet({
    contentSecurityPolicy: false,
})) // helmet is a security middleware that helps to protect your app by setup various http headers. 
app.use(morgan("dev")) //log the requests.

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


// apply arcjet rate limit to all routes .
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req , {
        requested:1, //specifies that each request consume 1 token.
    })
    if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            res.status(429).json({ message: "Too many requests. Please try again later."})
        }else if(decision.reason.isBot()){
            res.status(403).json({ message: "Access denied."})
        }else{
            res.status(403).json({ message: "Forbidden."})
        }
        return 
    }
// check for spoofed bot detection
   if(decision.results.some((result)=> result.reason.isBot() && result.reason.isSpoofed())){
    res.status(403).json({ message: "Access denied due to spoofed bot detection."})
    return
   }

    next() 
    } catch (error) {
        console.log("arcjet error :" , error)
        next(error)
    }
   
})

app.use('/api/products' , ProductRoute)
// console.log(process.env.ARCJET_ENV)
if(process.env.NODE_ENV === "production"){
    //server our react app
    app.use(express.static(path.join(__dirname , "/frontend/dist")));

    app.use((req, res)=>{
        res.sendFile(path.resolve(__dirname , "frontend" , "dist" , "index.html"));
    })
}

async function initDB(){
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY ,
        name VARCHAR(255) NOT NULL , 
        image VARCHAR(255) NOT NULL , 
        price DECIMAL(10 , 2) NOT NULL , 
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) 
        `;
        console.log("creating table")
    } catch (error) {
        console.log("Error init While DB." , error)
    }
}

initDB().then(()=>{
   app.listen(PORT , ()=> {
   console.log(`Database Connected and server running on http://localhost:${PORT}`);
});
}).catch((err)=>{
    console.log("Error while connect and starting server" , err)
})