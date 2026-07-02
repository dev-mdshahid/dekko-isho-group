import { legacyImage } from '../../lib/assets'

export type TeamSocialLink = {
  href: string
  icon: string
  alt: string
}

export type TeamMember = {
  wrapperId: string
  imageId: string
  contentId: string
  image: string
  imageClass: string
  contentClass: string
  name: string
  title: string
  social: TeamSocialLink[]
}

export const teamMembers: TeamMember[] = [
  {
    wrapperId: '3c4f7618-956a-e20e-f91a-ab5d915823a8',
    imageId: '0e9b32ae-e130-9276-6b45-278b38385d9c',
    contentId: 'cf9b2d24-09e1-a819-70c3-0b26760fadcc',
    image: legacyImage('Team-Members-3_1Team-Members-3.webp'),
    imageClass: 'team-image one',
    contentClass: 'team-info-content _01',
    name: 'James anderson',
    title: 'Head of operations',
    social: [
      { href: 'https://www.instagram.com/', icon: legacyImage('social-icon-2.svg'), alt: 'Social Icon' },
      { href: 'https://www.linkedin.com/', icon: legacyImage('social-icon-3.svg'), alt: 'Social Icon' },
      { href: 'https://x.com/', icon: legacyImage('social-icon-1.svg'), alt: 'Social Icon' },
    ],
  },
  {
    wrapperId: 'a9940cff-139d-c2d3-6221-238e4f46f246',
    imageId: 'ba36258d-da43-a5f7-47c0-471dc6f5510f',
    contentId: 'b5f89b86-8af3-23ea-ceff-8875e632056b',
    image: legacyImage('Team-Members-5_1Team-Members-5.webp'),
    imageClass: 'team-image two',
    contentClass: 'team-info-content _02',
    name: 'Michael turner',
    title: 'Lead CNC engineer',
    social: [
      { href: 'https://www.linkedin.com/', icon: legacyImage('social-icon-3.svg'), alt: 'Social Icon' },
      { href: 'https://x.com/', icon: legacyImage('social-icon-1.svg'), alt: 'Social Icon' },
    ],
  },
  {
    wrapperId: 'ac3f8c30-fe2b-9ebf-0c49-41f7effcc408',
    imageId: '071d24cd-a068-8114-21dc-37a185600140',
    contentId: '1a273ed4-ade9-2287-5d7f-4c6ba0e59f2b',
    image: legacyImage('Team-Members-2_1Team-Members-2.webp'),
    imageClass: 'team-image three',
    contentClass: 'team-info-content _03',
    name: 'Olivia bennett',
    title: 'Quality manager',
    social: [
      { href: 'https://www.instagram.com/', icon: legacyImage('social-icon-2.svg'), alt: 'Social Icon' },
      { href: 'https://x.com/', icon: legacyImage('social-icon-1.svg'), alt: 'Social Icon' },
    ],
  },
  {
    wrapperId: '86a62d01-d49a-84dd-0329-b43b1364fd20',
    imageId: 'ccfceddc-e5a0-975c-408e-198954f08b77',
    contentId: 'ce0ded0e-7ffb-ff32-1f34-ff2e324dd69a',
    image: legacyImage('Team-Members-7_1Team-Members-7.webp'),
    imageClass: 'team-image four',
    contentClass: 'team-info-content _04',
    name: 'William harris',
    title: 'Production supervisor',
    social: [
      { href: 'https://www.instagram.com/', icon: legacyImage('social-icon-2.svg'), alt: 'Social Icon' },
      { href: 'https://www.linkedin.com/', icon: legacyImage('social-icon-3.svg'), alt: 'Social Icon' },
    ],
  },
  {
    wrapperId: 'addb1d94-9d3c-f640-d8d3-2682cde80cc6',
    imageId: 'da90b41d-07ef-afdf-50bb-7feb72483ef5',
    contentId: '14d2b04d-2410-a158-1ed9-9fa355dc1bb3',
    image: legacyImage('Team-Members-4_1Team-Members-4.webp'),
    imageClass: 'team-image five',
    contentClass: 'team-info-content _05',
    name: 'Sophie walker',
    title: 'Client relations manager',
    social: [
      { href: 'https://www.instagram.com/', icon: legacyImage('social-icon-2.svg'), alt: 'Social Icon' },
      { href: 'https://www.linkedin.com/', icon: legacyImage('social-icon-3.svg'), alt: 'Social Icon' },
      { href: 'https://x.com/', icon: legacyImage('social-icon-1.svg'), alt: 'Social Icon' },
    ],
  },
  {
    wrapperId: 'cde56f3f-208c-06b8-f394-83463375e050',
    imageId: 'b4bacda4-c9d1-9dc1-0ec1-fe82fdf2a18f',
    contentId: 'bb091b31-d4ae-47f1-619a-eff2f67513b6',
    image: legacyImage('Team-Members-6_1Team-Members-6.webp'),
    imageClass: 'team-image six',
    contentClass: 'team-info-content _06',
    name: 'William carter',
    title: 'Project manager',
    social: [
      { href: 'https://www.linkedin.com/', icon: legacyImage('social-icon-3.svg'), alt: 'Social Icon' },
      { href: 'https://x.com/', icon: legacyImage('social-icon-1.svg'), alt: 'Social Icon' },
    ],
  },
  {
    wrapperId: '96045217-f44b-7e7c-ff73-ef5db6bf2c29',
    imageId: '8b53ecd7-b920-bf3e-9ee8-643ded9ab13d',
    contentId: 'c11039b8-f9c8-1892-f1ac-d753b49641fc',
    image: legacyImage('Team-Members-1_1Team-Members-1.webp'),
    imageClass: 'team-image seven',
    contentClass: 'team-info-content _07',
    name: 'Emily carter',
    title: 'Operations specialist',
    social: [{ href: 'https://x.com/', icon: legacyImage('social-icon-1.svg'), alt: 'Social Icon' }],
  },
]
