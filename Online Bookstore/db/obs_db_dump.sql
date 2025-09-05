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


SET default_tablespace = '';

SET default_table_access_method = heap;

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
    user_id integer,
    book_id integer,
    quantity integer DEFAULT 1
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
    payment_card_id integer
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
-- Name: shipping_addresses id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses ALTER COLUMN id SET DEFAULT nextval('public.shipping_addresses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.books (id, title, author, genre, price, image_url, release_date, is_featured, is_coming_soon, inventory) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.cart_items (id, user_id, book_id, quantity) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.order_items (id, order_id, book_id, quantity, price) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.orders (id, user_id, created_at, total_before_tax, tax, total_after_tax, payment_status, shipping_address_id, payment_card_id) FROM stdin;
\.


--
-- Data for Name: payment_cards; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.payment_cards (id, user_id, card_number, expiry_date, cvv, billing_address, is_default) FROM stdin;
\.


--
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.shipping_addresses (id, user_id, address_line1, address_line2, city, state, zip_code, country, is_default) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.users (id, username, email, password_hash, first_name, last_name, is_active, created_at) FROM stdin;
\.


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.books_id_seq', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payment_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.payment_cards_id_seq', 1, false);


--
-- Name: shipping_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.shipping_addresses_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


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
-- Name: shipping_addresses shipping_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_pkey PRIMARY KEY (id);


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
-- Name: cart_items cart_items_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


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
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.shipping_addresses(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payment_cards payment_cards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: shipping_addresses shipping_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

