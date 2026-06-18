export type Testimonial = {
  tab: string
  image: string
  quote: string
  name: string
  title: string
}

export const homeTestimonials: Testimonial[] = [
  {
    tab: 'Tab 1',
    image: 'testimonial-images-1_1testimonial-images-1.png',
    quote:
      "The team's dedication and innovative approach transformed our ideas into reality. Every stage of the project was handled with care and expertise.",
    name: 'Emily carter',
    title: 'Product Designer',
  },
  {
    tab: 'Tab 2',
    image: 'Client-images-2_1Client-images-2.webp',
    quote:
      'The precision and efficiency they demonstrated made the entire process effortless. I highly recommend them for any technical project.',
    name: 'Liam thompson',
    title: 'Operations Manager',
  },
  {
    tab: 'Tab 3',
    image: 'testimonial-images-3_1testimonial-images-3.png',
    quote:
      'Their precision engineering and attention to detail exceeded our expectations. From prototyping to delivery, the entire process was seamless and professional.',
    name: 'John matthews',
    title: 'Procurement Manager',
  },
  {
    tab: 'Tab 4',
    image: 'testimonial-images-4_1testimonial-images-4.png',
    quote:
      'I was impressed by their professionalism and attention to detail. Communication was clear, and the final product exceeded our expectations.',
    name: 'Sofia ramirez',
    title: 'Marketing Lead at BrightWave Tech',
  },
  {
    tab: 'Tab 5',
    image: 'testimonial-images-5_1testimonial-images-5.png',
    quote:
      'The level of professionalism and commitment to quality was exceptional. Every detail was meticulously handled, making our collaboration stress-free.',
    name: 'Ethan brooks',
    title: 'Project Coordinator at Stellar Industries',
  },
]
