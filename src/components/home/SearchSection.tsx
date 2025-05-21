
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Filter } from "lucide-react";

const SearchSection = () => {
  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Recherche rapide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Trouvez immédiatement des micro-missions qui correspondent à votre profil et vos disponibilités.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Input 
                placeholder="Rechercher une mission..."
                className="pl-10 pr-4 py-6 rounded-lg border-gray-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <div className="md:col-span-3">
              <Select>
                <SelectTrigger className="w-full py-6 rounded-lg border-gray-200">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Localisation" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearby">À proximité (5km)</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="lyon">Lyon</SelectItem>
                  <SelectItem value="marseille">Marseille</SelectItem>
                  <SelectItem value="remote">À distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3">
              <Select>
                <SelectTrigger className="w-full py-6 rounded-lg border-gray-200">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Durée" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="60m">1 heure</SelectItem>
                  <SelectItem value="more">Plus d'une heure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-1 flex items-center justify-center">
              <Button
                size="icon"
                variant="outline"
                className="h-full w-full rounded-lg border-gray-200"
                aria-label="Plus de filtres"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-full cursor-pointer">
              Administratif
            </Badge>
            <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-full cursor-pointer">
              Communication
            </Badge>
            <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-full cursor-pointer">
              Soutien scolaire
            </Badge>
            <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-full cursor-pointer">
              Aide alimentaire
            </Badge>
            <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-full cursor-pointer">
              Informatique
            </Badge>
          </div>

          <div className="mt-8 flex justify-center">
            <Button className="bg-bleu hover:bg-bleu-700 text-white py-6 px-8 rounded-xl shadow text-lg">
              Rechercher des missions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
