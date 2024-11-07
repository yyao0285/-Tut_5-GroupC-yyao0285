# -Tut_5-GroupC-yyao0285
## Circular Pattern Animation

My project is based on a group project using **time intervals** to create dynamic patterns with ever-changing colors and shapes.
The overall animation adopts randomness, and each time the animation is refreshed and loaded, the color and pattern of the tree ring, beads, and nodes are dynamically updated, bringing constantly changing visual effects.
My main idea is to center on time-based animation to create a relaxing, meditative effect. Each aspect of the animation (color, rotation, size) is driven by a specific time interval. Encapsulate each visual element, such as rings and beads, in a class. The circular pattern has different properties, such as interior pattern styles and background colors, which are randomly assigned and regularly updated, thus enhancing the generation.

## Inspiration and Creative Options

I was inspired by the Wheel of Fate in the Tarot cards and used concentric circles, symmetry, and repetitive patterns in the design elements. The animation design is inspired by the description of the Wheel of Fortune: "The wheel of fortune holds the fate of everyone, and when the wheel begins to spin, good luck or bad luck will be unknown." Therefore, I imagine the beads in the background as nodes of fate. The total number of nodes experienced by each person is certain, but what happens to each node is random, so in the performance of the code, every certain time, the black beads will be replaced by random colors. In the design of the wheel of fate, my inspiration comes from the tree ring; as time goes by, the tree ring rotates and expands outward at regular intervals. I wanted to capture the natural sense of rotation and expansion.

### Visual Inspirations

Here are some images that inspired my design:

1. ![Clock Concept](./9041.png_300.png)
2. ![Wheel of Fortune](./0d338744ebf81a4c9b10a780d32a6059252da65d.webp)
3. ![Tree Rings](./images.jpeg)

### Technical Notes

My key technique is **using time-based animation**. By using `millis()` in p5.js, the animation is able to smoothly transition colors, rotations, and other properties at fixed intervals.
I added several functions and properties to enable animation:
- **Rings**: This is achieved by the `drawTreeRings` function. Each ring is drawn after a certain time interval; the `ringsDrawn` count controls the number of rings drawn and increases this count after a certain time interval, creating a natural expansion effect. Colors are selected at random from `this.colorPalette`, so each ring is visually different.
- **Rotation and Extension**: In the `CircularPattern` class, the internal rotation and extension effects are implemented by the `drawInternalPattern` function, where the internal rotation angle and extension factor are periodically changed using the `sin` function. Internal rotation changes and dot extensions are implemented by adjusting `internalRotationAngle` and `rotationAngle`.
- **Delayed Coloring of Destiny Nodes**: In the `DecorativeBead` class, the color of each bead is delayed to create a continuous effect. Each bead is set to a different color change delay according to its index, which staggers the color change, creating a wavy effect.

### Difference with Group Code

I focus on time-driven animation, and the core of the design is to use timers to make graphic elements change and dynamic, minimizing user interaction. My teammates use keyboard, noise, and audio to change the pattern, while the screen among them can be paused and played manually. Mine, however, is full of randomness driven by fixed time intervals.