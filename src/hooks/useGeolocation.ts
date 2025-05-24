import { useState, useEffect } from "react";

interface GeolocationState {
  coordinates: [number, number] | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        error: "La géolocalisation n'est pas supportée par votre navigateur",
        loading: false,
      });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        coordinates: [position.coords.latitude, position.coords.longitude],
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState({
        coordinates: null,
        error: error.message,
        loading: false,
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}; 