
export enum PetalShape {
  ROUND = 'ROUND',
  POINTY = 'POINTY',
  HEART = 'HEART',
  SLENDER = 'SLENDER'
}

export enum LeafShape {
  OVAL = 'OVAL',
  SERRATED = 'SERRATED',
  LONG = 'LONG'
}

export interface FlowerConfig {
  id: string;
  position: [number, number, number];
  petalColor: string;
  petalCount: number;
  petalSize: number;
  petalShape: PetalShape;
  stemHeight: number;
  stemThickness: number;
  leafCount: number;
  leafSize: number;
  leafShape: LeafShape;
  centerColor: string;
  density: number; // For clusters
}

export interface GardenState {
  timeOfDay: number; // 0 to 24
  flowers: FlowerConfig[];
}
