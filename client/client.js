on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() == resourceName) {
        // Hint that the user can input a range to not delete vehicles within.
        emit('chat:addSuggestion', '/safedv', 'Deletes all vehicles that are not within a safe zone', [
            {
                name: 'range',
                help: 'The range to check for players'
            }
        ]);
    }
});

// Count down to the deletion of all vehicles
// TODO: Clean up this code
onNet('safeDv:countdown', () => {
    emit('chat:addMessage', {
        color: Config.prefix_color,
        multiline: true,
        args: [Config.prefix, 'Deleting all vehicles in ' + Config.dv_time_seconds + ' seconds!']
    });

    setTimeout(() => {
        emit('chat:addMessage', {
            color: Config.prefix_color,
            multiline: true,
            args: [Config.prefix, 'Deleting all vehicles in ' + Math.floor(Config.dv_time_seconds / 2) + ' seconds!']
        });
    }, Config.dv_time_seconds / 2 * 1000);

    setTimeout(() => {
        emit('chat:addMessage', {
            color: Config.prefix_color,
            multiline: true,
            args: [Config.prefix, 'Deleting all vehicles in 3 seconds!']
        });
    }, Config.dv_time_seconds * 1000 - 3000);

    setTimeout(() => {
        emit('chat:addMessage', {
            color: Config.prefix_color,
            multiline: true,
            args: [Config.prefix, 'Deleting all vehicles in 2 seconds!']
        });
    }, Config.dv_time_seconds * 1000 - 2000);

    setTimeout(() => {
        emit('chat:addMessage', {
            color: Config.prefix_color,
            multiline: true,
            args: [Config.prefix, 'Deleting all vehicles in 1 second!']
        });
    }, Config.dv_time_seconds * 1000 - 1000);

    setTimeout(() => {
        emit('chat:addMessage', {
            color: Config.prefix_color,
            multiline: true,
            args: [Config.prefix, `Deleting all vehicles!`]
        });
    }, Config.dv_time_seconds * 1000);
});