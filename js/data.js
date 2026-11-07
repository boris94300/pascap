// [texte, catégorie, niveau, durée min (s), durée max (s), score]
// score : 'reps' = répétitions, 'secs' = secondes tenues, 'vote' = vote des potes
const RAW = [
  // SPORT
  ['Max de pompes', 'sport', 2, 15, 20, 'reps'],
  ['Poirier contre le mur', 'sport', 3, 2, 5, 'secs'],
  ['Chaise contre le mur', 'sport', 2, 25, 30, 'secs'],
  ['Max de squats', 'sport', 2, 15, 25, 'reps'],
  ['Planche en chantant Joyeux anniversaire', 'sport', 3, 45, 60, 'secs'],
  ['Roue (ou tentative de roue)', 'sport', 3, 5, 8, 'vote'],
  ['Pompes claquées', 'sport', 3, 10, 15, 'reps'],
  ['Pistol squat sur une jambe', 'sport', 3, 10, 15, 'reps'],
  ['Shadow boxing contre un ennemi imaginaire', 'sport', 1, 5, 8, 'vote'],
  ['Sauts de grenouille dans la pièce', 'sport', 2, 15, 20, 'reps'],
  ['Burpees non-stop', 'sport', 3, 45, 60, 'reps'],
  ['Grand écart (le plus bas possible)', 'sport', 2, 10, 15, 'vote'],
  ['Marche en crabe jusqu\u2019à la porte', 'sport', 2, 15, 20, 'vote'],
  ['Marche de l\u2019ours à quatre pattes', 'sport', 2, 15, 25, 'vote'],
  ['Équilibre sur les mains, en crow pose', 'sport', 3, 3, 6, 'secs'],
  ['Vélo dans le vide, allongé sur le dos', 'sport', 2, 20, 30, 'vote'],
  ['Fentes sautées', 'sport', 2, 15, 20, 'reps'],
  ['Pompes en criant « je suis cap » à chaque fois', 'sport', 2, 15, 20, 'reps'],
  ['10 tours sur toi-même puis marche droit', 'sport', 2, 15, 20, 'vote'],
  ['Gainage latéral en souriant', 'sport', 3, 45, 60, 'secs'],
  // VOIX
  ['Chante le refrain de ta dernière chanson écoutée', 'voix', 1, 8, 10, 'vote'],
  ['Hurle comme un loup', 'voix', 1, 5, 6, 'vote'],
  ['Commente ton repas comme un match de foot', 'voix', 2, 20, 25, 'vote'],
  ['Lis ton dernier message reçu en méchant Disney', 'voix', 2, 15, 20, 'vote'],
  ['Chante l\u2019alphabet le plus vite possible', 'voix', 1, 6, 8, 'vote'],
  ['Déclare ton amour à un objet près de toi', 'voix', 2, 20, 30, 'vote'],
  ['Vocal de déclaration d\u2019amour à ton ex… à ta mère', 'voix', 2, 10, 15, 'vote'],
  ['Imite trois animaux à la suite', 'voix', 1, 8, 10, 'vote'],
  ['Présente la météo de ta pièce', 'voix', 2, 15, 20, 'vote'],
  ['Fais une pub pour ta chaussette', 'voix', 2, 20, 25, 'vote'],
  ['Chante ton prénom en mode opéra', 'voix', 2, 15, 20, 'vote'],
  ['Dis « pas cap » avec cinq accents différents', 'voix', 2, 15, 20, 'vote'],
  ['Raconte ta journée comme un robot', 'voix', 1, 8, 10, 'vote'],
  ['Fais le bruit d\u2019une alarme de voiture', 'voix', 1, 5, 8, 'vote'],
  ['Appelle un pote et chante-lui Joyeux anniversaire', 'voix', 3, 15, 20, 'vote'],
  ['Récite un poème inventé sur ton frigo', 'voix', 3, 45, 50, 'vote'],
  ['Tiens une note le plus longtemps possible', 'voix', 1, 8, 10, 'secs'],
  ['Rappe tes trois derniers achats', 'voix', 3, 45, 60, 'vote'],
  ['Cri de victoire comme si tu avais gagné au loto', 'voix', 2, 15, 20, 'vote'],
  ['Lance un sort sur la personne la plus proche', 'voix', 2, 15, 20, 'vote'],
  // DANSE
  ['Danse sans musique comme à la fête de ta vie', 'danse', 2, 20, 30, 'vote'],
  ['La danse du ver de terre au sol', 'danse', 3, 45, 50, 'vote'],
  ['Moonwalk', 'danse', 2, 15, 20, 'vote'],
  ['Danse du robot', 'danse', 1, 8, 10, 'vote'],
  ['Breakdance : tourne sur le dos', 'danse', 3, 8, 12, 'vote'],
  ['Danse puis fige-toi au signal, trois fois', 'danse', 1, 8, 10, 'vote'],
  ['Slow langoureux avec ton oreiller', 'danse', 3, 45, 60, 'vote'],
  ['Dab, floss et twerk à la suite', 'danse', 2, 15, 20, 'vote'],
  ['Pas de danse classique en chaussettes', 'danse', 2, 20, 25, 'vote'],
  ['Air guitar sur un solo imaginaire', 'danse', 1, 8, 10, 'vote'],
  ['Twerk la tête en bas contre le mur', 'danse', 3, 10, 15, 'vote'],
  ['Danse du serpent', 'danse', 2, 15, 20, 'vote'],
  ['Recrée une trend TikTok de mémoire', 'danse', 2, 20, 30, 'vote'],
  ['Danse irlandaise, bras collés au corps', 'danse', 2, 15, 20, 'vote'],
  ['Célébration de but de footballeur', 'danse', 1, 8, 10, 'vote'],
  ['Pose de bodybuilder en musique', 'danse', 1, 8, 10, 'vote'],
  ['Danse sur la table de ta cuisine (stable !)', 'danse', 2, 15, 20, 'vote'],
  ['Danse du cheval invisible', 'danse', 2, 15, 20, 'vote'],
  ['Danse en miroir avec ton reflet', 'danse', 2, 15, 20, 'vote'],
  ['Trois pas de salsa en annonçant les pas', 'danse', 2, 15, 20, 'vote'],
  // GRIMACES & IMITATIONS
  ['La grimace la plus moche de ta vie', 'grimace', 1, 5, 6, 'vote'],
  ['Un singe qui découvre un téléphone', 'grimace', 2, 15, 20, 'vote'],
  ['Ta grand-mère qui découvre TikTok', 'grimace', 2, 20, 25, 'vote'],
  ['Rugis comme le Roi Lion', 'grimace', 1, 5, 8, 'vote'],
  ['Ne cligne pas des yeux', 'grimace', 2, 20, 30, 'secs'],
  ['Touche ton nez avec ta langue (ou essaie)', 'grimace', 1, 5, 8, 'vote'],
  ['Rejoue une scène culte de film', 'grimace', 3, 45, 60, 'vote'],
  ['Imite ton prof préféré', 'grimace', 2, 15, 20, 'vote'],
  ['Joie, peur, colère, amour, dégoût : enchaîne', 'grimace', 1, 8, 10, 'vote'],
  ['Un poisson hors de l\u2019eau', 'grimace', 1, 8, 10, 'vote'],
  ['Un T-Rex qui essaie de lacer ses chaussures', 'grimace', 2, 15, 20, 'vote'],
  ['L\u2019espion qui traverse la pièce', 'grimace', 1, 8, 10, 'vote'],
  ['Défilé de mannequin jusqu\u2019à la porte', 'grimace', 2, 15, 20, 'vote'],
  ['Glaçon dans le t-shirt, sans bouger', 'grimace', 2, 10, 15, 'secs'],
  ['T\u2019endormir debout en trois étapes', 'grimace', 1, 8, 10, 'vote'],
  ['Un chat qui voit un concombre', 'grimace', 1, 8, 10, 'vote'],
  ['Mange un citron entier sans grimacer', 'grimace', 3, 20, 30, 'vote'],
  ['Un vampire qui a peur de l\u2019ail', 'grimace', 2, 15, 20, 'vote'],
  ['Un secret inventé, chuchoté de façon dramatique', 'grimace', 2, 20, 25, 'vote'],
  ['Le sol est de la lave', 'grimace', 2, 15, 25, 'vote'],
  // ABSURDE
  ['Fais parler une chaussette sur ta main', 'absurde', 2, 15, 20, 'vote'],
  ['Cuillère en équilibre sur le nez', 'absurde', 3, 45, 60, 'secs'],
  ['Réponds à une banane comme à un appel', 'absurde', 1, 8, 10, 'vote'],
  ['Chante à fond la fenêtre ouverte', 'absurde', 3, 10, 15, 'vote'],
  ['Unboxing d\u2019un objet banal façon influenceur', 'absurde', 2, 25, 30, 'vote'],
  ['Mini-pyramide avec ce qu\u2019il y a autour de toi', 'absurde', 3, 45, 60, 'vote'],
  ['Cuillère de moutarde forte, sourire aux lèvres', 'absurde', 2, 5, 10, 'vote'],
  ['Souffle des bougies imaginaires et fais un vœu à voix haute', 'absurde', 1, 8, 10, 'vote'],
  ['Présente ta pièce comme un agent immobilier de luxe', 'absurde', 3, 45, 60, 'vote'],
  ['Sors dans la rue et fais un salut royal à un inconnu', 'absurde', 3, 10, 15, 'vote'],
  ['Bois un verre d\u2019eau la tête en bas', 'absurde', 3, 8, 12, 'vote'],
  ['Lance une chaussette dans un sac', 'absurde', 1, 8, 10, 'reps'],
  ['Lunettes à l\u2019envers, déclaration officielle', 'absurde', 2, 15, 20, 'vote'],
  ['Tuto : comment ouvrir une porte', 'absurde', 2, 15, 20, 'vote'],
  ['Émission de cuisine avec un objet non comestible', 'absurde', 3, 45, 60, 'vote'],
  ['Objet coincé sous le menton, en sautant', 'absurde', 2, 15, 20, 'secs'],
  ['Colle trois objets sur toi sans les mains', 'absurde', 2, 20, 30, 'vote'],
  ['Statue immobile pendant que tout le monde regarde', 'absurde', 3, 50, 60, 'vote'],
  ['Ta pose de super-héros, avec bruitages', 'absurde', 1, 5, 8, 'vote'],
  ['Joker du chaos : la bande choisit ton défi', 'absurde', 3, 45, 60, 'vote'],
];

export const DEFIS = RAW.map(([t, cat, lvl, min, max, score], i) => ({ id: i + 1, t, cat, lvl, min, max, score }));
export const byId = Object.fromEntries(DEFIS.map(d => [d.id, d]));

export const CATS = {
  sport:   { label: 'Sport',    bg: '#D9502F', fg: '#F3EDE2' },
  voix:    { label: 'Voix',     bg: '#2747A3', fg: '#F3EDE2' },
  danse:   { label: 'Danse',    bg: '#9C8AC9', fg: '#1A1714' },
  grimace: { label: 'Grimaces', bg: '#E3A72F', fg: '#1A1714' },
  absurde: { label: 'Absurde',  bg: '#2E6B4E', fg: '#F3EDE2' },
};

export const SCORE_LABEL = { reps: 'Score : répétitions', secs: 'Score : secondes tenues', vote: 'Score : vote des potes' };

export const PEOPLE = {
  me:    { color: '#D9502F', fg: '#F3EDE2' },
  lea:   { name: 'Léa',   color: '#2747A3', fg: '#F3EDE2', lifetime: 31 },
  yanis: { name: 'Yanis', color: '#2E6B4E', fg: '#F3EDE2', lifetime: 14 },
  ines:  { name: 'Inès',  color: '#9C8AC9', fg: '#1A1714', lifetime: 52 },
};

export const GRADES = [
  { min: 0, name: 'Poussin' },
  { min: 5, name: 'Petit joueur' },
  { min: 15, name: 'Cap' },
  { min: 30, name: 'Téméraire' },
  { min: 50, name: 'Kamikaze' },
  { min: 100, name: 'Légende' },
];
export const gradeOf = n => [...GRADES].reverse().find(g => n >= g.min);
export const nextGrade = n => GRADES.find(g => g.min > n);

export const PACKS = [
  { name: 'Soirée', n: 30, bg: '#D9502F' },
  { name: 'Couple', n: 30, bg: '#E9A9B4' },
  { name: 'Extrême', n: 30, bg: '#1A1714' },
  { name: 'Bureau', n: 30, bg: '#2747A3' },
  { name: 'Vacances', n: 30, bg: '#E3A72F' },
];

export const CAPTIONS = ['PAS CAP ?', 'LÉGENDE', 'AU SECOURS', 'CAP !', 'MAIS POURQUOI', 'RESPECT'];
