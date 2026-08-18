export const dynamic = 'force-dynamic';

/**
 * « Bibliothèque » — la mémoire.
 *
 * Ce qu'on y trouve, c'est ce qu'on a COMPRIS, jamais ce qu'on a mis de
 * côté : il n'existe pas de pile « à lire plus tard » dans ce produit.
 * Reporter est une opération de file, avec une échéance obligatoire.
 *
 * Portée v0 : la liste des annotations est branchée sur le dépôt ; les
 * collections, rappels et connecteurs de sortie restent à câbler.
 */
const ANNOTATIONS_DEMO = [
  {
    id: 'an-1',
    extrait: '… relève le plafond de 12 % à compter de l’exercice suivant …',
    editeur: 'Le Monde',
    date: '14 août',
    ancrage: '§ 4',
    modalite: 'lecture' as const,
    sujet: 'Révision du plafond d’émissions',
  },
  {
    id: 'an-2',
    extrait: '… le calendrier d’application reste le point de blocage …',
    editeur: 'Contexte',
    date: '14 août',
    ancrage: '12 min 47',
    modalite: 'oreille' as const,
    sujet: 'Loi de programmation énergétique',
  },
];

export default function PageBibliotheque() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-5 text-2xl font-semibold tracking-[-0.02em]">Bibliothèque</h1>

      {ANNOTATIONS_DEMO.map((a) => (
        <article key={a.id} className="mb-2.5 rounded-l border border-filet bg-surface p-4">
          <blockquote className="mb-2.5 border-l-2 border-n-300 pl-3 font-lecture text-[15.5px] leading-[1.55]">
            {a.extrait}
          </blockquote>
          <p className="text-xs text-encre-3">
            <em className="italic text-encre-2">{a.editeur}</em> · {a.date} · {a.ancrage} ·
            saisi{' '}
            <b className="font-semibold text-encre-2">
              {a.modalite === 'lecture' ? 'en lecture' : 'à l’oreille'}
            </b>
          </p>
          <p className="mt-1 text-xs text-encre-3">Sujet : {a.sujet}</p>
        </article>
      ))}

      {/* Une annotation posée à l'oreille se retrouve à la bonne position
          dans le texte : c'est la preuve de l'ancrage canonique unique. */}
      <p className="mt-4 rounded-m border border-dashed border-filet p-4 text-[12.5px] leading-relaxed text-encre-3">
        La modalité de capture est affichée parce qu’elle dit d’où vient l’ancrage. Une
        annotation dont l’URL ne remonte pas est un défaut, pas une dégradation acceptable.
      </p>
    </div>
  );
}
