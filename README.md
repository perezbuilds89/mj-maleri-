# M&J Måleri AB – ny hemsida (prototyp, version C)

Statisk hemsida i HTML, CSS och JavaScript. Inga ramverk, inget att installera.

## Filstruktur

```
index.html        Hela sidan (alla sektioner och texter)
css/style.css     Effekter, animationer och mobilanpassning
js/main.js        Interaktion: logga, typewriter, korten, lightbox, rummet m.m.
images/           Alla bilder, loggan, verktygen och hero-videon
```

## Ladda upp på GitHub

1. Skapa ett nytt repository på GitHub, t.ex. `mj-maleri`.
2. Välj **Add file → Upload files**.
3. Dra in **innehållet** i mappen (index.html, mapparna css, js, images och README.md), inte själva mappen.
4. Klicka **Commit changes**.

## Förhandsvisa på Render

1. På render.com: **New → Static Site**.
2. Koppla repot `mj-maleri`.
3. **Build Command:** lämna tomt. **Publish Directory:** `.` (en punkt).
4. Klicka **Create Static Site**. Render ger en länk som uppdateras vid varje ändring på GitHub.

## Att fixa innan sidan går live

- **E-postadress:** sök efter `[E-POSTADRESS]` i `index.html` och byt till deras riktiga adress.
- **Tjänstetexterna** under "Vad kan vi hjälpa dig med?" är förslag – låt M&J läsa igenom dem.
- **Rummen i "Testa en färg"** är exempelbilder. Kan bytas mot egna.
- **Domänen mjmaleri.nu:** pekas om först när allt är godkänt. Rör inte e-postens DNS-poster (MX).

## Idébank

- Foto på Magnus och Jonas i "Om oss".
- "Se fler arbeten" med ett riktigt galleri.
- Serif-typsnitt (t.ex. DM Serif Display) på huvudrubriken.
