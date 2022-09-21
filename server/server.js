RegisterCommand('hello', (source, args) => {
    console.log('Hello from the server!');
});

RegisterCommand('safedv', (source, args) => {
    // Hint you can input a range as an argument
    emit('chat:addSuggestion', '/safedv', 'Deletes all vehicles that are not within a safe zone', [
        {
            name: 'range',
            help: 'The range to check for players'
        }
    ]);

    if (!IsPlayerAceAllowed(source, Config.safe_dv_ace))
    {
        console.log('You are not allowed to use this command!');
        return;
    }
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
});

