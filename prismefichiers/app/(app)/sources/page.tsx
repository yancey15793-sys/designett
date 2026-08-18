export const dynamic = 'force-dynamic';

/**
 * « Sources » — la souveraineté.
 *
 * Destination de premier rang assumée malgré le débat de la boucle 2 :
 * enterrer la souveraineté dans les réglages reviendrait à la démentir.
 *
 * Portée v0 : l'écran existe et est libellé — un onglet vide reste visible,
 * jamais masqué. L'ingestion, la résolution de source et le moteur de règles
 * relèvent du service d'ingestion, hors de cette application.
 */
export default function PageSources() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-5 text-2xl font-semibold tracking-[-0.02em]">Sources</h1>
      <div className="rounded-l border border-filet bg-surface p-6">
        <p className="mb-2 text-[15px] font-semibold">Pas encore branché.</p>
        <p className="max-w-prose text-sm leading-relaxed text-encre-2">
          L’ajout de source, la surveillance de pages sans flux et le moteur de règles
          dépendent du service d’ingestion, qui vit hors de cette application front. Le
          schéma les prévoit déjà (<code className="font-donnees text-[13px]">prisme.source</code>,{' '}
          <code className="font-donnees text-[13px]">prisme.regle</code>), avec écriture
          réservée à la clé de service.
        </p>
        <p className="mt-3 text-[12.5px] text-encre-3">
          Import et export OPML resteront accessibles sans abonnement payant.
        </p>
      </div>
    </div>
  );
}
