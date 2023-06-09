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