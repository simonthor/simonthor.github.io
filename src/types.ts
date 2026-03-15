export type PlanetData = {
    text: string;
    href: string;
    height: number;
    image: string;
    radius?: number;
    'width-rel'?: number;
};

export type AcademicLevel = {
    age?: number[];
    'high school'?: number[];
    university?: number[];
};

export type TipEntry = {
    name: string;
    links: string[];
    info: string | null;
    type: string[];
    subject: string;
    'academic level': AcademicLevel;
    season: string;
    months?: number[];
    archive?: boolean;
};
