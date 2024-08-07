import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  output,
  Output,
} from '@angular/core';
import { IBalloon } from '../../../core/models/balloon/balloon.model';
import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  style,
} from '@angular/animations';

@Component({
  selector: 'app-balloon',
  standalone: true,
  imports: [],
  templateUrl: './balloon.component.html',
  styleUrl: './balloon.component.scss',
})
export class BalloonComponent implements OnInit {
  // ===============================
  // == Fields
  // ===============================

  balloon = input.required<IBalloon>();
  animationBuilder = inject(AnimationBuilder);
  elRef = inject(ElementRef);
  @Output() balloonPopped = new EventEmitter<string>(); // before angular v17.3
  balloonMissed = output<string>(); // after angular v17.3, just add type-safety

  // ===============================
  // == Lifecycle
  // ===============================
  ngOnInit(): void {
    this.animateBalloon();
  }

  animateBalloon() {
    // Position
    const buffer: number = 10;
    const maxRemainingWidth: number =
      window.innerWidth -
      this.elRef.nativeElement.firstChild.clientWidth -
      buffer;
    const leftPosition: number = Math.floor(Math.random() * maxRemainingWidth);

    // Speed
    const minSpeed: number = 5;
    const maxSpeed: number = 10;
    const dynamicSpeed: number = minSpeed + Math.random() * maxSpeed; // dynamic speed from 5s to 10s

    const flyAnimation: AnimationFactory = this.animationBuilder.build([
      style({
        // starting position
        translate: `${leftPosition}px 0`,
        position: 'fixed',
        left: 0,
        bottom: 0,
      }),
      animate(
        `${dynamicSpeed}s 200ms ease-out`,
        style({
          translate: `${leftPosition}px -100vh`,
        })
      ),
    ]);

    const player = flyAnimation.create(this.elRef.nativeElement.firstChild);
    player.play();
    player.onDone(() => {
      this.balloonMissed.emit(this.balloon().id);
    });
  }

  pop(): void {
    this.balloonPopped.emit(this.balloon().id);
  }
}
