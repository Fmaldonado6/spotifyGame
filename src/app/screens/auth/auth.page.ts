import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private route: Router
  ) {


  }

  getAccessToken(code: string) {
    this.spotifyService.getAccessToken(code).subscribe(token => {
      return this.route.navigate(["/home"])
    }, (error) => {
    })
  }

  ngOnInit() {

    if(this.spotifyService.loggedIn())
      return this.route.navigate(["/home"])
  

    const code = this.activatedRoute.snapshot.queryParams.code

    if (code)
      this.getAccessToken(code)
  }

  authorize() {
    this.spotifyService.authorize()
  }

}
