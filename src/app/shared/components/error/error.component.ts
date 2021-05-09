import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  @Input() title = "Error";
  @Input() accept = "Reintentar"
  @Output() clickEvent = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  buttonClicked() {
    this.clickEvent.emit()
  }

}
