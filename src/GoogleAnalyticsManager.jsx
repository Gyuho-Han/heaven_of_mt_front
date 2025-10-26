import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GA_TRACKING_ID = import.meta.env.VITE_APP_GA_TRACKING_ID;

const GoogleAnalyticsManager = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (GA_TRACKING_ID) {
            ReactGA.initialize(GA_TRACKING_ID);
            setInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (initialized) {
            ReactGA.send({
                hitType: "pageview",
                page: location.pathname,
            });
        }
    }, [initialized, location]);

    return null;
};

export default GoogleAnalyticsManager;