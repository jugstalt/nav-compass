var navCompass = function() {
    const compassCircle = document.querySelector(".nav-compass-circle");
    const myPoint = document.querySelector(".nav-compass-current-position");
    const targetDirection = document.querySelector('.nav-compass-target-direction');
    const targetDistanceElement = document.querySelector('.nav-compass-target-info-distance');
    const infoArrow = document.querySelector(".nav-compass-target-info-arrow");

    let compass;
    let targetPoint;
    
    const isIOS = (
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
    );

    this.start = function(target) {
        targetPoint=target;
        if (isIOS) {
          DeviceOrientationEvent.requestPermission()
            .then((response) => {
              if (response === "granted") {
                window.addEventListener("deviceorientation", orientationHandler, true);
              } else {
                alert("has to be allowed!");
              }
            })
            .catch(() => alert("not supported"));
        } else {
          window.addEventListener("deviceorientationabsolute", orientationHandler, true);
        }

        if(targetPoint) {
            console.log('targetPoint', targetPoint);
            navigator.geolocation.getCurrentPosition(locationHandler);
        }
    }

    function orientationHandler(e) {
        compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

        if(pointDegree !== null) {
            if (
                (pointDegree < Math.abs(compass) && pointDegree + 15 > Math.abs(compass)) ||
                pointDegree > Math.abs(compass + 15) ||
                pointDegree < Math.abs(compass)
            ) {
               myPoint.style.opacity = 0;
            } else if (pointDegree) {
               myPoint.style.opacity = 1;
            }

            targetDirection.style.transform = `translate(-50%, -50%) rotate(${ -compass + pointDegree }deg)`;
            //infoArrow.style.transform=`rotate(${  -compass + pointDegree }deg)`;
        }
    }

    let pointDegree = null;
    let pointDistance = null;

    function locationHandler(position) {
        console.log('receive position', position);

        const { latitude, longitude } = position.coords;
        pointDegree = calcDegreeToPoint(latitude, longitude);
        pointDistance = calcSphericDistance(latitude, longitude);

        console.log('pointDistance', pointDistance);
        targetDistanceElement.innerHTML=`${ Math.round(pointDistance) }m (+/- ${ Math.round(position.coords.accuracy) }m)`

        if (pointDegree < 0) {
            pointDegree = pointDegree + 360;
        }

        targetDirection.style.opacity = 1;

        setTimeout(function(){
            navigator.geolocation.getCurrentPosition(locationHandler);
        },1000);
    }

    function calcDegreeToPoint(latitude, longitude) {
        const phiK = (targetPoint.lat * Math.PI) / 180.0;
        const lambdaK = (targetPoint.lng * Math.PI) / 180.0;
        const phi = (latitude * Math.PI) / 180.0;
        const lambda = (longitude * Math.PI) / 180.0;
        const psi =
            (180.0 / Math.PI) *
            Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) -
                Math.sin(phi) * Math.cos(lambdaK - lambda)
            );

        console.log('psi', psi);
        return Math.round(psi);
    }

    function calcSphericDistance(latitude, longitude) {
        var lat1 = latitude, lng1 = longitude;
        var lat2 = targetPoint.lat, lng2 = targetPoint.lng;

        var R = 6378137; // Radius of the earth in m
        var dLat = (lat2 - lat1) * Math.PI / 180.0;
        var dLon = (lng2 - lng1) * Math.PI / 180.0;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1) * Math.PI / 180.0) * Math.cos((lat2) * Math.PI / 180.0) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in m
        return d;
    };
};