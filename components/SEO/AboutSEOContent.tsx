import { CategoryEnum } from '@/types'

interface ProductsSEOContentProps {
  category?: string
  className?: string
}

export function ProductsSEOContent({ category, className = "" }: ProductsSEOContentProps) {
  if (category === CategoryEnum.Disinfectants) {
    return (
      <div className={`prose prose-lg max-w-none ${className}`}>
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dezinfectanți Medicali Profesioniști în Moldova
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Descoperă gama noastră completă de <strong>dezinfectanți medicali certificați</strong> pentru 
            instituții de sănătate din Moldova. Oferim soluții profesionale pentru dezinfectarea suprafețelor, 
            instrumentelor medicale și spațiilor sanitare.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Pentru Spitale și Clinici
              </h2>
              <ul className="text-blue-800 space-y-2">
                <li>• Dezinfectanți pentru săli de operație</li>
                <li>• Soluții pentru sterilizarea instrumentelor</li>
                <li>• Produse pentru dezinfectarea suprafețelor</li>
                <li>• Dezinfectanți pentru echipamente medicale</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-3">
                Pentru Cabinete Stomatologice
              </h2>
              <ul className="text-green-800 space-y-2">
                <li>• Dezinfectanți pentru unități dentare</li>
                <li>• Soluții pentru instrumentar stomatologic</li>
                <li>• Produse pentru scaunul stomatologic</li>
                <li>• Dezinfectanți pentru aspiratoare</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (category === CategoryEnum.Equipment) {
    return (
      <div className={`prose prose-lg max-w-none ${className}`}>
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Echipamente Medicale Profesionale în Moldova
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Găsește <strong>echipamente medicale de înaltă calitate</strong> pentru cabinete medicale, 
            clinici stomatologice și spitale din Moldova. Oferim instrumentar medical certificat și 
            echipamente moderne pentru toate specialitățile medicale.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-900 mb-3">
                Echipamente Stomatologice
              </h2>
              <ul className="text-purple-800 space-y-2">
                <li>• Unități dentare moderne</li>
                <li>• Instrumentar stomatologic</li>
                <li>• Aparate pentru sterilizare</li>
                <li>• Echipamente pentru radiologie dentară</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-orange-900 mb-3">
                Instrumentar Medical General
              </h2>
              <ul className="text-orange-800 space-y-2">
                <li>• Instrumente chirurgicale</li>
                <li>• Aparate de diagnostic</li>
                <li>• Echipamente pentru terapie</li>
                <li>• Mobilier medical specializat</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Default content for all products
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Produse Medicale Profesionale în Moldova
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <strong>MediClean Moldova</strong> este furnizorul tău de încredere pentru produse medicale 
          profesionale. Oferim o gamă completă de dezinfectanți, echipamente medicale și consumabile 
          pentru toate tipurile de instituții de sănătate din Moldova.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Dezinfectanți Certificați
            </h2>
            <p className="text-blue-800">
              Soluții profesionale pentru dezinfectarea spațiilor medicale și instrumentelor.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-green-900 mb-3">
              Echipamente Medicale
            </h2>
            <p className="text-green-800">
              Instrumentar și echipamente moderne pentru toate specialitățile medicale.
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-purple-900 mb-3">
              Consumabile Medicale
            </h2>
            <p className="text-purple-800">
              Produse consumabile de calitate pentru utilizare zilnică în medicina modernă.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            De ce să alegi MediClean Moldova?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-gray-700 space-y-2">
              <li>✓ Produse certificate și conforme standardelor europene</li>
              <li>✓ Livrare rapidă în toată Moldova</li>
              <li>✓ Prețuri competitive pentru instituții medicale</li>
              <li>✓ Consultanță specializată pentru alegerea produselor</li>
            </ul>
            <ul className="text-gray-700 space-y-2">
              <li>✓ Suport tehnic și service post-vânzare</li>
              <li>✓ Programe speciale pentru spitale și clinici</li>
              <li>✓ Formare și instruire pentru personalul medical</li>
              <li>✓ Garanție extinsă pentru echipamente</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
