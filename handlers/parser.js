const mailParse = require('@sendgrid/inbound-mail-parser');


exports.parseMessage = (msg) => {
    
        const config = {keys: ['to', 'from', 'subject', 'text' ,'html']};
        const parsing = new mailParse(config, msg);
        const parsedMsg = parsing.keyValues();

        return parsedMsg;
}