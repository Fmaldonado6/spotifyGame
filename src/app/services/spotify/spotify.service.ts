import { Song, SpotifyResponse, SelectedSongs } from './../../models/models';
import { environment } from 'src/environments/environment';
import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators'
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenResponse } from 'src/app/models/models';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService extends DataService {

  SPOTIFY_REFRESH_TOKEN = "spotify_refresh_token"

  access_token: string

  expiresAt: number

  currentSongs: Song[] = []
  currentPage = 0

  authorize() {
    const scopes = 'user-read-private user-read-email user-library-read';
    const key = environment.apiId
    const redirectUrl = environment.redirect
    window.location.href = 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + key +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&show_dialog=true'
  }

  getAccessToken(code: string) {
    const headers = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }
    const encodedBody = new URLSearchParams()
    encodedBody.set('grant_type', "authorization_code")
    encodedBody.set('code', code)
    encodedBody.set('redirect_uri', environment.redirect)
    encodedBody.set('client_id', environment.apiId)
    encodedBody.set('client_secret', environment.apiSecret)

    return this.http.post<TokenResponse>(`https://accounts.spotify.com/api/token`, encodedBody.toString(), headers)
      .pipe(catchError(this.handleError), map(e => {
        this.setToken(e)
        return e
      }))
  }

  refreshToken() {
    const base64Keys = btoa(`${environment.apiId}:${environment.apiSecret}`)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Basic ${base64Keys}`)
    const options = {
      headers: headers
    }
    const encodedBody = new URLSearchParams()
    encodedBody.set('grant_type', "refresh_token")
    encodedBody.set('refresh_token', this.getRefreshToken())

    return this.http.post<TokenResponse>(`https://accounts.spotify.com/api/token`, encodedBody.toString(), options)
      .pipe(catchError(this.handleError), map(e => {
        this.setToken(e)
      }))
  }

  requiresRefresh() {
    if (!this.expiresAt)
      return true
    return new Date().getTime() > this.expiresAt
  }

  setToken(token: TokenResponse) {
    this.access_token = token.access_token
    this.expiresAt = new Date().getTime() + token.expires_in
    if (token.refresh_token)
      localStorage.setItem(this.SPOTIFY_REFRESH_TOKEN, token.refresh_token)
  }

  getRefreshToken() {
    return localStorage.getItem(this.SPOTIFY_REFRESH_TOKEN)
  }

  loggedIn() {
    const token = localStorage.getItem(this.SPOTIFY_REFRESH_TOKEN)
    return !!token && token != undefined
  }


  getUserSongs() {
    const headers = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.access_token)
    }
    return this.http.get<SpotifyResponse>(`${this.url}me/tracks?market=ES&limit=50&offset=${this.currentPage}`, headers)
      .pipe(catchError(this.handleError), map(e => {
        this.currentSongs = e.items
        this.currentPage += 50
        return e
      }))

  }

  getRandomSongs(): SelectedSongs {
    const firstNumber = this.getRandomIndex()
    const firstSong = this.currentSongs.splice(firstNumber, 1).pop()
    let secondNumber: number
    while (true) {
      secondNumber = this.getRandomIndex()
      if (secondNumber != firstNumber)
        break
    }

    const secondSong = this.currentSongs.splice(secondNumber, 1).pop()

    return { song1: firstSong, song2: secondSong }

  }

  getRandomIndex() {
    return Math.floor(Math.random() * (this.currentSongs.length - 1))
  }

  logout() {
    localStorage.clear()
    this.access_token = null
  }

}
