/* eslint-disable*/

export const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1Ijoiam9wZWFsZ29ydGEiLCJhIjoiY2tiazQ5NGNlMDI2cDJ2bzZ0MXlkNDViNCJ9.n57ATj1B60MjqVd97lBTTw';

    var map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/jopealgorta/ckbk4dkko00uk1im0v4f1fivk',
        style: 'mapbox://styles/mapbox/light-v10',
        scrollZoom: false
    });

    map.addControl(new mapboxgl.NavigationControl());

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
            .addTo(map);

        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
