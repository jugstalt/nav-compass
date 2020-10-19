# nav-compass

A simple Javascript compass widget for navigating to a location with coordinates. The widget displays the compass with direction and distance to the destination point. 

![alt text](https://raw.githubusercontent.com/jugstalt/nav-compass/main/compass1.png)

```javascript
var compass=new navCompass(document.querySelector('#compass'));
compass.start({ lat: 47.0, lng: 15.5 }, 'Name of my target');

// release all Event Listeners (release geolocation handler...)
compass.stop();
```