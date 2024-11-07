// The pattern and beads are stored in the global arrays as shown below
let patterns = [];
let beads = [];
const padding = 20;

/**
 * Created a class called CircularPattern that will create circular patterned designs
 * Inspired by p5.js circular patterned design examples:
 * @see https://p5js.org/examples/form-regular-polygon.html
 */
class CircularPattern {
  /**
   * Initialised a constructor for CircularPattern
   * Below are the X and Y coordinates of the center of the circular patterned design
   * @param {number} x 
   * @param {number} y 
   * Color palette object that will contain various colors used in the circular patterned design
   * @param {Object} colors 
   */
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.radius = 70; 
    this.colors = colors;
    this.dotSize = 5;
    this.ringSpacing = 7;
  }

  /**
   * Creates a circular bead pattern inside of the circular patterned design.
   * Uses various pattern styles like concentric circles, zigzag lines, and beads.
   * Used p5.js circle pattern tutorial to create concentric circular.
   * @see https://p5js.org/reference/#/p5/circle
   */
  drawInternalPattern() {
    // Draws the background circle and fills it with internalBbColor
    fill(this.colors.internalBbColor);
    circle(0, 0, this.dotSize * 10);

    switch(this.colors.internalPatternStyle) {
      case "concentric circles":
        // Color palettes chosen for concentric circles
        let circleColorsPalette = {
          "green": {
            outerCircleColor: "#e4462b",
            innerCircleColor: "#d443a5",
          },
          "purple": {
            outerCircleColor: "#e4462b",
            innerCircleColor: "#305b53",
          },
          "cyan": {
            outerCircleColor: "#c74cab",
            innerCircleColor: "#1b9692",
          }
        };
        
        let selectedPalette = circleColorsPalette[this.colors.type] || circleColorsPalette["green"];
        
         // Draws concentric circles with the selected color palette
        for (let r = this.dotSize * 10; r > 0; r -= 10) {
          let color = (r / 10) % 2 === 0 ? selectedPalette.outerCircleColor : selectedPalette.innerCircleColor;
          fill(color);
          circle(0, 0, r);
        }
        break;
      
      case "zigzag lines":
        /**
        * Creates a circular bead pattern inside of the circular patterned design.
        * beginShape() and endShape() from p5.js are used to create the zigzag pattern
        * Both learnt from the p5.js shape tutorial:
        @see https://p5js.org/reference/#/p5/beginShape
        */
        stroke(255, 255, 255, 200);
        strokeWeight(1);
        noFill();

        // Number of concentric zigzag layers
        let zigzagLayers = 3;  
        let baseRadius = 2;
        
        for (let layer = 0; layer < zigzagLayers; layer++) {
          // Increase segments for the outer zigzag layers
          let segments = 12 + layer * 2;  
          // Increase radius for each layer
          let radius = baseRadius + layer * this.dotSize * 2;
          
          beginShape();
          for (let i = 0; i < segments; i++) {
            let angle = (TWO_PI * i) / segments;
            // Created zigzag effect by alternating the radius
            let x = cos(angle) * (radius + (i % 2 ? -4 : 4));
            let y = sin(angle) * (radius + (i % 2 ? -4 : 4));
            vertex(x, y);
          }
          endShape(CLOSE);
        }
        
        noStroke();
        break;

      case "beads":
        // Created the concentric circles of white beads
        // Inspired by the traditional mandala patterns
        fill(255, 255, 255);
        // Number of bead layers (concentric circles)
        let beadLayers = 2;
        
        for (let layer = 1; layer <= beadLayers; layer++) {
          // Increase the bead count for each layer
          let beadCount = 8 * layer;
          // Each layer has a larger radius
          let beadRadius = this.dotSize * 2 * layer;
          
          for (let i = 0; i < beadCount; i++) {
            let angle = (TWO_PI * i) / beadCount;
            let x = cos(angle) * beadRadius;
            let y = sin(angle) * beadRadius;
            // Draw a bead at (x, y)
            circle(x, y, this.dotSize);
          }
        }
        break;
        
      default:
        // Simple white center if no internalPatternStyle is defined
        fill(255, 255, 255, 150);
        circle(0, 0, this.dotSize * 6);
    }
  }

  /**
   * Displays the complete circular pattern
   * push() and pop() from p5.js is used for transformation isolation
   * @see https://p5js.org/reference/#/p5/push
   */
  display() {
    push();
    translate(this.x, this.y);

    // Draws the main background of the circle
    noStroke();
    fill(this.colors.bgColors);
    circle(0, 0, this.radius * 2);

    // Creates a series of dots placed on concentric circles.
    // The algorithm calculates the optimal spacing for the dots based on circumference.
    for (let r = this.radius-5; r > 0; r -= this.ringSpacing) {
      const circumference = TWO_PI * r;
      const dots = floor(circumference / (this.dotSize * 2));
      const angleStep = TWO_PI / dots;
      
      fill(this.colors.patternColors);

      for (let angle = 0; angle < TWO_PI; angle += angleStep) {
        const x = r * cos(angle);
        const y = r * sin(angle);
        circle(x, y, this.dotSize);
      }
    }

    this.drawInternalPattern();
    pop();
  }

  /**
   * Checks whether any pattern overlaps or falls on top of any other pattern
   * Uses dist() function from p5.js to callculate the distance
   * Returns True if any pattern overlaps
   * @param {CircularPattern} other - is an another pattern that is used to check for overlap
   */
  overlaps(other) {
    const minDistance = this.radius * 2 + 10;
    const distance = dist(this.x, this.y, other.x, other.y);
    return distance < minDistance;
  }
}

/**
 * DecorativeBead class is used to create the connecting elements for the beads
 * Creates a tri-colored bead using layered circles
 * Technique learnt from the p5.js glow effects tutorial
 * @see https://p5js.org/examples/color-linear-gradient.html
 */
class DecorativeBead {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 13.5;
    this.glowSize = this.size * 1.5;
    this.innerSize = this.size * 0.4;
  }

  /**
   * Displays the bead with glowing effect
   * Uses multiple layers to create visual depth effect
   */
  display() {
    push();
    translate(this.x, this.y);
    
    // Creates orange glow effect
    noStroke();
    let glowColor = color('#f47b23');
    
    fill(glowColor);
    circle(0, 0, this.glowSize);
    
    // Creates a black color body of the bead
    fill('black');
    circle(0, 0, this.size);
    
    // Creates a white circle at the center of the bead
    fill("white");
    circle(0, 0, this.innerSize);
    
    pop();
  }
}

/**
 * Draws the curved connections between beads
 * Uses p5.js noise() for organic curve variation
 * Technique learnt from the p5.js curve vertex tutorial
 * @see https://p5js.org/reference/#/p5/curveVertex
 */
function drawCurvyConnections() {
  let connectionCounts = new Array(beads.length).fill(0);
  let connections = [];

  // First pass: ensure minimum connections to the bead
  for (let i = 0; i < beads.length; i++) {
    if (connectionCounts[i] === 0) {
      let closestDist = Infinity;
      let closestIndex = -1;
      
      // Finds the closest bead that is not connected
      for (let j = 0; j < beads.length; j++) {
        if (i !== j && connectionCounts[j] < 3) {
          let d = dist(beads[i].x, beads[i].y, beads[j].x, beads[j].y);
          if (d < closestDist && d < 120) {
            closestDist = d;
            closestIndex = j;
          }
        }
      }
      
      if (closestIndex !== -1) {
        connections.push({
          bead1: i,
          bead2: closestIndex,
          distance: closestDist
        });
        connectionCounts[i]++;
        connectionCounts[closestIndex]++;
      }
    }
  }

  // Second pass: adds additional connections to the bead
  for (let i = 0; i < beads.length; i++) {
    if (connectionCounts[i] >= 3) continue;

    let possibleConnections = [];
    for (let j = 0; j < beads.length; j++) {
      if (i !== j && connectionCounts[j] < 3) {
        let d = dist(beads[i].x, beads[i].y, beads[j].x, beads[j].y);
        if (d < 100) {
          let exists = connections.some(c => 
            (c.bead1 === i && c.bead2 === j) || 
            (c.bead1 === j && c.bead2 === i)
          );
          
          if (!exists) {
            possibleConnections.push({
              bead1: i,
              bead2: j,
              distance: d
            });
          }
        }
      }
    }

    possibleConnections.sort((a, b) => a.distance - b.distance);
    for (let conn of possibleConnections) {
      if (connectionCounts[i] < 3 && connectionCounts[conn.bead2] < 3) {
        connections.push(conn);
        connectionCounts[i]++;
        connectionCounts[conn.bead2]++;
      }
    }
  }
  /** 
  * Draws curved connections with a glowing effect
  * Using multiple strokes that have varying opacity for glowing effect
  * Technique learnt from the creative coding glow effects
  * @see https://p5js.org/reference/#/p5/stroke
  */
  
  for (let conn of connections) {
    let bead1 = beads[conn.bead1];
    let bead2 = beads[conn.bead2];
    
    for (let k = 3; k >= 0; k--) {
      stroke(244, 123, 35, map(k, 0, 3, 50, 200));
      strokeWeight(map(k, 0, 3, 3, 0.8));
      
      let midX = (bead1.x + bead2.x) / 2;
      let midY = (bead1.y + bead2.y) / 2;
      
      // Use noise for the organic curve variation
      let offsetX = map(noise(conn.bead1 * 0.1, conn.bead2 * 0.1), 0, 1, -15, 15);
      let offsetY = map(noise(conn.bead2 * 0.1, conn.bead1 * 0.1), 0, 1, -15, 15);
      
      beginShape();
      curveVertex(bead1.x, bead1.y);
      curveVertex(bead1.x, bead1.y);
      curveVertex(midX + offsetX, midY + offsetY);
      curveVertex(bead2.x, bead2.y);
      curveVertex(bead2.x, bead2.y);
      endShape();
    }
  }
}

/**
 * p5.js setup function is used to initialize the canvas and to create the initial pattern layout
 * Uses random() function for creating variations in pattern placement
 * @see https://p5js.org/reference/#/p5/setup
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // An array of color pallete objects
  const arrayOfColors = [
    {
      type:"green",
      bgColors: "#cdf5e1",
      patternColors: "#2ba441",
      internalBbColor: "#fb586a",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"red",
      bgColors: "#fef3f3",
      patternColors: "#d03c49",
      internalBbColor: "#fa6776",
      internalPatternStyle:"zigzag lines"
    },
    {
      type:"orange",
      bgColors: "#f7edd9",
      patternColors: "#fc8c27",
      internalBbColor: "#bac37e",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"blue-yellow",
      bgColors: "#f4b628",
      patternColors: "#115799",
      internalBbColor: "#d5499b",
      internalPatternStyle:"beads"
    },
    {
      type:"cyan",
      bgColors: "#b6eff1",
      patternColors: "#119995",
      internalBbColor: "#ca3daf",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"purple",
      bgColors: "#cfe3f5",
      patternColors: "#231c80",
      internalBbColor: "#b03f8e",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"",
      bgColors: "#fdc038",
      patternColors: "#d5236f",
      internalBbColor: "#f165cc",
      internalPatternStyle:"concentric circles"
    }
  ];

  // Used to creates a grid-based pattern layout
  let gridSize = 150;
  for (let x = gridSize/2; x < width - gridSize/2; x += gridSize) {
    for (let y = gridSize/2; y < height - gridSize/2; y += gridSize) {
      let posX = x + random(-15, 15);
      let posY = y + random(-15, 15);
      
      const choosenPallete = random(arrayOfColors);
      const pattern = new CircularPattern(posX, posY, choosenPallete);
      
      let overlapping = false;
      for (let other of patterns) {
        if (pattern.overlaps(other)) {
          overlapping = true;
          break;
        }
      }
      
      if (!overlapping) {
        patterns.push(pattern);
      }
    }
  }

  // Initialized the decorative beads with connection constraints
  let attempts = 0;
  const maxAttempts = 2000;
  const minBeads = 400;
  
  while (beads.length < minBeads && attempts < maxAttempts) {
    let x = random(width);
    let y = random(height);
    let validPosition = true;
    
    // Checking pattern proximity
    for (let pattern of patterns) {
      let d = dist(x, y, pattern.x, pattern.y);
      if (d < pattern.radius + 20) {
        validPosition = false;
        break;
      }
    }
    
    // Check bead proximity and connections
    if (validPosition) {
      let hasNearbyBead = false;
      let tooClose = false;
      
      for (let bead of beads) {
        let d = dist(x, y, bead.x, bead.y);
        if (d < 35) {
          tooClose = true;
          break;
        }
        if (d < 120) {
          hasNearbyBead = true;
        }
      }
      
      validPosition = !tooClose && (beads.length === 0 || hasNearbyBead);
    }
    
    if (validPosition) {
      beads.push(new DecorativeBead(x, y));
    }
    
    attempts++;
  }
}

/**
 * p5.js draw function is used to render the complete generative artwork
 * Uses layering technique along with the background, patterns, connections, and beads to create a visual depth
 * Layer ordering technique leant from the p5.js layering tutorial
 * @see https://p5js.org/examples/structure-setup-draw.html
 */
function draw() {
 
  background('#086487');
  
  // Draws various circular patterned designs
  patterns.forEach(pattern => {
    pattern.display();
  });
  
  // Draws curvy connections that connect the beads
  drawCurvyConnections();
  
  // Draws various beads
  beads.forEach(bead => {
    bead.display();
  });
}

/**
 * p5.js windowResized function is used to make the canvas responsive
 * Implements responsive design principles for canvas resizing
 * Technique leant from the p5.js responsive design examples
 * @see https://p5js.org/reference/#/p5/windowResized
 * Reset and reinitialize approach learnt from the creative coding best practices
 * @see https://p5js.org/reference/#/p5/resizeCanvas
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  patterns = [];
  beads = [];
  setup();
}
