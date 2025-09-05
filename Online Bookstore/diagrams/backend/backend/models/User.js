const pool = require('../db.js');

class UserBuilder {
    constructor() {
        this.userData = {};
    }

    setBasicInfo(username, email, password, firstName, lastName) {
        this.userData.username = username;
        this.userData.email = email;
        this.userData.password = password;
        this.userData.first_name = firstName;
        this.userData.last_name = lastName;
        return this;
    }

    setPromoOptIn(optIn) {
        this.userData.promoOptIn = optIn;
        return this;
    }

    setShippingAddress(addressLine1, addressLine2, city, state, zipCode, country = 'US') {
        this.userData.address_line1 = addressLine1;
        this.userData.address_line2 = addressLine2;
        this.userData.city = city;
        this.userData.state = state;
        this.userData.zip_code = zipCode;
        return this;
    }

    setPaymentInfo(cardNumber, expiryDate, cvv, billingAddress) {
        this.userData.card_number = cardNumber;
        this.userData.expiry_date = expiryDate;
        this.userData.cvv = cvv;
        this.userData.billing_address = billingAddress;
        return this;
    }

    build() {
        return new User(this.userData);
    }
}

class User {
    constructor(userData) {
        this.username = userData.username;
        this.email = userData.email;
        this.password = userData.password;
        this.firstName = userData.first_name;
        this.lastName = userData.last_name;
        this.promoOptIn = userData.promoOptIn;
        
        // Shipping address
        this.shippingAddress = {
            addressLine1: userData.address_line1,
            addressLine2: userData.address_line2,
            city: userData.city,
            state: userData.state,
            zipCode: userData.zip_code,
        };
        
        // Payment info
        this.paymentInfo = {
            cardNumber: userData.card_number,
            expiryDate: userData.expiry_date,
            cvv: userData.cvv,
            billingAddress: userData.billing_address
        };
    }

    async save() {
        try {
            await pool.query('BEGIN');

            // Check if user exists
            const existingEmail = await pool.query('SELECT * FROM users WHERE email = $1', [this.email]);
            if (existingEmail.rows.length > 0) {
                throw new Error('Email already exists');
            }

            const existingUsername = await pool.query('SELECT * FROM users WHERE username = $1', [this.username]);
            if (existingUsername.rows.length > 0) {
                throw new Error('Username already taken');
            }

            // Insert user
            const newUser = await pool.query(
                `INSERT INTO users (username, email, password_hash, first_name, last_name, is_active)
                 VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5, false)
                 RETURNING id`,
                [this.username, this.email, this.password, this.firstName, this.lastName]
            );

            this.id = newUser.rows[0].id;
            console.log('Created user with ID:', this.id);

            // Create customer record FIRST (required for foreign key)
            await pool.query(
                `INSERT INTO customer (customerid, is_active, send_promo) VALUES ($1, $2::customer_state, $3)`,
                [this.id, 'Inactive', this.promoOptIn]
            );

            // Insert shipping address if provided
            if (this.hasShippingAddress()) {
                await this.saveShippingAddress();
            }

            // Insert payment info if provided
            if (this.hasPaymentInfo()) {
                await this.savePaymentInfo();
            }

            await pool.query(`INSERT INTO shopping_cart (user_id) VALUES ($1)`, [this.id]);

            await pool.query('COMMIT');
            return this.id;

        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }
    }

    hasShippingAddress() {
        return this.shippingAddress.addressLine1 && 
               this.shippingAddress.city && 
               this.shippingAddress.state && 
               this.shippingAddress.zipCode;
    }

    hasPaymentInfo() {
        return this.paymentInfo.cardNumber && 
               this.paymentInfo.expiryDate && 
               this.paymentInfo.cvv;
    }

    async saveShippingAddress() {
        console.log('Inserting shipping address for user_id:', this.id);
        console.log('Shipping data:', {
            user_id: this.id,
            address_line1: this.shippingAddress.addressLine1,
            city: this.shippingAddress.city,
            state: this.shippingAddress.state,
            zip_code: this.shippingAddress.zipCode
        });
        
        await pool.query(
            `INSERT INTO shipping_addresses (user_id, address_line1, address_line2, city, state, zip_code, country, is_default) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
            [
                this.id,
                this.shippingAddress.addressLine1,
                this.shippingAddress.addressLine2,
                this.shippingAddress.city,
                this.shippingAddress.state,
                this.shippingAddress.zipCode,
                this.shippingAddress.country
            ]
        );
    }

    async savePaymentInfo() {
        await pool.query(
            `INSERT INTO payment_cards (user_id, card_number, expiry_date, cvv, billing_address, is_default) 
             VALUES ($1, encrypt($2, $3, 'aes'), $4, $5, $6, true)`,
            [
                this.id,
                this.paymentInfo.cardNumber,
                process.env.ENCRYPTION_KEY,
                this.paymentInfo.expiryDate,
                this.paymentInfo.cvv,
                this.paymentInfo.billingAddress
            ]
        );
    }

    // Static method to fetch user profile data
    static async getProfile(userId) {
        try {
            const userQuery = `
                SELECT u.email, u.first_name, u.last_name,
                       c.send_promo,
                       sa.address_line1, sa.city, sa.state, sa.zip_code,
                       pc.card_number, pc.expiry_date, pc.cvv
                FROM users u
                LEFT JOIN customer c ON u.id = c.customerid
                LEFT JOIN shipping_addresses sa ON u.id = sa.user_id
                LEFT JOIN payment_cards pc ON u.id = pc.user_id
                WHERE u.id = $1
            `;
            
            const { rows } = await pool.query(userQuery, [userId]);
            
            if (rows.length === 0) {
                return null;
            }

            // Extract last 4 digits from encrypted card number
            const getCardLast4 = (encryptedCard) => {
                if (!encryptedCard) return null;
                // If card is stored as encrypted text, get last 4 characters
                // If it's binary, you may need different handling
                const cardStr = encryptedCard.toString();
                return cardStr.length >= 4 ? cardStr.slice(-4) : cardStr;
            };

            return {
                email: rows[0].email,
                password: '********', // Never show actual password
                firstName: rows[0].first_name,
                lastName: rows[0].last_name,
                promoOptIn: rows[0].send_promo,
                street: rows[0].address_line1,
                city: rows[0].city,
                state: rows[0].state,
                zip: rows[0].zip_code,
                card: await User.getCardNumber(userId),
                exp: rows[0].expiry_date,
                cvv: rows[0].cvv ? '***' : null
            };

        } catch (error) {
            throw error;
        }
    }

    // Static method to fetch card number with last 4 digits
    static async getCardNumber(userId) {
        try {
            const cardQuery = `
                SELECT card_number 
                FROM payment_cards 
                WHERE user_id = $1
            `;
            
            const { rows } = await pool.query(cardQuery, [userId]);
            
            if (rows.length === 0 || !rows[0].card_number) {
                return null;
            }

            // Return fully blocked out card number
            return '****-****-****-****';

        } catch (error) {
            throw error;
        }
    }
}

module.exports = { User, UserBuilder };
