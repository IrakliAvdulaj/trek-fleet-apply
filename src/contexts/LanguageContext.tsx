import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'al';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'tre.delivery': 'TRE Delivery',
    'wolt.fleet.partner': 'Wolt Fleet Partner',
    'language': 'Language',
    'english': 'English',
    'albanian': 'Albanian',
    'login': 'Login',
    'signup': 'Sign Up',
    'logout': 'Logout',
    'dashboard': 'Dashboard',
    
    // Landing Page
    'hero.title': 'Join TRE Delivery Team',
    'hero.subtitle': 'Become a courier partner with Wolt and start earning flexible income in Albania',
    'apply.now': 'Apply Now',
    'learn.more': 'Learn More',
    
    // Features
    'flexible.hours': 'Flexible Hours',
    'flexible.hours.desc': 'Work when you want, earn when you need',
    'good.earnings': 'Good Earnings',
    'good.earnings.desc': 'Competitive rates and tips from customers',
    'full.support': 'Full Support',
    'full.support.desc': '24/7 support and training provided',
    
    // Application Form
    'application.form': 'Courier Application Form',
    'personal.info': 'Personal Information',
    'first.name': 'First Name',
    'last.name': 'Last Name',
    'email': 'Email',
    'phone.number': 'Phone Number',
    'age': 'Age',
    'gender': 'Gender',
    'vehicle.details': 'Vehicle Details',
    'vehicle.type': 'Vehicle Type',
    'working.hours': 'Preferred Working Hours',
    'submit.application': 'Submit Application',
    'update.application': 'Update Application',
    
    // Gender Options
    'male': 'Male',
    'female': 'Female',
    'other': 'Other',
    'prefer.not.to.say': 'Prefer not to say',
    
    // Vehicle Types
    'bicycle': 'Bicycle',
    'motorcycle': 'Motorcycle',
    'car': 'Car',
    'scooter': 'Scooter',
    'e-bike': 'E-bike',
    
    // Application Status
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'application.status': 'Application Status',
    'applied.on': 'Applied on',
    'last.updated': 'Last updated',
    
    // Admin Dashboard
    'admin.dashboard': 'Admin Dashboard',
    'all.applications': 'All Applications',
    'approve': 'Approve',
    'reject': 'Reject',
    'view.details': 'View Details',
    'admin.notes': 'Admin Notes',
    'applicant.info': 'Applicant Information',
    
    // Messages
    'application.submitted': 'Application submitted successfully!',
    'application.updated': 'Application updated successfully!',
    'login.required': 'Please login to access your dashboard',
    'admin.access.required': 'Admin access required',
    'application.exists': 'You have already submitted an application',
    'application.approved': 'Congratulations! Your application has been approved.',
    'application.rejected': 'Unfortunately, your application has been rejected.',
    
    // Common
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'close': 'Close',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
  },
  al: {
    // Header
    'tre.delivery': 'TRE Delivery',
    'wolt.fleet.partner': 'Partner i Flotës Wolt',
    'language': 'Gjuha',
    'english': 'Anglisht',
    'albanian': 'Shqip',
    'login': 'Hyrje',
    'signup': 'Regjistrohu',
    'logout': 'Dalje',
    'dashboard': 'Paneli',
    
    // Landing Page
    'hero.title': 'Bashkohu me Ekipin TRE Delivery',
    'hero.subtitle': 'Bëhu partner kurier me Wolt dhe fillo të fitosh të ardhura fleksibile në Shqipëri',
    'apply.now': 'Apliko Tani',
    'learn.more': 'Mëso Më Shumë',
    
    // Features
    'flexible.hours': 'Orë Fleksibile',
    'flexible.hours.desc': 'Punoni kur dëshironi, fitoni kur keni nevojë',
    'good.earnings': 'Të Ardhura të Mira',
    'good.earnings.desc': 'Tarifa konkurruese dhe bakshishe nga klientët',
    'full.support': 'Mbështetje e Plotë',
    'full.support.desc': 'Mbështetje 24/7 dhe trajnim i ofruar',
    
    // Application Form
    'application.form': 'Formulari i Aplikimit për Kurier',
    'personal.info': 'Informacione Personale',
    'first.name': 'Emri',
    'last.name': 'Mbiemri',
    'email': 'Email',
    'phone.number': 'Numri i Telefonit',
    'age': 'Mosha',
    'gender': 'Gjinia',
    'vehicle.details': 'Detajet e Mjetit',
    'vehicle.type': 'Lloji i Mjetit',
    'working.hours': 'Orët e Preferuara të Punës',
    'submit.application': 'Dërgo Aplikimin',
    'update.application': 'Përditëso Aplikimin',
    
    // Gender Options
    'male': 'Mashkull',
    'female': 'Femër',
    'other': 'Tjetër',
    'prefer.not.to.say': 'Prefero të mos them',
    
    // Vehicle Types
    'bicycle': 'Biçikletë',
    'motorcycle': 'Motocikletë',
    'car': 'Makinë',
    'scooter': 'Skutër',
    'e-bike': 'Biçikletë Elektrike',
    
    // Application Status
    'pending': 'Në Pritje',
    'approved': 'Aprovuar',
    'rejected': 'Refuzuar',
    'application.status': 'Statusi i Aplikimit',
    'applied.on': 'Aplikuar më',
    'last.updated': 'Përditësuar së fundmi',
    
    // Admin Dashboard
    'admin.dashboard': 'Paneli i Administratorit',
    'all.applications': 'Të Gjitha Aplikimet',
    'approve': 'Aprovo',
    'reject': 'Refuzo',
    'view.details': 'Shiko Detajet',
    'admin.notes': 'Shënime Administratori',
    'applicant.info': 'Informacione Aplikuesi',
    
    // Messages
    'application.submitted': 'Aplikimi u dërgua me sukses!',
    'application.updated': 'Aplikimi u përditësua me sukses!',
    'login.required': 'Ju lutem hyni për të hyrë në panelin tuaj',
    'admin.access.required': 'Kërkohet qasje administratori',
    'application.exists': 'Ju keni dërguar tashmë një aplikim',
    'application.approved': 'Urime! Aplikimi juaj është aprovuar.',
    'application.rejected': 'متأسفة، aplikimi juaj është refuzuar.',
    
    // Common
    'save': 'Ruaj',
    'cancel': 'Anulo',
    'edit': 'Ndrysho',
    'delete': 'Fshi',
    'close': 'Mbyll',
    'loading': 'Duke ngarkuar...',
    'error': 'Gabim',
    'success': 'Sukses',
  }
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('tre-delivery-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'al')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('tre-delivery-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};