import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const seedMovies = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if movies already exist
    const existingMovies = await ctx.db.query("movies").collect();
    if (existingMovies.length > 0) {
      return "Movies already seeded";
    }

    const movies = [
      {
        title: "The Obsidian Conspiracy",
        description: "A secret organization controls the world's most powerful governments. When a whistleblower threatens to expose them, they'll stop at nothing to silence the truth.",
        genre: "Thriller",
        year: 2023,
        duration: "2h 15m",
        rating: "R",
        thumbnail: "https://images.unsplash.com/photo-1489599162163-3fb2b8e4b5b3?w=400&h=600&fit=crop",
        videoUrl: "#",
        isFeatured: true,
        views: 2847392
      },
      {
        title: "Midnight Protocols",
        description: "Elite hackers uncover a digital conspiracy that threatens global security.",
        genre: "Cyber Thriller",
        year: 2023,
        duration: "1h 58m",
        rating: "PG-13",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
        videoUrl: "#",
        isFeatured: false,
        views: 1234567
      },
      {
        title: "Shadow Cabinet",
        description: "Political intrigue meets supernatural horror in this chilling tale.",
        genre: "Horror",
        year: 2022,
        duration: "2h 3m",
        rating: "R",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        videoUrl: "#",
        isFeatured: false,
        views: 987654
      },
      {
        title: "The Illuminated",
        description: "Ancient secrets surface in modern times as a historian uncovers forbidden knowledge.",
        genre: "Mystery",
        year: 2023,
        duration: "2h 12m",
        rating: "PG-13",
        thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        videoUrl: "#",
        isFeatured: false,
        views: 2156789
      },
      {
        title: "Crimson Order",
        description: "A detective infiltrates a secret society to solve a series of ritualistic murders.",
        genre: "Crime",
        year: 2023,
        duration: "1h 47m",
        rating: "R",
        thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
        videoUrl: "#",
        isFeatured: false,
        views: 1876543
      },
      {
        title: "The Vault Keepers",
        description: "Bank robbers discover their target holds more than money - it guards ancient artifacts.",
        genre: "Action",
        year: 2022,
        duration: "2h 8m",
        rating: "PG-13",
        thumbnail: "https://images.unsplash.com/photo-1489599162163-3fb2b8e4b5b3?w=400&h=600&fit=crop",
        videoUrl: "#",
        isFeatured: false,
        views: 3456789
      }
    ];

    // Add more movies to reach 100+ for pagination
    const additionalMovies = [];
    for (let i = 7; i <= 120; i++) {
      additionalMovies.push({
        title: `Secret Film ${i}`,
        description: `A mysterious tale of hidden truths and dark secrets that will keep you on the edge of your seat.`,
        genre: ["Thriller", "Mystery", "Horror", "Action", "Drama"][Math.floor(Math.random() * 5)],
        year: 2020 + Math.floor(Math.random() * 4),
        duration: `${Math.floor(Math.random() * 60) + 90}m`,
        rating: ["PG", "PG-13", "R"][Math.floor(Math.random() * 3)],
        thumbnail: `https://images.unsplash.com/photo-${1489599162163 + i}?w=400&h=600&fit=crop`,
        videoUrl: "#",
        isFeatured: false,
        views: Math.floor(Math.random() * 5000000) + 100000
      });
    }

    // Insert all movies
    for (const movie of [...movies, ...additionalMovies]) {
      await ctx.db.insert("movies", movie);
    }

    return `Seeded ${movies.length + additionalMovies.length} movies`;
  },
});
