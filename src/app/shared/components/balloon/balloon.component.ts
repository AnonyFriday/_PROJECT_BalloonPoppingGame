import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Output,
} from '@angular/core';
import { IBalloon } from '../../../core/models/balloon/balloon.model';
import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  keyframes,
  style,
} from '@angular/animations';

@Component({
  selector: 'app-balloon',
  standalone: true,
  imports: [],
  templateUrl: './balloon.component.html',
  styleUrl: './balloon.component.scss',
})
export class BalloonComponent implements OnInit, OnDestroy {
  // ===============================
  // == Fields
  // ===============================

  balloon = input.required<IBalloon>();

  //! ERROR: error occurs on emit event on destroyed animation. Temporarily not used
  // after angular v17.3, just add type-safety
  readonly balloonMissed = output<string>();

  // before angular v17.3
  @Output() balloonPopped = new EventEmitter<string>();
  @Output() balloonMissed = new EventEmitter();

  private flyAnimationPlayer!: AnimationPlayer;
  private popAnimationPlayer!: AnimationPlayer;
  // ===============================
  // == Services
  // ===============================
  private readonly elRef = inject(ElementRef);
  private readonly animationBuilder = inject(AnimationBuilder);
  // ===============================
  // == Lifecycle
  // ===============================
  ngOnInit(): void {
    this.animateBalloon();
  }

  ngOnDestroy(): void {
    // Stop the animations if the component is destroyed
    if (this.flyAnimationPlayer) {
      this.flyAnimationPlayer.destroy();
    }
    if (this.popAnimationPlayer) {
      this.popAnimationPlayer.destroy();
    }
  }

  // ===============================
  // == Methods
  // ===============================

  /**
   * Animation attached to the balloon
   */
  animateBalloon() {
    // Position
    const buffer: number = 20;
    const maxRemainingWidth: number =
      window.innerWidth -
      this.elRef.nativeElement.firstChild.clientWidth -
      buffer;
    const leftPosition: number = Math.floor(Math.random() * maxRemainingWidth);

    // Speed
    const speedMin: number = 5;
    const speedVariation: number = 3;
    const speed: number = speedMin + Math.random() * speedVariation; // dynamic speed from 5s to 8s

    const flyAnimation: AnimationFactory = this.animationBuilder.build([
      style({
        // starting position
        translate: `${leftPosition}px 0`,
        position: 'fixed',
        left: 0,
        bottom: 0,
      }),
      animate(
        `${speed}s ease-in-out`,
        style({
          translate: `${leftPosition}px -100vh`,
        })
      ),
    ]);

    this.flyAnimationPlayer = flyAnimation.create(
      this.elRef.nativeElement.firstChild
    );
    this.flyAnimationPlayer.play();
    this.flyAnimationPlayer.onDone(() => {
      this.balloonMissed.emit(this.balloon().id);
    });
  }

  /**
   * Action to pop the balloon
   */
  pop(): void {
    const popAnimation: AnimationFactory = this.animationBuilder.build([
      animate(
        `0.2s ease-out`,
        keyframes([
          style({
            scale: '1.2',
            offset: 0.5,
          }),
          style({
            scale: '0.8',
            offset: 0.75,
          }),
        ])
      ),
    ]);

    this.popAnimationPlayer = popAnimation.create(
      this.elRef.nativeElement.firstChild
    );
    this.popAnimationPlayer.play();
    this.popAnimationPlayer.onDone(() => {
      // when the animation finish, then we emit the event
      this.balloonPopped.emit(this.balloon().id);
    });
  }
}
