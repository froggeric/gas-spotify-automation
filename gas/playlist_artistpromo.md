# Artist Promotion Playlist Automator

This script is a powerful tool for artists looking to enhance their Spotify presence. It automatically generates a dynamic, professionally structured playlist that strategically showcases an artist's music alongside tracks from other popular and similar-sounding artists.

The core idea is to create an engaging listening experience that drives discovery. The artist's most important tracks are featured prominently at the beginning of the playlist, surrounded by carefully selected, popular songs that capture and retain listener interest. The remainder of the artist's catalog is then seamlessly woven into the rest of the playlist, ensuring comprehensive exposure in a natural, enjoyable flow. The entire playlist is reshuffled daily to stay fresh for repeat listeners.

---

## 1. How It Works: The Three Playlists

The script operates using three distinct Spotify playlists. You will need to create these in your Spotify account and provide their IDs to the script.

### The Artist Playlist
This is your personal catalog, containing **only your own tracks**. The order is important.

*   **Top 3 Tracks:** The first three songs in this playlist are treated as your highest priority. They will be strategically placed within the top section of the final `Combined Playlist` to maximize their impact.
*   **Other Tracks:** All other songs from this playlist will be thoughtfully distributed throughout the remainder of the `Combined Playlist`.

### The Promo Playlist
This is your hand-picked collection of tracks from **other artists**. These are the songs you want your own music to be associated with. Think of it as creating the perfect musical neighborhood for your tracks to live in. The script will automatically use the popularity score from these tracks to build the final playlist.

### The Combined Playlist
This is the final, public-facing playlist that the script generates. On each run, the script completely replaces the contents of this playlist with a new, freshly organized set of tracks. The listening experience is designed as follows:

1.  **A Strong Start:** The playlist begins with a highly popular track from your `Promo Playlist` to immediately grab the listener's attention.
2.  **Priority Placement:** Your top 3 artist tracks are woven into the first part of the playlist, each preceded by a couple of popular tracks from other artists to keep the energy high.
3.  **Intelligent Distribution:** The rest of your tracks are sprinkled throughout the remainder of the playlist, separated by a random number of promo tracks. This creates a balanced and varied listening journey.
4.  **Daily Freshness:** The entire process runs daily, ensuring that while the structure remains consistent, the specific track order (especially in the main body of the playlist) is always different.

---

## 2. Getting Started: How to Use the Script

To use the script, you only need to edit the `runDailyPlaylistUpdate` function. This function is the main entry point that you will schedule to run automatically in Google Apps Script.

Inside this function, you'll find `playlistConfig` objects. Simply replace the placeholder IDs and names with the actual information from your Spotify playlists. The `createArtistPromoPlaylist` function also accepts an optional second parameter, `extraInterval` (an integer from 0-9), which increases the number of promotional tracks that are placed before and between your own songs.

```javascript
/**
 * EXAMPLE USAGE:
 * This function demonstrates how to call createArtistPromoPlaylist.
 * It should be triggered by a time-based scheduler in Google Apps Script.
 */
function runDailyPlaylistUpdate() {
  // Example 1: Main promotional playlist for an indie rock band
  const indieRockConfig = {
    artistPlaylist: {
      id: '5r35nClG2aYd30a84n6wK3',
      name: 'Starlight Runner - Official',
    },
    promoPlaylist: {
      id: '2pX9E5E23b6b1aD7dC4eF8',
      name: 'Indie Rock Influences',
    },
    combinedPlaylist: {
      id: '7qH89kE9b4c2b9F3dG5aC1',
      name: 'Indie Rock Discoveries | feat. Starlight Runner',
    },
  };
  // This call uses the default interval (0 extra promo tracks).
  createArtistPromoPlaylist(indieRockConfig, 0);


  // Example 2: A secondary, mood-based playlist for a chillwave artist
  const chillwaveConfig = {
    artistPlaylist: {
      id: '3aB4c5dE6fG7h8i9j0kL1m',
      name: 'Ocean Tides - Official',
    },
    promoPlaylist: {
      id: '1nO2pQ3rS4tU5vW6xY7zE9',
      name: 'Chillwave & Synthwave Gems',
    },
    combinedPlaylist: {
      id: '4zY7zE9xY7zE9xY7zE9xY7',
      name: 'Midnight Drive 🌴 Chillwave & Dream Pop',
    },
  };
  // This call adds 2 extra promo tracks at each insertion point.
  createArtistPromoPlaylist(chillwaveConfig, 2);
}
```

---

## 3. Strategy: Optimizing Your Playlist for Discovery (SEO)

The script handles the track arrangement, but the playlist's "packaging" (its title, description, and cover art) is crucial for attracting clicks and followers on Spotify.

### Playlist Title
The title should be both appealing and searchable. A great formula is:
**`[Mood or Genre] | featuring [Your Artist Name] & similar artists`**

*   **Keywords:** Include popular genres (e.g., "Indie Rock," "Lofi Beats," "Synthwave") and moods (e.g., "Late Night Vibes," "Coffee Shop Acoustic," "Running Motivation").
*   **Your Name:** Always include your artist name to build brand association.
*   **Examples:**
    *   `Cosmic Indie Rock | featuring Starlight Runner & more`
    *   `Focus & Chill Lofi | with Ocean Tides`
    *   `80s Throwback Synthwave | feat. Starlight Runner`

### Playlist Description
The description is your chance to sell the experience and add more keywords.

*   **Hook:** Start with a sentence that describes the feeling or purpose of the playlist.
*   **Key Artists:** Mention 2-3 of the most well-known artists from your `Promo Playlist` to draw in their fans.
*   **Update Cadence:** Let people know it's updated regularly (e.g., "New tracks added daily!").
*   **Call to Action:** End with a simple "Follow for more!"

### Cover Art
Your cover art should look professional and stand out in a sea of other playlists.

*   **High Contrast & Bold Colors:** Make it pop on small screens.
*   **Readable Text:** If you use text, ensure the font is clear and large.
*   **Branding:** Subtly include your artist logo or a high-quality photo of yourself.
*   **Consistency:** Maintain a consistent visual style across all your promotional playlists.

### AI Prompt to Generate Your Playlist Assets

Use the following prompt with an AI like ChatGPT-4 to brainstorm compelling assets for your playlist.

> **AI Prompt for Playlist Assets:**
>
> **Persona:** You are an expert Music Marketer and Playlist Curator for Spotify. Your goal is to create playlist assets that are highly clickable, optimized for search (SEO), and build an artist's brand.
>
> **Context:** I am an artist creating a promotional playlist on Spotify. The playlist will feature my own music alongside popular tracks from other artists in my genre. The goal is to attract new listeners and get them to associate my music with other great artists.
>
> **My Artist Profile:**
> *   **Artist Name:** `[Your Artist Name]`
> *   **Main Genre:** `[e.g., Indie Rock, Chillwave, Folk Pop]`
> *   **Playlist Moods/Vibes:** `[e.g., Energetic, melancholic, perfect for studying, late-night driving]`
> *   **List of 3 Key Artists in the Playlist:** `[e.g., The Killers, Tame Impala, Arctic Monkeys]`
>
> **Task:** Based on my profile, generate the following assets. Provide 5 distinct options for the title.
>
> **1. Playlist Titles (5 Options):**
> Create 5 compelling and SEO-friendly titles for the Spotify playlist. Use a mix of genre, mood, and artist name keywords.
>
> **2. Playlist Description (1 Option):**
> Write one compelling, keyword-rich description for the playlist. It should include a hook, mention the key artists, and state that it's updated daily.
>
> **3. Image Generation Prompt (1 Option):**
> Write one detailed prompt for an AI image generator (like DALL-E or Midjourney) to create professional, eye-catching cover art for the playlist. The prompt should specify the style, color palette, mood, and composition.

---

## 4. Curation: Finding the Right Tracks for Your Promo Playlist

The success of your `Combined Playlist` heavily depends on the quality of your `Promo Playlist`. The goal is to find tracks that are not only popular but also sonically and thematically aligned with your own music.

### Methodology
1.  **Start with Spotify's Data:** Go to your artist profile on Spotify. The "Fans Also Like" section is your primary source of truth. These are the artists your current listeners are already enjoying.
2.  **Analyze Influential Playlists:** Find the top user-created and editorial playlists in your genre (e.g., search for "Indie Rock" and filter by playlists). See which tracks and artists appear frequently. These are the gatekeepers of the genre.
3.  **Look at Live Shows:** Research festival lineups or artists you'd dream of touring with. Who are their opening acts? Who do they open for? This provides a real-world map of your musical ecosystem.
4.  **Filter for Vibe and Popularity:** As you gather tracks, listen to them. Do they truly fit the mood of your playlist? A mega-hit might be popular, but if it doesn't match the vibe, it could disrupt the listening experience. Aim for a mix of recognizable hits and deeper cuts from popular artists.

### AI Prompt to Research and Discover Tracks

Use this prompt to have an AI act as your personal A&R scout to find excellent tracks for your `Promo Playlist`.

> **AI Prompt for Track Discovery:**
>
> **Persona:** You are a knowledgeable A&R (Artists and Repertoire) Scout and music journalist with a deep understanding of music genres and artist connections.
>
> **Context:** I am an artist looking to build a promotional playlist on Spotify called a `Promo Playlist`. I need to fill it with tracks from other artists that are sonically similar to my own music, or who I want to be associated with. The goal is to create a cohesive and high-quality listening experience for potential new fans.
>
> **My Artist Profile:**
> *   **My Artist Name:** `[Your Artist Name]`
> *   **My Genre/Style:** `[e.g., Melancholic Indie Rock with synth elements]`
> *   **Artists I Admire or Sound Like:** `[List 3-5 artists, e.g., The National, Interpol, The War on Drugs]`
>
> **Task:**
> Based on my profile, find **20 tracks** from **10-15 different artists** that would be a perfect fit for my `Promo Playlist`. The selection should be a mix of well-known, popular songs and some slightly less-known "deep cuts" that fit the vibe perfectly.
>
> Present your findings in a markdown table with the following columns:
> *   `Artist`
> *   `Track Title`
> *   `Justification` (A brief explanation of why this track/artist is a good fit, e.g., "Shares the same baritone vocal style and driving rhythm" or "A hugely popular track in the genre that will attract listeners").
