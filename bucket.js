// Bucket tool for canvas, using the flood_fill function
function Bucket(canvas, cfg) {
    if(!(this instanceof Bucket)) {
        return new Bucket(canvas, cfg);
    }
    
    var _this = this,
        context = canvas.getContext('2d');
    
    this.canvas = canvas;
    cfg = cfg || {};
    
    // Apply defaults
    this.colour = cfg.colour || '#ff0000';
    
    this.active = cfg.active === undefined ? true : !!cfg.active;
    
    this.tolerance = cfg.tolerance === undefined || isNaN('' + cfg.tolerance) ? 10 : cfg.tolerance;
    
    this.fill_tolerance = cfg.fill_tolerance === undefined || isNaN('' + cfg.fill_tolerance) ? 1 : cfg.fill_tolerance;
    
    // Attach the click listener
    canvas.addEventListener('click', function(event) {
        if(!_this.active) {
            return;
        }
        
        var x = event.offsetX, 
            y = event.offsetY,
            canvas_size = canvas.getClientRects()[0],
            image_data = context.getImageData(0, 0, canvas_size.width, canvas_size.height),
            // PERF: Compile a function for quickly getting the offset into image_data.data that corresponds 
            // to an x-y pixel coordinate
            get_point_offset = new Function('x', 'y', 'return 4 * (y * ' + image_data.width + ' + x)'),
            // Find the offset, in image_data.data, of the clicked pixel
            target_offset = get_point_offset(x, y),
            target = image_data.data.slice(target_offset, target_offset + 4),
            result;
        
        if(tolerance_equal(target, 0, _this.parsed_colour, _this.fill_tolerance)) {
            // Trying to fill something which is (essentially) the fill colour
            return;
        }
        
        // Perform fill - this mutates the image_data.data array
        flood_fill(
            image_data.data, 
            get_point_offset, 
            { x: x, y: y }, 
            _this.parsed_colour, 
            target, _this.tolerance, 
            image_data.width, 
            image_data.height
        );
        
        // Push the updated image data back to the canvas
        context.putImageData(image_data, 0, 0);
    });
}

// Getter/setter for colour which validates and parses the set value
Object.defineProperty(Bucket.prototype, 'colour', {
    get: function() {
        return this.__colour;
    },
    set: function(value) {
        // Try to extract the hex values from the colour string
        var parsed = Bucket.__parse_colour_rgx.exec(value || '');
        if(!parsed) {
            // Don't update if string isn't parsable
            if(window.DEBUG) {
                console.warn('Invalid colour set: ', value);
            }
            
            return;
        }
    
        // Store the value, and the parsed data
        this.__colour = value;
        this.__parsed_colour = parsed.slice(1).map(function(value) { 
            // Get int from hex
            var parsed_int = parseInt(value, 16);
            
            // Default to 255 if value isn't an int or is out of uint8 range
            return isNaN(parsed_int) || parsed_int < 0 || parsed_int > 255 ? 255 : parsed_int;
        });
    }
});

// Accessor for the parsed colour value
Object.defineProperty(Bucket.prototype, 'parsed_colour', {
    get: function() {
        return this.__parsed_colour;
    }
});

// Static regex for extracting rgb(a) colours from a hex string (e.g. '#ff0000')
Bucket.__parse_colour_rgx = /^#?([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})?$/i;