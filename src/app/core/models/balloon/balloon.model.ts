export interface IBalloon {
  id: string;
  color: string;
}

const colors: string[] = ['red', 'blue', 'purple', 'orange'];

export class Balloon implements IBalloon {
  id: string;
  color: string;

  constructor() {
    this.id = window.crypto.randomUUID();
    this.color = colors.at(Math.floor(Math.random() * colors.length))!;
  }
}
