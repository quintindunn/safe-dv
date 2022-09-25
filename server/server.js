RegisterCommand('safedv', (source, args) => {
    // Pass the range to the client
    if (args.length > 0) {
        if (isNaN(args[0])) {
            // Send a message to the executing player "Invalid range"
            let message = 'Invalid range!';
            emitNet('chat:addMessage', source, {
                args: [Config.prefix, message]
            });
            return;
        }
    }

    let range = args[0] ? args[0] : Config.safe_dv_range;
    countdown(range);
}, true);

function countdown(range) {
    // If Config.dv_time_seconds is -1, skip the countdown.
    if (Config.dv_time_seconds == -1) 
        safeDv(range);
        
    // Otherwise, delete all vehicles after Config.dv_time_seconds, sending periodic messages to the player.
    else {
        emitNet('safeDv:countdown', -1);
        setTimeout(() => {
            safeDv(range);
        }, Config.dv_time_seconds * 1000);
    }
}

function safeDv(range) {
    let vehicles = GetAllVehicles();
    let players = GetAllPeds().filter((ped) => {return IsPedAPlayer(ped)});
    
    // Loop through all vehicles
    vehicles.forEach((vehicle) => {
        // Check if the vehicle is within a safe zone, if so, skip it.
        if (isEntityWithinSafeZone(vehicle)) 
            return;

        // Loop through all players
        for(let i = 0; i < players.length; i++) {
            let player = players[i];
            // Check if the player is within the range of the vehicle, if so, skip it.
            if (isPlayerWithinRange(player, GetEntityCoords(vehicle, true), range))
                return;
        }


        // All checks passed, delete the vehicle.
        DeleteEntity(vehicle);


    });
}

function isPlayerWithinRange(player, coords, range) {
    // Check if the player is within the range of the coordinates.
    let player_coords = GetEntityCoords(player, true);
    let distance = GetDistanceBetweenCoords(player_coords[0], player_coords[1], coords[0], coords[1]);
    return distance <= range;
}


function isEntityWithinSafeZone(entity) {
    // Check if the entity is within a safe zone.
    let is_entity_within_safe_zone = false;
    let entity_coords = GetEntityCoords(entity, true);
    Config.safe_zones.forEach((zone) => {
        let zone_coords = zone.pos;
        let distance = GetDistanceBetweenCoords(entity_coords[0], entity_coords[1], zone_coords.x, zone_coords.y);
        
        // If the distance is less than the radius, the entity is within the safe zone
        if (distance <= zone.radius) {
            is_entity_within_safe_zone = true;
            return;
        }
    });

    return is_entity_within_safe_zone;
}

function GetDistanceBetweenCoords(x1, y1, x2, y2) {
    // Get the distance between two coordinates. (a^2 + b^2 = c^2)
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

