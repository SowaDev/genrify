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
            // console.log(jsonResponse)
            return jsonResponse.items.map(item => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
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
                album: item.track.album.name,
                uri: item.track.uri
            }))
        })
    },

    getLikedTracksTotal() {
        return this.fetchSpotify(`me/tracks`)
        .then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.total;
        })
    },

    getLikedTracks() {
        let offset = 0;
        const tracksPromises = [] 
        return this.getLikedTracksTotal().then(total => {
            do {
                tracksPromises.push(this.get50LikedTracks(offset))
                offset += 50;
            } while(offset < total)
            return Promise.all(tracksPromises)
        }).then(result => result.flat())
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