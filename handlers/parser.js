const mailParse = require('@sendgrid/inbound-mail-parser');


exports.parseMessage = (msg) => {
    
        const config = {keys: ['to', 'from', 'subject', 'text' ,'html']};
        const parsing = new mailParse(config, msg);
        const parsedMap = parsing.keyValues();
        //const parsedMsg =  Object.fromEntries(parseMap);
       // console.log( parsedMap);
        return parsedMap;
}