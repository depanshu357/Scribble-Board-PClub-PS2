// A square on the colour swatch
function ColourPad(container, colour) {
    var el = this.el = document.createElement('div');
    
    el.style.width = el.style.height = '24px';
    el.style.border = el.style.padding = el.style.margin = 0;
    el.style.display = 'inline-block';
    el.style.background = colour;
    
    el.dataset.__swatch_colour = colour;
    
    container.appendChild(el);
}

// The overall swatch which has a variety of colour pads and sets the chosen
// colour on the bucket whenever a pad is clicked
function ColourSwatch(bucket, colours, container) {
    var pads = [],
        outer = document.createElement('div'),
        el = document.createElement('div');
    
    // Apply colour-indicator outline
    bucket.canvas.style.outline = '4px solid ' + bucket.colour;
    
    el.style.height = outer.style.height = '24px';
    outer.style.padding = outer.style.margin = el.style.padding = el.style.margin = 0;
    el.style.display = 'inline-block';
    el.style.border = '1px solid #666';
    outer.style.marginTop = '20px';
    outer.style.textAlign = 'center';
    outer.appendChild(el);
    container.appendChild(outer);
    
    // Make pads for the supplied colours
    colours.forEach(function(colour) {
        pads.push(new ColourPad(el, colour));
    });
    
    el.addEventListener('click', function(event) {
        // When clicked, set correct bucket colour
        var colour = event.target.dataset.__swatch_colour;
        bucket.colour = colour;
        
        // Update the indicator outline
        bucket.canvas.style.outline = '4px solid ' + colour;
    });
}