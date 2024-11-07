let patterns = []; // Array to store circular patterns
let beads = []; // Array to store decorative beads
const padding = 20; // Padding between elements

// Class to create circular patterns with various properties and animations
class CircularPattern {
  constructor(x, y, colors) {
    this.x = x; // X-coordinate of the pattern's center
    this.y = y; // Y-coordinate of the pattern's center
    this.radius = 70; // Radius of the main pattern
    this.colors = colors; // Color palette for this pattern
    this.dotSize = 5; // Size of small dots in the pattern
    this.ringSpacing = 7; // Spacing between rings
    this.expansionFactor = 0; // Controls the expansion of small dots
    this.rotationAngle = 0; // Controls the rotation angle of small dots
    this.internalRotationAngle = 0; // Controls the rotation angle of the internal pattern
    this.colorChangeInterval = 2000; // Interval to change background color every 2 seconds
    this.lastColorChangeTime = 0; // Timestamp of the last color change
    this.currentBgColor = this.colors.bgColors; // Current background color
    this.colorPalette = ["#cdf5e1", "#fef3f3", "#f7edd9", "#f4b628", "#b6eff1", "#cfe3f5", "#fdc038"];
    
    // Pattern change logic
    this.patternChangeInterval = 3000; // Changes pattern style every 3 seconds
    this.lastPatternChangeTime = 0; // Timestamp for the last pattern change
    this.patternStyles = ["concentric circles", "zigzag lines", "beads", "default"];
    this.currentPatternStyle = this.colors.internalPatternStyle; // Initial pattern style

    // Timer for drawing tree rings
    this.ringDrawStartTime = millis(); // Start time for drawing rings
    this.ringDrawInterval = 500; // Interval between each ring (milliseconds)
    this.maxRings = floor(this.radius / 10); // Maximum number of rings based on radius
    this.ringsDrawn = 0; // Current count of drawn rings
    this.ringRotationAngle = 0; // Rotation angle for tree rings
  }

  // Update background color and pattern style based on time intervals
  updateColorAndPattern() {
    // Update background color at set intervals
    if (millis() - this.lastColorChangeTime > this.colorChangeInterval) {
      let newColor;
      do {
        newColor = random(this.colorPalette); // Choose a random color from the palette
      } while (newColor === this.currentBgColor); // Ensure new color is different from the current one
      this.currentBgColor = newColor; // Set new color
      this.lastColorChangeTime = millis(); // Reset timer
    }

    // Update pattern style at set intervals
    if (millis() - this.lastPatternChangeTime > this.patternChangeInterval) {
      this.currentPatternStyle = random(this.patternStyles); // Choose a random pattern style
      this.lastPatternChangeTime = millis(); // Reset timer
    }

    // Update the dynamic display of tree rings
    if (millis() - this.ringDrawStartTime > this.ringDrawInterval) {
      if (this.ringsDrawn < this.maxRings) {
        this.ringsDrawn++; // Increment the number of rings drawn
        this.ringDrawStartTime = millis(); // Reset ring timer
      }
    }

    // Rotate tree rings
    this.ringRotationAngle += 0.002; // Control rotation speed
  }

  // Draws dynamic tree rings with random colors and gaps for a textured effect
  drawTreeRings() {
    push();
    noFill();
    strokeWeight(2); // Thicker lines for rings
    rotate(this.ringRotationAngle); // Rotate the entire tree ring structure

    // Draw each ring that should be displayed
    for (let i = 1; i <= this.ringsDrawn; i++) {
      let ringColor = random(this.colorPalette);
      stroke(ringColor); // Set random color for each ring

      beginShape();
      for (let angle = 0; angle < TWO_PI; angle += 0.1) {
        // Randomly skip some parts of the ring to create a broken effect
        if (random() > 0.2) { // 80% probability to draw, 20% probability to skip
          let x = cos(angle) * i * 10;
          let y = sin(angle) * i * 10;
          vertex(x, y);
        }
      }
      endShape(CLOSE);
    }
    pop(); // Restore original rotation state
  }

  // Draws the internal pattern based on the current pattern style
  drawInternalPattern() {
    push();
    // Apply internal rotation
    this.internalRotationAngle += 0.005; // Adjust rotation speed
    rotate(this.internalRotationAngle);

    fill(this.colors.internalBbColor);
    circle(0, 0, this.dotSize * 10); // Draws a base circle

    // Choose pattern style based on current pattern style setting
    switch (this.currentPatternStyle) {
      case "concentric circles":
        // Color palettes for concentric circles
        let circleColorsPalette = {
          "green": { outerCircleColor: "#e4462b", innerCircleColor: "#d443a5" },
          "purple": { outerCircleColor: "#e4462b", innerCircleColor: "#305b53" },
          "cyan": { outerCircleColor: "#c74cab", innerCircleColor: "#1b9692" }
        };
        let selectedPalette = circleColorsPalette[this.colors.type] || circleColorsPalette["green"];

        // Draw concentric circles alternating between colors
        for (let r = this.dotSize * 10; r > 0; r -= 10) {
          let color = (r / 10) % 2 === 0 ? selectedPalette.outerCircleColor : selectedPalette.innerCircleColor;
          fill(color);
          circle(0, 0, r);
        }
        break;

      case "zigzag lines":
        // Draw zigzag lines in a circular arrangement
        stroke(255, 255, 255, 200);
        strokeWeight(1);
        noFill();
        let zigzagLayers = 3;
        let baseRadius = 2;
        for (let layer = 0; layer < zigzagLayers; layer++) {
          let segments = 12 + layer * 2;
          let radius = baseRadius + layer * this.dotSize * 2;
          beginShape();
          for (let i = 0; i < segments; i++) {
            let angle = (TWO_PI * i) / segments;
            let x = cos(angle) * (radius + (i % 2 ? -4 : 4));
            let y = sin(angle) * (radius + (i % 2 ? -4 : 4));
            vertex(x, y);
          }
          endShape(CLOSE);
        }
        noStroke();
        break;

      case "beads":
        // Draw beads in concentric circles
        fill(255, 255, 255);
        let beadLayers = 2;
        for (let layer = 1; layer <= beadLayers; layer++) {
          let beadCount = 8 * layer;
          let beadRadius = this.dotSize * 2 * layer;
          for (let i = 0; i < beadCount; i++) {
            let angle = (TWO_PI * i) / beadCount;
            let x = cos(angle) * beadRadius;
            let y = sin(angle) * beadRadius;
            circle(x, y, this.dotSize);
          }
        }
        break;

      default:
        fill(255, 255, 255, 150);
        circle(0, 0, this.dotSize * 6); // Default white circle in the center
    }
    pop(); // Restore original rotation state
  }

  // Main display function to render the circular pattern
  display() {
    this.updateColorAndPattern(); // Update color and pattern style

    push();
    translate(this.x, this.y); // Move to the pattern's center
    noStroke();
    fill(this.currentBgColor); // Set background color
    circle(0, 0, this.radius * 2); // Draw main circle background

    // Calculate expansion and rotation of dots
    let time = millis() / 1000;
    this.expansionFactor = sin(time) * 2; // Expansion factor for dots
    this.rotationAngle += 0.01; // Increment rotation angle

    // Draw dots on concentric rings
    for (let r = this.radius - 5; r > 0; r -= this.ringSpacing) {
      const circumference = TWO_PI * r;
      const dots = floor(circumference / (this.dotSize * 2));
      const angleStep = TWO_PI / dots;
      fill(this.colors.patternColors); // Set dot color
      for (let angle = 0; angle < TWO_PI; angle += angleStep) {
        const expandedR = r + this.expansionFactor * 10;
        const rotatedAngle = angle + this.rotationAngle; // Offset by rotation angle
        const x = expandedR * cos(rotatedAngle);
        const y = expandedR * sin(rotatedAngle);
        circle(x, y, this.dotSize); // Draw dot
      }
    }

    this.drawInternalPattern(); // Draw the internal pattern
    this.drawTreeRings(); // Draw tree rings pattern
    pop();
  }

  // Checks if this pattern overlaps with another pattern
  overlaps(other) {
    const minDistance = this.radius * 2 + 10;
    const distance = dist(this.x, this.y, other.x, other.y);
    return distance < minDistance;
  }
}

// Class for creating decorative beads with color and rotation effects
class DecorativeBead {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.baseSize = 13.5; // Base size of the bead
    this.size = this.baseSize;
    this.glowSize = this.size * 1.5; // Size for glow effect
    this.innerSize = this.size * 0.4; // Inner white circle size
    this.angle = 0; // Initial rotation angle
    this.fillColor = 'black'; // Initial color
    this.colorChangeTime = millis(); // Track time for color change
    this.colorPalette = ["#f47b23", "#d03c49", "#2ba441", "#115799", "#ca3daf", "#d5236f"];
    this.index = index; // Bead index for color delay
    this.colorChangeDelay = this.index * 300; // Delay for color change
    this.colorChanged = false; // Track if color has changed
  }

  // Update color of the bead based on delay
  updateColor() {
    if (!this.colorChanged && millis() > this.colorChangeTime + this.colorChangeDelay) {
      this.fillColor = random(this.colorPalette); // Change to random color
      this.colorChanged = true; // Mark color as changed
    }
  }

  // Controls the expansion and rotation of the bead
  expandAndRotate() {
    let time = millis() / 1000;
    this.size = this.baseSize + sin(time * 2) * 3; // Pulsing effect
    this.angle += 0.01; // Increment rotation
  }

  // Display the bead with glow and color effects
  display() {
    this.updateColor(); // Update color if needed
    this.expandAndRotate();
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Draw glow effect
    noStroke();
    fill('#f47b23'); // Glow color
    circle(0, 0, this.glowSize);

    // Draw main bead body
    fill(this.fillColor);
    circle(0, 0, this.size);

    // Draw inner white circle
    fill("white");
    circle(0, 0, this.innerSize);

    pop();
  }
}

// Function to draw curved connections between beads with glowing effect
function drawCurvyConnections() {
  let connectionCounts = new Array(beads.length).fill(0); // Track connections per bead
  let connections = [];

  // Ensure minimum connections for each bead
  for (let i = 0; i < beads.length; i++) {
    if (connectionCounts[i] === 0) {
      let closestDist = Infinity;
      let closestIndex = -1;

      // Find closest bead for connection
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

  // Add extra connections to beads with fewer connections
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

  // Draw each connection with a glowing effect using layered strokes
  for (let conn of connections) {
    let bead1 = beads[conn.bead1];
    let bead2 = beads[conn.bead2];

    for (let k = 3; k >= 0; k--) {
      stroke(244, 123, 35, map(k, 0, 3, 50, 200));
      strokeWeight(map(k, 0, 3, 3, 0.8));

      let midX = (bead1.x + bead2.x) / 2;
      let midY = (bead1.y + bead2.y) / 2;

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

// p5.js setup function to initialize canvas and layout patterns and beads
function setup() {
  createCanvas(windowWidth, windowHeight);
  const arrayOfColors = [
    {
      type: "green",
      bgColors: "#cdf5e1",
      patternColors: "#2ba441",
      internalBbColor: "#fb586a",
      internalPatternStyle: "concentric circles"
    },
    // Additional color schemes would be defined here
  ];

  // Layout grid of circular patterns
  let gridSize = 150;
  for (let x = gridSize / 2; x < width - gridSize / 2; x += gridSize) {
    for (let y = gridSize / 2; y < height - gridSize / 2; y += gridSize) {
      let posX = x + random(-15, 15);
      let posY = y + random(-15, 15);
      const chosenPalette = random(arrayOfColors);
      const pattern = new CircularPattern(posX, posY, chosenPalette);
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

  // Create decorative beads
  let attempts = 0;
  const maxAttempts = 2000;
  const minBeads = 400;
  while (beads.length < minBeads && attempts < maxAttempts) {
    let x = random(width);
    let y = random(height);
    let validPosition = true;
    for (let pattern of patterns) {
      let d = dist(x, y, pattern.x, pattern.y);
      if (d < pattern.radius + 20) {
        validPosition = false;
        break;
      }
    }
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
      beads.push(new DecorativeBead(x, y, beads.length)); // Pass bead index to constructor
    }
    attempts++;
  }
}

// p5.js draw function to render the animation frame by frame
function draw() {
  background('#086487'); // Set background color
  patterns.forEach(pattern => {
    pattern.display(); // Draw each circular pattern
  });
  drawCurvyConnections(); // Draw connections between beads
  beads.forEach(bead => {
    bead.display(); // Display each bead
  });
}

// Handle window resizing to reinitialize canvas and patterns
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  patterns = [];
  beads = [];
  setup(); // Reinitialize patterns and beads
}