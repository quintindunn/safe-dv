RegisterCommand('safedv', (source, args) => {
    // Hint you can input a range as an argument
    
    // Pass the range to the client
    if (args.length > 0) {
        if (isNaN(args[0])) {
            // Send a message to the executing player "Invalid range"
            let message = 'Invalid range!';
            emitNet('chat:addMessage', source, {
                args: [message]
            });
            return;
        }
    }
    emitNet('safedv:SafeDv', source, args);
}, true);

