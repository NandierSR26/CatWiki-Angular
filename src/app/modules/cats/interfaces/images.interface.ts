export interface ICatsImages {
    breeds: Breed[];
    id:     string;
    url:    string;
    width:  number;
    height: number;
}

export interface Breed {
    weight:             Weight;
    id:                 ID;
    name:               Name;
    cfa_url:            string;
    vetstreet_url:      string;
    vcahospitals_url:   string;
    temperament:        Temperament;
    origin:             Origin;
    country_codes:      CountryCode;
    country_code:       CountryCode;
    description:        string;
    life_span:          LifeSpan;
    indoor:             number;
    lap:                number;
    alt_names:          string;
    adaptability:       number;
    affection_level:    number;
    child_friendly:     number;
    dog_friendly:       number;
    energy_level:       number;
    grooming:           number;
    health_issues:      number;
    intelligence:       number;
    shedding_level:     number;
    social_needs:       number;
    stranger_friendly:  number;
    vocalisation:       number;
    experimental:       number;
    hairless:           number;
    natural:            number;
    rare:               number;
    rex:                number;
    suppressed_tail:    number;
    short_legs:         number;
    wikipedia_url:      string;
    hypoallergenic:     number;
    reference_image_id: ReferenceImageID;
}

export enum CountryCode {
    Eg = "EG",
}

export enum ID {
    Abys = "abys",
}

export enum LifeSpan {
    The1415 = "14 - 15",
}

export enum Name {
    Abyssinian = "Abyssinian",
}

export enum Origin {
    Egypt = "Egypt",
}

export enum ReferenceImageID {
    The0XYvRd7OD = "0XYvRd7oD",
}

export enum Temperament {
    ActiveEnergeticIndependentIntelligentGentle = "Active, Energetic, Independent, Intelligent, Gentle",
}

export interface Weight {
    imperial: Imperial;
    metric:   Metric;
}

export enum Imperial {
    The710 = "7  -  10",
}

export enum Metric {
    The35 = "3 - 5",
}
