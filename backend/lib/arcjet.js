import arcjet ,{tokenBucket , shield , detectBot} from "@arcjet/node";
import 'dotenv/config';

export const aj = arcjet({
    key:process.env.ARCJET_KEY,
    characteristics:["ip.src"],
    rules:[
        // sheild protects your app from common attacks e.g SQL injection , XSS , LFI , RCE etc.
        shield({mode:"LIVE"}),
        detectBot({
        mode:"LIVE",
        allow:["CATEGORY:SEARCH_ENGINE"], // allow search engine bots
        }), //block all bots except search engine 
        
        tokenBucket({
            mode:"LIVE",
            refillRate:30,
            interval:5,
            capacity:20
        })
    ]
});