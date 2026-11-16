# Vaasan Eläinsuoja – Adoptiojärjestelmä

## Projektin kuvaus

Vaasan Eläinsuoja ry:lle toteutettu verkkosovellus, jonka avulla käyttäjät voivat tutustua adoptoitaviin eläimiin, tarkastella niiden tietoja ja lähettää adoptiohakemuksen sähköisesti.

## Teknologiat

- HTML, CSS ja JavaScript
- Node.js ja Express
- PostgreSQL
- Docker ja Docker Compose
- Pixabay API eläinkuvien hakemiseen

## Käynnistysvaatimukset

- Docker Desktop asennettuna
- Git asennettuna, jos projekti kloonataan GitHubista

## Asennus ja käynnistys

1. Kloonaa projekti GitHubista:

   ```bash
   git clone <GitHub-repositorion-osoite>
   ```

2. Siirry projektin kansioon:

   ```bash
   cd <projektin-kansio>
   ```

3. Käynnistä Docker Desktop.

4. Käynnistä kaikki palvelut projektin juurikansiosta:

   ```bash
   docker-compose up --build
   ```

5. Avaa verkkosovellus selaimessa:

   http://localhost:8080

Docker Compose käynnistää neljä palvelua:
- Frontend
- Server A
- Server B
- PostgreSQL-tietokanta

Tietokanta alustetaan automaattisesti `db/init.sql`-tiedostolla ensimmäisen alustuksen yhteydessä.

## Palveluiden osoitteet

| Palvelu | Osoite |
|---|---|
| Frontend | http://localhost:8080 |
| Server A | http://localhost:3000 |
| Server B | http://localhost:3001 |
| PostgreSQL | localhost:5433 |

## Palveluiden pysäyttäminen

Pysäytä palvelut painamalla terminaalissa `Ctrl + C` ja suorittamalla:

```bash
docker-compose down
```

## Järjestelmän toiminta

Frontend hakee eläintiedot Server A:lta. Adoptiohakemus lähetetään ensin Server A:lle, joka välittää sen Server B:lle. Server B tallentaa hakemuksen PostgreSQL-tietokantaan ja päivittää eläimen statuksen adoptoiduksi.