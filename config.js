const Config = {
    prefix: "DV",
    prefix_color: [255, 0, 0],
    safe_dv_range: 30, // The range to check for players
    dv_ai_vehicles: false, // DV vehicles that are AI controller (implemented by if the vehicle is occupied)

    safe_zones: [
        // Luxury Autos
        {pos: {x: -790, y: -215}, radius: 30},
        // Premium Deluxe Motorsport
        {pos: {x: -40, y: -1095}, radius: 25}
    ],

    dv_time_seconds: 30, // Disable with -1, the time in seconds to wait before running the mass DV. Recommeneded to be either disabled or a higher value due to the message implementation.
}