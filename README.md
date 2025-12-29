# CheckPack 🎒

**CheckPack** is a modern, mobile-first inventory and packing list management application built with robust web technologies and wrapped for Android performance. It helps users organize their items, create packing lists, and track inventory with ease.

## 🚀 Key Features

*   **Smart Inventory Management**: Easily add, edit, and categorize items.
*   **Packing Lists**: Create and manage detailed packing lists for trips or projects.
*   **Excel Integration**: Seamlessly export and import data using `.xlsx` files, preserving structure and special characters (including emojis 🎒).
*   **Mobile Optimized**: Designed with a responsive UI/UX perfect for Android devices.
*   **Offline Capable**: Uses local SQLite database for reliable offline data access.
*   **Modern UI**: Built with a clean, consistent aesthetic using Tailwind CSS and shadcn/ui.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons
*   **State & Forms**: React Query, React Hook Form, Zod
*   **Mobile Wrapper**: Capacitor (Android)
*   **Database**: SQLite (via Capacitor Community)
*   **Utilities**: `xlsx` (Excel handling), `date-fns` (Date management)

## 📦 Installation & Setup

Follow these steps to set up the project locally:

### Prerequisites
*   Node.js (v18+ recommended)
*   Android Studio (for Android build)

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/CheckPack.git
    cd CheckPack
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run Web Development Server**
    ```bash
    npm run dev
    ```
    The app will be accessible locally (usually at `http://localhost:8080`).

4.  **Run on Android**
    The project is configured for Android using Capacitor.

    *   Build the web assets:
        ```bash
        npm run build
        ```
    *   Sync with Capacitor to copy assets to the Android project:
        ```bash
        npx cap sync
        ```
    *   Open the project in Android Studio:
        ```bash
        npx cap open android
        ```
    *   From Android Studio, you can run the app on a connected device or emulator.

## 📱 Building for Production

To create a release-ready APK or Bundle:

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  Sync the changes:
    ```bash
    npx cap sync android
    ```
3.  Open Android Studio (`npx cap open android`) and navigate to **Build > Generate Signed Bundle / APK**.

## 🤝 Contributing

Contributions are excellent!
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License.
