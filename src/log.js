const bunyan = require('bunyan');
const  { Writable }  = require('stream');
const axios = require('axios');
const endpointElastic = `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`;



  const appName = process.env.APP_NAME || 'APP_NAME';


class StreamElastic extends Writable {
    
    write(message = {level:30}) {
        const now = Date.now();
        const messageJson = Object.assign({id:now},JSON.parse(message));
        const level = bunyan.nameFromLevel[messageJson.level];
        messageJson.level = level;
        
        const colorStrOut = new ColorStrOut();
        colorStrOut.color(messageJson);

        if (process.env.NODE_ENV === 'development'){

            const elastic = axios.create({                
                baseURL: endpointElastic,
            });

            elastic.post(`/${appName}/_doc`,messageJson);
        }
        
        return true;
  }
}

class ColorStrOut {
    
    color(messageJson){

        const colorSet = {
            reset: '\x1b[0m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
        };

        const colorBg = {
            bgBlack: '\x1b[40m',
            bgRed: '\x1b[41m',
            bgGreen: '\x1b[42m',
            bgYellow: '\x1b[43m',
            bgBlue: '\x1b[44m',
            bgMagenta: '\x1b[45m',
            bgCyan: '\x1b[46m',
            bgWhite: '\x1b[47m',
        };

        const color = (corStr, typeStr, msgStr, colorBackground = '') => {
            console.log(`${corStr}${colorBackground}[${typeStr.toUpperCase()}]${colorSet.reset}[${new Date(messageJson.id).toJSON()}]${msgStr}`);
        };

        switch (messageJson.level){
            case 'info':
                color(colorSet.green, messageJson.level, messageJson.msg);
            break;
            case 'warn':
                color(colorSet.yellow, messageJson.level, messageJson.msg);
            break;
            case 'debug':                
                color(colorSet.blue, messageJson.level, messageJson.msg, colorBg.bgYellow);
            break;
            case 'error':
                color(colorSet.red, messageJson.level, messageJson.msg, colorBg.bgYellow);
            break;
        }
    }
}

const streams = [
    {      
      stream: new StreamElastic(),
    },
];

module.exports = bunyan.createLogger({ streams, name: appName });