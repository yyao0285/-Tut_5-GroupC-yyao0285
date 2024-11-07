let patterns = [];
let beads = [];
const padding = 20;

class CircularPattern {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.radius = 70;
    this.colors = colors;
    this.dotSize = 5;
    this.ringSpacing = 7;
    this.expansionFactor = 0; // Controls the expansion of small circles
    this.rotationAngle = 0; // Controls the rotation angle of small circles
    this.internalRotationAngle = 0; // Controls the rotation of the internal pattern
    this.colorChangeInterval = 2000; // Change background color every 2 seconds
    this.lastColorChangeTime = 0;
    this.currentBgColor = this.colors.bgColors;
    this.colorPalette = ["#cdf5e1", "#fef3f3", "#f7edd9", "#f4b628", "#b6eff1", "#cfe3f5", "#fdc038"];
    
    // Pattern transformation settings
    this.patternChangeInterval = 3000; // Change pattern style every 3 seconds
    this.lastPatternChangeTime = 0;
    this.patternStyles = ["concentric circles", "zigzag lines", "beads", "default"];
    this.currentPatternStyle = this.colors.internalPatternStyle;
  }

  updateColorAndPattern() {
    // Update background color
    if (millis() - this.lastColorChangeTime > this.colorChangeInterval) {
      let newColor;
      do {
        newColor = random(this.colorPalette);
      } while (newColor === this.currentBgColor); // Ensure new color is different
      this.currentBgColor = newColor;
      this.lastColorChangeTime = millis(); // Reset timer
    }

    // Update pattern style
    if (millis() - this.lastPatternChangeTime > this.patternChangeInterval) {
      this.currentPatternStyle = random(this.patternStyles);
      this.lastPatternChangeTime = millis(); // Reset timer
    }
  }

  drawInternalPattern() {
    push();
    // Apply internal rotation
    this.internalRotationAngle += 0.005; // Adjust rotation speed
    rotate(this.internalRotationAngle);

    fill(this.colors.internalBbColor);
    circle(0, 0, this.dotSize * 10);

    switch (this.currentPatternStyle) {
      case "concentric circles":
        let circleColorsPalette = {
          "green": { outerCircleColor: "#e4462b", innerCircleColor: "#d443a5" },
          "purple": { outerCircleColor: "#e4462b", innerCircleColor: "#305b53" },
          "cyan": { outerCircleColor: "#c74cab", innerCircleColor: "#1b9692" }
        };
        let selectedPalette = circleColorsPalette[this.colors.type] || circleColorsPalette["green"];

        for (let r = this.dotSize * 10; r > 0; r -= 10) {
          let color = (r / 10) % 2 === 0 ? selectedPalette.outerCircleColor : selectedPalette.innerCircleColor;
          fill(color);
          circle(0, 0, r);
        }
        break;

      case "zigzag lines":
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
        circle(0, 0, this.dotSize * 6);
    }
    pop(); // Restore original rotation state
  }

  display() {
    this.updateColorAndPattern(); // Update color and pattern

    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.currentBgColor);
    circle(0, 0, this.radius * 2);

    let time = millis() / 1000;
    this.expansionFactor = sin(time) * 2; // Controls small circles' expansion
    this.rotationAngle += 0.01; // Controls small circles' rotation speed

    for (let r = this.radius - 5; r > 0; r -= this.ringSpacing) {
      const circumference = TWO_PI * r;
      const dots = floor(circumference / (this.dotSize * 2));
      const angleStep = TWO_PI / dots;
      fill(this.colors.patternColors); // Use initial color for dots
      for (let angle = 0; angle < TWO_PI; angle += angleStep) {
        const expandedR = r + this.expansionFactor * 10;
        const rotatedAngle = angle + this.rotationAngle; // Add rotation angle offset
        const x = expandedR * cos(rotatedAngle);
        const y = expandedR * sin(rotatedAngle);
        circle(x, y, this.dotSize);
      }
    }

    this.drawInternalPattern();
    pop();
  }

  overlaps(other) {
    const minDistance = this.radius * 2 + 10;
    const distance = dist(this.x, this.y, other.x, other.y);
    return distance < minDistance;
  }
}

class DecorativeBead {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseSize = 13.5;
    this.size = this.baseSize;
    this.glowSize = this.size * 1.5;
    this.innerSize = this.size * 0.4;
    this.angle = 0; // Controls rotation of the bead
  }

  expandAndRotate() {
    // Make bead pulsate and rotate over time
    let time = millis() / 1000;
    this.size = this.baseSize + sin(time * 2) * 3; // Pulsating effect
    this.angle += 0.01; // Gradually increase the rotation angle
  }

  display() {
    this.expandAndRotate();
    push();
    translate(this.x, this.y);
    rotate(this.angle); // Apply rotation
    noStroke();

    // Draw glow effect
    let glowColor = color('#f47b23');
    fill(glowColor);
    circle(0, 0, this.glowSize);

    // Draw bead body
    fill('black');
    circle(0, 0, this.size);

    // Draw inner white center
    fill("white");
    circle(0, 0, this.innerSize);
    pop();
  }
}

function drawCurvyConnections() {
  let connectionCounts = new Array(beads.length).fill(0);
  let connections = [];

  // Create initial mandatory connections to ensure every bead has at least one connection
  for (let i = 0; i < beads.length; i++) {
    if (connectionCounts[i] === 0) {
      let closestDist = Infinity;
      let closestIndex = -1;

      // Find closest bead that has fewer than 3 connections
      for (let j = 0; j < beads.length; j++) {
        if (i !== j && connectionCounts[j] < 3) {
          let d = dist(beads[i].x, beads[i].y, beads[j].x, beads[j].y);
          if (d < closestDist && d < 120) {
            closestDist = d;
            closestIndex = j;
          }
        }
      }

      // Create a connection if found
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

  // Attempt to create additional connections for visual appeal
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

          // Only add new unique connections
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

    // Sort and add connections based on proximity
    possibleConnections.sort((a, b) => a.distance - b.distance);
    for (let conn of possibleConnections) {
      if (connectionCounts[i] < 3 && connectionCounts[conn.bead2] < 3) {
        connections.push(conn);
        connectionCounts[i]++;
        connectionCounts[conn.bead2]++;
      }
    }
  }

  // Draw the curved connections with a glowing effect
  for (let conn of connections) {
    let bead1 = beads[conn.bead1];
    let bead2 = beads[conn.bead2];

    // Layered stroke for glow effect
    for (let k = 3; k >= 0; k--) {
      stroke(244, 123, 35, map(k, 0, 3, 50, 200));
      strokeWeight(map(k, 0, 3, 3, 0.8));

      // Calculate mid-point and add noise for organic curve
      let midX = (bead1.x + bead2.x) / 2;
      let midY = (bead1.y + bead2.y) / 2;
      let offsetX = map(noise(conn.bead1 * 0.1, conn.bead2 * 0.1), 0, 1, -15, 15);
      let offsetY = map(noise(conn.bead2 * 0.1, conn.bead1 * 0.1), 0, 1, -15, 15);

      // Draw smooth curve between beads
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Define color palettes for different patterns
  const arrayOfColors = [
    {
      type: "green",
      bgColors: "#cdf5e1",
      patternColors: "#2ba441",
      internalBbColor: "#fb586a",
      internalPatternStyle: "concentric circles"
    },
    {
      type: "red",
      bgColors: "#fef3f3",
      patternColors: "#d03c49",
      internalBbColor: "#fa6776",
      internalPatternStyle: "zigzag lines"
    },
    {
      type: "orange",
      bgColors: "#f7edd9",
      patternColors: "#fc8c27",
      internalBbColor: "#bac37e",
      internalPatternStyle: "concentric circles"
    },
    {
      type: "blue-yellow",
      bgColors: "#f4b628",
      patternColors: "#115799",
      internalBbColor: "#d5499b",
      internalPatternStyle: "beads"
    },
    {
      type: "cyan",
      bgColors: "#b6eff1",
      patternColors: "#119995",
      internalBbColor: "#ca3daf",
      internalPatternStyle: "concentric circles"
    },
    {
      type: "purple",
      bgColors: "#cfe3f5",
      patternColors: "#231c80",
      internalBbColor: "#b03f8e",
      internalPatternStyle: "concentric circles"
    },
    {
      type: "",
      bgColors: "#fdc038",
      patternColors: "#d5236f",
      internalBbColor: "#f165cc",
      internalPatternStyle: "concentric circles"
    }
  ];

  // Generate a grid layout for circular patterns
  let gridSize = 150;
  for (let x = gridSize / 2; x < width - gridSize / 2; x += gridSize) {
    for (let y = gridSize / 2; y < height - gridSize / 2; y += gridSize) {
      let posX = x + random(-15, 15);
      let posY = y + random(-15, 15);
      const chosenPalette = random(arrayOfColors);
      const pattern = new CircularPattern(posX, posY, chosenPalette);

      // Ensure no overlapping patterns
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

  // Generate decorative beads with connection constraints
  let attempts = 0;
  const maxAttempts = 2000;
  const minBeads = 400;
  while (beads.length < minBeads && attempts < maxAttempts) {
    let x = random(width);
    let y = random(height);
    let validPosition = true;

    // Ensure beads don't overlap patterns
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

      // Avoid beads that are too close together
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

function draw() {
  background('#086487'); // Set background color
  patterns.forEach(pattern => {
    pattern.display(); // Draw each circular pattern
  });
  drawCurvyConnections(); // Draw connections between beads
  beads.forEach(bead => {
    bead.display(); // Display each decorative bead
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  patterns = [];
  beads = [];
  setup(); // Reinitialize on resize for responsive design
}