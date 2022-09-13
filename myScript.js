const iterations = 360;

async function halvorsenSmoothRotate(centerPoint, i) {
    const alpha = 1.89, dt = 0.02, rotationScalar = 0.70710678118;
    let svgWindow = document.getElementById("attractor_svg");
    let attractor = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let idString = "attractor_id" + i;
    attractor.setAttribute("id", idString);
    svgWindow.append(attractor);
    let x = centerPoint.x, y = centerPoint.y, z = centerPoint.z;
    let curr;
    let points = [];
    let theta = -20 * Math.PI / 180;

    for (let i = 0; i <= iterations; i++) {
        x += (-alpha * x - 4 * y - 4 * z - Math.pow(y, 2)) * dt;
        y += (-alpha * y - 4 * z - 4 * x - Math.pow(z, 2)) * dt;
        z += (-alpha * z - 4 * x - 4 * y - Math.pow(x, 2)) * dt;
        //yCoord: rotationScalar * (x + y), zCoord: z
        points.push({xCoord: rotationScalar * (x - y), yCoord: (rotationScalar * (x + y)) * Math.cos(theta) - z * Math.sin(theta),
                     zCoord: (rotationScalar * (x + y)) * Math.sin(theta) + z * Math.cos(theta)});
    }

    let cursorBegin = {x: (points[0].xCoord + points[1].xCoord) / 2, z: (points[0].zCoord + points[1].zCoord) / 2};
    attractor.setAttribute("d", "M " + String(cursorBegin.x) + " " + String(cursorBegin.z));

    for (let i = 0; i <= iterations - 1; i++) {
        let controlPoints = {x: points[i].xCoord, z: points[i].zCoord};
        let endPoints = {x: (points[i].xCoord + points[i + 1].xCoord) / 2, z: (points[i].zCoord + points[i + 1].zCoord) / 2};
        curr = attractor.getAttribute("d");
        if (i < 100) {
            attractor.setAttribute("d", curr + " Q " + String(controlPoints.x) + " " + String(controlPoints.z) + 
                               ", " + String(endPoints.x) + " " + String(endPoints.z));
        } else {
            let cutOffIndex = curr.indexOf(",");
            attractor.setAttribute("d", "M" + curr.substring(cutOffIndex + 1, curr.length) + " Q " + String(controlPoints.x) + " " + String(controlPoints.z) + 
                               ", " + String(endPoints.x) + " " + String(endPoints.z));
        }
        await new Promise(r => setTimeout(r, 20));
    }
}

history.scrollRestoration = 'manual';

function scroll_education() {
    let element = document.getElementById("education_scroll");
    let top = element.getBoundingClientRect().top;
    window.scrollTo(0, window.scrollY + top - 35);
}

function scroll_top() {
    window.scrollTo(0, 0);
}

function scroll_bottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

for (let i = 0; i < 100; i++) {
    let centerPoint = {x: -1.48 + Math.random() * 3, y: -1.51 + Math.random() * 3, z: -2.0 + Math.random() * 3}
    halvorsenSmoothRotate(centerPoint, i);
}
