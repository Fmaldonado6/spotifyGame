import { Song } from './../../models/models';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss'],
})
export class SongComponent implements OnInit {

  @Input() song: Song
  @Output() songSelected = new EventEmitter()

  constructor() { }

  ngOnInit() {
    console.log(this.song)
  }

  selectSong() {
    this.songSelected.emit()
  }

}
