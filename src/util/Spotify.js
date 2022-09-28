const Spotify = {

    fetchSpotify(url, token) {
        return fetch(`https://api.spotify.com/v1/${url}`, 
        { headers: {
            Authorization: `Bearer ${token}`
        }})
    },

    async getUser(token) {
        const response = await this.fetchSpotify('me', token);
        if(!response.ok)
            return(false);
        const user = await response.json();
        return user;
    },

    async search(term, token) {
        let response = await (await this.fetchSpotify(`search?type=track&q=${term}`, token)).json();
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

    async getTracks(playlistId, total, token) {
        let offset = 0;
        const tracks = [];
        do {
            let part100Tracks = await this.get100Tracks(playlistId, offset, token);
            tracks.push(part100Tracks)
            offset += 100;
        } while(offset < total)
        return tracks.flat();
    },

    async get100Tracks(playlistId, offset, token) {
        let response = await (await this.fetchSpotify(`playlists/${playlistId}/tracks?offset=${offset}`, token)).json();
        if(!response)
            return [];
        return response.items.map(item => this.getTrackDetails(item))
    },

    async getPlaylists(user, token) {
        let response = await (await this.fetchSpotify(`users/${user.id}/playlists`, token)).json();
        if(!response)
            return [];
        return response.items.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            tracksUri: playlist.tracks.href,
            total: playlist.tracks.total
        }))
    },


    async get50LikedTracks(offset, token) {
        let response = await (await this.fetchSpotify(`me/tracks?offset=${offset}&limit=50`, token)).json();
        if(!response)
            return [];
        return response.items.map(item => this.getTrackDetails(item))
    },

    async getLikedTracksTotal(token) {
        const response = await (await this.fetchSpotify(`me/tracks`, token)).json();
        return response.total;
    },

    async getLikedTracks(token) {
        let offset = 0;
        const tracks = [];
        let total = await this.getLikedTracksTotal(token);
        do {
            let part50Tracks = await this.get50LikedTracks(offset, token);
            tracks.push(part50Tracks)
            offset += 50;
        } while(offset < total)
        return tracks.flat();
    },

    async getGenreByArtist(artistId, token) {
        let response = await (await this.fetchSpotify(`artists/${artistId}`, token)).json();
        if(!response)
            return [];
        return response.genres;
    },  

    async getTracksGenres(tracks, token) {
        await Promise.all(tracks.map(async (track) => {
            let trackGenres = await Spotify.getGenreByArtist(track.artistId, token)
            track.genres = trackGenres
        }))
        return tracks
    },

    async getPlaylistGenres(tracks, token) {
        const playlistGenres = new Map();
        await Promise.all(tracks.map(async (track) => {
            let trackGenres = await Spotify.getGenreByArtist(track.artistId, token);
            trackGenres.forEach(genre => {
                if(!playlistGenres.has(genre))
                    playlistGenres.set(genre, 1)
                else
                    playlistGenres.set(genre, playlistGenres.get(genre) + 1)
            })
        }))
        return playlistGenres;  
      },

    async addTracksToSavedPlaylist(trackURIs, headers, username, playlistId) {
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

    async savePlaylist(user, name, trackUris, token) {
        if(!name || !trackUris.length) { 
            return
        }
        const headers = { Authorization: `Bearer ${token}` };
        const response = await (await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, 
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                })).json();
        this.addTracksToSavedPlaylist(trackUris, headers, user.id, response.id);
        return {
            id: response.id,
            name: name,
            tracksUri: response.tracks.href,
            total: trackUris.length
        }
    },

    unfollowPlaylist(playlistId, token) {
        const headers = { Authorization: `Bearer ${token}` };
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`,
            {
                headers: headers,
                method: 'DELETE'
            })
    }
}

export default Spotify