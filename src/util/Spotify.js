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
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=${scope}&redirect_uri=${redirectUrl}`
            window.location = accessUrl
        }
    },

    search(term) {
        return this.fetchSpotify(`search?type=track&q=${term}`, 'playlist-modify-public')
        .then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse)
                return []
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    getTracks(playlistId) {
        return this.fetchSpotify(`playlists/${playlistId}/tracks`, 'playlist-modify-public')
        .then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse)
                return []
            return jsonResponse.items.map(item => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                artistId: item.track.artists[0].id,
                genres: [],
                album: item.track.album.name,
                uri: item.track.uri
            }))
        })
    },

    getPlaylists() {
        return this.fetchSpotify('me', 'playlist-modify-public')
        .then(response => response.json())
        .then(jsonResponse => {
            let username = jsonResponse.id
            return this.fetchSpotify(`users/${username}/playlists`, 'playlist-modify-public')
            .then(response => response.json())
            .then(jsonResponse => {
                if(!jsonResponse)
                    return []
                return jsonResponse.items.map(playlist => ({
                    id: playlist.id,
                    name: playlist.name,
                    tracksUri: playlist.tracks.href,
                    total: playlist.tracks.total
                }))
            })
        })
    },

    get50LikedTracks(offset) {
        return this.fetchSpotify(`me/tracks?offset=${offset}&limit=50`, 'user-library-read')
        .then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse)
                return []
            return jsonResponse.items.map(item => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                artistId: item.track.artists[0].id,
                genres: [],
                album: item.track.album.name,
                uri: item.track.uri
            }))
        })
    },

    async getLikedTracksTotal() {
        const response = await this.fetchSpotify(`me/tracks`);
        const jsonResponse = await response.json();
        return jsonResponse.total;
    },

    // getLikedTracks() {
    //     let offset = 0;
    //     const tracksPromises = [] 
    //     return this.getLikedTracksTotal().then(total => {
    //         do {
    //             tracksPromises.push(this.get50LikedTracks(offset))
    //             offset += 50;
    //         } while(offset < total)
    //         return Promise.all(tracksPromises)
    //     }).then(result => result.flat())
    // },

    async getLikedTracks() {
        let offset = 0;
        const tracks = [];
        let total = await this.getLikedTracksTotal();
        do {
            let part50Tracks = await this.get50LikedTracks(offset);
            tracks.push(part50Tracks)
            offset += 50;
        } while(offset < total)
        // let result = tracks.flat()
        // console.log(result)
        return tracks.flat();
    },

    getGenreByArtist(artistId) {
        return this.fetchSpotify(`artists/${artistId}`, 'playlist-modify-public')
        .then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse)
                return []
            // let result = jsonResponse.genres
            // if(result === [])
            //     result = ['none']
            return jsonResponse.genres;
        })
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

    savePlaylist(name, trackUris){
        if(!name || !trackUris) { 
            return
        }
        const accessToken = this.getAccessToken('playlist-modify-public');
        const headers = {
                Authorization: `Bearer ${accessToken}`
        }
        let username;
        return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then(response => response.json())
        .then(jsonResponse => {
            username = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${username}/playlists`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistId = jsonResponse.id
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, 
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                })
            })
        })
    }
}

export default Spotify