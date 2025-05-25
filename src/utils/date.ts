import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "d MMMM yyyy à HH'h'mm", { locale: fr });
};

export const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  } else if (minutes === 60) {
    return "1 heure";
  } else if (minutes % 60 === 0) {
    return `${minutes / 60} heures`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes}`;
  }
}; 