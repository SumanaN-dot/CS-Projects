const pool = require('../db.js');

class BookBuilder {
    constructor() {
        this.bookData = {};
    }

    setBasicInfo(title, author, genre) {
        this.bookData.title = title;
        this.bookData.author = author;
        this.bookData.genre = genre;
        return this;
    }

    setPricing(price) {
        this.bookData.price = price;
        return this;
    }

    setImageUrl(imageUrl) {
        this.bookData.image_url = imageUrl;
        return this;
    }

    setReleaseDate(releaseDate) {
        this.bookData.release_date = releaseDate;
        return this;
    }

    setInventory(inventory) {
        this.bookData.inventory = inventory || 0;
        return this;
    }

    setFeaturedStatus(isFeatured) {
        this.bookData.is_featured = isFeatured || false;
        return this;
    }

    setComingSoonStatus(isComingSoon) {
        this.bookData.is_coming_soon = isComingSoon || false;
        return this;
    }

    build() {
        return new Book(this.bookData);
    }
}

class Book {
    constructor(bookData) {
        this.title = bookData.title;
        this.author = bookData.author;
        this.genre = bookData.genre;
        this.price = bookData.price;
        this.image_url = bookData.image_url;
        this.release_date = bookData.release_date;
        this.is_featured = bookData.is_featured || false;
        this.is_coming_soon = bookData.is_coming_soon || false;
        this.inventory = bookData.inventory || 0;
    }

    async save() {
        try {
            const query = `
                INSERT INTO books (title, author, genre, price, image_url, release_date, is_featured, is_coming_soon, inventory)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id
            `;
            
            const values = [
                this.title,
                this.author,
                this.genre,
                this.price,
                this.image_url,
                this.release_date,
                this.is_featured,
                this.is_coming_soon,
                this.inventory
            ];

            const result = await pool.query(query, values);
            this.id = result.rows[0].id;
            
            return this.id;
        } catch (error) {
            throw error;
        }
    }

    // Static method to get all books
    static async getAll() {
        try {
            const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Static method to get book by ID
    static async getById(id) {
        try {
            const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Static method to update book
    static async updateById(id, bookData) {
        try {
            const query = `
                UPDATE books 
                SET title = $1, author = $2, genre = $3, price = $4, image_url = $5, 
                    release_date = $6, is_featured = $7, is_coming_soon = $8, inventory = $9
                WHERE id = $10
                RETURNING *
            `;
            
            const values = [
                bookData.title,
                bookData.author,
                bookData.genre,
                bookData.price,
                bookData.image_url,
                bookData.release_date,
                bookData.is_featured,
                bookData.is_coming_soon,
                bookData.inventory,
                id
            ];

            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Static method to delete book
    static async deleteById(id) {
        try {
            const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { Book, BookBuilder };
