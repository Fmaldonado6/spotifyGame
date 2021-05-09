export interface TokenResponse {
    access_token: string
    refresh_token: string
    expires_in: number
}

export class Album {
    images: AlbumImages[]
}

export class AlbumImages {
    url: string
}

export class SongInfo {
    name: string
    popularity: number
    album: Album
}
export class Song {
    track: SongInfo
}

export class SpotifyResponse {
    items: Song[]
}

export class SelectedSongs {
    song1: Song
    song2: Song
}

export enum Status {
    loading,
    loaded,
    error
}

export enum GameStatus {
    playing,
    correctAnswer,
    wrongAnswer,
}