# Počisti

#### Tri, četiri, POČISTI! Doprinesite čistijoj i zdravijoj Srbiji.

Počisti aplikacija je pisana u javascript-u pomocu react native framework-a. Odlučili smo se za react native umesto nativnog android developmenta radi mnogo bržeg vremena razvijanja. Za backend je zasluzan google-ov baas (backend as a service) firebase, iz kojeg koristimo autentikaciju, firestore bazu i storage sistem.
Neki od modula koji ?poweruje nasu aplikaciju su:

- Expo (Povezuje sve module i compile-uje aplikaciju na obe platforme)
  React-navigation (Omogućava nativnu platformsku navigaciju između raznih ekrana aplikacije)
- Tailwind (Zaslužan za postavljanje stilova)
- React-native-maps (Omogućava pokazivanje nativnih mapa (Google maps za android i apple maps za ios) kao i postavljanje markera na mapi)
- Uuid (Alat za dobijanje unikatnih identifikacionih kljuceva za imena slika u bazi)
- Expo-locaiton (Pristup korisnickoj lokaciji kao i generisanju adresa od geolokacije)
- Expo-image-picker (Omogućava da korisnik izabere fotografiju ili fotografise u aplikaciji)

##### Kako pokrenuti

Možete testirati na emulatoru ili na telefonu

Aplikaciju mozete pokrenuti na expo go aplikaciji [ovde](https://expo.dev/@pikqi/pocisti)

#### Pokretanje aplikacije lokalno

###### Preduslovi za pokretanje aplikacije

- [Node.js](https://nodejs.dev/download)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [expo-cli](https://docs.expo.dev/get-started/installation/)
- IOS ili Android emulator ili telefon

Kada imate sve prethodno navedene alate instalirajte sve module projekta pomocu:
`yarn`
zatim pokrenite expo dev server sa:
`expo start`
kada se dev server pokrene mozete skenirati QR kod iz konzole i otvoriti na telefonu koji ima expo go aplikaciju
Ukoliko pokrećete aplikaciju na emulatoru pokrenite emulator i u konzoli ukucajte `a` za Android ili `i` za IOS
