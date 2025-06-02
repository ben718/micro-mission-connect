
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Politique de Confidentialité</CardTitle>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Collecte des données</h2>
            <p>Nous collectons les informations suivantes :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Données d'identification (nom, prénom, email)</li>
              <li>Informations de profil (compétences, disponibilités, localisation)</li>
              <li>Données de navigation (cookies, adresse IP)</li>
              <li>Historique d'activité sur la plateforme</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Création et gestion de votre compte</li>
              <li>Mise en relation avec des associations</li>
              <li>Amélioration de nos services</li>
              <li>Communication concernant la plateforme</li>
              <li>Respect de nos obligations légales</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Partage des données</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Le partage est limité aux cas suivants :
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Avec les associations pour les missions auxquelles vous postulez</li>
              <li>Avec nos prestataires techniques (hébergement, analytics)</li>
              <li>En cas d'obligation légale ou judiciaire</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Vos droits RGPD</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Droit d'accès :</strong> consulter vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger des informations inexactes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format exploitable</li>
              <li><strong>Droit d'opposition :</strong> refuser certains traitements</li>
              <li><strong>Droit à la limitation :</strong> restreindre l'utilisation de vos données</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
              pour protéger vos données contre la perte, l'utilisation abusive, l'accès non autorisé, 
              la divulgation, l'altération ou la destruction.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez 
              configurer votre navigateur pour refuser les cookies, mais cela peut affecter 
              le fonctionnement du site.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles pendant la durée nécessaire aux finalités 
              pour lesquelles elles ont été collectées, et conformément à nos obligations légales.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Contact DPO</h2>
            <p>
              Pour exercer vos droits ou pour toute question concernant la protection de vos données :
              <br />
              Email : dpo@[votre-domaine].com
              <br />
              Vous pouvez également contacter la CNIL en cas de réclamation.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
