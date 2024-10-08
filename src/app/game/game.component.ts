import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  private easyWords = [
    "apple", "grape", "house", "lemon", "block",
    "chair", "front", "hello", "light", "snake",
    "brick", "crack", "dream", "field", "ghost",
    "mount", "plant", "river", "storm", "tiger",
    "trick", "world", "crown", "start", "place",
    "grass", "drift", "flood", "peace", "shape"
  ];

  private mediumWords = [
    "beach", "brick", "cycle", "dance", "grain",
    "chess", "flock", "pizza", "sweet", "table",
    "actor", "brain", "cloud", "drive", "earth",
    "fever", "gleam", "horse", "kneel", "magic",
    "pearl", "plain", "route", "shoot", "stone",
    "tiger", "trail", "trust", "wound", "youth"
  ];

  private hardWords = [
    "flour", "zebra", "whale", "mango", "crane",
    "flash", "leaky", "twist", "globe", "laser",
    "blaze", "brush", "crisp", "depth", "fancy",
    "fraud", "gleam", "haunt", "knelt", "meter",
    "perch", "prone", "realm", "shriek", "snare",
    "spear", "sword", "weary", "whisk", "wreck"
  ];

  private randomWord: string = '';
  private currentRowIndex: number = 0;
  private isCorrect: boolean = false;

  ngOnInit() {
    Swal.fire({
      imageUrl: "../assets/HowTo.png",
      imageHeight: 581,
      imageAlt: "How to play instructions",
    });

    this.setRandomWord('medium');
  }

  private setRandomWord(difficulty: string) {
    let wordList: string[];

    switch (difficulty) {
      case 'easy':
        wordList = this.easyWords;
        break;
      case 'medium':
        wordList = this.mediumWords;
        break;
      case 'hard':
        wordList = this.hardWords;
        break;
      default:
        wordList = this.mediumWords;
    }

    const randomIndex = Math.floor(Math.random() * wordList.length);
    this.randomWord = wordList[randomIndex];
    console.log('Random Word (' + difficulty + '):', this.randomWord);
  }

  confirmChangeMessage(difficulty: string) {
    this.setRandomWord(difficulty);
    Swal.fire({
      title: "Done!",
      text: "You changed the difficulty to " + difficulty + ".",
      icon: "success"
    });
  }

  insertLetter(letter: string) {
    if (this.isCorrect) return;
    const elements = document.querySelectorAll('.row')[this.currentRowIndex].querySelectorAll('.fixed-size');
    for (let i = 0; i < 5; i++) {
      if (!elements[i].textContent) {
        elements[i].textContent = letter;
        return;
      }
    }
  }

  deleteLetter() {
    if (this.isCorrect) return;
    const elements = document.querySelectorAll('.row')[this.currentRowIndex].querySelectorAll('.fixed-size');
    for (let i = 4; i >= 0; i--) {
      if (elements[i].textContent) {
        elements[i].textContent = '';
        return;
      }
    }
  }

  enterAnswer() {
    const elements = document.querySelectorAll('.row')[this.currentRowIndex].querySelectorAll('.fixed-size');
    let answer = '';

    for (let i = 0; i < 5; i++) {
      if (elements[i].textContent) {
        answer += elements[i].textContent?.toLowerCase();
      } else {
        return;
      }
    }

    let tempRandomWord: (string | null)[] = this.randomWord.split('');

    if (answer === this.randomWord) {
      this.isCorrect = true;
      Swal.fire({
        title: "Congratulations!",
        text: "You've guessed the correct word!",
        icon: "success"
      });
    }

    for (let i = 0; i < 5; i++) {
      const currentLetter = answer[i];
      if (currentLetter === tempRandomWord[i]) {
        elements[i].classList.add('bg-success');
        tempRandomWord[i] = null;
      }
    }

    for (let i = 0; i < 5; i++) {
      const currentLetter = answer[i];
      if (elements[i].classList.contains('bg-success')) {
        continue;
      }
      if (tempRandomWord.includes(currentLetter)) {
        elements[i].classList.add('bg-warning');
        const index = tempRandomWord.indexOf(currentLetter);
        tempRandomWord[index] = null;
      } else {
        elements[i].classList.add('bg-dark');
      }
    }

    this.currentRowIndex++;

    if (this.currentRowIndex >= 6) {
      Swal.fire({
        title: "Game Over!",
        text: "You've used all your attempts.",
        icon: "error"
      });
    }
  }

  revealAnswer() {
    Swal.fire({
      title: "The Correct Answer Is:",
      text: this.randomWord,
      icon: "info"
    });
  }

}