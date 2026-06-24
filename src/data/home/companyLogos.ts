const DEKKO_CLIENTS_PATH = '/images/dekko-clients'

function clientLogo(filename: string, alt: string) {
  return {
    src: `${DEKKO_CLIENTS_PATH}/${encodeURIComponent(filename)}`,
    alt,
  }
}

export const companyLogos = [
  clientLogo('Kiabi.png', 'Kiabi'),
  clientLogo('Jack Jones.png', 'Jack & Jones'),
  clientLogo('Calvin Klein_s.png', 'Calvin Klein'),
  clientLogo('Ralph Lauren.png', 'Ralph Lauren'),
  clientLogo('Levi_s.png', "Levi's"),
  clientLogo('Kontoor.png', 'Kontoor'),
  clientLogo('Bestseller.png', 'Bestseller'),
  clientLogo('Camel Active.png', 'Camel Active'),
  clientLogo('Camaïeu.png', 'Camaïeu'),
  clientLogo('Carhartt.png', 'Carhartt'),
  clientLogo('Carlings.png', 'Carlings'),
  clientLogo('Celio.png', 'Celio'),
  clientLogo('Cubus.png', 'Cubus'),
  clientLogo('Dressmann.png', 'Dressmann'),
  clientLogo('ginatricot.png', 'Gina Tricot'),
  clientLogo('GMS.png', 'GMS'),
  clientLogo('Haggar.png', 'Haggar'),
  clientLogo('Inditex.png', 'Inditex'),
  clientLogo('J.Crew.png', 'J.Crew'),
  clientLogo('Kohl_s.png', "Kohl's"),
  clientLogo('Lindex.png', 'Lindex'),
  clientLogo('LPP.png', 'LPP'),
  clientLogo('Mark_s.png', "Mark's"),
  clientLogo('Nutmeg.png', 'Nutmeg'),
  clientLogo('PDS.png', 'PDS'),
  clientLogo('Peek Cloppenburg.png', 'Peek & Cloppenburg'),
  clientLogo('PVH.png', 'PVH'),
  clientLogo('S.Oliver.png', 'S.Oliver'),
  clientLogo('Sainsbury.png', 'Sainsbury'),
  clientLogo('Selected.png', 'Selected'),
  clientLogo('TESCO.png', 'Tesco'),
  clientLogo('Tom Tailor.png', 'Tom Tailor'),
  clientLogo('Tommy Hilfiger.png', 'Tommy Hilfiger'),
  clientLogo('Varner.png', 'Varner'),
]
