--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: customer_state; Type: TYPE; Schema: public; Owner: obs_user
--

CREATE TYPE public.customer_state AS ENUM (
    'Active',
    'Inactive',
    'Suspended'
);


ALTER TYPE public.customer_state OWNER TO obs_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.admin (
    adminid integer NOT NULL
);


ALTER TABLE public.admin OWNER TO obs_user;

--
-- Name: books; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title text NOT NULL,
    author text,
    genre text,
    price numeric(10,2),
    image_url text,
    release_date date,
    is_featured boolean DEFAULT false,
    is_coming_soon boolean DEFAULT false,
    inventory integer DEFAULT 0
);


ALTER TABLE public.books OWNER TO obs_user;

--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.books_id_seq OWNER TO obs_user;

--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    book_id integer,
    quantity integer DEFAULT 1,
    cart_id integer
);


ALTER TABLE public.cart_items OWNER TO obs_user;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_items_id_seq OWNER TO obs_user;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: customer; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.customer (
    customerid integer NOT NULL,
    is_active public.customer_state NOT NULL,
    CONSTRAINT customer_is_active_check CHECK (((is_active)::text = ANY (ARRAY[('Active'::character varying)::text, ('Inactive'::character varying)::text, ('Suspended'::character varying)::text])))
);


ALTER TABLE public.customer OWNER TO obs_user;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    book_id integer,
    quantity integer,
    price numeric(10,2)
);


ALTER TABLE public.order_items OWNER TO obs_user;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO obs_user;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_before_tax numeric(10,2),
    tax numeric(10,2),
    total_after_tax numeric(10,2),
    payment_status text,
    shipping_address_id integer,
    payment_card_id integer,
    promotion_id integer
);


ALTER TABLE public.orders OWNER TO obs_user;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO obs_user;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payment_cards; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.payment_cards (
    id integer NOT NULL,
    user_id integer,
    card_number text,
    expiry_date text,
    cvv text,
    billing_address text,
    is_default boolean DEFAULT false
);


ALTER TABLE public.payment_cards OWNER TO obs_user;

--
-- Name: payment_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.payment_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_cards_id_seq OWNER TO obs_user;

--
-- Name: payment_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.payment_cards_id_seq OWNED BY public.payment_cards.id;


--
-- Name: promotion; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.promotion (
    promotionid integer NOT NULL,
    discountpercentage numeric(5,2) NOT NULL,
    expirationdate date NOT NULL
);


ALTER TABLE public.promotion OWNER TO obs_user;

--
-- Name: promotion_promotionid_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.promotion_promotionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_promotionid_seq OWNER TO obs_user;

--
-- Name: promotion_promotionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.promotion_promotionid_seq OWNED BY public.promotion.promotionid;


--
-- Name: shipping_addresses; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.shipping_addresses (
    id integer NOT NULL,
    user_id integer,
    address_line1 text,
    address_line2 text,
    city character varying(50),
    state character varying(50),
    zip_code character varying(20),
    country character varying(50),
    is_default boolean DEFAULT false
);


ALTER TABLE public.shipping_addresses OWNER TO obs_user;

--
-- Name: shipping_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.shipping_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shipping_addresses_id_seq OWNER TO obs_user;

--
-- Name: shipping_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.shipping_addresses_id_seq OWNED BY public.shipping_addresses.id;


--
-- Name: shopping_cart; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.shopping_cart (
    cartid integer NOT NULL,
    user_id integer
);


ALTER TABLE public.shopping_cart OWNER TO obs_user;

--
-- Name: shopping_cart_cartid_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.shopping_cart_cartid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shopping_cart_cartid_seq OWNER TO obs_user;

--
-- Name: shopping_cart_cartid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.shopping_cart_cartid_seq OWNED BY public.shopping_cart.cartid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: obs_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    is_active boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO obs_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO obs_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payment_cards id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.payment_cards ALTER COLUMN id SET DEFAULT nextval('public.payment_cards_id_seq'::regclass);


--
-- Name: promotion promotionid; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.promotion ALTER COLUMN promotionid SET DEFAULT nextval('public.promotion_promotionid_seq'::regclass);


--
-- Name: shipping_addresses id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses ALTER COLUMN id SET DEFAULT nextval('public.shipping_addresses_id_seq'::regclass);


--
-- Name: shopping_cart cartid; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shopping_cart ALTER COLUMN cartid SET DEFAULT nextval('public.shopping_cart_cartid_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (adminid);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (customerid);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payment_cards payment_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_pkey PRIMARY KEY (id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (promotionid);


--
-- Name: shipping_addresses shipping_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_pkey PRIMARY KEY (id);


--
-- Name: shopping_cart shopping_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_pkey PRIMARY KEY (cartid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: admin admin_adminid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_adminid_fkey FOREIGN KEY (adminid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.shopping_cart(cartid) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: customer customer_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_customerid_fkey FOREIGN KEY (customerid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_payment_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_payment_card_id_fkey FOREIGN KEY (payment_card_id) REFERENCES public.payment_cards(id);


--
-- Name: orders orders_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotion(promotionid);


--
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.shipping_addresses(id);


--
-- Name: orders orders_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.customer(customerid);


--
-- Name: payment_cards payment_cards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.customer(customerid) ON DELETE CASCADE;


--
-- Name: shipping_addresses shipping_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.customer(customerid) ON DELETE CASCADE;


--
-- Name: shopping_cart shopping_cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.customer(customerid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

