import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  public data = 10
  private data2 = 20

  public evento(){
    // codigo con llamadas http, ls, etc
    console.log('salida desde evento')
    return this.data
  }

  private evento2(){

  }
}
