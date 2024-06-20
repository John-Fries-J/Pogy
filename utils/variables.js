const config = require("./../config.json");
let token;
let mongodb;

if (config.dev) {
    token = process.env.TOKEN;
    mongodb = process.env.mongodb_url;
} if (!config.dev) {
    token = process.env.TOKEN
    mongodb = process.env.mongodb_url
    
};



module.exports = { config, token, mongodb };
