import { Router } from '@angular/router';
import { Song, SelectedSongs, Status, GameStatus } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  animations: [
    trigger('enterTrigger', [
      state('fadeIn', style({
        opacity: '1',
      })),
      transition('void => *', [style({ opacity: '0' }), animate('300ms')])
    ])
  ]
})
export class HomePage implements OnInit {

  selectedSongs: SelectedSongs
  songs: Song[] = []

  Status = Status
  currentStatus = Status.loading

  GameStatus = GameStatus
  currentGameStatus = GameStatus.playing

  score = 0
  correctAnswer: Song

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.refreshToken()

  }

  refreshToken() {
    if (this.spotifyService.requiresRefresh())
      this.spotifyService.refreshToken().subscribe(e => {
        this.getSongs()
      })
    else
      this.getSongs()
  }

  getSongs() {
    this.currentStatus = Status.loading
    this.spotifyService.getUserSongs().subscribe(e => {
      this.getRandomSong()
    }, () => {
      this.currentStatus = Status.error
    })

  }

  getRandomSong() {
    if (this.spotifyService.currentSongs.length == 0)
      return this.getSongs()
    this.currentGameStatus = GameStatus.playing
    this.selectedSongs = this.spotifyService.getRandomSongs()
    this.currentStatus = Status.loaded
  }

  retry() {
    this.currentStatus = Status.loading
    this.getSongs()
  }

  reset() {
    this.score = 0
    this.getRandomSong()
  }

  selectSong(song: number) {
    let selected: Song = song == 1 ? this.selectedSongs.song1 : this.selectedSongs.song2
    let other: Song = song == 1 ? this.selectedSongs.song2 : this.selectedSongs.song1

    if (selected.track.popularity > other.track.popularity) {
      this.currentGameStatus = GameStatus.correctAnswer
      this.score += 1
      setTimeout(() => {
        this.getRandomSong()
      }, 1000);
    }
    else {
      this.correctAnswer = other
      this.currentGameStatus = GameStatus.wrongAnswer
    }
  }

  logout() {
    this.spotifyService.logout()
    this.router.navigate(["/"])
  }

}

