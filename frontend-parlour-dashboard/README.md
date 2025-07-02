# Parlour Dashboard

This is a project consisting of a **frontend** built with [Next.js](https://nextjs.org) and a **backend** built with Node.js and MongoDB.

## 🎥 Demo

Watch the project demo: [**View Demo Video**](https://drive.google.com/file/d/10pyGR1snsR7QL92DhfUTM-6e446Kwp6-/view?usp=sharing)

## Frontend Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/parlour-dashboard.git
cd parlour-dashboard/frontend-parlour-dashboard
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

- Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

- Fill in the required values in the `.env` file:
  ```properties
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  NEXT_PUBLIC_API_WS_URL=http://localhost:5000
  ```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Backend Setup

### 1. Navigate to the backend directory

```bash
cd backend-parlour-dashboard
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

- Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

- Fill in the required values in the `.env` file:
  ```properties
  PORT=5000
  MONGO_URI=<your-mongodb-connection-string>
  JWT_SECRET=<your-jwt-secret>
  CLIENT_URL=http://localhost:3000
  ```

### 4. Seed the database

Run the following command to seed users:

```bash
npx ts-node src/utils/seedUsers.ts
```

### 5. Start the backend server

```bash
npm run dev
# or
yarn dev
```

The backend will run on [http://localhost:5000](http://localhost:5000).

---
