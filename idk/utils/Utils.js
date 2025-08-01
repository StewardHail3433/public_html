//https://web.archive.org/web/20060911055655/http://local.wasp.uwa.edu.au/%7Epbourke/geometry/lineline2d/
function containEdge(pts1, pts2) {
    for(let i = 0; i < pts1.length; i++) {
        for(let j = 0; j < pts2.length; j++) {
            if(isIntersecting([pts1[i], pts1[(i+1) % pts1.length]], [pts2[j], pts2[(j+1) % pts2.length]])) {
                return true;
            }
        }
    }
    return false;
}

function isIntersecting(line1, line2) {
    const denominator = (line2[1][1] - line2[0][1]) * (line1[1][0] - line1[0][0]) - (line2[1][0] - line2[0][0]) * (line1[1][1] - line1[0][1])
    const numeratorA = (line2[1][0] - line2[0][0]) * (line1[0][1] - line2[0][1]) - (line2[1][1] - line2[0][1]) * (line1[0][0] - line2[0][0])
    const numeratorB = (line1[1][0] - line1[0][0]) * (line1[0][1] - line2[0][1]) - (line1[1][1] - line1[0][1]) * (line1[0][0] - line2[0][0])
    if(denominator == 0) {
        if(numeratorA == 0 && numeratorB == 0) {
            return true;
        }
        return false;
    }

    const ua = numeratorA / denominator;
    const ub = numeratorB / denominator;

    return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
}


function getCorners(x, y, width, height, rot = 0) {
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);

    const cx = x;
    const cy = y;

    const points = [
        [x, y],                     
        [x + width, y],            
        [x + width, y + height],   
        [x, y + height]
    ];

    const rotatedCorners = [];

    for (let i = 0; i < points.length; i++) {
        const dx = points[i][0] - cx;
        const dy = points[i][1] - cy;

        const rx = dx * cos - dy * sin;
        const ry = dx * sin + dy * cos;

        rotatedCorners.push([cx + rx, cy + ry]);
    }

    return rotatedCorners;
}


function containBox(box1, box2) {
    return box1.x < box2.x + box2.width && box1.x + box1.width > box2.x 
    && box1.y < box2.y + box2.height && box1.y + box1.height > box2.y;
}

export default {
    getCorners,
    containEdge,
    containBox
}
