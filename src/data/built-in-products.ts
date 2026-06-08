import type { ProductCategory } from '../types';

export interface BuiltInProduct {
  name: string;
  brand: string;
  category: ProductCategory;
  ingredients: string;
}

const BUILT_IN_PRODUCTS: BuiltInProduct[] = [
  // ── CeraVe ──
  {
    name: 'Hydrating Cleanser',
    brand: 'CeraVe',
    category: 'cleanser',
    ingredients: 'Aqua/Water, Glycerin, Cetearyl Alcohol, PEG-40 Stearate, Stearalkonium Chloride, Phenoxyethanol, Ceteareth-20, Behentrimonium Methosulfate, Ethylhexylglycerin, Cetyl Alcohol, Stearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Cholesterol, Phytosphingosine, Xanthan Gum, Sodium Hyaluronate, Sodium Lauroyl Lactylate, Disodium EDTA',
  },
  {
    name: 'Foaming Cleanser',
    brand: 'CeraVe',
    category: 'cleanser',
    ingredients: 'Aqua/Water, Cocamidopropyl Hydroxysultaine, Glycerin, Sodium Lauroyl Sarcosinate, Niacinamide, Gluconolactone, PEG-150 Pentaerythrityl Tetrastearate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Calcium Gluconate, Cholesterol, Phytosphingosine, Sodium Chloride, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Sodium Benzoate, Methylparaben, Propylparaben',
  },
  {
    name: 'SA Smoothing Cleanser',
    brand: 'CeraVe',
    category: 'cleanser',
    ingredients: 'Aqua/Water, Cocamidopropyl Hydroxysultaine, Glycerin, Sodium Lauroyl Sarcosinate, Niacinamide, Salicylic Acid, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Phytosphingosine, Sodium Chloride, Sodium Hyaluronate, Sodium Lauroyl Lactylate, Sodium Benzoate, Phenoxyethanol, Carbomer, Calcium Gluconate',
  },
  {
    name: 'Moisturising Lotion',
    brand: 'CeraVe',
    category: 'moisturiser',
    ingredients: 'Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Potassium Phosphate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Dimethicone, Behentrimonium Methosulfate, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phenoxyethanol, Disodium EDTA, Dipotassium Phosphate, Ethylhexylglycerin, Phytosphingosine, Methylparaben, Propylparaben, Xanthan Gum, Tocopherol',
  },
  {
    name: 'Moisturising Cream',
    brand: 'CeraVe',
    category: 'moisturiser',
    ingredients: 'Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Dimethicone, Potassium Phosphate, Behentrimonium Methosulfate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phenoxyethanol, Disodium EDTA, Dipotassium Phosphate, Ethylhexylglycerin, Phytosphingosine, Methylparaben, Propylparaben, Xanthan Gum, Tocopherol',
  },
  {
    name: 'AM Facial Moisturising Lotion SPF 25',
    brand: 'CeraVe',
    category: 'spf',
    ingredients: 'Aqua/Water, Homosalate, Niacinamide, Glycerin, Octocrylene, Ethylhexyl Salicylate, Silica, Butyl Methoxydibenzoylmethane, Dimethicone, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Behentrimonium Methosulfate, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phytosphingosine, Phenoxyethanol, Ceteareth-20, Xanthan Gum, Disodium EDTA, Tocopheryl Acetate, Lauroyl Lysine, Ethylhexylglycerin',
  },
  {
    name: 'PM Facial Moisturising Lotion',
    brand: 'CeraVe',
    category: 'moisturiser',
    ingredients: 'Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Niacinamide, Ceteareth-20, Petrolatum, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Dimethicone, Behentrimonium Methosulfate, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phenoxyethanol, Stearyl Alcohol, Cetyl Alcohol, Disodium EDTA, Dipotassium Phosphate, Ethylhexylglycerin, Phytosphingosine, Potassium Phosphate, Tocopherol, Xanthan Gum',
  },
  {
    name: 'Eye Repair Cream',
    brand: 'CeraVe',
    category: 'treatment',
    ingredients: 'Aqua/Water, Niacinamide, Glycerin, Cetearyl Alcohol, Behentrimonium Methosulfate, Dimethicone, Cetyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phytosphingosine, Phenoxyethanol, Ethylhexylglycerin, Panthenol, Tocopheryl Acetate, Marine Extract',
  },

  // ── The Ordinary ──
  {
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'serum',
    ingredients: 'Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin',
  },
  {
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    category: 'serum',
    ingredients: 'Aqua, Sodium Hyaluronate, Pentylene Glycol, Propanediol, Sodium Hyaluronate Crosspolymer, Panthenol, Ahnfeltia Concinna Extract, Glycerin, Trisodium Ethylenediamine Disuccinate, Citric Acid, Isoceteth-20, Ethoxydiglycol, Ethylhexylglycerin, Hexylene Glycol, 1,2-Hexanediol, Phenoxyethanol, Caprylyl Glycol',
  },
  {
    name: 'Glycolic Acid 7% Toning Solution',
    brand: 'The Ordinary',
    category: 'toner',
    ingredients: 'Aqua, Glycolic Acid, Rosa Damascena Flower Water, Centaurea Cyanus Flower Water, Aloe Barbadensis Leaf Water, Propanediol, Glycerin, Triethanolamine, Aminomethyl Propanol, Panax Ginseng Root Extract, Tasmannia Lanceolata Fruit/Leaf Extract, Aspartic Acid, Alanine, Glycine, Serine, Valine, Isoleucine, Proline, Threonine, Histidine, Phenylalanine, Glutamic Acid, Arginine, PCA, Sodium PCA, Sodium Lactate, Polysorbate 20, Gellan Gum, Trisodium Ethylenediamine Disuccinate, Sodium Chloride, Hexylene Glycol, Potassium Sorbate, Sodium Benzoate, 1,2-Hexanediol, Caprylyl Glycol',
  },
  {
    name: 'Salicylic Acid 2% Solution',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Aqua, Cocamidopropyl Dimethylamine, Salicylic Acid, Polysorbate 20, Hydroxyethylcellulose, Citric Acid, Pentylene Glycol, Sodium Citrate, Phenoxyethanol, Chlorphenesin',
  },
  {
    name: 'Retinol 0.5% in Squalane',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Squalane, Caprylic/Capric Triglyceride, Retinol, Solanum Lycopersicum (Tomato) Fruit Extract, Simmondsia Chinensis (Jojoba) Seed Oil, BHT, Rosmarinus Officinalis (Rosemary) Leaf Extract',
  },
  {
    name: 'AHA 30% + BHA 2% Peeling Solution',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Glycolic Acid, Aqua, Aloe Barbadensis Leaf Water, Sodium Hydroxide, Daucus Carota Sativa Extract, Propanediol, Cocamidopropyl Dimethylamine, Salicylic Acid, Potassium Citrate, Lactic Acid, Tartaric Acid, Citric Acid, Panthenol, Sodium Hyaluronate Crosspolymer, Tasmannia Lanceolata Fruit/Leaf Extract, Glycerin, Pentylene Glycol, Xanthan Gum, Polysorbate 20, Trisodium Ethylenediamine Disuccinate, Potassium Sorbate, Sodium Benzoate, Ethylhexylglycerin, 1,2-Hexanediol, Caprylyl Glycol',
  },
  {
    name: 'Squalane Cleanser',
    brand: 'The Ordinary',
    category: 'cleanser',
    ingredients: 'Squalane, Aqua, Coco-Caprylate/Caprate, Polyglyceryl-4 Oleate, Polysorbate 20, Sorbitan Oleate, Sucrose Stearate, Glycerin, Ethyl Macadamiate, Caprylic/Capric Triglyceride, Ethylhexyl Palmitate, Sucrose Laurate, Hydrogenated Starch Hydrolysate',
  },
  {
    name: 'Natural Moisturizing Factors + HA',
    brand: 'The Ordinary',
    category: 'moisturiser',
    ingredients: 'Aqua, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Propanediol, Stearyl Alcohol, Glycerin, Sodium Hyaluronate, Arginine, Aspartic Acid, Glycine, Alanine, Serine, Valine, Isoleucine, Proline, Threonine, Histidine, Phenylalanine, Sodium PCA, PCA, Sodium Lactate, Urea, Allantoin, Linoleic Acid, Oleic Acid, Phytosteryl Canola Glycerides, Palmitic Acid, Stearic Acid, Lecithin, Triolein, Tocopherol, Carbomer, Isoceteth-20, Polysorbate 60, Sodium Chloride, Citric Acid, Trisodium Ethylenediamine Disuccinate, Pentylene Glycol, Triethanolamine, Sodium Hydroxide, Phenoxyethanol, Chlorphenesin',
  },

  // ── La Roche-Posay ──
  {
    name: 'Toleriane Dermo-Cleanser',
    brand: 'La Roche-Posay',
    category: 'cleanser',
    ingredients: 'Aqua, Glycerin, Pentaerythrityl Tetraethylhexanoate, Propylene Glycol, Ammonium Polyacryloyldimethyl Taurate, Polysorbate 60, Ceramide NP, Niacinamide, Sodium Chloride, Coco-Betaine, Disodium EDTA, Caprylyl Glycol',
  },
  {
    name: 'Effaclar Purifying Foaming Gel',
    brand: 'La Roche-Posay',
    category: 'cleanser',
    ingredients: 'Aqua, Sodium Laureth Sulfate, PEG-8, Coco-Betaine, Hexylene Glycol, Sodium Chloride, PEG-120 Methyl Glucose Dioleate, Zinc PCA, Glycerin, Sodium Hydroxide, Citric Acid, Sodium Benzoate, Phenoxyethanol, Linalool, Parfum/Fragrance',
  },
  {
    name: 'Anthelios UVMune 400 Invisible Fluid SPF50+',
    brand: 'La Roche-Posay',
    category: 'spf',
    ingredients: 'Aqua, Diisopropyl Sebacate, Alcohol Denat., Silica, Isononyl Isononanoate, Butyl Methoxydibenzoylmethane, Octocrylene, C12-22 Alkyl Acrylate/Hydroxyethylacrylate Copolymer, Ethylhexyl Triazone, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Glycerin, Perlite, Drometrizole Trisiloxane, Caprylyl Glycol, Tocopherol, Disodium EDTA, Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Isohexadecane, Polysorbate 80',
  },
  {
    name: 'Cicaplast Baume B5+',
    brand: 'La Roche-Posay',
    category: 'moisturiser',
    ingredients: 'Aqua, Hydrogenated Polyisobutene, Dimethicone, Glycerin, Butyrospermum Parkii Butter, Cetearyl Alcohol, Panthenol, Aluminum Starch Octenylsuccinate, Propanediol, Madecassoside, Zinc Gluconate, Manganese Gluconate, Copper Gluconate, Ceramide NP, Tocopherol, Sodium Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Polyglyceryl-4 Isostearate, Cetyl Palmitate, Sodium Hydroxide, Sorbitan Oleate, Disodium EDTA, Phenoxyethanol, Chlorhexidine Digluconate',
  },

  // ── Simple ──
  {
    name: 'Kind to Skin Moisturising Facial Wash',
    brand: 'Simple',
    category: 'cleanser',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Propylene Glycol, Sodium Laureth Sulfate, Hydroxypropyl Methylcellulose, Panthenol, Tocopheryl Acetate, Sodium Hydroxide, Bisabolol, Pantolactone, Citric Acid, Disodium EDTA, Sodium Chloride, Sodium Benzoate, Phenoxyethanol',
  },
  {
    name: 'Kind to Skin Hydrating Light Moisturiser',
    brand: 'Simple',
    category: 'moisturiser',
    ingredients: 'Aqua, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Stearic Acid, Glyceryl Stearate, Dimethicone, Tocopheryl Acetate, Panthenol, Bisabolol, Carbomer, Triethanolamine, Disodium EDTA, Methylparaben, Phenoxyethanol, Propylparaben',
  },
  {
    name: 'Kind to Skin Soothing Facial Toner',
    brand: 'Simple',
    category: 'toner',
    ingredients: 'Aqua, Propylene Glycol, Chamomilla Recutita Flower Extract, Centaurea Cyanus Flower Water, Panthenol, Niacinamide, Tocopheryl Acetate, Glycerin, Allantoin, Bisabolol, Sodium Hydroxide, Citric Acid, Disodium EDTA, Cetrimonium Chloride, Sodium Benzoate, Iodopropynyl Butylcarbamate',
  },
  {
    name: "Protect 'n' Glow Brightening Eye Gel",
    brand: 'Simple',
    category: 'treatment',
    ingredients: 'Aqua, Glycerin, Dimethicone, Niacinamide, Pentylene Glycol, Cetyl Alcohol, Bisabolol, Panthenol, Tocopheryl Acetate, Sodium Hyaluronate, Carbomer, Triethanolamine, Phenoxyethanol',
  },

  // ── Neutrogena ──
  {
    name: 'Hydro Boost Water Gel',
    brand: 'Neutrogena',
    category: 'moisturiser',
    ingredients: 'Aqua, Dimethicone, Glycerin, Dimethicone/Vinyl Dimethicone Crosspolymer, Cetearyl Olivate, Phenoxyethanol, Polyacrylamide, Sorbitan Olivate, Sodium Hyaluronate, Dimethicone Crosspolymer, C13-14 Isoparaffin, Dimethiconol, Chlorphenesin, Carbomer, Laureth-7, Ethylhexylglycerin, Sodium Hydroxide',
  },
  {
    name: 'Hydro Boost Cleansing Gel',
    brand: 'Neutrogena',
    category: 'cleanser',
    ingredients: 'Aqua, Glycerin, Cocamidopropyl Hydroxysultaine, Sodium Cocoyl Isethionate, Sodium Methyl Cocoyl Taurate, Sodium Hyaluronate, Ethylhexylglycerin, Phenoxyethanol, Polyquaternium-10, Coco-Glucoside, Citric Acid, Sodium Chloride, Fragrance',
  },
  {
    name: 'Clear & Defend+ Facial Scrub',
    brand: 'Neutrogena',
    category: 'treatment',
    ingredients: 'Aqua, Glycerin, Salicylic Acid, Microcrystalline Cellulose, Cocamidopropyl Betaine, Sodium Laureth Sulfate, Acrylates Copolymer, Sodium Hydroxide, Disodium EDTA, Phenoxyethanol, Methylparaben, Propylparaben, Parfum, Limonene, Linalool',
  },

  // ── Garnier ──
  {
    name: 'Micellar Cleansing Water',
    brand: 'Garnier',
    category: 'cleanser',
    ingredients: 'Aqua, Hexylene Glycol, Glycerin, Disodium Cocoamphodiacetate, Disodium EDTA, Poloxamer 184, Polyaminopropyl Biguanide',
  },
  {
    name: 'SkinActive Rose Micellar Water',
    brand: 'Garnier',
    category: 'cleanser',
    ingredients: 'Aqua, Hexylene Glycol, Glycerin, Rosa Damascena Flower Water, Disodium Cocoamphodiacetate, Disodium EDTA, Poloxamer 184, Polyaminopropyl Biguanide, Linalool, Geraniol, Citronellol, Parfum',
  },

  // ── e.l.f. ──
  {
    name: 'Holy Hydration! Face Cream',
    brand: 'e.l.f.',
    category: 'moisturiser',
    ingredients: 'Water, Glycerin, Squalane, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Niacinamide, Cetearyl Olivate, Sorbitan Olivate, Sodium Hyaluronate, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin, Potassium Sorbate, Pentylene Glycol',
  },
  {
    name: 'Holy Hydration! Eye Cream',
    brand: 'e.l.f.',
    category: 'treatment',
    ingredients: 'Water, Glycerin, Cetearyl Alcohol, Niacinamide, Caprylic/Capric Triglyceride, Cetearyl Olivate, Sorbitan Olivate, Squalane, Sodium Hyaluronate, Peptide Complex, Ceramide NP, Panthenol, Tocopheryl Acetate, Carbomer, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── Revolution Skincare ──
  {
    name: 'Niacinamide 10% + Zinc 1% Serum',
    brand: 'Revolution Skincare',
    category: 'serum',
    ingredients: 'Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Glycerin, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin',
  },
  {
    name: 'Dewy Drench HA Serum',
    brand: 'Revolution Skincare',
    category: 'serum',
    ingredients: 'Aqua, Glycerin, Sodium Hyaluronate, Panthenol, Pentylene Glycol, Propanediol, Xanthan Gum, Citric Acid, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── L'Oréal ──
  {
    name: 'Revitalift Clinical SPF 50+ UV Fluid',
    brand: "L'Oréal",
    category: 'spf',
    ingredients: 'Aqua, Homosalate, Ethylhexyl Salicylate, Niacinamide, Octocrylene, Butyl Methoxydibenzoylmethane, Glycerin, Propanediol, Silica, Ethylhexyl Triazone, Drometrizole Trisiloxane, Dimethicone, Stearyl Alcohol, Cetyl Alcohol, Tocopherol, Panthenol, Hyaluronic Acid, Carbomer, Triethanolamine, Caprylyl Glycol, Phenoxyethanol',
  },
  {
    name: 'Revitalift Filler Hyaluronic Acid Serum',
    brand: "L'Oréal",
    category: 'serum',
    ingredients: 'Aqua, Dimethicone, Glycerin, Hydroxypropyl Tetrahydropyrantriol, Alcohol Denat., Hyaluronic Acid, Sodium Hyaluronate, Capryloyl Salicylic Acid, Adenosine, Cetyl Alcohol, PEG-20 Methyl Glucose Sesquistearate, Methyl Glucose Sesquistearate, Synthetic Fluorphlogopite, Ammonium Polyacryloyldimethyl Taurate, Caprylyl Glycol, Citric Acid, Hydroxyethylpiperazine Ethane Sulfonic Acid, Phenoxyethanol, Parfum, Linalool, Benzyl Salicylate, Benzyl Alcohol, Alpha-Isomethyl Ionone, Citronellol, Geraniol, Limonene',
  },

  // ── Nivea ──
  {
    name: 'Soft Moisturising Cream',
    brand: 'Nivea',
    category: 'moisturiser',
    ingredients: 'Aqua, Caprylic/Capric Triglyceride, Glycerin, Cetearyl Alcohol, Butyrospermum Parkii Butter, Glyceryl Stearate SE, Cera Microcristallina, Tocopheryl Acetate, Lanolin Alcohol, Octyldodecanol, Aluminum Stearates, Citric Acid, Potassium Phosphate, Dipotassium Phosphate, Sodium Carbomer, Phenoxyethanol, Parfum, Limonene, Linalool, Citronellol, Geraniol, Hydroxycitronellal, Coumarin, Benzyl Benzoate',
  },

  // ── Bioderma ──
  {
    name: 'Sensibio H2O Micellar Water',
    brand: 'Bioderma',
    category: 'cleanser',
    ingredients: 'Aqua, PEG-6 Caprylic/Capric Glycerides, Fructooligosaccharides, Mannitol, Xylitol, Rhamnose, Cucumis Sativus Fruit Extract, Propylene Glycol, Cetrimonium Bromide, Disodium EDTA',
  },

  // ── Drunk Elephant ──
  {
    name: 'Protini Polypeptide Cream',
    brand: 'Drunk Elephant',
    category: 'moisturiser',
    ingredients: 'Water, Dicaprylyl Carbonate, Glycerin, Cetearyl Alcohol, Cetearyl Olivate, Sorbitan Olivate, Acetyl Hexapeptide-8, Copper Tripeptide-1, Palmitoyl Tetrapeptide-7, Palmitoyl Tripeptide-1, Sodium Hyaluronate, Pygmy Waterlily Stem Cell Extract, Sclerocarya Birrea Seed Oil, Helianthus Annuus Seed Oil, Chrondrus Crispus Extract, Opuntia Ficus-Indica Stem Extract, Penylene Glycol, Caprylyl Glycol, Citric Acid, Polysorbate 60, Sodium Hydroxide, Xanthan Gum, Phenoxyethanol',
  },

  // ── COSRX ──
  {
    name: 'Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    category: 'serum',
    ingredients: 'Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Hyaluronate, Panthenol, Arginine, Allantoin, Ethyl Hexanediol, Sodium Polyacrylate, Carbomer, Phenoxyethanol',
  },
  {
    name: 'Low pH Good Morning Gel Cleanser',
    brand: 'COSRX',
    category: 'cleanser',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Polysorbate 20, Styrax Japonicus Branch/Fruit/Leaf Extract, Butylene Glycol, Saccharomyces Ferment, Cryptomeria Japonica Leaf Extract, Nelumbo Nucifera Leaf Extract, Pinus Palustris Leaf Extract, Ulmus Davidiana Root Extract, Oenothera Biennis Flower Extract, Pueraria Lobata Root Extract, Melaleuca Alternifolia Leaf Oil, Allantoin, Caprylyl Glycol, Ethylhexylglycerin, Betaine Salicylate, Citric Acid, Sodium Chloride, Disodium EDTA',
  },

  // ── Paula's Choice ──
  {
    name: 'Skin Perfecting 2% BHA Liquid Exfoliant',
    brand: "Paula's Choice",
    category: 'treatment',
    ingredients: 'Aqua, Methylpropanediol, Butylene Glycol, Salicylic Acid, Polysorbate 20, Green Tea Extract, Methylpropanediol, Sodium Hydroxide, Tetrasodium EDTA',
  },

  // ── Superdrug ──
  {
    name: 'Simply Pure Hydrating Serum',
    brand: 'Superdrug',
    category: 'serum',
    ingredients: 'Aqua, Glycerin, Pentylene Glycol, Sodium Hyaluronate, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── Eucerin ──
  {
    name: 'DermatoCLEAN Refreshing Cleansing Gel',
    brand: 'Eucerin',
    category: 'cleanser',
    ingredients: 'Aqua, Glycerin, Sodium Laureth Sulfate, Cocamidopropyl Betaine, PEG-200 Hydrogenated Glyceryl Palmate, Sodium Chloride, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, PEG-7 Glyceryl Cocoate, PEG-40 Hydrogenated Castor Oil, Sodium Hydroxide, Lactic Acid, Disodium EDTA, Phenoxyethanol, Parfum',
  },

  // ── Pixi ──
  {
    name: 'Glow Tonic',
    brand: 'Pixi',
    category: 'toner',
    ingredients: 'Aqua, Aloe Barbadensis Leaf Juice, Glycolic Acid, Hamamelis Virginiana Water, Butylene Glycol, Glycerin, Aesculus Hippocastanum Extract, Flos Lonicerae Extract, Hexylene Glycol, Saccharum Officinarum Extract, Biotin, Gluconolactone, Sodium Benzoate, Potassium Sorbate, Sodium Hydroxide, Phenoxyethanol',
  },

  // ── Boots ──
  {
    name: 'Vitamin E Moisture Cream',
    brand: 'Boots',
    category: 'moisturiser',
    ingredients: 'Aqua, Glycerin, Paraffinum Liquidum, Cetearyl Alcohol, Glyceryl Stearate, PEG-100 Stearate, Dimethicone, Tocopheryl Acetate, Phenoxyethanol, Carbomer, Methylparaben, Triethanolamine, Propylparaben, Disodium EDTA, BHT, Parfum, Linalool, Hexyl Cinnamal, Benzyl Salicylate, Limonene, Alpha-Isomethyl Ionone',
  },

  // ── The Ordinary (expanded) ──
  {
    name: 'Vitamin C Suspension 23% + HA Spheres 2%',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Ascorbic Acid, Squalane, Isodecyl Neopentanoate, Isononyl Isononanoate, Coconut Alkanes, Ethylene/Propylene/Styrene Copolymer, Ethylhexyl Palmitate, Silica Dimethyl Silylate, Sodium Hyaluronate, Glucomannan, Coco-Caprylate/Caprate, Butylene/Ethylene/Styrene Copolymer, Acrylates/Ethylhexyl Acrylate Crosspolymer, Trihydroxystearin, BHT',
  },
  {
    name: 'Ascorbic Acid 8% + Alpha Arbutin 2%',
    brand: 'The Ordinary',
    category: 'serum',
    ingredients: 'Aqua, Ascorbic Acid, Alpha-Arbutin, Propanediol, Triethanolamine, Isodecyl Neopentanoate, Ethoxydiglycol, Dimethyl Isosorbide, Glycerin, Ethylene/Propylene/Styrene Copolymer, Butylene/Ethylene/Styrene Copolymer, Acrylates/Ethylhexyl Acrylate Crosspolymer, Xanthan Gum, Trisodium Ethylenediamine Disuccinate, Phenoxyethanol, Chlorphenesin, BHT',
  },
  {
    name: 'Azelaic Acid Suspension 10%',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Aqua, Isodecyl Neopentanoate, Dimethicone, Azelaic Acid, Dimethicone/Bis-Isobutyl PPG-20 Crosspolymer, Dimethyl Isosorbide, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Polysilicone-11, Isohexadecane, Tocopherol, Trisodium Ethylenediamine Disuccinate, Isoceteth-20, Polysorbate 60, Triethanolamine, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin',
  },
  {
    name: 'Lactic Acid 10% + HA',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Aqua, Lactic Acid, Glycerin, Pentylene Glycol, Propanediol, Sodium Hyaluronate Crosspolymer, Tasmannia Lanceolata Fruit/Leaf Extract, Acacia Senegal Gum, Xanthan Gum, Isoceteth-20, Trisodium Ethylenediamine Disuccinate, Sodium Hydroxide, Ethylhexylglycerin, 1,2-Hexanediol, Caprylyl Glycol',
  },
  {
    name: 'Retinol 1% in Squalane',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Squalane, Caprylic/Capric Triglyceride, Retinol, Solanum Lycopersicum (Tomato) Fruit Extract, Simmondsia Chinensis (Jojoba) Seed Oil, BHT, Rosmarinus Officinalis (Rosemary) Leaf Extract',
  },
  {
    name: 'Alpha Arbutin 2% + HA',
    brand: 'The Ordinary',
    category: 'serum',
    ingredients: 'Aqua, Alpha-Arbutin, Polyacrylate Crosspolymer-6, Sodium Hyaluronate, Dimethyl Isosorbide, Propanediol, PPG-26-Buteth-26, Trisodium Ethylenediamine Disuccinate, Ethoxydiglycol, PEG-40 Hydrogenated Castor Oil, Citric Acid, Isoceteth-20, Pentylene Glycol, 1,2-Hexanediol, Caprylyl Glycol, Phenoxyethanol, Chlorphenesin',
  },
  {
    name: 'Caffeine Solution 5% + EGCG',
    brand: 'The Ordinary',
    category: 'serum',
    ingredients: 'Aqua, Caffeine, Maltodextrin, Glycerin, Propanediol, Epigallocatechin Gallatyl Glucoside, Gallyl Glucoside, Hyaluronic Acid, Oxidized Glutathione, Melanin, Glycine Soja Seed Extract, Urea, Pentylene Glycol, Ethylhexylglycerin, Sodium Chloride, Sodium Citrate, Citric Acid, Polysorbate 20, Disodium EDTA, Xanthan Gum, 1,2-Hexanediol, Caprylyl Glycol, Phenoxyethanol',
  },
  {
    name: 'Granactive Retinoid 2% Emulsion',
    brand: 'The Ordinary',
    category: 'treatment',
    ingredients: 'Aqua, Glycerin, Caprylic/Capric Triglyceride, Methyl Glucose Sesquistearate, Dimethyl Isosorbide, Cetearyl Isononanoate, Bisabolol, Ethoxydiglycol, Hydroxypinacolone Retinoate, Retinol, Tasmannia Lanceolata Fruit/Leaf Extract, Inulin Lauryl Carbamate, Jojoba Esters, Cetearyl Alcohol, Sodium Stearoyl Glutamate, Xanthan Gum, Potassium Sorbate, Ethylhexylglycerin, Phenoxyethanol, BHT',
  },

  // ── La Roche-Posay (expanded) ──
  {
    name: 'Effaclar Duo+ SPF30',
    brand: 'La Roche-Posay',
    category: 'moisturiser',
    ingredients: 'Aqua, Homosalate, Silica, Glycerin, Niacinamide, Ethylhexyl Salicylate, Butyl Methoxydibenzoylmethane, Octocrylene, Dimethicone, Salicylic Acid, Linoleic Acid, Piroctone Olamine, Tocopherol, Mannose, Capryloyl Glycine, Sodium Hydroxide, Carbomer, Poloxamer 338, Phenoxyethanol',
  },
  {
    name: 'Hyalu B5 Serum',
    brand: 'La Roche-Posay',
    category: 'serum',
    ingredients: 'Aqua, Glycerin, Alcohol Denat., Dimethicone, Hydroxyethylpiperazine Ethane Sulfonic Acid, Hyaluronic Acid, Sodium Hyaluronate, Madecassoside, Panthenol, Adenosine, Mannose, Vitreoscilla Ferment, Ammonium Polyacryloyldimethyl Taurate, Caprylyl Glycol, Citric Acid, Disodium EDTA, Phenoxyethanol',
  },
  {
    name: 'Effaclar Serum',
    brand: 'La Roche-Posay',
    category: 'serum',
    ingredients: 'Aqua, Glycerin, Niacinamide, Dimethicone, Salicylic Acid, Glycolic Acid, Alcohol Denat., Hydroxyethylpiperazine Ethane Sulfonic Acid, Zinc PCA, Piroctone Olamine, Sodium Hydroxide, Carbomer, Poloxamer 338, Phenoxyethanol, Parfum',
  },

  // ── Byoma ──
  {
    name: 'Moisturizing Gel Cream',
    brand: 'Byoma',
    category: 'moisturiser',
    ingredients: 'Aqua, Glycerin, Squalane, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Niacinamide, Sodium Hyaluronate, Panthenol, Sorbitan Olivate, Cetearyl Olivate, Carbomer, Xanthan Gum, Citric Acid, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin',
  },
  {
    name: 'Creamy Jelly Cleanser',
    brand: 'Byoma',
    category: 'cleanser',
    ingredients: 'Aqua, Glycerin, Coco-Glucoside, Cocamidopropyl Betaine, Sodium Lauroyl Sarcosinate, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Niacinamide, Panthenol, Allantoin, Citric Acid, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin',
  },
  {
    name: 'Brightening Serum',
    brand: 'Byoma',
    category: 'serum',
    ingredients: 'Aqua, Propanediol, Glycerin, Niacinamide, Ascorbyl Glucoside, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Alpha-Arbutin, Tranexamic Acid, Panthenol, Xanthan Gum, Citric Acid, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── Cetaphil ──
  {
    name: 'Gentle Skin Cleanser',
    brand: 'Cetaphil',
    category: 'cleanser',
    ingredients: 'Aqua, Cetyl Alcohol, Propylene Glycol, Sodium Lauryl Sulfate, Stearyl Alcohol, Methylparaben, Propylparaben, Butylparaben',
  },
  {
    name: 'Moisturising Lotion',
    brand: 'Cetaphil',
    category: 'moisturiser',
    ingredients: 'Aqua, Glycerin, Hydrogenated Polyisobutene, Cetearyl Alcohol, Ceteareth-20, Macadamia Integrifolia Seed Oil, Dimethicone, Tocopheryl Acetate, Panthenol, Niacinamide, Glyceryl Stearate, PEG-100 Stearate, Benzyl Alcohol, Phenoxyethanol, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Sodium Hydroxide, Citric Acid',
  },

  // ── Avène ──
  {
    name: 'Tolérance Extrême Cleansing Lotion',
    brand: 'Avène',
    category: 'cleanser',
    ingredients: 'Avene Aqua, Squalane, Behenyl Alcohol, Caprylic/Capric Triglyceride, Glycerin, Sodium Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Aqua',
  },
  {
    name: 'Cicalfate+ Restorative Protective Cream',
    brand: 'Avène',
    category: 'moisturiser',
    ingredients: 'Avene Aqua, Mineral Oil, Glycerin, Copper Sulfate, Zinc Sulfate, Sucrose Stearate, Microcrystalline Wax, Cetearyl Alcohol, Glyceryl Stearate, Panthenol, Beeswax, Aluminum Sucrose Octasulfate, Cetyl Esters, Zinc Oxide, Glycine, Phenoxyethanol, Titanium Dioxide',
  },

  // ── Vichy ──
  {
    name: 'Minéral 89 Hyaluronic Acid Booster',
    brand: 'Vichy',
    category: 'serum',
    ingredients: 'Aqua, Glycerin, Dimethicone, Sodium Hyaluronate, Hydroxypropyl Tetrahydropyrantriol, Caffeyl Hydroxyphenylpropionamide, Caprylyl Glycol, Carbomer, Citric Acid, Sodium Hydroxide, Phenoxyethanol',
  },
  {
    name: 'Normaderm Phytosolution Double-Correction Daily Care',
    brand: 'Vichy',
    category: 'moisturiser',
    ingredients: 'Aqua, Dimethicone, Glycerin, Alcohol Denat., Niacinamide, Salicylic Acid, Bifida Ferment Lysate, Hyaluronic Acid, Capryloyl Glycine, Citric Acid, Zinc PCA, Copper PCA, Phytosphingosine, Sodium Hydroxide, Carbomer, Phenoxyethanol',
  },

  // ── Olay ──
  {
    name: 'Regenerist Micro-Sculpting Cream',
    brand: 'Olay',
    category: 'moisturiser',
    ingredients: 'Water, Glycerin, Niacinamide, Isohexadecane, Dimethicone, Panthenol, Palmitoyl Pentapeptide-4, Tocopheryl Acetate, Sodium Hyaluronate, Allantoin, Camellia Sinensis Leaf Extract, Cetearyl Alcohol, PEG-100 Stearate, Glyceryl Stearate, Dimethicone Crosspolymer, Carbomer, Phenoxyethanol, Ethylhexylglycerin, Parfum',
  },
  {
    name: 'Total Effects 7-in-1 Day Cream SPF15',
    brand: 'Olay',
    category: 'spf',
    ingredients: 'Water, Glycerin, Niacinamide, Ethylhexyl Salicylate, Isopropyl Isostearate, Dimethicone, Butyl Methoxydibenzoylmethane, Tocopheryl Acetate, Panthenol, Sodium Hyaluronate, Ascorbyl Glucoside, Green Tea Extract, Cetearyl Alcohol, Glyceryl Stearate, PEG-100 Stearate, Carbomer, Sodium Hydroxide, Phenoxyethanol, Parfum',
  },

  // ── Bondi Sands ──
  {
    name: 'SPF 50+ Fragrance Free Sunscreen Lotion',
    brand: 'Bondi Sands',
    category: 'spf',
    ingredients: 'Water, Homosalate, Octocrylene, Ethylhexyl Salicylate, Butyl Methoxydibenzoylmethane, Glycerin, Cetearyl Alcohol, Dimethicone, Aloe Barbadensis Leaf Juice, Tocopheryl Acetate, Ceteareth-20, Phenoxyethanol, Carbomer, Sodium Hydroxide',
  },

  // ── Superdrug (expanded) ──
  {
    name: 'Simply Pure Soothing Serum',
    brand: 'Superdrug',
    category: 'serum',
    ingredients: 'Aqua, Glycerin, Panthenol, Pentylene Glycol, Sodium Hyaluronate, Bisabolol, Allantoin, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum, Citric Acid, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin',
  },
  {
    name: 'Vitamin C Serum',
    brand: 'Superdrug',
    category: 'serum',
    ingredients: 'Aqua, Ascorbic Acid, Propanediol, Glycerin, Sodium Hyaluronate, Pentylene Glycol, Ethoxydiglycol, Xanthan Gum, Citric Acid, Trisodium Ethylenediamine Disuccinate, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── COSRX (expanded) ──
  {
    name: 'AHA/BHA Clarifying Treatment Toner',
    brand: 'COSRX',
    category: 'toner',
    ingredients: 'Mineral Water, Salix Alba (Willow) Bark Water, Pyrus Malus (Apple) Fruit Water, Glycolic Acid, Betaine Salicylate, Butylene Glycol, 1,2-Hexanediol, Sodium Lactate, Glycerin, Allantoin, Panthenol, Ethyl Hexanediol',
  },
  {
    name: 'BHA Blackhead Power Liquid',
    brand: 'COSRX',
    category: 'treatment',
    ingredients: 'Salix Alba (Willow) Bark Water, Butylene Glycol, Betaine Salicylate, Niacinamide, 1,2-Hexanediol, Arginine, Panthenol, Sodium Hyaluronate, Xanthan Gum, Ethyl Hexanediol',
  },
  {
    name: 'AHA 7 Whitehead Power Liquid',
    brand: 'COSRX',
    category: 'treatment',
    ingredients: 'Pyrus Malus (Apple) Fruit Water, Butylene Glycol, Glycolic Acid, Niacinamide, Sodium Lactate, 1,2-Hexanediol, Sodium Hyaluronate, Panthenol, Allantoin, Xanthan Gum, Ethyl Hexanediol',
  },

  // ── Skin + Me ──
  {
    name: 'Daily Defence SPF 50',
    brand: 'Skin + Me',
    category: 'spf',
    ingredients: 'Aqua, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Glycerin, Niacinamide, C12-15 Alkyl Benzoate, Dimethicone, Cetearyl Alcohol, Phenoxyethanol, Tocopheryl Acetate, Sodium Hyaluronate, Ethylhexylglycerin, Carbomer, Sodium Hydroxide',
  },

  // ── Beauty of Joseon ──
  {
    name: 'Relief Sun: Rice + Probiotics SPF50+',
    brand: 'Beauty of Joseon',
    category: 'spf',
    ingredients: 'Oryza Sativa (Rice) Extract, Dibutyl Adipate, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Propanediol, Polymethylsilsesquioxane, Niacinamide, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Triazone, Coco-Caprylate/Caprate, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol, Glycerin, Lactobacillus/Rice Ferment, Sodium Hyaluronate, Panthenol, Allantoin, Tocopherol, Caprylyl Glycol, Ethylhexylglycerin',
  },
  {
    name: 'Glow Serum: Propolis + Niacinamide',
    brand: 'Beauty of Joseon',
    category: 'serum',
    ingredients: 'Propolis Extract, Dipropylene Glycol, Glycerin, Butylene Glycol, Niacinamide, 1,2-Hexanediol, Water, Sodium Hyaluronate, Adenosine, Camellia Sinensis Leaf Extract, Panthenol, Allantoin, Xanthan Gum, Ethylhexylglycerin',
  },

  // ── Altruist ──
  {
    name: 'Dermatologist Sunscreen SPF 50',
    brand: 'Altruist',
    category: 'spf',
    ingredients: 'Aqua, Homosalate, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, C12-15 Alkyl Benzoate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Glycerin, Cetearyl Alcohol, Tocopheryl Acetate, Panthenol, Dimethicone, Phenoxyethanol, Carbomer, Sodium Hydroxide, Disodium EDTA',
  },

  // ── Drunk Elephant (expanded) ──
  {
    name: 'T.L.C. Sukari Babyfacial',
    brand: 'Drunk Elephant',
    category: 'treatment',
    ingredients: 'Water, Glycolic Acid, Sodium Hydroxypropyl Starch Phosphate, Lactic Acid, Tartaric Acid, Citric Acid, Salicylic Acid, Hydroxyethylcellulose, Chickpea Flour, Sclerocarya Birrea Seed Oil, Passiflora Edulis Seed Oil, Sodium Hyaluronate Crosspolymer, Camellia Sinensis Leaf Extract, Vitis Vinifera Seed Extract, Aloe Barbadensis Leaf Juice, Panthenol, Sodium Hyaluronate, Glycerin, Propanediol, Xanthan Gum, Pentylene Glycol, Phenoxyethanol, Ethylhexylglycerin',
  },
  {
    name: 'C-Firma Fresh Day Serum',
    brand: 'Drunk Elephant',
    category: 'serum',
    ingredients: 'Aqua, Ascorbic Acid, Glycerin, Laureth-23, Cetearyl Alcohol, Sodium Hyaluronate, Ferulic Acid, Tocopherol, Sodium Hyaluronate Crosspolymer, Panthenol, Camellia Sinensis Leaf Extract, Vitis Vinifera Seed Extract, Sclerocarya Birrea Seed Oil, Chrondrus Crispus Extract, Xanthan Gum, Ceteareth-20, Citric Acid, Pentylene Glycol, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── The INKEY List ──
  {
    name: 'Hyaluronic Acid Serum',
    brand: 'The INKEY List',
    category: 'serum',
    ingredients: 'Aqua, Glycerin, Sodium Hyaluronate, Matrixyl 3000 Peptide Complex, Pentylene Glycol, Propanediol, Phenoxyethanol, Ethylhexylglycerin, Carbomer, Sodium Hydroxide',
  },
  {
    name: 'Retinol Serum',
    brand: 'The INKEY List',
    category: 'serum',
    ingredients: 'Squalane, Caprylic/Capric Triglyceride, Retinol, Granactive Retinoid, Dimethyl Isosorbide, Bisabolol, Rosmarinus Officinalis Leaf Extract, Tocopherol, BHT',
  },
  {
    name: 'Vitamin C Serum',
    brand: 'The INKEY List',
    category: 'serum',
    ingredients: 'Aqua, Ascorbyl Glucoside, Propanediol, Glycerin, Pentylene Glycol, Sodium Hyaluronate, Xanthan Gum, Citric Acid, Trisodium Ethylenediamine Disuccinate, Phenoxyethanol, Ethylhexylglycerin',
  },
  {
    name: 'Salicylic Acid Cleanser',
    brand: 'The INKEY List',
    category: 'cleanser',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Salicylic Acid, Zinc PCA, Allantoin, Glycerin, Coco-Glucoside, Phenoxyethanol, Ethylhexylglycerin, Citric Acid, Sodium Chloride',
  },
  {
    name: 'Niacinamide Serum',
    brand: 'The INKEY List',
    category: 'serum',
    ingredients: 'Aqua, Niacinamide, Pentylene Glycol, Glycerin, Sodium Hyaluronate, Zinc PCA, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── Medik8 ──
  {
    name: 'Crystal Retinal 3',
    brand: 'Medik8',
    category: 'treatment',
    ingredients: 'Aqua, Glycerin, Caprylic/Capric Triglyceride, Squalane, Retinaldehyde, Tocopheryl Acetate, Vitamin E, Sodium Hyaluronate, Ceramide NP, Climbazole, Panthenol, Dimethicone, Cetearyl Alcohol, Phenoxyethanol, Ethylhexylglycerin, Carbomer, Sodium Hydroxide',
  },
  {
    name: 'C-Tetra Lipid Vitamin C Serum',
    brand: 'Medik8',
    category: 'serum',
    ingredients: 'Tetrahexyldecyl Ascorbate, Squalane, Caprylic/Capric Triglyceride, Jojoba Esters, Tocopherol, Bisabolol, Rosmarinus Officinalis Leaf Extract, BHT',
  },

  // ── Boots No7 ──
  {
    name: 'Protect & Perfect Intense Advanced Day Cream SPF 30',
    brand: 'No7',
    category: 'spf',
    ingredients: 'Aqua, Glycerin, Ethylhexyl Salicylate, Butyl Methoxydibenzoylmethane, Octocrylene, Dimethicone, Cetearyl Alcohol, Niacinamide, Retinyl Palmitate, Ascorbyl Glucoside, Tocopheryl Acetate, Sodium Hyaluronate, Glyceryl Stearate, PEG-100 Stearate, Phenoxyethanol, Carbomer, Sodium Hydroxide, Parfum',
  },
  {
    name: 'Advanced Retinol 1.5% Complex Night Concentrate',
    brand: 'No7',
    category: 'treatment',
    ingredients: 'Aqua, Dimethicone, Glycerin, Isononyl Isononanoate, Retinol, Retinyl Palmitate, Bisabolol, Tocopheryl Acetate, Panthenol, Sodium Hyaluronate, Cetearyl Alcohol, Phenoxyethanol, Carbomer, Triethanolamine, Parfum, Linalool, Hexyl Cinnamal, Limonene',
  },

  // ── Versed ──
  {
    name: 'Dew Point Moisturizing Gel-Cream',
    brand: 'Versed',
    category: 'moisturiser',
    ingredients: 'Water, Aloe Barbadensis Leaf Juice, Glycerin, Squalane, Sodium Hyaluronate, Green Tea Extract, Niacinamide, Jojoba Esters, Cetearyl Olivate, Sorbitan Olivate, Panthenol, Allantoin, Tocopherol, Carbomer, Phenoxyethanol, Ethylhexylglycerin',
  },

  // ── Face Masks ──
  {
    name: 'Pure Clay Mask - Purify & Mattify',
    brand: "L'Oréal",
    category: 'mask',
    ingredients: 'Kaolin, Aqua, Bentonite, Glycerin, Silica, Niacinamide, Zinc PCA, Salicylic Acid, Cetearyl Alcohol, PEG-100 Stearate, Glyceryl Stearate, Carbomer, Phenoxyethanol, Disodium EDTA, Sodium Hydroxide',
  },
  {
    name: 'Salicylic Acid 2% Masque',
    brand: 'The Ordinary',
    category: 'mask',
    ingredients: 'Aqua, Kaolin, Salicylic Acid, Charcoal Powder, Glycerin, Propanediol, Cocamidopropyl Dimethylamine, Hydroxyethylcellulose, Citric Acid, Pentylene Glycol, Sodium Citrate, Phenoxyethanol, Chlorphenesin',
  },
  {
    name: 'Ultimate Nourishing Rice Overnight Mask',
    brand: 'COSRX',
    category: 'mask',
    ingredients: 'Oryza Sativa (Rice) Water, Glycerin, Niacinamide, Panthenol, Sodium Hyaluronate, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Allantoin, Beta-Glucan, Adenosine, Butylene Glycol, Carbomer, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin',
  },
  {
    name: 'Moisture Bomb Hyaluronic Acid Sheet Mask',
    brand: 'Garnier',
    category: 'mask',
    ingredients: 'Aqua, Glycerin, Sodium Hyaluronate, Aloe Barbadensis Leaf Juice, Panthenol, Niacinamide, Allantoin, Propylene Glycol, Hydroxyethylcellulose, Phenoxyethanol, Citric Acid, Disodium EDTA, Sodium Benzoate, Potassium Sorbate',
  },
  {
    name: 'Clear Improvement Active Charcoal Mask',
    brand: 'Origins',
    category: 'mask',
    ingredients: 'Aqua, Kaolin, Glycerin, Charcoal Powder, Salicylic Acid, Bambusa Vulgaris Extract, Zinc PCA, Saccharomyces Ferment, Silica, Cetearyl Alcohol, Glyceryl Stearate, Phenoxyethanol, Carbomer, Sodium Hydroxide',
  },
  {
    name: 'Kind to Skin Revitalising Sheet Mask',
    brand: 'Simple',
    category: 'mask',
    ingredients: 'Aqua, Glycerin, Niacinamide, Panthenol, Allantoin, Tocopheryl Acetate, Bisabolol, Sodium Hyaluronate, Propylene Glycol, Hydroxyethylcellulose, Citric Acid, Phenoxyethanol',
  },

  // ── Kiehl's ──
  {
    name: 'Ultra Facial Cream',
    brand: "Kiehl's",
    category: 'moisturiser',
    ingredients: 'Aqua, Squalane, Glycerin, Sucrose Stearate, Bis-PEG-18 Methyl Ether Dimethyl Silane, Stearyl Alcohol, Myristyl Myristate, Glyceryl Stearate SE, Imperata Cylindrica Root Extract, Olea Europaea Fruit Oil, Prunus Armeniaca Kernel Oil, Persea Gratissima Oil, Tocopherol, Phenoxyethanol, Carbomer, Sodium Hydroxide, Disodium EDTA',
  },
];

export default BUILT_IN_PRODUCTS;
