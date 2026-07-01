--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

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
-- Name: CartStatus; Type: TYPE; Schema: public; Owner: ashkan
--

CREATE TYPE public."CartStatus" AS ENUM (
    'ACTIVE',
    'CHECKED_OUT',
    'ABANDONED'
);


ALTER TYPE public."CartStatus" OWNER TO ashkan;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: ashkan
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'CANCELED',
    'REFUNDED',
    'DELIVERING',
    'DELIVERED',
    'PREPARING'
);


ALTER TYPE public."OrderStatus" OWNER TO ashkan;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: ashkan
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO ashkan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    phone text NOT NULL,
    email text,
    province text NOT NULL,
    city text NOT NULL,
    address text NOT NULL,
    "postalCode" text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Address" OWNER TO ashkan;

--
-- Name: AiResponse; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."AiResponse" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    "userId" text,
    recommendation text NOT NULL,
    explanation text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AiResponse" OWNER TO ashkan;

--
-- Name: AiResponse_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."AiResponse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AiResponse_id_seq" OWNER TO ashkan;

--
-- Name: AiResponse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."AiResponse_id_seq" OWNED BY public."AiResponse".id;


--
-- Name: Blog; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Blog" (
    id integer NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    description text NOT NULL,
    author text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "authorImage" text NOT NULL,
    content text NOT NULL,
    slug text NOT NULL,
    "authorTitle" text NOT NULL
);


ALTER TABLE public."Blog" OWNER TO ashkan;

--
-- Name: Blog_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."Blog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Blog_id_seq" OWNER TO ashkan;

--
-- Name: Blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."Blog_id_seq" OWNED BY public."Blog".id;


--
-- Name: Cart; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text,
    status public."CartStatus" DEFAULT 'ACTIVE'::public."CartStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO ashkan;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."CartItem" (
    id integer NOT NULL,
    "cartId" text NOT NULL,
    "productId" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO ashkan;

--
-- Name: CartItem_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."CartItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CartItem_id_seq" OWNER TO ashkan;

--
-- Name: CartItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."CartItem_id_seq" OWNED BY public."CartItem".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    "iconPath" text NOT NULL
);


ALTER TABLE public."Category" OWNER TO ashkan;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO ashkan;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Faq; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Faq" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL
);


ALTER TABLE public."Faq" OWNER TO ashkan;

--
-- Name: Faq_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."Faq_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Faq_id_seq" OWNER TO ashkan;

--
-- Name: Faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."Faq_id_seq" OWNED BY public."Faq".id;


--
-- Name: FeedCategory; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."FeedCategory" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FeedCategory" OWNER TO ashkan;

--
-- Name: FeedCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."FeedCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."FeedCategory_id_seq" OWNER TO ashkan;

--
-- Name: FeedCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."FeedCategory_id_seq" OWNED BY public."FeedCategory".id;


--
-- Name: Gain; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Gain" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    title text NOT NULL,
    ingredient text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public."Gain" OWNER TO ashkan;

--
-- Name: Gain_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."Gain_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Gain_id_seq" OWNER TO ashkan;

--
-- Name: Gain_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."Gain_id_seq" OWNED BY public."Gain".id;


--
-- Name: HealthAssessment; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."HealthAssessment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    answers jsonb NOT NULL,
    "sleepScore" integer NOT NULL,
    "nutritionScore" integer NOT NULL,
    "activityScore" integer NOT NULL,
    "stressScore" integer NOT NULL,
    "beautyScore" integer NOT NULL,
    "medicalScore" integer NOT NULL,
    "overallScore" integer NOT NULL,
    "healthArchetype" text,
    "readinessStage" text,
    "decisionStyle" text,
    "consistencyLevel" text,
    "motivationSource" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastViewedAt" timestamp(3) without time zone,
    "aiOutput" jsonb,
    domains jsonb
);


ALTER TABLE public."HealthAssessment" OWNER TO ashkan;

--
-- Name: HealthRecommendation; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."HealthRecommendation" (
    id text NOT NULL,
    "healthAssessmentId" text NOT NULL,
    "productId" integer NOT NULL,
    reason text NOT NULL,
    domain text NOT NULL,
    priority integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "recommendationBatchId" text
);


ALTER TABLE public."HealthRecommendation" OWNER TO ashkan;

--
-- Name: Icon; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Icon" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "iconPath" text
);


ALTER TABLE public."Icon" OWNER TO ashkan;

--
-- Name: Icon_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."Icon_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Icon_id_seq" OWNER TO ashkan;

--
-- Name: Icon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."Icon_id_seq" OWNED BY public."Icon".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text,
    "cartId" text NOT NULL,
    "totalPrice" integer NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "shippingAddress" text NOT NULL,
    "shippingCity" text NOT NULL,
    "shippingEmail" text NOT NULL,
    "shippingFirstName" text NOT NULL,
    "shippingLastName" text NOT NULL,
    "shippingNotes" text,
    "shippingPhone" text NOT NULL,
    "shippingPostalCode" text NOT NULL,
    "shippingProvince" text NOT NULL,
    "canceledAt" timestamp(3) without time zone,
    "cancellationReason" text,
    "paymentAuthority" text,
    "paymentErrorMessage" text,
    "paymentMethod" text,
    "paymentRefId" text,
    "paymentRequestedAt" timestamp(3) without time zone,
    "paymentVerifiedAt" timestamp(3) without time zone,
    "refundReason" text,
    "refundedAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO ashkan;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    "orderId" text NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    price integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO ashkan;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OrderItem_id_seq" OWNER TO ashkan;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    title text NOT NULL,
    price integer NOT NULL,
    image text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    slug text NOT NULL,
    solution text NOT NULL,
    "categoryId" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "feedCategoryId" integer
);


ALTER TABLE public."Product" OWNER TO ashkan;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: ashkan
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO ashkan;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ashkan
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO ashkan;

--
-- Name: User; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    email text,
    phone text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "firstName" text,
    "lastName" text
);


ALTER TABLE public."User" OWNER TO ashkan;

--
-- Name: VisitMonth; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public."VisitMonth" (
    id text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    visits integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VisitMonth" OWNER TO ashkan;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: ashkan
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO ashkan;

--
-- Name: AiResponse id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."AiResponse" ALTER COLUMN id SET DEFAULT nextval('public."AiResponse_id_seq"'::regclass);


--
-- Name: Blog id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Blog" ALTER COLUMN id SET DEFAULT nextval('public."Blog_id_seq"'::regclass);


--
-- Name: CartItem id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."CartItem" ALTER COLUMN id SET DEFAULT nextval('public."CartItem_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Faq id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Faq" ALTER COLUMN id SET DEFAULT nextval('public."Faq_id_seq"'::regclass);


--
-- Name: FeedCategory id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."FeedCategory" ALTER COLUMN id SET DEFAULT nextval('public."FeedCategory_id_seq"'::regclass);


--
-- Name: Gain id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Gain" ALTER COLUMN id SET DEFAULT nextval('public."Gain_id_seq"'::regclass);


--
-- Name: Icon id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Icon" ALTER COLUMN id SET DEFAULT nextval('public."Icon_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Address" (id, "userId", "firstName", "lastName", phone, email, province, city, address, "postalCode", "isDefault", "createdAt", "updatedAt") FROM stdin;
cmp1mhewk000104uupmfdzmvu	cmlwjbbwh0000ktuuynrhik9d	سارا	سارا	09129212536	asd@asd.com	اردبیل	خلخال	asdasdasdasd	1234567891	t	2026-05-11 19:56:38.708	2026-05-11 19:56:38.708
cmp1sand9001akluu0oxq31bg	cmlwjbbwh0000ktuuynrhik9d	نرگس	کریمی	09129212536	narges.karimi@example.com	البرز	طالقان	asdxsxasdasd	1123456789	f	2026-05-11 22:39:20.781	2026-05-11 22:39:20.781
\.


--
-- Data for Name: AiResponse; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."AiResponse" (id, "productId", "userId", recommendation, explanation, "createdAt") FROM stdin;
1	4	\N	این محصول برای پوست خشک مناسب است	اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند. مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان چیزی است که برای نوع پوست تو توصیه می‌شود.	2026-02-20 08:17:51.994
2	5	\N	این محصول برای پوست خشک مناسب است	اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند. مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان چیزی است که برای نوع پوست تو توصیه می‌شود.	2026-02-20 08:17:52.013
3	6	\N	این محصول برای پوست خشک مناسب است	اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند. مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان چیزی است که برای نوع پوست تو توصیه می‌شود.	2026-02-20 08:17:52.023
4	7	\N	این محصول برای پوست خشک مناسب است	اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند. مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان چیزی است که برای نوع پوست تو توصیه می‌شود.	2026-02-20 08:17:52.031
5	8	\N	این محصول برای پوست خشک مناسب است	اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند. مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان چیزی است که برای نوع پوست تو توصیه می‌شود.	2026-02-20 08:17:52.039
6	9	\N	این محصول برای پوست خشک مناسب است	اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند. مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان چیزی است که برای نوع پوست تو توصیه می‌شود.	2026-02-20 08:17:52.047
\.


--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Blog" (id, title, image, description, author, "createdAt", "updatedAt", "authorImage", content, slug, "authorTitle") FROM stdin;
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Cart" (id, "userId", status, "createdAt", "updatedAt") FROM stdin;
cmlxy4os20004ktuutvwf9462	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-02-22 16:12:28.658	2026-02-22 16:56:16.543
cmlxy4qt90005ktuu91i6gr06	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-02-22 16:12:31.292	2026-05-02 14:46:12.141
cmoohwwxp00025kuut48mv0y8	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-02 15:27:43.549	2026-05-02 15:28:12.957
cmoohwwye00035kuufca5czkh	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-02 15:27:43.574	2026-05-08 20:51:53.991
cmoohwxp400045kuu72z97oy1	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-02 15:27:44.536	2026-05-11 19:56:38.814
cmp1mhpgc000304uucw61srqh	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-11 19:56:52.38	2026-05-11 23:02:41.247
cmp1mhq94000404uub849ygyg	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-11 19:56:53.416	2026-05-11 23:03:21.017
cmp1t5po4001qkluu3umedf1a	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-11 23:03:30.1	2026-05-11 23:04:09.717
cmp1t5q7q001rkluuq5910m60	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-11 23:03:30.806	2026-05-19 12:41:48.569
cmpcmqyjk0006jyuu1jcyi540	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 12:49:32	2026-05-19 12:49:40.151
cmpcmr08h0007jyuufs1srxca	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 12:49:34.193	2026-05-19 14:08:07.283
cmpcpkjag000tmtuu3dkvxycr	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 14:08:31.144	2026-05-19 14:16:21.096
cmpcpkk8e000umtuu2unky079	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 14:08:32.366	2026-05-19 14:16:57.826
cmpcpkl1g000vmtuuh0nimk6t	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 14:08:33.412	2026-05-19 14:17:19.981
cmpcpw02x0011mtuui5heabcp	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 14:17:26.121	2026-05-19 14:17:41.239
cmpcq02xc0013mtuuv0f84oj7	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 14:20:36.432	2026-05-19 14:20:48.655
cmpcqkghp0005siuuv4hvikkh	cmlwjbbwh0000ktuuynrhik9d	CHECKED_OUT	2026-05-19 14:36:27.133	2026-05-19 14:36:34.235
cmpd2xlx80002z6uuyr012wb3	cmlwjbbwh0000ktuuynrhik9d	ACTIVE	2026-05-19 20:22:36.092	2026-05-19 20:22:36.092
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."CartItem" (id, "cartId", "productId", quantity, price, "createdAt") FROM stdin;
11	cmlxy4os20004ktuutvwf9462	11	1	330000	2026-02-22 16:12:55.178
8	cmlxy4os20004ktuutvwf9462	8	3	420000	2026-02-22 16:12:46.99
6	cmlxy4os20004ktuutvwf9462	7	2	99000	2026-02-22 16:12:28.681
9	cmlxy4os20004ktuutvwf9462	9	3	86000	2026-02-22 16:12:48.561
23	cmoohwxp400045kuu72z97oy1	9	21	86000	2026-05-08 21:07:43.951
24	cmp1mhpgc000304uucw61srqh	10	1	120000	2026-05-11 19:56:52.431
26	cmp1mhpgc000304uucw61srqh	9	1	86000	2026-05-11 19:57:27.323
27	cmp1mhpgc000304uucw61srqh	8	1	420000	2026-05-11 19:57:31.797
76	cmpcpkk8e000umtuu2unky079	8	6	420000	2026-05-19 14:16:42.278
28	cmp1mhq94000404uub849ygyg	8	4	420000	2026-05-11 23:03:09.938
29	cmp1mhq94000404uub849ygyg	9	3	86000	2026-05-11 23:03:10.921
30	cmp1t5po4001qkluu3umedf1a	10	1	120000	2026-05-11 23:03:30.119
32	cmp1t5q7q001rkluuq5910m60	8	2	420000	2026-05-17 13:38:09.014
34	cmp1t5q7q001rkluuq5910m60	9	1	86000	2026-05-19 12:41:41.626
12	cmlxy4qt90005ktuu91i6gr06	6	9	233000	2026-04-29 16:06:16.22
13	cmlxy4qt90005ktuu91i6gr06	7	6	99000	2026-04-29 16:06:19.269
82	cmpcpkl1g000vmtuuh0nimk6t	8	2	420000	2026-05-19 14:17:15.469
35	cmpcmqyjk0006jyuu1jcyi540	8	3	420000	2026-05-19 12:49:32.018
17	cmoohwwxp00025kuut48mv0y8	5	4	543000	2026-05-02 15:27:43.731
84	cmpcpw02x0011mtuui5heabcp	10	1	120000	2026-05-19 14:17:26.132
20	cmoohwwye00035kuufca5czkh	10	2	120000	2026-05-08 20:48:33.782
21	cmoohwwye00035kuufca5czkh	11	1	330000	2026-05-08 20:48:35.169
22	cmoohwwye00035kuufca5czkh	9	1	86000	2026-05-08 20:48:36.888
85	cmpcpw02x0011mtuui5heabcp	11	2	330000	2026-05-19 14:17:27.193
87	cmpcpw02x0011mtuui5heabcp	9	2	86000	2026-05-19 14:17:28.701
89	cmpcpw02x0011mtuui5heabcp	8	6	420000	2026-05-19 14:17:33.359
95	cmpcq02xc0013mtuuv0f84oj7	8	2	420000	2026-05-19 14:20:36.455
38	cmpcmr08h0007jyuufs1srxca	9	1	86000	2026-05-19 12:49:34.224
97	cmpcq02xc0013mtuuv0f84oj7	9	2	86000	2026-05-19 14:20:38.703
99	cmpcq02xc0013mtuuv0f84oj7	10	1	120000	2026-05-19 14:20:40.012
100	cmpcq02xc0013mtuuv0f84oj7	11	1	330000	2026-05-19 14:20:40.959
101	cmpcqkghp0005siuuv4hvikkh	12	1	10000000	2026-05-19 14:36:27.198
102	cmpcqkghp0005siuuv4hvikkh	8	1	420000	2026-05-19 14:36:27.422
45	cmpcmr08h0007jyuufs1srxca	11	5	330000	2026-05-19 12:52:13.967
109	cmpd2xlx80002z6uuyr012wb3	12	1	10000000	2026-05-19 20:22:36.158
110	cmpd2xlx80002z6uuyr012wb3	8	1	420000	2026-05-19 20:22:36.691
72	cmpcpkjag000tmtuu3dkvxycr	8	1	420000	2026-05-19 14:16:10.446
73	cmpcpkjag000tmtuu3dkvxycr	9	1	86000	2026-05-19 14:16:11.646
74	cmpcpkjag000tmtuu3dkvxycr	10	1	120000	2026-05-19 14:16:13.016
56	cmpcpkk8e000umtuu2unky079	9	2	86000	2026-05-19 14:08:32.392
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Category" (id, name, "iconPath") FROM stdin;
1	پوست و مو	/images/clean.svg
2	مکمل ها	/images/medication.svg
3	مراقبت ذهنی	/images/mindfulness.svg
4	حیوانات	/images/pets.svg
5	موادغذایی	/images/spoon.svg
6	لوازم خانه	/images/chair.svg
\.


--
-- Data for Name: Faq; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Faq" (id, "productId", question, answer) FROM stdin;
1	4	این محصول دقیقاً چگونه عمل می‌کند؟	با ترکیب عصاره‌های گیاهی و ویتامین‌ها، سد دفاعی پوست تقویت شده و رطوبت عمقی به لایه‌های پوست منتقل می‌شود؛ خشکی و تحریک کاهش می‌یابد.
2	4	بر چه شواهدی تکیه دارد؟	تحقیقات بالینی روی ترکیبات گلیسیرین، آلوئه‌ورا و ویتامین E نشان داده‌اند که استفاده مداوم باعث بهبود رطوبت و کاهش التهاب پوست می‌شود.
3	4	برای چه افرادی بیشترین اثر را دارد؟	افرادی که پوست خشک، حساس یا تحریک‌پذیر دارند و به دنبال بهبود سریع رطوبت و نرمی پوست هستند.
4	4	چه چیزی آن را از محصولات مشابه متمایز می‌کند؟	ترکیب عصاره‌های گیاهی فعال و ویتامین‌های ضروری با فرمولاسیون ملایم و قابل استفاده روزانه، باعث اثر سریع و بدون نیاز به نسخه می‌شود.
5	4	چگونه با سبک زندگی سالم هماهنگ می‌شود؟	استفاده روزانه از محصول همراه با مراقبت‌های پایه پوست و سبک زندگی سالم باعث نتایج پایدار و حفظ شادابی طبیعی پوست می‌شود.
6	4	چرا سرمایه‌گذاری روی این محصول ارزشمند است؟	با انتخاب محصولی که رطوبت و تعادل پوست را بازمی‌گرداند، از هزینه‌های احتمالی برای درمان خشکی، التهاب و آسیب پوست جلوگیری می‌کنید؛ ارزش واقعی آن در پیشگیری و محافظت بلندمدت است.
7	5	این محصول دقیقاً چگونه عمل می‌کند؟	با ترکیب عناصر طبیعی حیاتی، تولید سلول‌های قرمز خون و گردش خون را بهینه کرده و کم‌خونی و خستگی را کاهش می‌دهد؛ انرژی و نشاط بدن سریع افزایش می‌یابد.
8	5	بر چه شواهدی تکیه دارد؟	مطالعات بالینی روی ترکیبات آهن و ویتامین B12 نشان داده‌اند که مصرف مداوم باعث افزایش هموگلوبین، بهبود گردش خون و کاهش خستگی می‌شود.
9	5	برای چه افرادی بیشترین اثر را دارد؟	افرادی که سطح انرژی پایینی دارند، کم‌خونی دارند یا نیاز به بهبود گردش خون و نشاط روزانه دارند.
10	5	چه چیزی آن را از محصولات مشابه متمایز می‌کند؟	فرمول طبیعی بدون افزودنی‌های شیمیایی و اثر سریع و قابل لمس در انرژی و شادابی، آن را از دیگر مکمل‌ها متمایز می‌کند.
11	5	چگونه با سبک زندگی سالم هماهنگ می‌شود؟	استفاده روزانه از محصول همراه با تغذیه متعادل، ورزش و خواب کافی باعث نتایج پایدار و افزایش کیفیت زندگی می‌شود.
12	5	چرا سرمایه‌گذاری روی این محصول ارزشمند است؟	با انتخاب این محصول، سلامت خون و انرژی بدن خود را تضمین می‌کنید و از هزینه‌ها و مشکلات ناشی از کم‌خونی و خستگی جلوگیری می‌کنید؛ این یک سرمایه‌گذاری بلندمدت برای سلامتی است.
13	6	این محصول دقیقاً چگونه عمل می‌کند؟	با ترکیب عصاره‌های فعال و مرطوب‌کننده‌ها، سلول‌های پوست را تغذیه کرده و بافت‌های آسیب‌دیده را بازسازی می‌کند. نتیجه کاهش خشکی و افزایش لطافت و انعطاف‌پذیری پوست است.
14	6	بر چه شواهدی تکیه دارد؟	مطالعات بالینی نشان داده‌اند که عصاره زالو و اسید هیالورونیک به بازسازی پوست و حفظ رطوبت کمک می‌کنند و ویتامین E التهاب و تحریک پوست را کاهش می‌دهد.
15	6	برای چه افرادی بیشترین اثر را دارد؟	افرادی با پوست خشک، خشن یا تحریک‌پذیر که نیاز به بازسازی و آبرسانی عمیق دارند.
16	6	چه چیزی آن را از محصولات مشابه متمایز می‌کند؟	ترکیب منحصر به فرد عصاره زالو با مرطوب‌کننده‌های عمقی و فرمولاسیون ملایم، اثر ملموس در نرمی و لطافت پوست ایجاد می‌کند.
17	6	چگونه با سبک زندگی سالم هماهنگ می‌شود؟	استفاده روزانه از محصول همراه با تغذیه مناسب، هیدراته نگه داشتن بدن و مراقبت از پوست باعث نتایج پایدار و سلامت پوست می‌شود.
18	6	چرا سرمایه‌گذاری روی این محصول ارزشمند است؟	با انتخاب این کرم، از خشکی، تحریک و آسیب پوست جلوگیری کرده و نرمی و لطافت طبیعی پوست خود را حفظ می‌کنید؛ این یک سرمایه‌گذاری مستقیم روی سلامت و زیبایی پوست است.
19	7	این محصول دقیقاً چگونه عمل می‌کند؟	ماسک با ترکیب کراتین هیدرولیز شده، روغن آرگان و پانتنول، تارهای آسیب‌دیده مو را بازسازی کرده، درخشندگی و نرمی طبیعی مو را بازمی‌گرداند و ساختار آن را تقویت می‌کند.
20	7	بر چه شواهدی تکیه دارد؟	مطالعات نشان داده‌اند که کراتین هیدرولیز شده مو را ترمیم و مقاوم می‌کند، روغن آرگان درخشندگی و رطوبت طبیعی را افزایش می‌دهد و پانتنول موها را نرم و لطیف نگه می‌دارد.
21	7	برای چه افرادی بیشترین اثر را دارد؟	افرادی با موهای خشک، آسیب‌دیده، رنگ‌شده یا دمیج که نیاز به ترمیم، نرم‌کنندگی و درخشندگی دارند.
22	7	چه چیزی آن را از محصولات مشابه متمایز می‌کند؟	ترکیب منحصر به فرد کراتین هیدرولیز شده و روغن آرگان با فرمول ملایم، اثر ملموس در بازسازی و درخشندگی مو ایجاد می‌کند.
23	7	چگونه با سبک زندگی سالم هماهنگ می‌شود؟	استفاده منظم همراه با مراقبت‌های معمول مو و تغذیه سالم باعث حفظ سلامت و زیبایی مو به صورت پایدار می‌شود.
24	7	چرا سرمایه‌گذاری روی این محصول ارزشمند است؟	این ماسک آسیب موها را کاهش داده، درخشندگی و نرمی طبیعی را بازمی‌گرداند و از موهای شکننده و خشک محافظت می‌کند؛ سرمایه‌گذاری مستقیم روی سلامت و زیبایی مو است.
25	8	این محصول دقیقاً چگونه عمل می‌کند؟	سرم با ترکیب ویتامین C، ویتامین E و پپتیدهای فعال، سلول‌های پوست را تغذیه کرده، بازسازی می‌کند و شفافیت و لطافت طبیعی آن را بازمی‌گرداند.
26	8	بر چه شواهدی تکیه دارد؟	تحقیقات نشان داده‌اند که ویتامین C باعث روشن شدن پوست، ویتامین E لطافت و انعطاف‌پذیری را افزایش می‌دهد و پپتیدها به بازسازی و کاهش خستگی پوست کمک می‌کنند.
27	8	برای چه افرادی بیشترین اثر را دارد؟	افرادی با پوست خسته، کدر یا حساس که نیاز به تغذیه عمیق، شفافیت و ترمیم سریع دارند.
28	8	چه چیزی آن را از محصولات مشابه متمایز می‌کند؟	ترکیب ویتامین‌ها و پپتیدهای فعال با فرمولاسیون ملایم و قابل اعتماد، اثر ملموس در شفافیت، لطافت و بازسازی پوست ایجاد می‌کند.
29	8	چگونه با سبک زندگی سالم هماهنگ می‌شود؟	استفاده منظم همراه با مراقبت‌های روزانه پوست و تغذیه مناسب باعث حفظ سلامت و جوانی پوست به صورت پایدار می‌شود.
30	8	چرا سرمایه‌گذاری روی این محصول ارزشمند است؟	این سرم شفافیت، لطافت و جوانی پوست را بازمی‌گرداند و نشانه‌های خستگی و کدری را کاهش می‌دهد؛ سرمایه‌گذاری مستقیم روی سلامت و زیبایی پوست است.
31	9	این محصول دقیقاً چگونه عمل می‌کند؟	شامپو با ترکیبی از روغن آرگان، کراتین هیدرولیز شده و پانتنول، تارهای مو را تغذیه، تقویت و مرطوب می‌کند و سلامت و درخشندگی طبیعی موها را بازمی‌گرداند.
32	9	بر چه شواهدی تکیه دارد؟	مطالعات نشان داده‌اند روغن آرگان باعث تقویت و محافظت مو می‌شود، کراتین هیدرولیز شده به ترمیم ساختار مو کمک می‌کند و پانتنول نرمی و لطافت را حفظ می‌کند.
33	9	برای چه افرادی بیشترین اثر را دارد؟	افرادی با موهای خشک، ضعیف یا آسیب‌دیده که نیاز به تقویت، ترمیم و بازگرداندن درخشندگی طبیعی دارند.
34	9	چه چیزی آن را از محصولات مشابه متمایز می‌کند؟	ترکیب طبیعی و گیاهی با مواد تقویتی و مرطوب‌کننده، اثر ملموس در سلامت، درخشندگی و لطافت مو ایجاد می‌کند.
35	9	چگونه با سبک زندگی سالم هماهنگ می‌شود؟	استفاده منظم همراه با مراقبت‌های روزانه مو و تغذیه مناسب باعث حفظ سلامت و زیبایی طبیعی موها به صورت پایدار می‌شود.
36	9	چرا سرمایه‌گذاری روی این محصول ارزشمند است؟	این شامپو سلامت، نرمی و درخشندگی طبیعی موها را بازمی‌گرداند و از آسیب و خشکی جلوگیری می‌کند؛ سرمایه‌گذاری مستقیم روی مراقبت و زیبایی مو است.
37	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn
38	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn
39	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn
40	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn
41	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn
42	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn
43	11	gfhgfhgfgfhgfhgf	gfhgfhgfgfhgfhgf
44	11	gfhgfhgfgfhgfhgf	gfhgfhgfgfhgfhgf
45	11	gfhgfhgfgfhgfhgf	gfhgfhgfgfhgfhgf
46	11	gfhgfhgfgfhgfhgf	gfhgfhgfgfhgfhgf
47	11	gfhgfhgfgfhgfhgf	gfhgfhgfgfhgfhgf
48	11	gfhgfhgfgfhgfhgf	gfhgfhgfgfhgfhgf
49	12	ergerg	ergerg
50	12	ergerg	ergerg
51	12	ergerg	ergerg
52	12	ergerg	ergerg
53	12	ergerg	ergerg
54	12	ergerg	ergerg
55	13	آیا بوبو نینی هست؟	بله، بوبو یک نینی کاملاً نینی و پف پفیونگ است
56	13	آیا بوبو نرمو است؟	بله، بوبو بسیار پفیونگ و نرمالو است مثل مارشمالو
57	13	نحوه نگهداری بوبو چیست؟	توت فرنگی زیاد و شکلات تلخ همراه با لازانیا و پیتزا و پاستا
58	13	کی بوبو می‌رسه به دستم؟	خیلی سریع قِل می‌خوره میاد
59	13	بوبو سینیور چنده؟	اون دیگه یه محصول جداست
60	13	چطور می‌تونم اعتماد کنم؟	بوبو فروشی اوبتوکاریو مجوز رسمی بوبو ارشادو داره
\.


--
-- Data for Name: FeedCategory; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."FeedCategory" (id, name, slug, description, "order", "createdAt", "updatedAt") FROM stdin;
1	aaa	aaa	aaa	1	2026-05-16 02:04:44.645	1969-12-31 20:30:00
2	bbb	bbb	bbb	2	2026-05-16 02:04:44.645	1969-12-31 20:30:00
3	ccc	ccc	ccc	3	2026-05-16 02:04:44.645	1969-12-31 20:30:00
4	ddd	ddd	ddd	4	2026-05-16 02:04:44.645	1969-12-31 20:30:00
\.


--
-- Data for Name: Gain; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Gain" (id, "productId", title, ingredient, description) FROM stdin;
1	4	ضد خشکی	گلیسیرین	رطوبت پوست را حفظ و خشکی را کاهش می‌دهد
2	4	افزایش لطافت	آلوئه‌ورا	پوست را نرم و انعطاف‌پذیر می‌کند
3	4	حفظ تعادل طبیعی	ویتامین E	از تحریک و التهاب پوست جلوگیری می‌کند
4	5	تقویت خون	عنصر آهن	کم‌خونی را کاهش می‌دهد
5	5	افزایش انرژی	ویتامین B12	سطح انرژی و نشاط را بالا می‌برد
6	5	بهبود گردش خون	عصاره گیاهان طبیعی	جریان خون و اکسیژن‌رسانی به بدن را بهینه می‌کند
7	6	مرطوب‌کنندگی	اسید هیالورونیک	رطوبت را در لایه‌های عمیق پوست حفظ می‌کند
8	6	افزایش انعطاف‌پذیری	عصاره زالو	پوست را نرم و قابل انعطاف می‌کند
9	6	حفظ نرمی	ویتامین E	از خشکی و تحریک پوست جلوگیری می‌کند
10	7	ترمیم تارهای آسیب‌دیده	کراتین هیدرولیز شده	ساختار مو را بازسازی و مقاومت آن را افزایش می‌دهد
11	7	افزایش درخشندگی	روغن آرگان	موها را براق و شفاف می‌کند
12	7	حفظ نرمی و لطافت	پانتنول	مو را نرم، لطیف و قابل انعطاف نگه می‌دارد
13	8	تغذیه پوست	ویتامین C	باعث افزایش شفافیت و درخشندگی پوست می‌شود
14	8	افزایش لطافت	ویتامین E	پوست را نرم و انعطاف‌پذیر می‌کند
15	8	بازسازی و ترمیم	پپتیدهای فعال	نشانه‌های خستگی و کدری پوست را کاهش می‌دهد و بافت پوست را بازسازی می‌کند
16	9	تقویت مو	روغن آرگان	مو را قوی و مقاوم می‌کند
17	9	افزایش درخشندگی	کراتین هیدرولیز شده	موها را براق و سالم می‌کند
18	9	حفظ نرمی	پانتنول	مو را نرم و لطیف نگه می‌دارد
19	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn	njlsndfjnasdjkfn
20	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn	njlsndfjnasdjkfn
21	10	njlsndfjnasdjkfn	njlsndfjnasdjkfn	njlsndfjnasdjkfn
22	11	gfhgfhgf	gfhgfhgf	gfhgfhgf
23	11	gfhgfhgf	gfhgfhgf	gfhgfhgf
24	11	gfhgfhgf	gfhgfhgf	gfhgfhgf
25	12	gergreg	ergerg	ergerg
26	12	ergerg	ergerg	ergerg
27	12	ergerg	ergerg	ergerg
28	13	very lopooo	magic bubu	niniye
29	13	very cute	magic bubu	khojhalet mokone
30	13	lopooye	lop	khordani
\.


--
-- Data for Name: HealthAssessment; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."HealthAssessment" (id, "userId", answers, "sleepScore", "nutritionScore", "activityScore", "stressScore", "beautyScore", "medicalScore", "overallScore", "healthArchetype", "readinessStage", "decisionStyle", "consistencyLevel", "motivationSource", "isActive", "completedAt", "lastViewedAt", "aiOutput", domains) FROM stdin;
cmq3xm7qi0004otuuw11ub1de	cmlwjbbwh0000ktuuynrhik9d	{"1": "۷ تا ۸ ساعت", "2": "احساس سنگینی می‌کنم، انگار اصلاً نخوابیده‌ام", "3": "بله، چندین بار", "4": "بله، هر شب", "5": "چند بار در هفته", "6": "به ندرت", "7": "۱ تا ۲ وعده", "8": "۸ لیوان یا بیشتر", "9": "گاهی نفخ یا گاز معده دارم", "10": "۳ تا ۵ بار در هفته", "11": "۱ تا ۲ روز", "12": "ورزش هوازی (دویدن، دوچرخه‌سواری، شنا)", "13": "نسبتاً فعال", "14": "خسته اما حس خوبی دارم", "15": "اغلب", "16": "تپش قلب یا تنفس سطحی", "17": "معمولاً مثبت و پایدار", "18": "نه", "19": "هفتگی", "20": "شفاف و آرام", "21": "جوش‌ها بیشتر می‌شوند", "22": "هیچ مشکلی ندارم", "23": "هر روز، چند مرحله‌ای", "24": "فشار خون بالا", "25": "بله، یک یا چند مورد", "26": "بله، دو دارو یا بیشتر", "27": "گلوتن", "28": "در یک سال گذشته"}	50	50	38	50	50	50	48	The Busy Achiever	Preparation	\N	\N	\N	t	2026-06-07 15:23:33.162	\N	\N	\N
cmq4q2dps0006kiuu4suwo0o0	cmlwjbbwh0000ktuuynrhik9d	{"state": {"flags": ["sleep_issue"], "sleep": 20, "stress": 50, "activity": 50, "nutrition": 40, "medicalRisk": 0}, "answers": {"sleep_1": "کمتر از ۵", "sleep_2": "معمولی", "sleep_3": "چند بار", "sleep_4": "گاهی", "stress_1": "کم", "stress_2": "متوسط", "stress_3": "نوسانی", "activity_1": "۳-۴", "activity_2": "قدرتی", "core_sleep": "ضعیف", "core_energy": "بسیار بالا", "core_stress": "زیاد", "nutrition_1": "کم", "nutrition_2": "زیاد", "nutrition_3": "متوسط", "core_medical": "هیچ", "core_activity": "متوسط", "core_nutrition": "سالم"}, "primaryIssue": "sleep"}	50	50	38	50	50	50	48	The Hopeful Restarter	Preparation	\N	\N	\N	t	2026-06-08 04:39:56.656	\N	\N	\N
cmq6j6xgp0004fxuuug0lnhzj	cmlwjbbwh0000ktuuynrhik9d	{"1": "پوست بهتری داشتم", "2": "افزایش انرژی", "3": "هزینه بالاست", "4": "ثابت و بالا", "7": "بیشتر از ۸ ساعت", "11": "در هر وعده غذایی", "16": "۵ روز یا بیشتر", "20": "اغلب", "21": "دل‌درد یا حالت تهوع", "22": "نوسانات روحی زیاد", "23": "به ندرت", "24": "هفتگی", "25": "خشک، پوسته‌پوسته یا دارای علائم پیری زودرس", "26": "هیچ تغییری نمی‌کند", "27": "شکنندگی ناخن", "28": "هیچ روتینی ندارم", "29": "اختلال تیروئید", "30": "مطمئن نیستم", "31": "بله، دو دارو یا بیشتر", "32": "صدف دریایی", "33": "بیشتر از ۲ سال پیش", "34": "مطمئن نیستم", "35": "هر از گاهی به سلامت خود توجه می‌کنم", "36": "بهتر از امروز", "37": "متوسط", "38": "کاملاً مطمئنم"}	63	60	67	39	23	30	54	The Self-Care Seeker	Contemplation	\N	\N	\N	t	2026-06-09 11:03:03.913	\N	\N	\N
cmq6jc0x30008fxuu5wdx8kot	cmlwjbbwh0000ktuuynrhik9d	{"1": "پوست بهتری داشتم", "2": "کاهش وزن", "3": "وقت کافی ندارم", "4": "کل روز خسته", "5": "همچنان پرانرژی هستم", "6": "بعد از ۱۵–۳۰ دقیقه جا می‌افتم", "7": "۶ تا ۷ ساعت", "8": "سرحال و آماده برای شروع روز", "9": "بله، و دوباره خوابیدن برایم سخت است", "10": "بعضی وقت‌ها", "11": "چند بار در هفته", "12": "هفته‌ای یک بار", "13": "۱ تا ۲ وعده", "14": "۸ لیوان یا بیشتر", "15": "بسیار راحت و منظم", "16": "۱ تا ۲ روز", "17": "ورزش هوازی (دویدن، دوچرخه‌سواری، شنا)", "18": "نسبتاً فعال", "19": "خسته اما حس خوبی دارم", "20": "تقریباً هر روز", "21": "سردرد یا فشار فک", "22": "گاهی بی‌حوصلگی یا تحریک‌پذیری", "23": "به ندرت", "24": "چند بار در هفته", "25": "آکنه یا جوش‌های مکرر", "26": "هیچ تغییری نمی‌کند", "27": "شکنندگی ناخن", "28": "بعضی وقت‌ها", "29": "فشار خون بالا", "30": "بله، یک یا چند مورد", "31": "بله، یک دارو", "32": "گلوتن", "33": "بیشتر از ۲ سال پیش", "34": "مطمئن نیستم", "35": "من فردی هستم که همیشه از سلامت خود مراقبت می‌کنم", "36": "بهتر از امروز", "37": "بسیار سالم", "38": "کاملاً مطمئنم"}	60	65	65	48	40	40	58	The Busy Achiever	Contemplation	\N	\N	\N	t	2026-06-09 11:07:01.671	\N	\N	\N
cmqj3ip2e0003mbuub3zo80wx	cmpplyc9l000203uu1uk7ma8x	{"1": "استرس کمتری داشتم", "2": "سلامت پوست و مو", "3": "هزینه بالاست", "4": "کل روز خسته", "5": "اصلاً نمی‌توانم تمرکز کنم", "6": "هرگز کاملاً آماده احساس نمی‌کنم", "7": "بیشتر از ۸ ساعت", "11": "به ندرت", "12": "هفته‌ای یک بار", "13": "به ندرت", "14": "کمتر از ۴ لیوان", "15": "مشکلات مزمن (IBS، یبوست یا اسهال)", "16": "به ندرت یا هرگز", "17": "هیچ‌کدام به‌صورت منظم", "18": "کم‌تحرک (کار پشت‌میزی و بیشتر نشسته)", "19": "خسته اما حس خوبی دارم", "20": "تقریباً هر روز", "21": "هیچ علامت فیزیکی ندارم", "22": "بیشتر اوقات بی‌انگیزه یا ناراحت", "23": "نه", "24": "به ندرت", "25": "قرمزی یا روزاسه", "26": "خشکی یا تشدید اگزما", "27": "موهای خشک یا آسیب‌دیده", "28": "هیچ روتینی ندارم", "29": "اختلال تیروئید", "30": "مطمئن نیستم", "31": "خیر", "32": "سویا", "33": "یادم نیست / هرگز", "34": "فعلاً آماده نیستم", "35": "سلامت در اولویت من نیست", "36": "بسیار بدتر", "37": "ناسالم", "38": "زیاد مطمئن نیستم"}	63	23	31	18	25	60	33	The Burnout Candidate	Contemplation	\N	\N	\N	t	2026-06-18 06:05:19.334	\N	{"goals": [{"goal": "شروع روز با نور طبیعی و حرکت سبک", "domain": "energy", "priority": 1}, {"goal": "جلوگیری از افت انرژی بعد از ناهار با حرکت کوتاه", "domain": "energy", "priority": 2}, {"goal": "تنظیم میان‌وعده برای تثبیت انرژی", "domain": "energy", "priority": 3}], "domains": {"sleep": {"score": 63, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 25, "status": "weak", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 17, "status": "weak", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 18, "status": "weak", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 60, "status": "moderate", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 31, "status": "weak", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 23, "status": "weak", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 20, "status": "weak", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}, "summary": "از اعتماد شما سپاسگزارم. سیستم شما نشان می‌دهد که ظرفیت خوبی برای بهبود احساس آرامش دارید.", "diagnosis": "سطح انرژی شما یک شاخص مرکزی است که بر تمام رفتارهای روزانه اثر می‌گذارد.", "keyInsight": "The system bottleneck is concentrated in the weakest domain affecting overall stability.", "causalChain": ["energy acts as system bottleneck reducing overall regulation efficiency", "this creates downstream instability in energy and stress response systems", "instability feeds back and further weakens energy performance"], "startingPoint": {"title": "شروع از energy", "description": "تمرکز اولیه باید روی اصلاح ناپایدارترین بخش سیستم باشد تا اثر زنجیره‌ای ایجاد شود.", "firstAction": "یک تغییر ۵ تا ۱۰ دقیقه‌ای مرتبط با این حوزه انجام دهید", "expectedBenefits": ["افزایش انرژی پایدار", "کاهش نوسان استرس", "بهبود کیفیت عملکرد روزانه"]}, "mainBottleneck": {"title": "energy به‌عنوان گلوگاه اصلی سیستم", "domain": "energy", "explanation": "energy پایین‌ترین سطح عملکرد را دارد و بیشترین اثر را روی کل سیستم می‌گذارد.", "affectedAreas": ["انرژی روزانه", "پاسخ به استرس", "کیفیت ریکاوری", "ثبات رفتاری"], "leverageReason": "بهبود این بخش بیشترین اثر زنجیره‌ای را روی سایر سیستم‌ها دارد."}, "readinessStage": "Contemplation", "whyThisMatters": "Small improvements in the weakest node create disproportionate improvements across the system.", "healthArchetype": "The Burnout Candidate", "priorityFactors": [{"title": "energy به‌عنوان گلوگاه اصلی", "domain": "energy", "priority": 1, "microAction": "۵ دقیقه اقدام مرتبط با این حوزه", "systemImpact": "نوسان در انرژی و استرس", "whyImportant": "این بخش بیشترین اثر را روی کل سیستم دارد", "personalImpact": "کاهش تمرکز و بهره‌وری روزانه"}, {"title": "تنظیم چرخه انرژی", "domain": "energy", "priority": 2, "microAction": "پیاده‌روی کوتاه بعد از غذا", "systemImpact": "ثبات کمتر در عملکرد روزانه", "whyImportant": "انرژی خروجی کل سیستم را کنترل می‌کند", "personalImpact": "خستگی زودهنگام"}, {"title": "کاهش استرس پایه", "domain": "stress", "priority": 3, "microAction": "تنفس عمیق ۳ دقیقه‌ای", "systemImpact": "اختلال در خواب و ریکاوری", "whyImportant": "استرس همه سیستم‌ها را تحت تاثیر قرار می‌دهد", "personalImpact": "کاهش کیفیت تصمیم‌گیری"}], "futureProjection": {"confidence": "high", "ifImproved": "Stabilizing energy initiates cascade improvement across connected health subsystems.", "ifNoChange": "Ongoing energy dysfunction maintains feedback instability across energy and stress systems.", "expectedTimeframe": "10–14 days"}}	{"sleep": {"score": 63, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 25, "status": "weak", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 17, "status": "weak", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 18, "status": "weak", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 60, "status": "moderate", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 31, "status": "weak", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 23, "status": "weak", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 20, "status": "weak", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}
cmqj3s6vn0005mbuu9hf8yk11	cmpplyc9l000203uu1uk7ma8x	{"1": "خواب بهتری داشتم", "2": "کاهش استرس", "3": "وقت کافی ندارم", "4": "کل روز خسته", "5": "همچنان پرانرژی هستم", "6": "بعد از ۱۵–۳۰ دقیقه جا می‌افتم", "7": "۶ تا ۷ ساعت", "8": "سرحال و آماده برای شروع روز", "9": "نه، خوابم پیوسته است", "11": "در هر وعده غذایی", "16": "۱ تا ۲ روز", "17": "تمرینات قدرتی", "18": "نسبتاً فعال", "19": "پرانرژی", "20": "گاهی", "21": "تپش قلب یا تنفس سطحی", "22": "معمولاً مثبت و پایدار", "23": "بعضی وقت‌ها", "24": "روزانه", "25": "شفاف و آرام", "29": "دیابت / پیش‌دیابت", "30": "خیر", "31": "بله، دو دارو یا بیشتر", "32": "صدف دریایی", "33": "بیشتر از ۲ سال پیش", "34": "احتمالاً شروع می‌کنم", "35": "من فردی هستم که همیشه از سلامت خود مراقبت می‌کنم", "36": "بهتر از امروز", "37": "بسیار سالم", "38": "کاملاً مطمئنم"}	78	60	73	83	75	30	70	The Busy Achiever	Preparation	\N	\N	\N	t	2026-06-18 06:12:42.323	\N	{"goals": [{"goal": "ثبت یک چکاپ پایه برای شناخت وضعیت بدن", "domain": "medical", "priority": 1}, {"goal": "جمع‌آوری سابقه سلامت خانوادگی", "domain": "medical", "priority": 2}, {"goal": "ثبت علائم تکرارشونده بدن در یک یادداشت", "domain": "medical", "priority": 3}], "domains": {"sleep": {"score": 78, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 75, "status": "moderate", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 62, "status": "moderate", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 83, "status": "strong", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 30, "status": "weak", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 73, "status": "moderate", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 60, "status": "moderate", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 93, "status": "strong", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}, "summary": "از اینکه این ارزیابی را کامل کردید متشکرم. پایه‌های خوبی در سلامت و زیبایی طبیعی شما دیده می‌شود.", "diagnosis": "آگاهی از وضعیت پایه بدن نقش مهمی در مدیریت بلندمدت سلامت دارد. محدودیت زمان نیاز به راه‌حل‌های بسیار کوچک و قابل اجرا دارد.", "keyInsight": "The system bottleneck is concentrated in the weakest domain affecting overall stability.", "causalChain": ["medical acts as system bottleneck reducing overall regulation efficiency", "this creates downstream instability in energy and stress response systems", "instability feeds back and further weakens medical performance"], "startingPoint": {"title": "شروع از medical", "description": "تمرکز اولیه باید روی اصلاح ناپایدارترین بخش سیستم باشد تا اثر زنجیره‌ای ایجاد شود.", "firstAction": "یک تغییر ۵ تا ۱۰ دقیقه‌ای مرتبط با این حوزه انجام دهید", "expectedBenefits": ["افزایش انرژی پایدار", "کاهش نوسان استرس", "بهبود کیفیت عملکرد روزانه"]}, "mainBottleneck": {"title": "medical به‌عنوان گلوگاه اصلی سیستم", "domain": "medical", "explanation": "medical پایین‌ترین سطح عملکرد را دارد و بیشترین اثر را روی کل سیستم می‌گذارد.", "affectedAreas": ["انرژی روزانه", "پاسخ به استرس", "کیفیت ریکاوری", "ثبات رفتاری"], "leverageReason": "بهبود این بخش بیشترین اثر زنجیره‌ای را روی سایر سیستم‌ها دارد."}, "readinessStage": "Preparation", "whyThisMatters": "Small improvements in the weakest node create disproportionate improvements across the system.", "healthArchetype": "The Busy Achiever", "priorityFactors": [{"title": "medical به‌عنوان گلوگاه اصلی", "domain": "medical", "priority": 1, "microAction": "۵ دقیقه اقدام مرتبط با این حوزه", "systemImpact": "نوسان در انرژی و استرس", "whyImportant": "این بخش بیشترین اثر را روی کل سیستم دارد", "personalImpact": "کاهش تمرکز و بهره‌وری روزانه"}, {"title": "تنظیم چرخه انرژی", "domain": "energy", "priority": 2, "microAction": "پیاده‌روی کوتاه بعد از غذا", "systemImpact": "ثبات کمتر در عملکرد روزانه", "whyImportant": "انرژی خروجی کل سیستم را کنترل می‌کند", "personalImpact": "خستگی زودهنگام"}, {"title": "کاهش استرس پایه", "domain": "stress", "priority": 3, "microAction": "تنفس عمیق ۳ دقیقه‌ای", "systemImpact": "اختلال در خواب و ریکاوری", "whyImportant": "استرس همه سیستم‌ها را تحت تاثیر قرار می‌دهد", "personalImpact": "کاهش کیفیت تصمیم‌گیری"}], "futureProjection": {"confidence": "high", "ifImproved": "Stabilizing medical initiates cascade improvement across connected health subsystems.", "ifNoChange": "Ongoing medical dysfunction maintains feedback instability across energy and stress systems.", "expectedTimeframe": "10–14 days"}}	{"sleep": {"score": 78, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 75, "status": "moderate", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 62, "status": "moderate", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 83, "status": "strong", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 30, "status": "weak", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 73, "status": "moderate", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 60, "status": "moderate", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 93, "status": "strong", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}
cmqj3x9ti000208uu3nf2yqse	cmpplyc9l000203uu1uk7ma8x	{"1": "انرژی بیشتری داشتم", "2": "کاهش وزن", "3": "وقت کافی ندارم", "4": "ثابت و بالا", "7": "بیشتر از ۸ ساعت", "11": "در هر وعده غذایی", "16": "۵ روز یا بیشتر", "20": "به ندرت", "25": "شفاف و آرام", "29": "فشار خون بالا", "30": "بله، یک یا چند مورد", "31": "بله، یک دارو", "32": "لبنیات", "33": "۱ تا ۲ سال پیش", "34": "همین امروز شروع می‌کنم", "35": "من فردی هستم که همیشه از سلامت خود مراقبت می‌کنم", "36": "تقریباً مشابه", "37": "بسیار سالم", "38": "تا حدودی مطمئنم"}	63	60	67	63	75	55	65	The Busy Achiever	Action	\N	\N	\N	t	2026-06-18 06:16:39.414	\N	{"goals": [{"goal": "ثبت یک چکاپ پایه برای شناخت وضعیت بدن", "domain": "medical", "priority": 1}, {"goal": "جمع‌آوری سابقه سلامت خانوادگی", "domain": "medical", "priority": 2}, {"goal": "ثبت علائم تکرارشونده بدن در یک یادداشت", "domain": "medical", "priority": 3}], "domains": {"sleep": {"score": 63, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 75, "status": "moderate", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 67, "status": "moderate", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 63, "status": "moderate", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 55, "status": "moderate", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 67, "status": "moderate", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 60, "status": "moderate", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 81, "status": "strong", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}, "summary": "از اینکه این ارزیابی را کامل کردید متشکرم. پایه‌های خوبی در سلامت و زیبایی طبیعی شما دیده می‌شود.", "diagnosis": "آگاهی از وضعیت پایه بدن نقش مهمی در مدیریت بلندمدت سلامت دارد. محدودیت زمان نیاز به راه‌حل‌های بسیار کوچک و قابل اجرا دارد.", "keyInsight": "The system bottleneck is concentrated in the weakest domain affecting overall stability.", "causalChain": ["medical acts as system bottleneck reducing overall regulation efficiency", "this creates downstream instability in energy and stress response systems", "instability feeds back and further weakens medical performance"], "startingPoint": {"title": "شروع از medical", "description": "تمرکز اولیه باید روی اصلاح ناپایدارترین بخش سیستم باشد تا اثر زنجیره‌ای ایجاد شود.", "firstAction": "یک تغییر ۵ تا ۱۰ دقیقه‌ای مرتبط با این حوزه انجام دهید", "expectedBenefits": ["افزایش انرژی پایدار", "کاهش نوسان استرس", "بهبود کیفیت عملکرد روزانه"]}, "mainBottleneck": {"title": "medical به‌عنوان گلوگاه اصلی سیستم", "domain": "medical", "explanation": "medical پایین‌ترین سطح عملکرد را دارد و بیشترین اثر را روی کل سیستم می‌گذارد.", "affectedAreas": ["انرژی روزانه", "پاسخ به استرس", "کیفیت ریکاوری", "ثبات رفتاری"], "leverageReason": "بهبود این بخش بیشترین اثر زنجیره‌ای را روی سایر سیستم‌ها دارد."}, "readinessStage": "Action", "whyThisMatters": "Small improvements in the weakest node create disproportionate improvements across the system.", "healthArchetype": "The Busy Achiever", "priorityFactors": [{"title": "medical به‌عنوان گلوگاه اصلی", "domain": "medical", "priority": 1, "microAction": "۵ دقیقه اقدام مرتبط با این حوزه", "systemImpact": "نوسان در انرژی و استرس", "whyImportant": "این بخش بیشترین اثر را روی کل سیستم دارد", "personalImpact": "کاهش تمرکز و بهره‌وری روزانه"}, {"title": "تنظیم چرخه انرژی", "domain": "energy", "priority": 2, "microAction": "پیاده‌روی کوتاه بعد از غذا", "systemImpact": "ثبات کمتر در عملکرد روزانه", "whyImportant": "انرژی خروجی کل سیستم را کنترل می‌کند", "personalImpact": "خستگی زودهنگام"}, {"title": "کاهش استرس پایه", "domain": "stress", "priority": 3, "microAction": "تنفس عمیق ۳ دقیقه‌ای", "systemImpact": "اختلال در خواب و ریکاوری", "whyImportant": "استرس همه سیستم‌ها را تحت تاثیر قرار می‌دهد", "personalImpact": "کاهش کیفیت تصمیم‌گیری"}], "futureProjection": {"confidence": "medium", "ifImproved": "Stabilizing medical initiates cascade improvement across connected health subsystems.", "ifNoChange": "Ongoing medical dysfunction maintains feedback instability across energy and stress systems.", "expectedTimeframe": "5–10 days"}}	{"sleep": {"score": 63, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 75, "status": "moderate", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 67, "status": "moderate", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 63, "status": "moderate", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 55, "status": "moderate", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 67, "status": "moderate", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 60, "status": "moderate", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 81, "status": "strong", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}
cmqj4j1wb000408uu0vwz4pne	cmpplyc9l000203uu1uk7ma8x	{"1": "وزن کم می‌کردم", "2": "طول عمر و پیشگیری", "3": "انرژی کافی ندارم", "4": "ثابت و بالا", "7": "۷ تا ۸ ساعت", "8": "سرحال و آماده برای شروع روز", "11": "چند بار در هفته", "12": "چند بار در هفته", "13": "۳ تا ۴ وعده", "14": "۸ لیوان یا بیشتر", "15": "بسیار راحت و منظم", "16": "۱ تا ۲ روز", "17": "پیاده‌روی", "18": "نسبتاً فعال", "19": "پرانرژی", "20": "گاهی", "21": "دل‌درد یا حالت تهوع", "22": "گاهی بی‌حوصلگی یا تحریک‌پذیری", "23": "بله، روزانه", "24": "چند بار در هفته", "25": "جوش‌های گاه‌به‌گاه", "26": "خشکی یا تشدید اگزما", "27": "نازک شدن یا ریزش مو", "28": "هر روز، چند مرحله‌ای", "29": "کلسترول بالا", "30": "بله، یک یا چند مورد", "31": "بله، دو دارو یا بیشتر", "32": "لبنیات", "33": "در یک سال گذشته", "34": "همین امروز شروع می‌کنم", "35": "من فردی هستم که همیشه از سلامت خود مراقبت می‌کنم", "36": "کمی بدتر", "37": "بسیار سالم", "38": "کاملاً مطمئنم"}	71	77	63	78	85	60	73	The Busy Achiever	Action	\N	\N	\N	t	2026-06-18 06:33:35.579	\N	{"goals": [{"goal": "ثبت یک چکاپ پایه برای شناخت وضعیت بدن", "domain": "medical", "priority": 1}, {"goal": "جمع‌آوری سابقه سلامت خانوادگی", "domain": "medical", "priority": 2}, {"goal": "ثبت علائم تکرارشونده بدن در یک یادداشت", "domain": "medical", "priority": 3}], "domains": {"sleep": {"score": 71, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 85, "status": "strong", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 67, "status": "moderate", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 78, "status": "moderate", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 60, "status": "moderate", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 63, "status": "moderate", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 77, "status": "moderate", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 84, "status": "strong", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}, "summary": "از اینکه این ارزیابی را کامل کردید متشکرم. پایه‌های خوبی در سلامت و زیبایی طبیعی شما دیده می‌شود.", "diagnosis": "آگاهی از وضعیت پایه بدن نقش مهمی در مدیریت بلندمدت سلامت دارد. کمبود انرژی نشان می‌دهد باید ابتدا روی بازیابی سیستم تمرکز شود.", "keyInsight": "The system bottleneck is concentrated in the weakest domain affecting overall stability.", "causalChain": ["medical acts as system bottleneck reducing overall regulation efficiency", "this creates downstream instability in energy and stress response systems", "instability feeds back and further weakens medical performance"], "startingPoint": {"title": "شروع از medical", "description": "تمرکز اولیه باید روی اصلاح ناپایدارترین بخش سیستم باشد تا اثر زنجیره‌ای ایجاد شود.", "firstAction": "یک تغییر ۵ تا ۱۰ دقیقه‌ای مرتبط با این حوزه انجام دهید", "expectedBenefits": ["افزایش انرژی پایدار", "کاهش نوسان استرس", "بهبود کیفیت عملکرد روزانه"]}, "mainBottleneck": {"title": "medical به‌عنوان گلوگاه اصلی سیستم", "domain": "medical", "explanation": "medical پایین‌ترین سطح عملکرد را دارد و بیشترین اثر را روی کل سیستم می‌گذارد.", "affectedAreas": ["انرژی روزانه", "پاسخ به استرس", "کیفیت ریکاوری", "ثبات رفتاری"], "leverageReason": "بهبود این بخش بیشترین اثر زنجیره‌ای را روی سایر سیستم‌ها دارد."}, "readinessStage": "Action", "whyThisMatters": "Small improvements in the weakest node create disproportionate improvements across the system.", "healthArchetype": "The Busy Achiever", "priorityFactors": [{"title": "medical به‌عنوان گلوگاه اصلی", "domain": "medical", "priority": 1, "microAction": "۵ دقیقه اقدام مرتبط با این حوزه", "systemImpact": "نوسان در انرژی و استرس", "whyImportant": "این بخش بیشترین اثر را روی کل سیستم دارد", "personalImpact": "کاهش تمرکز و بهره‌وری روزانه"}, {"title": "تنظیم چرخه انرژی", "domain": "energy", "priority": 2, "microAction": "پیاده‌روی کوتاه بعد از غذا", "systemImpact": "ثبات کمتر در عملکرد روزانه", "whyImportant": "انرژی خروجی کل سیستم را کنترل می‌کند", "personalImpact": "خستگی زودهنگام"}, {"title": "کاهش استرس پایه", "domain": "stress", "priority": 3, "microAction": "تنفس عمیق ۳ دقیقه‌ای", "systemImpact": "اختلال در خواب و ریکاوری", "whyImportant": "استرس همه سیستم‌ها را تحت تاثیر قرار می‌دهد", "personalImpact": "کاهش کیفیت تصمیم‌گیری"}], "futureProjection": {"confidence": "medium", "ifImproved": "Stabilizing medical initiates cascade improvement across connected health subsystems.", "ifNoChange": "Ongoing medical dysfunction maintains feedback instability across energy and stress systems.", "expectedTimeframe": "5–10 days"}}	{"sleep": {"score": 71, "status": "moderate", "insight": "Sleep quality regulates systemic recovery and energy restoration.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "sleep acts as a system regulator influencing downstream health stability", "whatDrivesIt": "sleep is driven by upstream behavioral and physiological inputs", "whatItAffects": "sleep influences energy regulation, stress response, and recovery balance"}, "beauty": {"score": 85, "status": "strong", "insight": "Beauty reflects downstream systemic health signals.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "beauty acts as a system regulator influencing downstream health stability", "whatDrivesIt": "beauty is driven by upstream behavioral and physiological inputs", "whatItAffects": "beauty influences energy regulation, stress response, and recovery balance"}, "energy": {"score": 67, "status": "moderate", "insight": "Energy is the central output metric of the health system.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "energy acts as a system regulator influencing downstream health stability", "whatDrivesIt": "energy is driven by upstream behavioral and physiological inputs", "whatItAffects": "energy influences energy regulation, stress response, and recovery balance"}, "stress": {"score": 78, "status": "moderate", "insight": "Stress modulates all downstream physiological responses.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "stress acts as a system regulator influencing downstream health stability", "whatDrivesIt": "stress is driven by upstream behavioral and physiological inputs", "whatItAffects": "stress influences energy regulation, stress response, and recovery balance"}, "medical": {"score": 60, "status": "moderate", "insight": "Medical baseline defines system constraints and risk boundaries.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "medical acts as a system regulator influencing downstream health stability", "whatDrivesIt": "medical is driven by upstream behavioral and physiological inputs", "whatItAffects": "medical influences energy regulation, stress response, and recovery balance"}, "activity": {"score": 63, "status": "moderate", "insight": "Activity regulates metabolic flow and stress buffering.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "activity acts as a system regulator influencing downstream health stability", "whatDrivesIt": "activity is driven by upstream behavioral and physiological inputs", "whatItAffects": "activity influences energy regulation, stress response, and recovery balance"}, "nutrition": {"score": 77, "status": "moderate", "insight": "Nutrition acts as the primary input for energy availability.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "nutrition acts as a system regulator influencing downstream health stability", "whatDrivesIt": "nutrition is driven by upstream behavioral and physiological inputs", "whatItAffects": "nutrition influences energy regulation, stress response, and recovery balance"}, "behavioral": {"score": 84, "status": "strong", "insight": "Behavioral stability determines system consistency.", "microAction": "Take a 5–10 minute corrective action targeting this domain", "roleInSystem": "behavioral acts as a system regulator influencing downstream health stability", "whatDrivesIt": "behavioral is driven by upstream behavioral and physiological inputs", "whatItAffects": "behavioral influences energy regulation, stress response, and recovery balance"}}
\.


--
-- Data for Name: HealthRecommendation; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."HealthRecommendation" (id, "healthAssessmentId", "productId", reason, domain, priority, "createdAt", "recommendationBatchId") FROM stdin;
cmq3xm7r50005otuuqby4yjbu	cmq3xm7qi0004otuuw11ub1de	8	برای افزایش تحرک و بهبود سلامت جسمانی شما	activity	1	2026-06-07 15:23:33.185	\N
cmq4q2dqs0007kiuun32rvxie	cmq4q2dps0006kiuu4suwo0o0	8	برای افزایش تحرک و بهبود سلامت جسمانی شما	activity	1	2026-06-08 04:39:56.692	\N
cmq6j6xia0005fxuuaua5p85c	cmq6j6xgp0004fxuuug0lnhzj	8	برای تقویت زیبایی طبیعی و درخشندگی پوست و موی شما	beauty	1	2026-06-09 11:03:03.97	\N
\.


--
-- Data for Name: Icon; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Icon" (id, "productId", title, description, "iconPath") FROM stdin;
1	4	استفاده آسان	بدون نیاز به نسخه و آماده مصرف روزانه	
2	4	ملایم و ایمن	فرمولاسیون مناسب برای پوست حساس	
3	4	اثر سریع	نتایج محسوس در رطوبت و نرمی پوست	
4	5	غنی از عناصر حیاتی	با مواد طبیعی و بدون افزودنی‌های شیمیایی	
5	5	اثر ملموس	حس انرژی و شادابی را سریع افزایش می‌دهد	
6	5	ایمن و قابل اعتماد	مناسب مصرف روزانه و برای تمام سنین	
7	6	بازسازی پوست	ترمیم بافت‌های آسیب‌دیده و نرم کردن پوست	
8	6	ملایم و ایمن	فرمولاسیون مناسب برای انواع پوست	
9	6	آبرسانی عمیق	رطوبت پوست را حفظ می‌کند و از خشکی جلوگیری می‌کند	
10	7	بازسازی عمیق	ترمیم تارهای آسیب‌دیده و تقویت ساختار مو	
11	7	درخشان و نرم	موها را براق، لطیف و قابل مدیریت می‌کند	
12	7	استفاده آسان	قابل استفاده بعد از شست‌وشوی مو	
13	8	تغذیه عمیق	مواد مغذی و ویتامین‌ها پوست را احیا می‌کنند	
14	8	شفافیت و جوانی	باعث روشن شدن و شادابی پوست می‌شود	
15	8	ایمن و ملایم	مناسب پوست‌های حساس و تحریک‌پذیر	
16	9	پاکسازی ملایم	پوست سر را تمیز و بدون خشکی نگه می‌دارد	
17	9	تقویت مو	موها را نرم و قوی می‌کند	
18	9	درخشان و قابل مدیریت	موها را براق، سالم و قابل حالت‌دهی نگه می‌دارد	
19	10		njlsndfjnasdjkfn	images.png
20	10		njlsndfjnasdjkfn	images (1).png
21	10		njlsndfjnasdjkfn	images (2).png
22	11		gfhgfhgf	
23	11		gfhgfhgf	
24	11		gfhgfhgf	
25	12	asd	gfs	/uploads/blogs/5098242b-d936-44ac-bd92-21261a19778f.png
26	12	ert	hre	/uploads/blogs/bbb3aea0-c135-4f7e-8537-f35491a455a7.png
27	12	tehte	k8yi8	/uploads/blogs/7acae75e-8bab-4f6e-95ed-ee4a9fe9b4cd.png
28	13	khodo	khodo	/uploads/blogs/936740ae-efe3-4c08-97e5-babba6846b4c.png
29	13	khodo	khodo	/uploads/blogs/47ba2763-ab82-45af-b0be-9c81e2680f6a.png
30	13	khodo	khodo	/uploads/blogs/c3c6edf0-919c-48d8-8c2d-2569a43eabb2.png
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Order" (id, "userId", "cartId", "totalPrice", status, "createdAt", "shippingAddress", "shippingCity", "shippingEmail", "shippingFirstName", "shippingLastName", "shippingNotes", "shippingPhone", "shippingPostalCode", "shippingProvince", "canceledAt", "cancellationReason", "paymentAuthority", "paymentErrorMessage", "paymentMethod", "paymentRefId", "paymentRequestedAt", "paymentVerifiedAt", "refundReason", "refundedAt", "updatedAt") FROM stdin;
cmpd2xunj0003z6uu5vkkrcwt	cmlwjbbwh0000ktuuynrhik9d	cmpd2xlx80002z6uuyr012wb3	11357800	PENDING	2026-05-19 20:22:47.407	asdasdasdasd	خلخال	asd@asd.com	سارا	سارا		09129212536	1234567891	اردبیل	\N	\N	\N	\N	zarinpal	\N	\N	\N	\N	\N	2026-05-19 20:22:47.407
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price, "createdAt") FROM stdin;
43	cmpd2xunj0003z6uu5vkkrcwt	12	1	10000000	2026-05-19 20:22:47.407
44	cmpd2xunj0003z6uu5vkkrcwt	8	1	420000	2026-05-19 20:22:47.407
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Product" (id, title, price, image, description, "createdAt", "updatedAt", slug, solution, "categoryId", "isActive", "feedCategoryId") FROM stdin;
13	خودووووووو بوبو	999999999	/uploads/blogs/d8af41d9-3dc7-497d-a658-e0dc28ce72a0.jpeg	very very khodo bubu	2026-05-21 11:26:41.243	2026-05-21 11:48:29.807	khodo-bubu	خودووووووو	2	f	1
8	سرم ویتامینه ویتال‌درم	420000	/images/product-five.svg	سرم ویتامینه پوست را تغذیه و بازسازی می‌کند و شفافیت، لطافت و جوانی طبیعی آن را افزایش می‌دهد.	2026-02-20 08:17:52.039	2026-05-15 22:36:14.188	سرم-ویتامینه-ویتالدرم	پوست کدر و خسته را سریع شفاف و جوان می‌کند	3	t	1
9	شامپو گیاهی ویتال‌درم	86000	/images/product-six.svg	شامپو گیاهی موها را پاکسازی کرده، سلامت پوست سر را حفظ می‌کند و نرمی و درخشندگی طبیعی موها را بازمی‌گرداند.	2026-02-20 08:17:52.047	2026-05-15 22:36:21.167	شامپو-گیاهی-ویتالدرم	موهای ضعیف و خشک را سریع سالم و نرم می‌کند	4	t	2
10	njlsndfjnasdjkfn	120000		njlsndfjnasdjkfnnjlsndfjnasdjkfnnjlsndfjnasdjkfnnjlsndfjnasdjkfn	2026-02-20 08:31:29.484	2026-05-15 22:36:32.968	njlsndfjnasdjkfn-njlsndfjnasdjkfn	njlsndfjnasdjkfn	3	t	3
7	ماسک مو ترمیمی ویتال‌درم	99000	/images/product-four.svg	ماسک مو ترمیمی تارهای آسیب‌دیده مو را بازسازی کرده و درخشندگی، نرمی و مقاومت طبیعی را بازمی‌گرداند.	2026-02-20 08:17:52.031	2026-05-05 12:24:17.855	ماسک-مو-ترمیمی-ویتالدرم	موهای آسیب‌دیده را سریع ترمیم و درخشان می‌کند	3	f	1
6	کرم ترمیمی زالو ویتال‌درم	233000	/images/product-three.svg	کرم ترمیمی زالو با عصاره‌های فعال، پوست را مرطوب و بازسازی می‌کند و لطافت و انعطاف‌پذیری طبیعی را حفظ می‌نماید.	2026-02-20 08:17:52.023	2026-05-03 12:43:04.713	کرم-ترمیمی-زالو-ویتالدرم	خشکی و خشن بودن پوست را کاهش می‌دهد و نرمی و لطافت بازمی‌گرداند	1	f	2
5	عرق خونساز طبیعی ویتال‌درم	543000	/images/product-two.svg	عرق خونساز ویتال‌درم با فرمولی طبیعی و غنی از عناصر حیاتی، به تقویت خون و بهبود گردش خون کمک می‌کند و انرژی و نشاط شما را افزایش می‌دهد.	2026-02-20 08:17:52.013	2026-05-03 12:42:04.699	عرق-خونساز-طبیعی-ویتالدرم	کم‌خونی و خستگی را کاهش می‌دهد و سطح انرژی بدن را سریع بهبود می‌بخشد	2	f	3
4	کرم آبرسان عمقی ویتال‌درم	320000	/images/product-one.svg	کرم ویتال‌درم با ترکیبی از عصاره‌های گیاهی فعال و ویتامین‌های ضروری، رطوبت عمقی پوست را بازیابی می‌کند و از خشکی، خستگی و تحریک‌پذیری پوست جلوگیری می‌کند.	2026-02-20 08:17:51.994	2026-05-03 12:41:56.901	کرم-آبرسان-عمقی-ویتالدرم	خشکی پوست را سریع رفع کرده و نرمی، شادابی و تعادل طبیعی پوست را بازمی‌گرداند	1	f	4
12	wow	10000000	/uploads/blogs/0cb2db5a-ceb9-466b-a411-c2893713b87d.jpg	sooooo helpful	2026-05-19 14:24:39.417	2026-05-19 14:35:53.781	amazing	this helps a lot	2	t	1
11	gfhgfhgf	330000		gfhgfhgfgfhgfhgfgfhgfhgfgfhgfhgf	2026-02-21 09:43:09.915	2026-05-19 14:57:36.437	gfhgfhgfgfhgfhgf	gfhgfhgf	4	f	4
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."Subscription" (id, email, "createdAt", "updatedAt") FROM stdin;
cmpa9zlin0009k7uuxq0rxelt	asd@asd.com	2026-05-17 21:16:47.663	2026-05-17 21:16:47.663
cmpaa0jl9000bk7uuq6qcti9v	aeee@asd.com	2026-05-17 21:17:31.821	2026-05-17 21:17:31.821
cmpaaelm2000dk7uucboftaz9	rrr@asd.com	2026-05-17 21:28:27.626	2026-05-17 21:28:27.626
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."User" (id, "createdAt", "updatedAt", email, phone, role, "firstName", "lastName") FROM stdin;
cmou0kipp0002bmuuz5ozf10r	2026-05-06 12:08:48.829	2026-05-06 12:08:48.829	\N	09129212538	USER	\N	\N
cmlwjbbwh0000ktuuynrhik9d	2026-02-21 16:29:58.145	2026-05-11 23:26:21.373	asd@asd.com	09129212536	ADMIN	امیر	امیر
cmpplyc9l000203uu1uk7ma8x	2026-05-28 14:48:17.049	2026-05-28 14:48:17.049	ashkanebtekari@gmail.com	\N	USER	\N	\N
\.


--
-- Data for Name: VisitMonth; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public."VisitMonth" (id, year, month, visits, "updatedAt") FROM stdin;
cmq3wvls90000byuuo5hkxlli	2026	6	66	2026-06-18 06:31:54.712
cmoofjaxn0000b8uulg6p0ycr	2026	5	3039	2026-05-28 19:00:49.608
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: ashkan
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
742156e8-261c-48fa-aa11-f2251342f1f3	959dc054bf76b53fe565cd82f28d9903d9e8a2825ea11062ead788dfa19b5542	2026-02-15 00:40:51.339135+03:30	20251215073839_init	\N	\N	2026-02-15 00:40:51.336034+03:30	1
d5e357e5-f506-4f75-ae1b-564440926cf0	386bad87dc551cbd6f32f5506837c47272c7c481bb203915355c97fe94ef5a90	2026-02-15 00:40:51.383918+03:30	20251223101434_add_phone_email_to_user	\N	\N	2026-02-15 00:40:51.375264+03:30	1
f54293ba-3b79-4a43-b818-b33e70e135ee	152c62245dd2bb9b08764d813fe33451a23120d1bce92ae180ebdb93f0605264	2026-02-15 00:40:51.343091+03:30	20251216115450_add_products	\N	\N	2026-02-15 00:40:51.339452+03:30	1
17885b45-882c-455e-916b-7d433afecf00	0768f79bc1154db518a5dc2b141718ef49f8d146997fffde62e28eed72e0e03f	2026-02-15 00:40:51.344856+03:30	20251216125410_add_unique_title	\N	\N	2026-02-15 00:40:51.343477+03:30	1
4c3c0e8f-2f9d-4340-a775-f5ea71980661	e23eedf9b4ea40b79098e1029d739198e329d1faf3c78911b80b194e6cfd422f	2026-02-15 00:40:51.348469+03:30	20251216133732_add_blog_model	\N	\N	2026-02-15 00:40:51.345229+03:30	1
4795198e-a3ed-4399-bba7-c6dbbd8fe971	b61784693dd2a32daf7399ae0858dcaa03cd00c81036ec470b0162c9592ac9a4	2026-02-15 00:40:51.385283+03:30	20251223121352_add_category_icon_path	\N	\N	2026-02-15 00:40:51.384298+03:30	1
e1d60574-b295-4311-9593-dfbae17279e7	d741acfed971997fdcfc4f6c45797a564693eabb9616470ceae70dfa86aa0897	2026-02-15 00:40:51.349948+03:30	20251216134921_add_blog_model	\N	\N	2026-02-15 00:40:51.348835+03:30	1
d18a7a5e-3766-47b3-8d5b-c315833e6c1e	4255f39d37badbe3249a9ea684a59fef3c64adff69e573e243941a496599f86f	2026-02-15 00:40:51.351611+03:30	20251217155022_add_slug_to_product	\N	\N	2026-02-15 00:40:51.35032+03:30	1
2dc1173d-bda8-4fce-abd7-01c989df9992	4c47596ea398d97ac428ea271db83b41db4379ab2e3e17c3d94b65e8e93bdbac	2026-02-15 00:40:51.352978+03:30	20251217160348_make_slug_required	\N	\N	2026-02-15 00:40:51.351948+03:30	1
1b0c5506-316e-450c-8a07-9d28c2332950	04d6ee553bcadcf6179ec1f9b25b3ece488d5c8093f68121ab81e57f87304b77	2026-02-15 00:40:51.386301+03:30	20251223121909_make_icon_path_required	\N	\N	2026-02-15 00:40:51.385539+03:30	1
6ce60667-271e-4286-9b7e-37e954ff26a4	639bebd095aee632c350532d59dc3207a2cad4bfe94092cbe1761b77ade4a787	2026-02-15 00:40:51.3543+03:30	20251217170446_make_solution_required	\N	\N	2026-02-15 00:40:51.353314+03:30	1
a9dac977-afe7-48f2-a3aa-cf99fcafa437	b971d3ffe77f785862a14a8e4056d530663c2db36989eed329b8361ffbeff440	2026-02-15 00:40:51.355499+03:30	20251217171017_make_solution_required	\N	\N	2026-02-15 00:40:51.354586+03:30	1
19704d5d-7c20-46c6-bbaf-efa9a8f127b1	abde6b594bfdb77f1997c58bdfb6ad998ffb1bc946117d38c496fdaa9baeb652	2026-02-15 00:40:51.365036+03:30	20251219115351_add_product_details	\N	\N	2026-02-15 00:40:51.355875+03:30	1
a5e27904-6951-4ba0-8bcb-414e1abcf56d	ea849fce303ea3a54781655a61538acd45a79eb0400dbad1e9de2d9c5c46d22a	2026-02-15 00:40:51.387407+03:30	20260212192756_add_user_role	\N	\N	2026-02-15 00:40:51.386581+03:30	1
bb9eef0a-6389-48e0-a7c4-30b3db3179b2	99d2bb2b5aeedf0f2aecf0f660e7d2e8b389fada01ef9f3c46b252b634764a68	2026-02-15 00:40:51.369381+03:30	20251219120306_add_icon_path_to_icon	\N	\N	2026-02-15 00:40:51.365365+03:30	1
7fa23146-a4df-4b55-a4f7-cf623fb71a8d	411010ff62edc7ba4ac2562c845fb06915f6a2fac6e3634fda43ec43f200b19b	2026-02-15 00:40:51.372146+03:30	20251219122002_add_category_to_product	\N	\N	2026-02-15 00:40:51.369677+03:30	1
931be77d-4449-42d8-a384-15b1fdb3dee5	fc748125ff05c1cdf192bb2de695c972758b8ed1337a1fb0684149902c12adf8	2026-02-15 00:40:51.374906+03:30	20251219122522_make_category_id_required	\N	\N	2026-02-15 00:40:51.372458+03:30	1
e0857b2c-27cc-431c-849d-25ed9a05ecaf	89830280fac37307eb3539ebfea4830b2f04aa1e47b70c6240032d3e9711c740	2026-02-21 16:44:46.326657+03:30	20260221131446_add_order_items_and_shipping	\N	\N	2026-02-21 16:44:46.322228+03:30	1
6bfac747-827e-43c3-9212-69caf01c0e87	8ad3f0b9336bdd208e90e87478219452243642724a056eed62e18800c25c5528	2026-05-02 14:17:38.373622+03:30	20260502104738_add_monthly_visits	\N	\N	2026-05-02 14:17:38.365177+03:30	1
210baa27-7404-4916-a61f-385baf02f5fa	65149a98677dda5850bda4fe3f9fb2c6b7feb3a209265407f5f36b28db54b1f9	2026-05-03 16:09:54.062552+03:30	20260503123954_add_is_active_to_products	\N	\N	2026-05-03 16:09:54.060808+03:30	1
7f996d3d-5048-4995-8dfe-084c20908b81	f3de07da9755e9c023af1517b4ba82b1922bfb9a826a9f534c75b6a28fefd9bd	2026-05-06 12:33:04.066828+03:30	20260506090304_add_address_model	\N	\N	2026-05-06 12:33:04.060638+03:30	1
\.


--
-- Name: AiResponse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."AiResponse_id_seq"', 6, true);


--
-- Name: Blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."Blog_id_seq"', 11, true);


--
-- Name: CartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."CartItem_id_seq"', 111, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."Category_id_seq"', 1, false);


--
-- Name: Faq_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."Faq_id_seq"', 60, true);


--
-- Name: FeedCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."FeedCategory_id_seq"', 4, true);


--
-- Name: Gain_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."Gain_id_seq"', 30, true);


--
-- Name: Icon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."Icon_id_seq"', 30, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 44, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ashkan
--

SELECT pg_catalog.setval('public."Product_id_seq"', 13, true);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: AiResponse AiResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."AiResponse"
    ADD CONSTRAINT "AiResponse_pkey" PRIMARY KEY (id);


--
-- Name: Blog Blog_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Blog"
    ADD CONSTRAINT "Blog_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Faq Faq_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Faq"
    ADD CONSTRAINT "Faq_pkey" PRIMARY KEY (id);


--
-- Name: FeedCategory FeedCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."FeedCategory"
    ADD CONSTRAINT "FeedCategory_pkey" PRIMARY KEY (id);


--
-- Name: Gain Gain_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Gain"
    ADD CONSTRAINT "Gain_pkey" PRIMARY KEY (id);


--
-- Name: HealthAssessment HealthAssessment_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."HealthAssessment"
    ADD CONSTRAINT "HealthAssessment_pkey" PRIMARY KEY (id);


--
-- Name: HealthRecommendation HealthRecommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."HealthRecommendation"
    ADD CONSTRAINT "HealthRecommendation_pkey" PRIMARY KEY (id);


--
-- Name: Icon Icon_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Icon"
    ADD CONSTRAINT "Icon_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VisitMonth VisitMonth_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."VisitMonth"
    ADD CONSTRAINT "VisitMonth_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Address_userId_idx; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE INDEX "Address_userId_idx" ON public."Address" USING btree ("userId");


--
-- Name: Blog_slug_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Blog_slug_key" ON public."Blog" USING btree (slug);


--
-- Name: Blog_title_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Blog_title_key" ON public."Blog" USING btree (title);


--
-- Name: CartItem_cartId_productId_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON public."CartItem" USING btree ("cartId", "productId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: FeedCategory_name_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "FeedCategory_name_key" ON public."FeedCategory" USING btree (name);


--
-- Name: FeedCategory_slug_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "FeedCategory_slug_key" ON public."FeedCategory" USING btree (slug);


--
-- Name: HealthAssessment_healthArchetype_idx; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE INDEX "HealthAssessment_healthArchetype_idx" ON public."HealthAssessment" USING btree ("healthArchetype");


--
-- Name: HealthAssessment_overallScore_idx; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE INDEX "HealthAssessment_overallScore_idx" ON public."HealthAssessment" USING btree ("overallScore");


--
-- Name: HealthAssessment_readinessStage_idx; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE INDEX "HealthAssessment_readinessStage_idx" ON public."HealthAssessment" USING btree ("readinessStage");


--
-- Name: HealthAssessment_userId_idx; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE INDEX "HealthAssessment_userId_idx" ON public."HealthAssessment" USING btree ("userId");


--
-- Name: HealthRecommendation_healthAssessmentId_idx; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE INDEX "HealthRecommendation_healthAssessmentId_idx" ON public."HealthRecommendation" USING btree ("healthAssessmentId");


--
-- Name: HealthRecommendation_healthAssessmentId_productId_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "HealthRecommendation_healthAssessmentId_productId_key" ON public."HealthRecommendation" USING btree ("healthAssessmentId", "productId");


--
-- Name: HealthRecommendation_productId_idx; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE INDEX "HealthRecommendation_productId_idx" ON public."HealthRecommendation" USING btree ("productId");


--
-- Name: Order_cartId_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Order_cartId_key" ON public."Order" USING btree ("cartId");


--
-- Name: Order_paymentAuthority_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Order_paymentAuthority_key" ON public."Order" USING btree ("paymentAuthority");


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Product_title_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Product_title_key" ON public."Product" USING btree (title);


--
-- Name: Subscription_email_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "Subscription_email_key" ON public."Subscription" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: VisitMonth_year_month_key; Type: INDEX; Schema: public; Owner: ashkan
--

CREATE UNIQUE INDEX "VisitMonth_year_month_key" ON public."VisitMonth" USING btree (year, month);


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AiResponse AiResponse_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."AiResponse"
    ADD CONSTRAINT "AiResponse_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AiResponse AiResponse_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."AiResponse"
    ADD CONSTRAINT "AiResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Faq Faq_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Faq"
    ADD CONSTRAINT "Faq_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Gain Gain_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Gain"
    ADD CONSTRAINT "Gain_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: HealthAssessment HealthAssessment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."HealthAssessment"
    ADD CONSTRAINT "HealthAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HealthRecommendation HealthRecommendation_healthAssessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."HealthRecommendation"
    ADD CONSTRAINT "HealthRecommendation_healthAssessmentId_fkey" FOREIGN KEY ("healthAssessmentId") REFERENCES public."HealthAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HealthRecommendation HealthRecommendation_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."HealthRecommendation"
    ADD CONSTRAINT "HealthRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Icon Icon_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Icon"
    ADD CONSTRAINT "Icon_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_feedCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ashkan
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_feedCategoryId_fkey" FOREIGN KEY ("feedCategoryId") REFERENCES public."FeedCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

