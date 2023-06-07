import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  restartGame() {
    location.reload();
  }

}
