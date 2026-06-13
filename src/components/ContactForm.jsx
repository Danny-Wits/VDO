import { useRef } from 'react'
import { TextInput, Textarea, Button } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function ContactForm() {
  const formRef = useRef(null)

  useGSAP(() => {
    // Staggered entrance for form elements
    gsap.from('.contact-element', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: formRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    })
  }, { scope: formRef })

  return (
    <section ref={formRef} className="py-16 md:py-32 px-6 relative z-10">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="contact-element text-center mb-16">
          <h2 className="text-5xl font-display font-black text-accent">THE FINAL CUT</h2>
          <p className="text-primary mt-2 tracking-widest uppercase text-sm font-sans">Let's craft something timeless</p>
        </div>

        <form className="contact-element space-y-6 bg-forest/30 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-accent/10 shadow-2xl" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="contact-element">
              <TextInput
                label="Name"
                placeholder="Your name"
                size="lg"
                classNames={{
                  input: 'bg-dark/50 border-accent/10 text-accent focus:border-primary focus:ring-primary transition-colors rounded-xl',
                  label: 'text-accent/70 font-sans tracking-wide mb-2'
                }}
              />
            </div>
            <div className="contact-element">
              <TextInput
                label="Email"
                placeholder="Your email address"
                size="lg"
                classNames={{
                  input: 'bg-dark/50 border-accent/10 text-accent focus:border-primary focus:ring-primary transition-colors rounded-xl',
                  label: 'text-accent/70 font-sans tracking-wide mb-2'
                }}
              />
            </div>
          </div>
          
          <div className="contact-element">
            <Textarea
              label="Project Vision"
              placeholder="Tell me about the story we're editing..."
              size="lg"
              minRows={5}
              classNames={{
                input: 'bg-dark/50 border-accent/10 text-accent focus:border-primary focus:ring-primary transition-colors rounded-xl',
                label: 'text-accent/70 font-sans tracking-wide mb-2'
              }}
            />
          </div>

          <div className="contact-element">
            <Button 
              type="submit"
              size="xl" 
              fullWidth 
              color="wood.8"
              rightSection={<IconSend size={20} />}
              className="font-sans tracking-widest uppercase mt-8 hover:scale-[1.02] transition-transform shadow-lg rounded-xl"
            >
              Initiate Render
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
