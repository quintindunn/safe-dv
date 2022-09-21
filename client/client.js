on('onClientResourceStart', (resourceName) => {
    if (GetCurrentResourceName() == resourceName) {
        emit('chat:addSuggestion', '/safedv', 'Deletes all vehicles that are not within a safe zone', [
            {
                name: 'range',
                help: 'The range to check for players'
            }
        ]);
    }
});

onNet('safedv:SafeDv', (source, args) => {
    console.log('SafeDv called! ' + source);
    let range = source[0] ? source[0] : Config.safe_dv_range;
    
    // If Config.dv_time_seconds is -1, delete all vehicles
    if (Config.dv_time_seconds == -1) 
        safeDv(range);

    // Otherwise, delete all vehicles after Config.dv_time_seconds, sending periodic messages to the player
    else {
        let message = 'Deleting all vehicles in ' + Config.dv_time_seconds + ' seconds!';
        emit('chat:addMessage', {
            color: [255, 0, 0],
            multiline: true,
            args: ["DV", message]
        });
        
        setTimeout(() => {
            message = 'Deleting all vehicles in ' + Math.floor(Config.dv_time_seconds / 2) + ' seconds!';
            emit('chat:addMessage', {
                color: [255, 0, 0],
                multiline: true,
                args: ["DV", message]
            });
            console.log(message);
        }, Config.dv_time_seconds / 2 * 1000);

        setTimeout(() => {
            message = 'Deleting all vehicles in 3 seconds!';
            emit('chat:addMessage', {
                color: [255, 0, 0],
                multiline: true,
                args: ["DV", message]
            });
            console.log(message);
        }, Config.dv_time_seconds * 1000 - 3000);

        setTimeout(() => {
            message = 'Deleting all vehicles in 2 seconds!';
            emit('chat:addMessage', {
                color: [255, 0, 0],
                multiline: true,
                args: ["DV", message]
            });
            console.log(message);
        }, Config.dv_time_seconds * 1000 - 2000);

        setTimeout(() => {
            message = 'Deleting all vehicles in 1 second!';
            emit('chat:addMessage', {
                color: [255, 0, 0],
                multiline: true,
                args: ["DV", message]
            });
            console.log(message);
        }, Config.dv_time_seconds * 1000 - 1000);

        setTimeout(() => {
            message = `Deleting all vehicles!`;
            emit('chat:addMessage', {
                color: [255, 0, 0],
                multiline: true,
                args: ["DV", message]
            });
            safeDv(range);
        }, Config.dv_time_seconds * 1000);
        


    }
});

function isPlayerWithinRange(player, coords, range) {
    let player_coords = GetEntityCoords(player, true);
    let distance = GetDistanceBetweenCoords(player_coords[0], player_coords[1], player_coords[2], coords[0], coords[1], coords[2], false);
    return distance <= range;
}


function isEntityWithinSafeZone(entity) {
    let is_entity_within_safe_zone = false;
    let entity_coords = GetEntityCoords(entity, true);
    Config.safe_zones.forEach((zone) => {
        let zone_coords = zone.pos;
        let distance = GetDistanceBetweenCoords(entity_coords[0], entity_coords[1], entity_coords[2], zone_coords.x, zone_coords.y, -1, false);
        
        // If the distance is less than the radius, the entity is within the safe zone
        if (distance <= zone.radius) {
            is_entity_within_safe_zone = true;
            return;
        }
    });

    return is_entity_within_safe_zone;
}


function safeDv(range) {

    let vehicles = GetGamePool('CVehicle');
    let players = GetActivePlayers();

    // Loop through all players
    vehicles.forEach((vehicle) => {
        // Check if the vehicle is within a safe zone
        if (isEntityWithinSafeZone(vehicle)) 
            return;

        
        // Check if player is in range
        let vehicle_coords = GetEntityCoords(vehicle, true);
        for (let i = 0; i < players.length; i++) {
            let player = GetPlayerPed(players[i]);
            if (!isPlayerWithinRange(player, vehicle_coords, range)) {
                // If the config is NOT set to delete vehicles with ai in them                
                if (!Config.dv_ai_vehicles) {
                    // Check if the vehicle occupied
                    let occupier = GetPedInVehicleSeat(vehicle, -1);
                    if ( occupier != 0) {
                        // Check if the occupier is alive
                        if (!IsPedDeadOrDying(occupier, true))
                            return;
                    }
                }

                // Player is in range, delete vehicle
                SetVehicleHasBeenOwnedByPlayer(vehicle, false) 
                SetEntityAsMissionEntity(vehicle, false, false) 
                DeleteVehicle(vehicle)
                if (DoesEntityExist(vehicle)) 
                    DeleteVehicle(vehicle) 
                break;
            }
        }

    });
}