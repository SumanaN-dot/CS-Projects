--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-08 13:00:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16525)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16562)
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
-- TOC entry 219 (class 1259 OID 16570)
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_id_seq OWNER TO obs_user;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 219
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- TOC entry 220 (class 1259 OID 16571)
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
-- TOC entry 221 (class 1259 OID 16575)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO obs_user;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 221
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 222 (class 1259 OID 16576)
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
-- TOC entry 223 (class 1259 OID 16579)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO obs_user;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 223
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 224 (class 1259 OID 16580)
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
-- TOC entry 225 (class 1259 OID 16586)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO obs_user;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 226 (class 1259 OID 16587)
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
-- TOC entry 227 (class 1259 OID 16593)
-- Name: payment_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.payment_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_cards_id_seq OWNER TO obs_user;

--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 227
-- Name: payment_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.payment_cards_id_seq OWNED BY public.payment_cards.id;


--
-- TOC entry 228 (class 1259 OID 16594)
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
-- TOC entry 229 (class 1259 OID 16600)
-- Name: shipping_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.shipping_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_addresses_id_seq OWNER TO obs_user;

--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 229
-- Name: shipping_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.shipping_addresses_id_seq OWNED BY public.shipping_addresses.id;


--
-- TOC entry 230 (class 1259 OID 16601)
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
-- TOC entry 231 (class 1259 OID 16608)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: obs_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO obs_user;

--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: obs_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4809 (class 2604 OID 16609)
-- Name: books id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- TOC entry 4813 (class 2604 OID 16610)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 16611)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4816 (class 2604 OID 16612)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 16613)
-- Name: payment_cards id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.payment_cards ALTER COLUMN id SET DEFAULT nextval('public.payment_cards_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 16614)
-- Name: shipping_addresses id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses ALTER COLUMN id SET DEFAULT nextval('public.shipping_addresses_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 16615)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4997 (class 0 OID 16562)
-- Dependencies: 218
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.books (id, title, author, genre, price, image_url, release_date, is_featured, is_coming_soon, inventory) FROM stdin;
1	To Kill a Mockingbird	Harper Lee	Historical Fiction	8.99	https://covers.openlibrary.org/b/id/8228691-L.jpg	1960-07-11	t	f	25
2	1984	George Orwell	Dystopian	9.50	https://covers.openlibrary.org/b/id/7222246-L.jpg	1949-06-08	t	f	30
3	Pride and Prejudice	Jane Austen	Romance	7.99	https://covers.openlibrary.org/b/id/8091016-L.jpg	1813-01-28	t	f	40
4	The Catcher in the Rye	J.D. Salinger	Coming-of-Age	10.00	https://covers.openlibrary.org/b/id/8231851-L.jpg	1951-07-16	t	f	18
5	The Hobbit	J.R.R. Tolkien	Fantasy	11.25	https://covers.openlibrary.org/b/id/6979861-L.jpg	1937-09-21	t	f	35
\.


--
-- TOC entry 4999 (class 0 OID 16571)
-- Dependencies: 220
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.cart_items (id, user_id, book_id, quantity) FROM stdin;
\.


--
-- TOC entry 5001 (class 0 OID 16576)
-- Dependencies: 222
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.order_items (id, order_id, book_id, quantity, price) FROM stdin;
\.


--
-- TOC entry 5003 (class 0 OID 16580)
-- Dependencies: 224
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.orders (id, user_id, created_at, total_before_tax, tax, total_after_tax, payment_status, shipping_address_id, payment_card_id) FROM stdin;
\.


--
-- TOC entry 5005 (class 0 OID 16587)
-- Dependencies: 226
-- Data for Name: payment_cards; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.payment_cards (id, user_id, card_number, expiry_date, cvv, billing_address, is_default) FROM stdin;
\.


--
-- TOC entry 5007 (class 0 OID 16594)
-- Dependencies: 228
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.shipping_addresses (id, user_id, address_line1, address_line2, city, state, zip_code, country, is_default) FROM stdin;
\.


--
-- TOC entry 5009 (class 0 OID 16601)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: obs_user
--

COPY public.users (id, username, email, password_hash, first_name, last_name, is_active, created_at) FROM stdin;
2	TamaraSkinner	337tamaraskinner@gmail.com	$2a$06$DKJomK0HQS.pdR87xd48PeANZMbe0egD7rDMc1gpNOI/u0SBU1aOS	Tamara	Skinner	t	2025-07-07 19:46:22.186647
\.


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 219
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.books_id_seq', 15, true);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 221
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 223
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 227
-- Name: payment_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.payment_cards_id_seq', 1, false);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 229
-- Name: shipping_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.shipping_addresses_id_seq', 1, false);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: obs_user
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4826 (class 2606 OID 16617)
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 16619)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4830 (class 2606 OID 16621)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 16623)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 16625)
-- Name: payment_cards payment_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16627)
-- Name: shipping_addresses shipping_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 4838 (class 2606 OID 16629)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4840 (class 2606 OID 16631)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16633)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4843 (class 2606 OID 16634)
-- Name: cart_items cart_items_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- TOC entry 4844 (class 2606 OID 16639)
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4845 (class 2606 OID 16644)
-- Name: order_items order_items_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- TOC entry 4846 (class 2606 OID 16649)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4847 (class 2606 OID 16654)
-- Name: orders orders_payment_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_payment_card_id_fkey FOREIGN KEY (payment_card_id) REFERENCES public.payment_cards(id);


--
-- TOC entry 4848 (class 2606 OID 16659)
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.shipping_addresses(id);


--
-- TOC entry 4849 (class 2606 OID 16664)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4850 (class 2606 OID 16669)
-- Name: payment_cards payment_cards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 16674)
-- Name: shipping_addresses shipping_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: obs_user
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-07-08 13:00:01

--
-- PostgreSQL database dump complete
--

