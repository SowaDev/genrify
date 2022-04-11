let accessToken;
const clientID = 'db19cb1182f140fab5eb77bcecedcd12'
const redirectUrl = 'http://localhost:3000/'

const Spotify = {
    
    getAccessToken() {
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
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`
            window.location = accessUrl
        }
    },

    search(term) {
        const token = Spotify.getAccessToken()
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        { headers: {
            Authorization: `Bearer ${token}`
        }}).then(response => {
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
        const token = Spotify.getAccessToken()
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, 
        { headers: {
            Authorization: `Bearer ${token}`
        }}).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse)
                return []
            console.log(jsonResponse)
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
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        let username;
        return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
        .then(response => response.json())
        .then(jsonResponse => {
            username = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${username}/playlists`, { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                if(!jsonResponse)
                    return []
                return jsonResponse.items.map(playlist => ({
                    id: playlist.id,
                    name: playlist.name,
                    tracksUri: playlist.tracks.href
                }))
            })
        })
    },

    savePlaylist(name, trackUris){
        if(!name || !trackUris) { 
            return
        }
        const accessToken = this.getAccessToken();
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