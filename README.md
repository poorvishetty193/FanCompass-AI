# FanCompass AI

A GenAI-powered stadium companion specifically designed for the FIFA World Cup 2026. FanCompass AI bridges the gap between stadium operations and the fan experience by creating a dynamic, real-time data loop.

---

## 🏟️ Chosen Vertical
**Smart Stadiums & Tournament Operations**

---

## 🏗️ Architecture & Tech Stack

FanCompass AI is built for speed, reliability, and edge-ready performance using a modern web stack:

- **Frontend & Framework:** Next.js 14 (App Router), React 19, Tailwind CSS
- **Backend/API:** Next.js Serverless Route Handlers
- **Database & Auth:** Firebase (Firestore for real-time data, Google OAuth for staff login)
- **AI Integration:** Vercel AI SDK (`@ai-sdk/google`)
- **Language:** TypeScript (Strict Mode)

### System Architecture Flow:
1. **Input Layer:** Staff input incident reports via the dashboard.
2. **Data Layer:** Firebase Firestore stores the reports in real-time.
3. **Retrieval Layer:** When a fan asks a question, the API fetches the most recent zone reports.
4. **Generation Layer:** The zone reports and user query are injected into the Gemini model's system prompt to generate a contextually accurate response.

---

## 🧠 Models Used

- **Google Gemini 1.5 Flash (`gemini-1.5-flash`)**: Chosen for its exceptionally fast inference times and low latency, which is critical for real-time mobile chatting in a crowded stadium environment. It powers the multilingual conversational AI and naturally processes the injected zone reports to adjust fan guidance dynamically.

---

## ⚙️ Methods & Logic: The Connected Data Loop

Our core logic centers around creating a **connected data loop** where stadium staff inputs directly inform the AI that guides fans. Rather than having separate silos for operations and fan engagement, FanCompass AI acts as the connective tissue.

- **Staff Reporting Method:** Staff and volunteers report on real-time stadium conditions (e.g., crowd levels, broken gates, spills). 
- **Dynamic Context Injection:** These "Zone Reports" are instantly saved to Firestore and then pulled into the backend upon a fan's API request. The AI Concierge receives this data directly in its system prompt, meaning the AI inherently "knows" what is happening in the stadium at that exact second.

---

## 📱 How the Solution Works

FanCompass AI features two main user interfaces:

### 1. Fan Concierge (Public)
A multilingual AI chat interface designed for mobile usage. 
- **Natural Language:** Fans can ask questions like *"Where's the nearest accessible restroom?"* or *"Is the north gate crowded?"*
- **Real-Time Accuracy:** Because of the connected data loop, if staff report a spill at the North Gate, the AI will warn the fan and suggest an alternative route.
- **Accessibility Mode:** A dedicated toggle alters the AI's system prompt to prioritize elevators, ramps, and accessible seating routes.

### 2. Staff Dashboard (Authenticated)
A secure portal for stadium personnel.
- **Google OAuth:** Staff log in securely.
- **Zone Reporting:** They use a simple, mobile-friendly form to log conditions (Crowd Levels: Low, Medium, High, Critical) and specific incidents across predefined stadium zones.
- **Live Feed:** A real-time data table shows all recent reports in the stadium.

---

## 🚀 Installation & Setup Process

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- A Firebase Project (with Firestore and Google Authentication enabled)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/your-username/fancompass-ai.git
cd fancompass-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the template file to create your local environment variables:
```bash
cp .env.template .env.local
```
Fill out `.env.local` with your Firebase and Gemini credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id

GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Testing & Building
- **Run Tests:** `npm run test`
- **Lint Code:** `npm run lint`
- **Production Build:** `npm run build && npm run start`

---

## 📌 Assumptions Made
- **MVP Scope:** We assumed a single stadium environment with predefined zones (e.g., North Gate, South Concourse) for this prototype, rather than a multi-stadium deployment.
- **Environment:** The app relies on mobile browser capabilities (using dynamic viewport heights `100dvh` for iOS Safari compatibility).
- **Rate Limiting:** In-memory rate limiting is used for the API routes as a simplified MVP substitute for Redis.
