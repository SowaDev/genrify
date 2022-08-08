import TrackList from "../Components/TrackList/TrackList";

let accessToken;
const clientID = 'db19cb1182f140fab5eb77bcecedcd12'
const redirectUrl = 'http://localhost:3000/'

const Spotify = {

    fetchSpotify(url, scope) {
        const token = Spotify.getAccessToken(scope)
        return fetch(`https://api.spotify.com/v1/${url}`, 
        { headers: {
            Authorization: `Bearer ${token}`
        }})
    },
    
    getAccessToken(scope) {
        if(accessToken){
            return accessToken
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1])
            window.setTimeout(() => accessToken = '', expiresIn * 1000)
            window.history.pushState('Access Token', null, '/')
            return accessToken
        } else {
            const allScopes = 'user-library-read playlist-modify-public'
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=${allScopes}&redirect_uri=${redirectUrl}`
            window.location = accessUrl
        }
    },

    async search(term) {
        let response = await (await this.fetchSpotify(`search?type=track&q=${term}`, 'playlist-modify-public')).json();
        if(!response)
            return [];
        return response.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            artistId: track.artists[0].id,
            genres: [],
            album: track.album.name,
            uri: track.uri
        }))
    },

    getTrackDetails(item) {
        return {
            id: item.track.id,
            name: item.track.name,
            artist: item.track.artists[0].name,
            artistId: item.track.artists[0].id,
            genres: [],
            album: item.track.album.name,
            uri: item.track.uri
        }
    },

    async getTracks(playlistId, total) {
        let offset = 0;
        const tracks = [];
        do {
            let part100Tracks = await this.get100Tracks(playlistId, offset);
            tracks.push(part100Tracks)
            offset += 100;
        } while(offset < total)
        return tracks.flat();
    },

    async get100Tracks(playlistId, offset) {
        let response = await (await this.fetchSpotify(`playlists/${playlistId}/tracks?offset=${offset}`, 'playlist-modify-public')).json();
        if(!response)
            return [];
        return response.items.map(item => this.getTrackDetails(item))
    },

    async getPlaylists() {
        let user = await (await this.fetchSpotify('me', 'playlist-modify-public')).json();
        let response = await (await this.fetchSpotify(`users/${user.id}/playlists`, 'playlist-modify-public')).json();
        if(!response)
            return [];
        return response.items.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            tracksUri: playlist.tracks.href,
            total: playlist.tracks.total
        }))
    },


    async get50LikedTracks(offset) {
        let response = await (await this.fetchSpotify(`me/tracks?offset=${offset}&limit=50`, 'user-library-read')).json();
        if(!response)
            return [];
        return response.items.map(item => this.getTrackDetails(item))
    },

    async getLikedTracksTotal() {
        const response = await (await this.fetchSpotify(`me/tracks`)).json();
        return response.total;
    },

    async getLikedTracks() {
        let offset = 0;
        const tracks = [];
        let total = await this.getLikedTracksTotal();
        do {
            let part50Tracks = await this.get50LikedTracks(offset);
            tracks.push(part50Tracks)
            offset += 50;
        } while(offset < total)
        return tracks.flat();
    },

    async getGenreByArtist(artistId) {
        let response = await (await this.fetchSpotify(`artists/${artistId}`, 'playlist-modify-public')).json();
        if(!response)
            return [];
        return response.genres;
    },  

    async getTracksGenres(tracks) {
        await Promise.all(tracks.map(async (track) => {
            let trackGenres = await Spotify.getGenreByArtist(track.artistId)
            track.genres = trackGenres
        }))
        return tracks
    },

    async getPlaylistGenres(tracks) {
        const playlistGenres = new Map();
        await Promise.all(tracks.map(async (track) => {
            let trackGenres = await Spotify.getGenreByArtist(track.artistId);
            trackGenres.forEach(genre => {
                if(!playlistGenres.has(genre))
                    playlistGenres.set(genre, 1)
                else
                    playlistGenres.set(genre, playlistGenres.get(genre) + 1)
            })
        }))
        return playlistGenres;  
      },

    async add100TracksToPlaylist(trackURIs, headers, username, playlistId) {
        let start = 0, end = 99;
        let total = trackURIs.length;
        while (total > start) {
            let part100TrackURIs = trackURIs.slice(start, end);
            await fetch(`https://api.spotify.com/v1/users/${username}/playlists/${playlistId}/tracks`, 
            {
                headers: headers, 
                method: 'POST',
                body: JSON.stringify({ uris: part100TrackURIs })
            })
            start += 99;
            end += 99;
        } 
    },

    async savePlaylist(name, trackUris) {
        if(!name || !trackUris.length) { 
            return
        }
        const accessToken = this.getAccessToken('playlist-modify-public');
        const headers = { Authorization: `Bearer ${accessToken}` };
        const username = (await (await fetch('https://api.spotify.com/v1/me', { headers: headers })).json()).id;
        const playlistId = (await (await fetch(`https://api.spotify.com/v1/users/${username}/playlists`, 
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                })).json()).id;
        this.add100TracksToPlaylist(trackUris, headers, username, playlistId);
    },

    unfollowPlaylist(playlistId) {
        const accessToken = this.getAccessToken('playlist-modify-public');
        const headers = { Authorization: `Bearer ${accessToken}` };
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`,
            {
                headers: headers,
                method: 'DELETE'
            })
    }
}

export default Spotify