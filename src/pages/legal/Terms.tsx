
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Conditions Générales d'Utilisation</CardTitle>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Objet</h2>
            <p>
              Les présentes conditions générales d'utilisation (« CGU ») régissent l'utilisation 
              de la plateforme de bénévolat [Nom de la plateforme] accessible à l'adresse [URL].
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Acceptation des CGU</h2>
            <p>
              L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU. 
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Description des services</h2>
            <p>
              Notre plateforme met en relation des bénévoles avec des associations et organisations 
              à but non lucratif pour faciliter l'engagement citoyen et les actions solidaires.
            </p>
            <p>Les services incluent :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Création de profils pour bénévoles et associations</li>
              <li>Publication et recherche de missions de bénévolat</li>
              <li>Système de candidature et de gestion des inscriptions</li>
              <li>Outils de communication et de suivi</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Inscription et compte utilisateur</h2>
            <p>
              L'inscription est gratuite et ouverte à toute personne physique majeure ou 
              organisation légalement constituée. Vous vous engagez à fournir des informations 
              exactes et à les maintenir à jour.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Obligations des utilisateurs</h2>
            <h3 className="text-lg font-medium mb-2">Pour les bénévoles :</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Respecter les engagements pris auprès des associations</li>
              <li>Faire preuve de sérieux et de ponctualité</li>
              <li>Signaler tout empêchement dans les meilleurs délais</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2">Pour les associations :</h3>
            <ul className="list-disc pl-6">
              <li>Publier des missions conformes à leur objet social</li>
              <li>Assurer l'encadrement et la sécurité des bénévoles</li>
              <li>Respecter la législation en vigueur sur le bénévolat</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Responsabilité</h2>
            <p>
              La plateforme agit comme intermédiaire entre bénévoles et associations. 
              Elle ne peut être tenue responsable des dommages résultant des missions 
              de bénévolat ou des relations entre utilisateurs.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Propriété intellectuelle</h2>
            <p>
              Tous les éléments de la plateforme (design, textes, logos, etc.) sont protégés 
              par les droits de propriété intellectuelle et ne peuvent être reproduits sans 
              autorisation expresse.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Modification des CGU</h2>
            <p>
              Nous nous réservons le droit de modifier les présentes CGU à tout moment. 
              Les modifications seront notifiées aux utilisateurs et prendront effet 
              après un délai de 30 jours.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p>
              Pour toute question concernant ces CGU, vous pouvez nous contacter à l'adresse : 
              <br />
              Email : legal@[votre-domaine].com
              <br />
              Adresse : [Votre adresse]
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;
