import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const useBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let lastBackPress = 0;

        const handleBackButton = async () => {
            // 1. Check for open overlays (Dialogs, Drawers, Sheets, etc.)
            // Radix UI primitives usually add 'data-state="open"' or role="dialog"
            const openOverlay = document.querySelector('[role="dialog"], [data-state="open"]');

            // If an overlay is open, we assume the library (Radix/Shadcn) handles the back button 
            // (usually via Escape key emulation or internal listeners). 
            // We just need to prevent the default App exit.
            if (openOverlay) {
                // However, sometimes we might need to manually close it if the library doesn't catch the hardware back button.
                // For now, let's assume Radix handles "Escape" which Capacitor maps Back to.
                // If not, we might need to dispatch an Escape key event.
                return;
            }

            // 2. Navigation Handling
            if (location.pathname !== '/') {
                navigate(-1);
                return;
            }

            // 3. Home Screen Exit Handling
            const now = Date.now();
            if (now - lastBackPress < 2000) {
                App.exitApp();
            } else {
                toast("Press back again to exit");
                lastBackPress = now;
            }
        };

        const listener = App.addListener('backButton', (event) => {
            // Prevent default behavior immediately
            // event.canGoBack is for WebView history, which we are managing with React Router
            handleBackButton();
        });

        return () => {
            listener.then(handle => handle.remove());
        };
    }, [navigate, location]);
};
