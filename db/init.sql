CREATE TABLE animals (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(10)  NOT NULL,
  age         INTEGER      NOT NULL,
  breed       VARCHAR(100),
  description TEXT,
  image_url   TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'available'
);

CREATE TABLE adoptions (
  id             SERIAL PRIMARY KEY,
  animal_id      INTEGER NOT NULL UNIQUE REFERENCES animals(id),
  applicant_name VARCHAR(150) NOT NULL,
  email          VARCHAR(150) NOT NULL,
  phone          VARCHAR(50),
  message        TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO animals (name, type, age, breed, description) VALUES
('Munis',   'kissa', 7,  'Maatiaiskissa',      'Leikkisä ja utelias kissa.'),
('Minttu',  'koira', 13, 'Sheltti',            'Uskollinen ja älykäs koira.'),
('Vikke',   'koira', 5,  'Plotti',             'Energinen metsästyskoira.'),
('Veksi',   'koira', 3,  'Amerikankettukoira', 'Innokas metsästäjä ja energinen pakkaus, joka tarvitsee paljon liikuntaa.'),
('Viki',    'koira', 4,  'Drever',             'Rakastaa metsästystä ja vielä enemmän keppien kantamista.'),
('Tiikeri', 'kissa', 6,  'Norjanmetsäkissa',   'Rauhallinen ja arvokas kissa, joka rakastaa sylissä köllöttelyä.'),
('Salem',   'kissa', 4,  'Venäjänsininen',     'Hieman ujo mutta kiintyy nopeasti ja seuraa omistajaansa kotona.'),
('Pörri',   'kissa', 3,  'Persialainen',       'Pehmeäkarvainen ja leppoisa kissa, joka nauttii rapsutuksista.'),
('Kaneli',  'kissa', 2,  'Siamilainen',        'Äänekäs ja seurallinen kissa, joka hasaa jutella kanssasi.');

DELETE FROM animals
WHERE name = 'Luna';