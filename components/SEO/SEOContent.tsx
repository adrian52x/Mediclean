import React from 'react';

interface SEOContentSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SEOContentSection({ title, children, className = "" }: SEOContentSectionProps) {
  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {children}
        </div>
      </div>
    </section>
  );
}

// SEO-optimized content for home page
export function HomePageSEOContent() {
  return (
    <>
      <SEOContentSection title="Despre Dezinfect MD - Partenerul Tău de Încredere în Produse Medicale">
        <p>
          <strong>Dezinfect MD</strong> este liderul pieței din Moldova în furnizarea de 
          <strong> dezinfectanți profesionali</strong> și <strong>echipamente medicale</strong> de înaltă calitate. 
          Cu peste 5 ani de experiență, deservim cabinete medicale, clinici stomatologice și spitale din întreaga țară.
        </p>
        <p>
          Oferim o gamă completă de produse certificate pentru <em>sterilizare</em>, <em>dezinfecție</em> și 
          <em>îngrijire medicală profesională</em>. Toate produsele noastre respectă standardele europene și 
          sunt aprobate de Ministerul Sănătății din Moldova.
        </p>
      </SEOContentSection>

      <SEOContentSection title="De Ce Să Alegi Dezinfect MD?">
        <ul>
          <li><strong>Livrare rapidă în toată Moldova</strong> - comenzile se livrează în 24-48h</li>
          <li><strong>Prețuri competitive</strong> - oferim cele mai bune prețuri din piață</li>
          <li><strong>Produse certificate</strong> - toate articolele au certificări internaționale</li>
          <li><strong>Consultanță specializată</strong> - echipa noastră te ajută să alegi produsele potrivite</li>
          <li><strong>Garanție de calitate</strong> - returnare gratuită în 30 de zile</li>
        </ul>
      </SEOContentSection>

      <SEOContentSection title="Serviciile Noastre în Moldova">
        <p>
          Activăm în <strong>Chișinău, Bălți, Cahul, Soroca, Orhei</strong> și în toate orașele din Moldova. 
          Oferim consultanță gratuită pentru alegerea dezinfectanților potriviți pentru cabinetul tău medical.
        </p>
        <p>
          Specializările noastre includ: <em>medicina generală</em>, <em>stomatologie</em>, 
          <em>chirurgie</em>, <em>ginecologie</em> și <em>pediatrie</em>.
        </p>
      </SEOContentSection>
    </>
  );
}

// SEO content for products category pages
export function DisinfectantsSEOContent() {
  return (
    <SEOContentSection title="Dezinfectanți Profesionali Moldova - Ghidul Complet">
      <p>
        Descoperă cea mai mare colecție de <strong>dezinfectanți profesionali</strong> din Moldova. 
        Avem soluții pentru sterilizarea instrumentelor, dezinfecția suprafețelor și igienizarea cabinetelor medicale.
      </p>
      <h3>Tipuri de Dezinfectanți Disponibili:</h3>
      <ul>
        <li><strong>Dezinfectanți pentru instrumente chirurgicale</strong></li>
        <li><strong>Soluții de sterilizare la rece</strong></li>
        <li><strong>Dezinfectanți pentru suprafețe medicale</strong></li>
        <li><strong>Antiseptice pentru mâini</strong></li>
        <li><strong>Dezinfectanți pentru echipamente dentare</strong></li>
      </ul>
    </SEOContentSection>
  );
}

export function EquipmentSEOContent() {
  return (
    <SEOContentSection title="Echipamente Medicale Moldova - Instrumente Profesionale">
      <p>
        Găsește <strong>echipamente medicale profesionale</strong> pentru cabinetul tău în Moldova. 
        De la instrumente chirurgicale la aparate de sterilizare, avem tot ce îți trebuie.
      </p>
      <h3>Categorii de Echipamente:</h3>
      <ul>
        <li><strong>Instrumente chirurgicale sterile</strong></li>
        <li><strong>Aparate de sterilizare și autoclav</strong></li>
        <li><strong>Mobilier medical specializat</strong></li>
        <li><strong>Echipamente de protecție medicală</strong></li>
        <li><strong>Aparatură pentru stomatologie</strong></li>
      </ul>
    </SEOContentSection>
  );
}
