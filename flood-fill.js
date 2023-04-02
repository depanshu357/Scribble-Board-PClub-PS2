// Compare subsection of array_one's values to array_two's values, with an optional tolerance
function tolerance_equal(array_one, offset, array_two, tolerance) {
    var length = array_two.length,
    start = offset + length;
    
    tolerance = tolerance || 0;
    
    // Iterate (in reverse) the items being compared in each array, checking their values are 
    // within tolerance of each other
    while(start-- && length--) {
        if(Math.abs(array_one[start] - array_two[length]) > tolerance) {
            return false;
        }
    }
    
    return true;
}

// The actual flood fill implementation
function flood_fill(image_data, get_point_offset, point, colour, target, tolerance, width, height) {
    var points = [point],
        seen = {},
        steps = flood_fill.steps,
        key,
        x,
        y,
        offset,
        i,
        x2,
        y2;
    
    // Keep going while we have points to walk
    while(!!(point = points.pop())) {
        x = point.x;
        y = point.y;
        offset = get_point_offset(x, y);
        
        // Move to next point if this pixel isn't within tolerance of the colour being filled
        if(!tolerance_equal(image_data, offset, target, tolerance)) {
            continue;
        }
        
        // Update the pixel to the fill colour and add neighbours onto stack to traverse 
        // the fill area
        i = flood_fill.fill_ways;
        while(i--) {
            // Use the same loop for setting RGBA as for checking the neighbouring pixels
            if(i < 4) {
                image_data[offset + i] = colour[i];
            }
        
            // Get the new coordinate by adjusting x and y based on current step
            x2 = x + steps[i][0];
            y2 = y + steps[i][1];
            key = x2 + ',' + y2;
            
            // If new coordinate is out of bounds, or we've already added it, then skip to 
            // trying the next neighbour without adding this one
            if(x2 < 0 || y2 < 0 || x2 >= width || y2 >= height || seen[key]) {
                continue;
            }
            
            // Push neighbour onto points array to be processed, and tag as seen
            points.push({ x: x2, y: y2 });
            seen[key] = true;
        }
    }
}

// Static props for adjustment steps to use in fill algorithm (4-way is default) and a getter 
// to dynamically check how many steps are set
flood_fill.steps = [[1, 0], [0, 1], [0, -1], [-1, 0]];
Object.defineProperty(flood_fill, 'fill_ways', {
    get: function() {
        return flood_fill.steps.length;
    }
});