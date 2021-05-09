import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './components/error/error.component';



@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    ErrorComponent
  ]
})
export class SharedModule { }
