import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameOverComponent } from './game-over/game-over.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'snake';

  static startCoordinates: number = 0;
  static rowLength: number = 30;
  static snakeLength: number = 6;

  gridArray: string[] = [];
  snakeArray: string[] = [];
  headCoordinates = { row: AppComponent.startCoordinates, column: AppComponent.snakeLength - 1 };
  apple: string = '';
  lastMove: string = 'undefined';
  scoreBoard: number = 0;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.startGame();
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.lastMove !== '') {
        this.displaySnack('Use arrow keys to move the snake')
      }
    }, 1500);

    setTimeout(() => {
      if (this.lastMove !== '') {
        this.displaySnack('Collect as many points as you can by driving the snake on green cube')
      }
    }, 8000);
  }

  startGame() {
    this.fillGrid();
    this.fillSnake();
    this.placeApple();
    this.moveWithArrowButtons();
  }

  displaySnack(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 3000 });
  }

  fillGrid() {
    for (let i = 0; i < AppComponent.rowLength; i++) {
      for (let x = 0; x < AppComponent.rowLength; x++) {
        this.gridArray.push(i + ':' + x);
      }
    }
  }

  fillSnake() {
    for (let i = 0; i < AppComponent.snakeLength; i++) {
      this.snakeArray.push(0 + ':' + i);
    }
  }

  placeApple() {
    this.apple =
      Math.floor(Math.random() * AppComponent.rowLength) +
      ':' +
      Math.floor(Math.random() * AppComponent.rowLength);
    if (this.snakeArray.indexOf(this.apple) !== -1) {
      this.placeApple();
    }
  }

  moveWithArrowButtons() {
    const checkKey = (e: any) => {
      e = e || window.event;

      if (e.keyCode === 38 && this.lastMove !== '') {
        this.moveUp();
      } else if (e.keyCode === 40 && this.lastMove !== '') {
        this.moveBottom();
      } else if (e.keyCode === 37 && this.lastMove !== '') {
        this.moveLeft();
      } else if (e.keyCode === 39 && this.lastMove !== '') {
        this.moveRight();
      }
    };
    document.onkeydown = checkKey;
  }

  moveRight() {
    if (this.lastMove !== 'left') {
      this.lastMove = 'right';
      this.moveSnake(0, 1);

      setTimeout(() => {
        if (this.lastMove === 'right') this.moveRight();
      }, 200);
    }
  }

  moveLeft() {
    if (this.lastMove !== 'right') {
      this.lastMove = 'left';
      this.moveSnake(0, -1);

      setTimeout(() => {
        if (this.lastMove === 'left') this.moveLeft();
      }, 200);
    }
  }

  moveUp() {
    if (this.lastMove !== 'bottom') {
      this.lastMove = 'up';
      this.moveSnake(-1, 0);

      setTimeout(() => {
        if (this.lastMove === 'up') this.moveUp();
      }, 200);
    }
  }

  moveBottom() {
    if (this.lastMove !== 'up') {
      this.lastMove = 'bottom';
      this.moveSnake(1, 0);

      setTimeout(() => {
        if (this.lastMove === 'bottom') this.moveBottom();
      }, 200);
    }
  }

  moveSnake(plusRow: number, plusColumn: number) {
    this.headCoordinates.row += plusRow;
    this.headCoordinates.column += plusColumn;

    let headCoordinatesString =
      this.headCoordinates.row + ':' + this.headCoordinates.column;
    this.checkBoarders();

    if (this.snakeArray.indexOf(headCoordinatesString) !== -1) {
      this.restartGame();
    }

    this.snakeArray.push(headCoordinatesString);

    if (headCoordinatesString !== this.apple) {
      this.snakeArray.splice(0, 1);
    } else {
      this.scoreBoard += 10;
      this.placeApple();
    }
    console.log(this.lastMove);

  }

  checkBoarders() {
    if (
      this.headCoordinates.row >= AppComponent.rowLength ||
      this.headCoordinates.column >= AppComponent.rowLength ||
      this.headCoordinates.row < AppComponent.startCoordinates ||
      this.headCoordinates.column < AppComponent.startCoordinates
    ) {
      this.restartGame();
    }
  }

  restartGame() {
    this.lastMove = '';
    this.dialog.open(GameOverComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: { name: this.scoreBoard }
    })
  }
}
