interface DrawMessage {
  x: number;
  y: number;
  color: Color;
}

interface Color {
  r: number;
  g: number;
  b: number;
}

export { DrawMessage, Color };
