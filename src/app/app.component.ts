import { Component } from '@angular/core';
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
export class AppComponent {
  // =======================
  // == Fields
  // =======================
  private balloonsOnScreen: number = 10;
  public balloons: IBalloon[] = new Array(this.balloonsOnScreen)
    .fill(0)
    .map(() => new Balloon());
}
