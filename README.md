# 🧠 LinkedIn Post Generator

A simple AI-powered SaaS that generates high-quality, LinkedIn-ready posts based on a topic and tone of your choice — powered by **Cohere AI**, **Supabase Auth**, and **Next.js**.

## ✨ Features

- 🔐 User authentication via **Supabase Magic Link**
- 🧠 AI-generated posts using **Cohere's Command model**
- 📄 Customizable tone and topic inputs
- 💾 Save generated posts to **Supabase DB** (RLS secured)
- 📋 One-click **copy to clipboard**
- 🧑‍💻 Built with **TypeScript**, **Tailwind CSS**, and **Next.js**
- 🧱 Optional: Post dashboard with history

---

## 🖥️ Tech Stack

| Layer      | Tech                      |
| ---------- | ------------------------- |
| Frontend   | Next.js + TypeScript      |
| Styling    | Tailwind CSS              |
| Auth       | Supabase (email OTP)      |
| Backend DB | Supabase PostgreSQL + RLS |
| AI Engine  | Cohere AI (Command Model) |
| Deployment | Vercel (recommended)      |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/linkedin-post-generator.git
cd linkedin-post-generator
```
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_COHERE_API_KEY=your-cohere-key
```

Get your keys from:

- [Supabase Project Settings](https://app.supabase.com)
- [Cohere API Dashboard](https://dashboard.cohere.ai/)

---

## 🧪 Run Locally

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧠 How It Works

1. User logs in with email (magic link)
2. Inputs a **topic** and selects a **tone**
3. App calls **Cohere** to generate a LinkedIn-style post
4. Post is displayed and **saved to Supabase**
5. User can **copy or manage** their generated posts

---

## 📸 Screenshots

> (Add screenshots here once the UI is ready!)

---

## 🔒 Database Schema (Posts)

| Field        | Type      | Description            |
| ------------ | --------- | ---------------------- |
| `id`         | UUID      | Primary key            |
| `user_id`    | UUID      | Supabase Auth user ID  |
| `topic`      | Text      | Post topic             |
| `tone`       | Text      | Writing tone           |
| `content`    | Text      | Generated post content |
| `created_at` | Timestamp | Auto-generated         |

**RLS** policies restrict access so users only read/write their own posts.

---

## 🛡️ Security

- Supabase RLS (Row-Level Security) enforces access control
- JWT-based user identification via `auth.uid()`
- Frontend cannot spoof another user's `user_id`

---

## 📦 Deploy to Vercel

1. Push your repo to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import the repo
4. Add environment variables
5. Hit **Deploy**

---

## 📈 Roadmap

- [ ] Add `/dashboard` page for post history
- [ ] Add delete/edit options for posts
- [ ] Integrate Stripe for subscriptions
- [ ] Share post to LinkedIn with API
- [ ] Add usage limits for free users

---

## 👨‍💻 Author

**Harith Abeysinghe**
FinTech-focused software engineer & SaaS builder 🚀
[LinkedIn](https://www.linkedin.com/in/harithabeysinghe)

---

## 📝 License

This project is MIT licensed.

---

## 💡 Want to Contribute?

Feel free to open issues or PRs — feedback & collaboration are welcome!

```

---

Would you like me to:
- Auto-generate the schema for the `posts` table?
- Add badges or markdown visuals?
- Turn this into a `README.md` file you can paste directly?

Let’s make this repo stand out to investors, clients, and employers. 💼🔥
