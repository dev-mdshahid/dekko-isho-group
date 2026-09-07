const DEKKO_CLIENTS_PATH = '/images/dekko-clients'

function clientLogo(filename: string, alt: string) {
  return {
    src: `${DEKKO_CLIENTS_PATH}/${encodeURIComponent(filename)}`,
    alt,
  }
}

export const companyLogos = [
  clientLogo('Ralph Lauren.png', 'Ralph Lauren'),
  clientLogo('Tommy Hilfiger.png', 'Tommy Hilfiger'),
  clientLogo('Zara_Logo.svg', 'Zara'),
  clientLogo('Inditex.png', 'Inditex'),
  clientLogo('Bestseller.png', 'Bestseller'),
  clientLogo('Levi_s.png', "Levi's"),
  clientLogo('Calvin Klein_s.png', 'Calvin Klein'),
  clientLogo('Camel Active.png', 'Camel Active'),
  clientLogo('Carhartt.png', 'Carhartt'),
  clientLogo('Celio.png', 'Celio'),
  clientLogo('Haggar.png', 'Haggar'),
  clientLogo('Kiabi.png', 'Kiabi'),
  clientLogo('Kohl_s.png', "Kohl's"),
  clientLogo('Kontoor.png', 'Kontoor'),
  clientLogo('Lindex.png', 'Lindex'),
  clientLogo('LPP.png', 'LPP'),
  clientLogo('Mark_s.png', "Mark's"),
  clientLogo('PeekandCloppenburg.png', 'Peek & Cloppenburg'),
  clientLogo('tom-tailor-seeklogo.png', 'Tom Tailor'),
  clientLogo('Varner.png', 'Varner'),
]
