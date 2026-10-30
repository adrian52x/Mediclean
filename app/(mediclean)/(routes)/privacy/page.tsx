import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/seo/structured-data';

export const metadata: Metadata = {
    title: `Politica de confidențialitate | ${SITE_CONFIG.name}`,
    description: 'Cum colectăm, folosim și protejăm datele tale personale pe Dezinfect MD, inclusiv informații despre cookie-uri.',
    alternates: {
        canonical: `${SITE_CONFIG.url}/privacy`,
    },
};

const LAST_UPDATED = '30 octombrie 2026';

const sectionClass = 'space-y-3';
const headingClass = 'text-xl font-semibold text-foreground';
const listClass = 'list-disc space-y-1 pl-5';
const cellClass = 'border-b p-3 align-top';

const cookies = [
    { name: 'mediclean-cart-storage', type: 'Necesar', purpose: 'Păstrează produsele din coș', duration: 'Până la golirea coșului sau a browserului' },
    { name: 'theme', type: 'Necesar', purpose: 'Reține tema deschisă sau întunecată', duration: 'Până la ștergerea din browser' },
    { name: 'cookie-consent', type: 'Necesar', purpose: 'Reține alegerea ta privind cookie-urile', duration: 'Până la ștergerea din browser' },
    { name: 'sb-*', type: 'Necesar', purpose: 'Autentificarea administratorilor site-ului', duration: 'Pe durata sesiunii de autentificare' },
    { name: 'sidebar_state', type: 'Necesar', purpose: 'Reține starea meniului din panoul de administrare', duration: '7 zile' },
    { name: '_ga, _ga_*', type: 'Analiză', purpose: 'Google Analytics: statistici despre utilizarea site-ului', duration: 'Până la 2 ani, doar cu acordul tău' },
];

export default function PrivacyPage() {
    return (
        <main className="mx-auto w-full max-w-3xl space-y-8 py-8 text-muted-foreground">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Politica de confidențialitate</h1>
                <p className="text-sm">Ultima actualizare: {LAST_UPDATED}</p>
            </header>

            <p>
                Această politică explică ce date personale colectăm atunci când folosești site-ul{' '}
                {SITE_CONFIG.url.replace('https://', '')}, de ce le folosim și ce drepturi ai. Datele sunt
                prelucrate conform legislației Republicii Moldova, inclusiv Legii nr. 195/2024 privind
                protecția datelor cu caracter personal.
            </p>

            <section className={sectionClass}>
                <h2 className={headingClass}>1. Cine suntem</h2>
                <p>Operatorul datelor este:</p>
                <ul className={listClass}>
                    <li>&quot;ERICON&quot; S.R.L., care administrează magazinul {SITE_CONFIG.name}</li>
                    <li>IDNO: 1003600000316</li>
                    <li>Adresa: {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city}, Republica Moldova</li>
                    <li>Telefon: {SITE_CONFIG.contact.phone}</li>
                </ul>
            </section>

            <section className={sectionClass}>
                <h2 className={headingClass}>2. Ce date colectăm</h2>
                <p>Când plasezi o comandă, colectăm datele pe care le introduci în formular:</p>
                <ul className={listClass}>
                    <li>nume, telefon și adresă de email</li>
                    <li>adresa de livrare, orașul și codul poștal</li>
                    <li>rechizitele bancare, dacă alegi să le completezi</li>
                    <li>observațiile adăugate la comandă și produsele comandate</li>
                </ul>
                <p>
                    Pentru a verifica adresa de email, păstrăm temporar emailul tău și un cod de verificare.
                    Codul este valabil 10 minute.
                </p>
                <p>
                    Dacă accepți cookie-urile de analiză, Google Analytics colectează date despre utilizarea
                    site-ului, cum ar fi paginile vizitate și informații despre dispozitiv și browser.
                </p>
                <p>Plățile nu se fac pe site, deci nu colectăm date ale cardurilor bancare.</p>
            </section>

            <section className={sectionClass}>
                <h2 className={headingClass}>3. De ce folosim datele</h2>
                <ul className={listClass}>
                    <li>
                        <strong>Procesarea și livrarea comenzilor:</strong> pentru a încheia și a executa
                        contractul de vânzare și pentru a te contacta despre comandă.
                    </li>
                    <li>
                        <strong>Verificarea emailului:</strong> pentru a ne asigura că adresa îți aparține și
                        pentru a preveni comenzile false. Acesta este interesul nostru legitim.
                    </li>
                    <li>
                        <strong>Obligații legale:</strong> de exemplu, păstrarea documentelor contabile.
                    </li>
                    <li>
                        <strong>Statistici despre site:</strong> pentru a îmbunătăți site-ul, doar cu acordul tău.
                    </li>
                </ul>
                <p>Furnizarea datelor de comandă este necesară pentru a putea procesa comanda.</p>
            </section>

            <section className={sectionClass}>
                <h2 className={headingClass}>4. Cine primește datele</h2>
                <p>Nu vindem datele tale. Le transmitem doar furnizorilor care ne ajută să operăm site-ul:</p>
                <ul className={listClass}>
                    <li><strong>Resend:</strong> trimiterea emailurilor de verificare și de confirmare a comenzii</li>
                    <li><strong>Supabase:</strong> baza de date a site-ului și autentificarea administratorilor</li>
                    <li><strong>Google:</strong> statistici Google Analytics, harta de pe pagina principală și autentificarea administratorilor</li>
                    <li><strong>Furnizorul de găzduire</strong> al site-ului</li>
                    <li><strong>Serviciile de livrare,</strong> când este necesar pentru a-ți livra comanda</li>
                </ul>
                <p>
                    Unii dintre acești furnizori pot prelucra datele în afara Republicii Moldova, inclusiv în
                    Statele Unite ale Americii. Putem divulga date și autorităților, atunci când legea o cere.
                </p>
            </section>

            <section className={sectionClass}>
                <h2 className={headingClass}>5. Cât timp păstrăm datele</h2>
                <p>
                    Nu salvăm comenzile într-o bază de date a site-ului. Detaliile comenzii sunt transmise prin
                    email către tine și către noi. Le păstrăm atât timp cât este necesar pentru a procesa
                    comanda și pentru a respecta obligațiile legale, inclusiv cele contabile.
                </p>
                <p>
                    Codurile de verificare sunt șterse după utilizare, iar cele expirate sunt șterse periodic.
                </p>
            </section>

            <section className={sectionClass}>
                <h2 className={headingClass}>6. Drepturile tale</h2>
                <p>În condițiile legii, ai dreptul:</p>
                <ul className={listClass}>
                    <li>să afli ce date deținem despre tine și să primești o copie</li>
                    <li>să ceri corectarea sau ștergerea datelor</li>
                    <li>să ceri restricționarea prelucrării și să te opui acesteia</li>
                    <li>să ceri transferul datelor către alt operator</li>
                    <li>să îți retragi oricând acordul, fără a afecta prelucrările făcute anterior</li>
                </ul>
                <p>
                    Pentru a-ți exercita drepturile, contactează-ne la telefon sau la adresa din secțiunea 1. Ai
                    și dreptul să depui o plângere la Centrul Național pentru Protecția Datelor cu Caracter
                    Personal (datepersonale.md).
                </p>
            </section>

            <section className={sectionClass}>
                <h2 className={headingClass}>7. Securitatea datelor</h2>
                <p>
                    Folosim măsuri tehnice și organizatorice pentru a proteja datele, inclusiv conexiuni
                    criptate și acces limitat. Totuși, nicio metodă de transmitere sau stocare nu este complet
                    sigură, mai ales emailul.
                </p>
            </section>

            <section id="cookies" className={`${sectionClass} scroll-mt-24`}>
                <h2 className={headingClass}>8. Cookie-uri</h2>
                <p>
                    Cookie-urile și stocarea locală sunt mici fișiere și date păstrate în browserul tău. Cele
                    necesare fac site-ul să funcționeze și nu pot fi dezactivate din site. Cookie-urile de analiză
                    se folosesc doar dacă apeși &quot;Accept&quot;.
                </p>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[32rem] text-left text-sm">
                        <thead>
                            <tr className="text-foreground">
                                <th className={cellClass}>Nume</th>
                                <th className={cellClass}>Tip</th>
                                <th className={cellClass}>Scop</th>
                                <th className={cellClass}>Durată</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cookies.map(({ name, type, purpose, duration }) => (
                                <tr key={name}>
                                    <td className={cellClass}><code>{name}</code></td>
                                    <td className={cellClass}>{type}</td>
                                    <td className={cellClass}>{purpose}</td>
                                    <td className={cellClass}>{duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p>
                    Harta de pe pagina principală este încărcată de la Google Maps. Google poate primi adresa ta
                    IP și poate seta propriile cookie-uri, conform politicii sale de confidențialitate.
                </p>
                <p>
                    Îți poți schimba oricând alegerea din linkul &quot;Setări cookie&quot; din subsolul site-ului.
                    Poți șterge cookie-urile și din setările browserului.
                </p>
            </section>

            <section className={sectionClass}>
                <h2 className={headingClass}>9. Modificări</h2>
                <p>
                    Putem actualiza această politică. Versiunea actuală este mereu pe această pagină, iar data
                    ultimei actualizări este afișată la început.
                </p>
            </section>
        </main>
    );
}
