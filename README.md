# Project Management Frontend 🚀

This repository hosts the frontend application for a comprehensive Project Management System. Built with React and Material-UI, it provides an intuitive and responsive user interface for managing projects, tasks, and team members, seamlessly interacting with a separate backend API.

-----

## ✨ Features

  * **Responsive Design:** Optimized for various screen sizes (desktop, tablet, mobile).
  * **User Authentication:** Secure signup and login flows.
  * **Dashboard View:** Overview of assigned projects and tasks.
  * **Project Management:** Create, view, update, and delete projects.
  * **Task Management:** Create, view, update, and delete tasks within projects, including status updates.
  * **Member Management:** Add and remove team members from projects.
  * **Modern UI:** Leverages Material-UI for a sleek and consistent user experience.

-----

## 🛠️ Technologies Used

  * **React:** A JavaScript library for building user interfaces.
  * **Material-UI (MUI):** A popular React UI framework implementing Google's Material Design.
  * **React Router DOM:** For declarative routing within the application.
  * **Axios:** A promise-based HTTP client for making API requests to the backend.
  * **Vite:** A fast build tool that provides a rapid development environment.

-----

## 📦 Getting Started

### Prerequisites

  * Node.js (v18 or higher recommended)
  * npm or Yarn
  * Git
  * A running instance of the [Task Manager Backend](https://github.com/codewith-swapnil/task-manager-backend) (either locally or deployed).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/codewith-swapnil/project-management-frontend.git
    cd project-management-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install
    ```

### Environment Variables (.env)

Create a file named `.env` in the root directory of the frontend project. This file will store the base URL of your backend API.

```dotenv
VITE_REACT_APP_API_BASE_URL=http://localhost:5000/api
```

  * **`VITE_REACT_APP_API_BASE_URL`**: This variable should point to the base URL of your backend API.
      * For **local development**, it will typically be `http://localhost:5000/api` (or whatever port your backend is running on).
      * For **production deployment**, you will update this to the URL of your deployed backend (e.g., `https://your-deployed-backend.render.com/api`).

-----

## 🏃 Running Locally

1.  **Start the backend server:** Ensure your [Task Manager Backend](https://github.com/codewith-swapnil/task-manager-backend) is running locally (e.g., `npm start` in its directory).
2.  **Start the frontend development server:**
    ```bash
    npm run dev # or yarn dev
    ```
    The application will typically open in your browser at `http://localhost:5173` (or another available port).

-----

## 🌐 Deployment

This frontend application is a static site and can be easily deployed on various platforms.

  * **Hosting:** [Vercel](https://vercel.com/) (recommended), [Netlify](https://www.netlify.com/), or Render's Static Site service.

### Deployment Setup (Environment Variables on Hosting Platforms)

When deploying, you will need to set the `VITE_REACT_APP_API_BASE_URL` environment variable directly on the hosting platform. **Do NOT commit your `.env` file to Git.**

  * **Vercel/Netlify/Render:**
      * Go to your project settings -\> Environment Variables.
      * Add `VITE_REACT_APP_API_BASE_URL` and set its value to your **deployed backend's API URL** (e.g., `https://your-backend-app.render.com/api`).

-----

## 🤝 Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

-----

## 📄 License

[Optional: Add your license information here, e.g., MIT License]
