import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

gsap.registerPlugin(ScrollTrigger);

const Certifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const certifications = [
    {
      title: 'CCNA',
      fullName: 'Cisco Certified Network Associate',
      description: 'Network fundamentals, routing and switching',
      status: 'Active',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: Award,
      year: '2015',
    },
    {
      title: 'CKA',
      fullName: 'Certified Kubernetes Administrator',
      description: 'Kubernetes cluster administration and management',
      status: 'In Progress',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: Clock,
      year: '2024',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards fan out animation
      const cards = cardsRef.current?.querySelectorAll('.cert-card');
      if (cards) {
        cards.forEach((card, index) => {
          const direction = index === 0 ? -1 : 1;
          gsap.fromTo(
            card,
            {
              x: 0,
              rotateY: 0,
              opacity: 0,
              scale: 0.8,
            },
            {
              x: direction * (index === 0 ? -30 : 30),
              rotateY: direction * 5,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
              delay: index * 0.1,
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-cyan" />
            <span className="text-sm uppercase tracking-widest text-cyan font-medium">
              Certifications
            </span>
            <div className="h-px w-12 bg-cyan" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white">
            Professional <span className="text-gradient">Credentials</span>
          </h2>
        </div>

        {/* Certification Cards */}
        <div
          ref={cardsRef}
          className="flex flex-col md:flex-row justify-center gap-6 md:gap-8"
          style={{ perspective: '1200px' }}
        >
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="cert-card group relative w-full md:w-80"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan/20 to-purple/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card content */}
              <div className="relative h-full p-8 rounded-2xl bg-dark-200/80 border border-white/10 hover:border-cyan/30 transition-all duration-500 hover:shadow-xl hover:shadow-cyan/10 overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan/10 to-transparent rounded-bl-full" />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-xl bg-cyan/10 flex items-center justify-center group-hover:bg-cyan/20 transition-colors duration-300">
                    <cert.icon className="w-8 h-8 text-cyan group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Status badge */}
                  <Badge
                    className={`absolute -top-2 -right-2 ${cert.statusColor} border text-xs font-medium`}
                  >
                    {cert.status === 'Active' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {cert.status}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-display text-3xl text-white mb-2 group-hover:text-cyan transition-colors duration-300">
                  {cert.title}
                </h3>

                {/* Full name */}
                <p className="text-neutral-400 text-sm mb-4">{cert.fullName}</p>

                {/* Description */}
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                  {cert.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-neutral-600 text-xs">{cert.year}</span>
                  <button className="flex items-center gap-1 text-cyan text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Verify
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
