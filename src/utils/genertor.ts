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
  const listPP = ["/profilPics/minotaur.svg", "/profilPics/giant-squid.svg", "/profilPics/octopod.svg", "/profilPics/octopus.svg", "/profilPics/pegasus.svg", '/profilPics/squid-head.svg']
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