

#  Synapse
### **AI-Powered Real-Time Collaboration Workspace**

> **Transform scattered ideas into structured, collaborative plans with real-time intelligence**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

---

## **Project Overview**
## **Synapse is a collaborative canvas with real-time sync, AI insights, and secure invite-based sharing**.

## **Real-Time Collaboration Demo**


![Real-time Collaboration](docs/gifs/realtime.gif)

## **Multi-user simultaneous editing → Live drag & drop → Text updates → Node resizing → All synchronized instantly with 50ms latency**

### **Key Problem Solved**
- **Before Synapse**: Ideas scattered across multiple tools, poor collaboration, lack of project intelligence
- **After Synapse**: Unified visual workspace with real-time collaboration and AI-driven project analysis

---

## **⭐ Here’s a link to live demo**

[Live Demo](https://synapse-workspace.netlify.app) 

---

## **Performance & Scale**

- **Real-time Updates**: Sub-50ms synchronization across clients
- **Serverless Architecture**: Auto-scaling based on demand
- **Optimized Database**: Dual-database strategy for performance and consistency
- **Modern Stack**: Built with latest React 19 and TypeScript for maintainability

---

##  **Complete Workflow Demonstration**

*Experience the full collaborative journey from canvas creation to real-time editing*

### **1️⃣ Canvas Creation & Sharing**
![Canvas Creation and Sharing](docs/gifs/create.gif)

**Step 1:** *Create new canvas → Add initial content nodes → Open share dropdown → Generate secure invite link*

### **2️⃣ Secure Invitation System**
![Collaboration Request](docs/gifs/request.gif)

**Step 2:** *Share invite link → Access request notification → User authentication and permission request*

### **3️⃣ Smart Access Control**
![Accept/Decline Requests](docs/gifs/accept.gif)

**Step 3:** *Review collaboration requests → User details verification → Accept or decline access permissions*

### **4️⃣ Seamless Canvas Access**
![Canvas Reload After Access](docs/gifs/reload.gif)

**Step 4:** *loading canvas → Ready for collaborative editing*

---

##  **AI Intelligence Suite**       

### **Smart Content Categorization**
![AI Categorization Demo](docs/gifs/Catagorize.gif)

*Select multiple nodes → AI analysis via Hugging Face → Automatic intelligent tagging → Organized workspace*

### **AI Project Analyst**

<img src="docs/gifs/analysis.gif" alt="AI Generated Project Analysis" width="600">

*AI-driven insights providing project summaries, risk analysis, and actionable recommendations*

## **Analytics Dashboard**
![Snapshot Analytics](docs/gifs/SnapShot.gif)

*Real-time canvas insights → Interactive pie charts → Checklist completion tracking → Project health metrics*



##  **Features Showcase**

### **Professional Landing & Dashboard**
<img src="docs/img/landing.png" alt="Synapse Landing Page" width="800">

*Clean, professional interface with intuitive navigation and canvas management*

### **Canvas Management & Sharing**
<img src="docs/img/Share.png" alt="Canvas Sidebar with Share Options" width="300">

*Organized canvas sidebar with dropdown sharing controls and delete options*

### **Secure Collaboration System**
<img src="docs/img/Accept.png" alt="Collaboration Request Notification" width="300">

*Smart notification system showing user details (name, email) with accept/decline options*


### **Multi-Modal Node Creation**
<img src="docs/img/Nodetypes.png" alt="All Node Types on Canvas" width="300">

*Comprehensive node system: Text, Checklists, Sticky Notes, and Image nodes with creation dropdown*


---

##  **Technical Architecture**

### **Full-Stack TypeScript Monorepo**
```
synapse-monorepo/
├── client/          # React + TypeScript frontend
├── server/          # Express + TypeScript backend
└── netlify.toml     # Serverless deployment configuration
```

### **Frontend Stack**
- **Framework**: React 19 with TypeScript, built with Vite
- **UI Libraries**: ReactFlow (canvas), Recharts (analytics), Tailwind CSS
- **State Management**: Custom React hooks, TanStack Query, React Context
- **Authentication**: Firebase Authentication SDK

### **Backend Stack**
- **Runtime**: Node.js with Express, serverless-compatible architecture
- **Authentication**: Firebase Admin SDK for secure token verification
- **API Design**: RESTful endpoints with custom controllers and services
- **Deployment**: Netlify Functions for serverless execution

### **Database Strategy**
- **MongoDB**: Primary database for permissions, metadata, and core application data
- **Google Firestore**: Real-time collaborative state engine for live synchronization
- **Dual Database Architecture**: Optimized for both persistence and real-time performance

---
##  Technical Decisions & Learnings

**Why Dual Database (MongoDB + Firestore)?**
- MongoDB: Stores user permissions, canvas metadata, collaboration requests
- Firestore: Real-time collaborative state with <100ms sync
- Trade-off: Added complexity, but optimized for both persistence and live collaboration

**Conflict Resolution Challenge**
Race conditions when 10+ users edit simultaneously. Solved with last-write-wins + Firestore timestamps + optimistic UI updates.

**Why Serverless (Netlify Functions)?**
Auto-scaling without managing servers, but required stateless API design and cold start optimization.

---

## 🛠️ **Technology Stack**

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19, TypeScript, Vite | Modern UI development |
| **Backend** | Node.js, Express, TypeScript | API and business logic |
| **Real-time** | Google Firestore | Live collaboration |
| **Database** | MongoDB | Data persistence |
| **Authentication** | Firebase Auth | Secure user management |
| **AI/ML** | Hugging Face, Google Gemini | Intelligence features |
| **Visualization** | ReactFlow, Recharts | Canvas and analytics |
| **Styling** | Tailwind CSS | Responsive design |
| **Deployment** | Netlify Functions | Serverless hosting |
| **State Management** | TanStack Query, React Context | Client-side state |

---

## **Getting Started**

### **Quick Start (Docker)**

This is the recommended way to run the project for local development.

1.  **Prerequisites**
    *   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
    *   [Git](https://git-scm.com/) installed.

2.  **Clone the Repository**
    ```bash
    git clone https://github.com/kryonic-fluke/synapse
    cd synapse
    ```

3.  **Environment Setup**
    This project uses environment variables for configuration. You'll need to create a `.env` file for the server and a `serviceAccountKey.json` for Firebase.

    *   **Server Environment:** Copy the example file and fill in your details (e.g., MongoDB credentials).
        ```bash
        cp server/.env.example server/.env
        ```

    *   **Firebase Credentials:** Place your `serviceAccountKey.json` file in the **root** of the project directory. This file is required and is securely ignored by git.

4.  **Launch the Application**
    From the root directory, run the following command. Docker will build the images, install dependencies, and start the client and server.

    ```bash
    docker-compose up --build
    ```
    *The initial build may take a few minutes. Subsequent launches will be much faster due to caching.*

    Once complete, the application will be available at:
    *   **Frontend (React App):** `http://localhost:5174`
    *   **Backend (Express API):** `http://localhost:5001`

---

### **Manual Installation (Legacy)**

If you prefer not to use Docker, you can run the project natively on your machine.

1.  **Prerequisites**
    *   Node.js v20+

2.  **Clone and Install Dependencies**
    ```bash
    git clone https://github.com/kryonic-fluke/synapse
    cd synapse
    npm install
    ```

3.  **Environment Setup**
    *   **Server:** Create a `.env` file in the `/server` directory and provide your MongoDB and other required variables.
    *   **Firebase:** Place your `serviceAccountKey.json` in the root directory.

4.  **Run Development Servers**
    ```bash
    # Start both client and server concurrently
    npm run dev
    ```

##  **Use Cases**

- **Product Teams**: Feature planning, user journey mapping, sprint planning
- **Designers**: Mood boards, design systems, collaborative wireframing  
- **Educators**: Interactive lesson planning, collaborative learning spaces
- **Consultants**: Client workshops, strategy sessions, project visualization
- **Developers**: System architecture, API design, technical documentation

---



## 👤 **Author**

**Suyash Upadhyay**

- LinkedIn: [Suyash Upadhyay](https://www.linkedin.com/in/suyash-upadhyay-49554b333/)
- Email: suyash.upadhyay01@gmail.com


