# 3D Digital Workspace - Developer Portfolio

A premium, interactive 3D portfolio website built for **Pranjal Shukla**, showcasing technical depth across **DevOps, IoT, and AI**. The site features a futuristic 3D desktop console/server environment that adapts dynamically to client devices.

---

## Key Features

### 1. Interactive 3D Canvas (R3F)

- **Agentic Core:** A central gyroscopic sci-fi core representing AI autonomy. It responds to mouse coordinates for parallax tilt and spins at high speed when transmitting contact signals.
- **Orbital Project Cluster:** Arranges your 8 developer projects along a circular orbit. Hovering reveals interactive labels, and clicking zooms the camera in to overlay detailed glassmorphic descriptions.
- **Credit-Card Certification Wall:** Arranges verified certifications as metallic credit card nodes on a grid. Clicking them rotates and flips the card to reveal verification pathways.
- **Retro Contact Terminal:** A command-line terminal monitor that packages client metadata and pings the EmailJS relay, shifting to a glowing green success state upon receipt.

### 2. High-Performance 2D Fallback

- Serves an optimized 2D fallback layout on viewports under `768px` to guarantee instant load times and stutter-free interaction on mobile browsers.
- Includes a manual "3D Mode" / "2D UI" toggle button on desktops to maximize accessibility.

### 3. Media Preview Modal

- Hovering over "Image" buttons reveals a mini thumbnail preview of the certificate screenshot or project graphic.
- Clicking the button opens a blurred-backdrop image viewer overlay that supports both 3D and 2D components.

---

## Technology Stack

- **Core:** React.js, Vite
- **3D Engine:** `@react-three/fiber`, `@react-three/drei` (Three.js binding)
- **Physics/Math:** `three`, `maath`
- **Animations:** `Framer Motion`
- **Icons:** `Lucide React`
- **Style System:** Responsive Vanilla CSS Variables (Glassmorphism & dark/light theme properties)

---

## Project Structure

```text
portfolio/
├── public/                     # Static served assets
│   ├── certificates/           # Verification screenshots
│   └── profile.jpg             # Hero graphics
├── src/
│   ├── components/
│   │   ├── DigitalWorkspace.jsx    # Main 3D canvas and camera LERP manager
│   │   ├── ProjectCluster3D.jsx    # 3D orbital project nodes
│   │   ├── CertificateWall3D.jsx   # 3D credit-card grid layout
│   │   ├── ContactTerminal3D.jsx   # 3D console screen and mail inputs
│   │   ├── MobileFallback.jsx      # Standalone 2D mobile view
│   │   ├── Navbar.jsx              # Responsive header and 3D triggers
│   │   └── Background3D.jsx        # 3D starry particle backgrounds
│   ├── data/
│   │   ├── projects.json           # Dynamic projects database
│   │   └── certificates.json       # Dynamic certificates database
│   ├── App.jsx                     # Viewmode orchestrator and modal portals
│   ├── index.css                   # Theme configurations and micro-animations
│   └── main.jsx                    # Root mount controller
├── netlify.toml                # Netlify SPA build configurations
└── package.json                # Project script registry
```

---

## Local Setup

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Setup Instructions

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Fire up the local hot-reloading development server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173/` in your browser.

4. Compile and verify the production bundle:

   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Deployment

This project includes a [netlify.toml](file:///d:/Program%20Files/portfolio/netlify.toml) file, making it ready for deployment on **Netlify**. It specifies:

- The build command: `npm run build`
- The publish folder: `dist`
- The Single Page App rewrite rule to route all traffic back through `index.html`.

For environment variables (such as custom EmailJS credentials):

- Add `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` to your Netlify Site Settings to dynamically bind your mail account!
