# nav-compass

A simple Javascript compass widget for navigating to a location with coordinates. The widget displays the compass with direction and distance to the destination point. 

![alt text](https://raw.githubusercontent.com/jugstalt/nav-compass/main/compass1.png)

```javascript
var compass = new navCompass(document.querySelector('#compass'));
compass.start({ lat: 47.0, lng: 15.5 }, 'Name of my target');

// optional:
// Report current position (from geolocation api), compass direction and direction to target
compass.onPositionChanged = function (position, compassDirection, pointDirection) {
    console.log('new position', position);
    console.log('current compass direction', compassDirection);
    console.log('current direction to point', pointDirection);
};


// release all event listeners (release geolocation handler...)
compass.stop();
```