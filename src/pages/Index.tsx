import { useContext } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Clock, Shield, Users, MapPin, Zap, Utensils } from "lucide-react";

const Index = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      hero: {
        title: "Join TRE Delivery",
        subtitle: "Partner with Wolt",
        description: "Become a courier and earn money on your schedule. Flexible hours, competitive pay, and full support.",
        cta: "Apply Now"
      },
      features: {
        title: "Why Choose TRE Delivery?",
        items: [
          {
            icon: Clock,
            title: "Flexible Hours",
            description: "Work when you want, as much as you want"
          },
          {
            icon: Shield,
            title: "Insurance Covered",
            description: "Full coverage while you're on duty"
          },
          {
            icon: Zap,
            title: "Quick Payments",
            description: "Get paid weekly with transparent earnings"
          },
          {
            icon: Users,
            title: "24/7 Support",
            description: "Our team is always here to help you"
          },
          {
            icon: MapPin,
            title: "City Coverage",
            description: "Deliver across all major areas in the city"
          },
          {
            icon: Utensils,
            title: "Any Vehicle",
            description: "Bike, scooter, car - use what works for you"
          }
        ]
      }
    },
    al: {
      hero: {
        title: "Bashkohu me TRE Delivery",
        subtitle: "Partner me Wolt",
        description: "Bëhu kurier dhe fito para në orarin tënd. Orë të përshtatshme, pagesë konkurruese, dhe mbështetje të plotë.",
        cta: "Apliko Tani"
      },
      features: {
        title: "Pse të Zgjedhësh TRE Delivery?",
        items: [
          {
            icon: Clock,
            title: "Orë të Përshtatshme",
            description: "Punë kur do, sa të duash"
          },
          {
            icon: Shield,
            title: "Sigurim i Mbuluar",
            description: "Mbulim i plotë gjatë punës"
          },
          {
            icon: Zap,
            title: "Pagesa të Shpejta",
            description: "Paguhu çdo javë me të ardhura transparente"
          },
          {
            icon: Users,
            title: "Mbështetje 24/7",
            description: "Ekipi ynë është gjithmonë këtu për të të ndihmuar"
          },
          {
            icon: MapPin,
            title: "Mbulim i Qytetit",
            description: "Dorëzo në të gjitha zonat kryesore të qytetit"
          },
          {
            icon: Utensils,
            title: "Çdo Automjet",
            description: "Biçikletë, skuter, makinë - përdor çfarë të funksionojë për ty"
          }
        ]
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 animate-fade-in">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-primary font-semibold mb-6 animate-fade-in">
              {t.hero.subtitle}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              {t.hero.description}
            </p>
            <Link to="/auth">
              <Button size="lg" className="animate-scale-in bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg">
                {t.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {t.features.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {t.features.items.map((feature, index) => (
              <Card key={index} className="p-6 hover-scale bg-gradient-card border-0 shadow-soft">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {language === 'en' ? 'Ready to Start?' : 'Gati të Fillosh?'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'en' 
                ? 'Join thousands of couriers already earning with TRE Delivery'
                : 'Bashkohu me mijëra kurierë që tashmë fitojnë me TRE Delivery'
              }
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg">
                {t.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
