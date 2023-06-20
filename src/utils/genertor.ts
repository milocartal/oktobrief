export function generatePassword() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 16) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function aleatoirePP() {
  //const listPP = ["/profilPics2/minotaur.svg", "/profilPics2/giant-squid.svg", "/profilPics2/octopod.svg", "/profilPics2/octopus.svg", "/profilPics2/pegasus.svg", '/profilPics2/squid-head.svg']
  const listPP = ["/profilPics/okto_happy.png", "/profilPics/okto_normal.png", "/profilPics/okto_pirate.png", "/profilPics/okto_wink.png"]
  const pp = listPP[Math.floor(Math.random() * listPP.length)];
  return pp as string
}

export function aleatoireColor() {
  const listColor = ["#0e6073", "#75ACAA", "#53A2A4", "#3C7E8A", '#2A6071', '#ECE4D9', '#E4D4BA', '#FD9E04']
  const pp = listColor[Math.floor(Math.random() * listColor.length)];
  return pp as string
}

export function aleatoireColor2() {
  let result = '#';
  const characters = 'ABCDEF0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}