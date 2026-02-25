import React from 'react';
import Section from './Section';
import { ArrowRight, Star } from 'lucide-react';

const FEATURED_ARTISTS = [
  {
    name: 'Amina Diop',
    role: 'Afro-Soul Vocalist',
    location: 'Dakar, Senegal',
    bio: 'Since joining GigsConnect, Amina has headlined 3 major festivals across West Africa and collaborated with top producers.',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviews: 24,
  },
  {
    name: 'The Lagos Jazz Collective',
    role: 'Contemporary Jazz Band',
    location: 'Lagos, Nigeria',
    bio: 'This 5-piece ensemble went from playing local lounges to securing a residency at a premium hotel through the platform.',
    image: 'https://images.unsplash.com/photo-1546707012-c46675f12716?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 56,
  },
  {
    name: 'Kwame Osei',
    role: 'Highlife Guitarist',
    location: 'Accra, Ghana',
    bio: 'Kwame found his big break connecting with international event organizers looking for authentic Highlife sounds.',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 31,
  }
];

const ArtistSpotlight: React.FC = () => {
  return (
    <Section id="spotlight" dark>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 font-bold text-sm mb-6 shadow-sm font-display tracking-wide">
          <Star className="w-4 h-4 fill-current" />
          SUCCESS STORIES
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">Artist Spotlight</h2>
        <p className="text-gray-600 text-lg font-sans">Discover the incredible talent thriving on GigsConnect and landing their dream gigs.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {FEATURED_ARTISTS.map((artist, index) => (
          <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={artist.image} 
                alt={artist.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white font-display">{artist.name}</h3>
                <p className="text-brand-200 font-medium text-sm">{artist.role} • {artist.location}</p>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-accent-500 fill-current" />
                <span className="font-bold text-gray-900">{artist.rating}</span>
                <span className="text-gray-500 text-sm">({artist.reviews} reviews)</span>
              </div>
              
              <p className="text-gray-600 leading-relaxed font-sans mb-6 flex-grow">
                "{artist.bio}"
              </p>
              
              <a href="#" className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors group/link mt-auto">
                View Profile 
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default ArtistSpotlight;
