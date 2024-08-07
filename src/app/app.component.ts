import {
  Component,
  computed,
  effect,
  OnInit,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalloonComponent } from './shared/components/balloon/balloon.component';
import { Balloon, IBalloon } from './core/models/balloon/balloon.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BalloonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // =======================
  // == Fields
  // =======================
  private readonly balloonsOnScreen: number = 10;
  private readonly maximumMissed: number = 4;
  public balloons: IBalloon[] = [];
  public score = signal<number>(0);
  public missed = signal<number>(0);
  public isGameOver = computed(() => this.missed() === this.maximumMissed);
  public balloonElements = viewChildren(BalloonComponent); // get a list of multiple instance of BalloonComponent

  // =======================
  // == Effects
  // =======================
  // If a signal changed, then this function will be triggered
  private createBalloonsOnDemand = effect(() => {
    if (
      !this.isGameOver() &&
      this.balloonElements().length < this.balloonsOnScreen
    ) {
      this.balloons = [...this.balloons, new Balloon()];
    }
  });

  // =======================
  // == Lifecycle
  // =======================
  ngOnInit(): void {
    this.startGame();
  }

  // =======================
  // == Methods
  // =======================
  startGame(): void {
    this.score.set(0);
    this.missed.set(0);
    this.balloons = new Array(this.balloonsOnScreen)
      .fill(0)
      .map(() => new Balloon());
  }

  balloonPoppedHandler(balloonId: string) {
    this.score.update((val) => val + 1);
    // popout the balloon
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);

    // add new balloon
    this.balloons = [...this.balloons, new Balloon()];
  }

  balloonMissedHandler(balloonId: string) {
    this.missed.update((val) => val + 1);

    // Remove balloon after being missed
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
  }
}
