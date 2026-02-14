import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import Workshop from './components/sections/Workshop';
import LeadMagnets from './components/sections/LeadMagnets';
import Newsletter from './components/sections/Newsletter';
import Footer from './components/sections/Footer';
import EditableSection from './components/cms/EditableSection';
import InlineEditButton from './components/cms/InlineEditButton';
import CMSToolbar from './components/cms/CMSToolbar';
import LoginPage from './components/cms/LoginPage';
import type { FieldConfig } from './components/cms/EditableSection';

// Field configurations for each section
const navbarFields: FieldConfig[] = [
  { key: 'logoText', label: 'שם הלוגו', type: 'text' },
  { key: 'links', label: 'קישורי ניווט', type: 'object-list', fields: [
    { key: 'name', label: 'שם', type: 'text' },
    { key: 'href', label: 'קישור', type: 'text' },
  ]},
];

const heroFields: FieldConfig[] = [
  { key: 'image', label: 'תמונה ראשית', type: 'image' },
  { key: 'badge', label: 'תגית', type: 'text' },
  { key: 'title', label: 'כותרת', type: 'text' },
  { key: 'subtitle', label: 'תת כותרת', type: 'textarea' },
  { key: 'subtitleHighlight', label: 'טקסט מודגש', type: 'text' },
  { key: 'trustIndicators', label: 'אינדיקטורים', type: 'object-list', fields: [
    { key: 'text', label: 'טקסט', type: 'text' },
    { key: 'icon', label: 'אייקון (Heart/Leaf/Sparkles)', type: 'text' },
  ]},
];

const aboutFields: FieldConfig[] = [
  { key: 'sectionTitle', label: 'כותרת סקשן', type: 'text' },
  { key: 'sectionSubtitle', label: 'תת כותרת', type: 'text' },
  { key: 'paragraphs', label: 'פסקאות', type: 'list' },
  { key: 'highlights', label: 'כרטיסים', type: 'object-list', fields: [
    { key: 'icon', label: 'אייקון (Brain/Heart/Leaf/Sparkles)', type: 'text' },
    { key: 'title', label: 'כותרת', type: 'text' },
    { key: 'description', label: 'תיאור', type: 'textarea' },
  ]},
  { key: 'missionStatement', label: 'הצהרת ייעוד', type: 'textarea' },
];

const servicesFields: FieldConfig[] = [
  { key: 'sectionTitle', label: 'כותרת סקשן', type: 'text' },
  { key: 'sectionSubtitle', label: 'תת כותרת', type: 'text' },
  { key: 'services', label: 'שירותים', type: 'object-list', fields: [
    { key: 'icon', label: 'אייקון (Sparkles/MessageCircle)', type: 'text' },
    { key: 'title', label: 'שם השירות', type: 'text' },
    { key: 'subtitle', label: 'תת כותרת', type: 'text' },
    { key: 'description', label: 'תיאור', type: 'textarea' },
    { key: 'features', label: 'תכונות', type: 'list' },
    { key: 'dates', label: 'תאריכים', type: 'text' },
    { key: 'cta', label: 'טקסט כפתור', type: 'text' },
    { key: 'href', label: 'קישור כפתור', type: 'text' },
    { key: 'featuredBadge', label: 'תגית מובלטת', type: 'text' },
  ]},
];

const workshopFields: FieldConfig[] = [
  { key: 'sectionTitle', label: 'כותרת סקשן', type: 'text' },
  { key: 'sectionSubtitle', label: 'תת כותרת', type: 'text' },
  { key: 'introParagraphs', label: 'פסקאות פתיחה', type: 'list' },
  { key: 'introHighlight', label: 'טקסט מודגש פתיחה', type: 'textarea' },
  { key: 'benefitsTitle', label: 'כותרת יתרונות', type: 'text' },
  { key: 'benefits', label: 'יתרונות', type: 'list' },
  { key: 'approachTitle', label: 'כותרת גישה', type: 'text' },
  { key: 'approachParagraphs', label: 'פסקאות גישה', type: 'list' },
  { key: 'syllabusTitle', label: 'כותרת סילבוס', type: 'text' },
  { key: 'syllabus', label: 'סילבוס', type: 'object-list', fields: [
    { key: 'week', label: 'שבוע', type: 'text' },
    { key: 'date', label: 'תאריך', type: 'text' },
    { key: 'title', label: 'כותרת', type: 'text' },
    { key: 'topics', label: 'נושאים', type: 'list' },
  ]},
  { key: 'technicalTitle', label: 'כותרת פרטים טכניים', type: 'text' },
  { key: 'technicalDetails', label: 'פרטים טכניים', type: 'object-list', fields: [
    { key: 'icon', label: 'אייקון', type: 'text' },
    { key: 'text', label: 'טקסט', type: 'text' },
  ]},
  { key: 'technicalExtra', label: 'טקסט נוסף', type: 'text' },
  { key: 'ctaText', label: 'טקסט קריאה לפעולה', type: 'textarea' },
  { key: 'ctaButton', label: 'טקסט כפתור', type: 'text' },
  { key: 'ctaHref', label: 'קישור כפתור', type: 'text' },
  { key: 'ctaSubtext', label: 'טקסט משנה', type: 'text' },
];

const syllabusFields: FieldConfig[] = [
  { key: 'syllabusTitle', label: 'כותרת', type: 'text' },
  { key: 'syllabus', label: 'שבועות', type: 'object-list', fields: [
    { key: 'week', label: 'מספר שבוע', type: 'text' },
    { key: 'date', label: 'תאריך', type: 'text' },
    { key: 'title', label: 'כותרת', type: 'text' },
    { key: 'topics', label: 'נושאים', type: 'list' },
  ]},
];

const leadMagnetsFields: FieldConfig[] = [
  { key: 'sectionTitle', label: 'כותרת סקשן', type: 'text' },
  { key: 'sectionSubtitle', label: 'תת כותרת', type: 'text' },
  { key: 'gifts', label: 'מתנות', type: 'object-list', fields: [
    { key: 'icon', label: 'אייקון (Droplets/ChefHat)', type: 'text' },
    { key: 'title', label: 'כותרת', type: 'text' },
    { key: 'description', label: 'תיאור', type: 'textarea' },
    { key: 'benefits', label: 'יתרונות', type: 'list' },
    { key: 'cta', label: 'טקסט כפתור', type: 'text' },
    { key: 'color', label: 'צבע (sage/blush)', type: 'text' },
  ]},
];

const newsletterFields: FieldConfig[] = [
  { key: 'sectionTitle', label: 'כותרת סקשן', type: 'text' },
  { key: 'sectionSubtitle', label: 'תת כותרת', type: 'text' },
  { key: 'whatsapp', label: 'וואטסאפ', type: 'object-list', fields: [
    { key: 'title', label: 'כותרת', type: 'text' },
    { key: 'description', label: 'תיאור', type: 'textarea' },
    { key: 'features', label: 'תכונות', type: 'list' },
    { key: 'buttonText', label: 'טקסט כפתור', type: 'text' },
    { key: 'href', label: 'קישור', type: 'text' },
  ]},
  { key: 'email', label: 'מייל', type: 'object-list', fields: [
    { key: 'title', label: 'כותרת', type: 'text' },
    { key: 'description', label: 'תיאור', type: 'textarea' },
    { key: 'buttonText', label: 'טקסט כפתור', type: 'text' },
  ]},
];

const footerFields: FieldConfig[] = [
  { key: 'brandName', label: 'שם המותג', type: 'text' },
  { key: 'brandDescription', label: 'תיאור', type: 'textarea' },
  { key: 'quickLinksTitle', label: 'כותרת קישורים', type: 'text' },
  { key: 'quickLinks', label: 'קישורים', type: 'object-list', fields: [
    { key: 'name', label: 'שם', type: 'text' },
    { key: 'href', label: 'קישור', type: 'text' },
  ]},
  { key: 'contactTitle', label: 'כותרת צור קשר', type: 'text' },
  { key: 'email', label: 'כתובת מייל', type: 'text' },
  { key: 'whatsappNumber', label: 'מספר וואטסאפ', type: 'text' },
  { key: 'instagramUrl', label: 'קישור אינסטגרם', type: 'text' },
  { key: 'facebookUrl', label: 'קישור פייסבוק', type: 'text' },
];

// Public website view
function WebsiteView() {
  const { content, loading } = useContent();

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-sage-600 text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar content={content.navbar} />
      <main>
        <Hero content={content.hero} />
        <About content={content.about} />
        <Services content={content.services} />
        <Workshop content={content.workshop} />
        <LeadMagnets content={content.leadMagnets} />
        <Newsletter content={content.newsletter} />
      </main>
      <Footer content={content.footer} />
    </div>
  );
}

// CMS editor view - protected by auth
function CMSView() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { content, loading, updateSection } = useContent();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-sage-600 text-xl">טוען...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-sage-600 text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CMSToolbar onLogout={logout} />
      <div className="pt-10">
        <EditableSection sectionKey="navbar" sectionLabel="ניווט" fieldConfigs={navbarFields}>
          <Navbar content={content.navbar} />
        </EditableSection>
        <main>
          <EditableSection sectionKey="hero" sectionLabel="כותרת ראשית" fieldConfigs={heroFields}>
            <Hero content={content.hero} />
          </EditableSection>
          <EditableSection sectionKey="about" sectionLabel="אודות" fieldConfigs={aboutFields}>
            <About content={content.about} />
          </EditableSection>
          <EditableSection sectionKey="services" sectionLabel="שירותים" fieldConfigs={servicesFields}>
            <Services content={content.services} />
          </EditableSection>
          <EditableSection sectionKey="workshop" sectionLabel="סדנה" fieldConfigs={workshopFields}>
            <Workshop
              content={content.workshop}
              syllabusEditSlot={
                <InlineEditButton
                  label="מבנה הקורס"
                  data={content.workshop as unknown as Record<string, unknown>}
                  fieldConfigs={syllabusFields}
                  onSave={(newData) => {
                    updateSection('workshop', { ...content.workshop, ...newData } as unknown as typeof content.workshop);
                  }}
                />
              }
            />
          </EditableSection>
          <EditableSection sectionKey="leadMagnets" sectionLabel="מתנות חינמיות" fieldConfigs={leadMagnetsFields}>
            <LeadMagnets content={content.leadMagnets} />
          </EditableSection>
          <EditableSection sectionKey="newsletter" sectionLabel="ניוזלטר" fieldConfigs={newsletterFields}>
            <Newsletter content={content.newsletter} />
          </EditableSection>
          <EditableSection sectionKey="footer" sectionLabel="פוטר" fieldConfigs={footerFields}>
            <Footer content={content.footer} />
          </EditableSection>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WebsiteView />} />
            <Route path="/cms" element={<CMSView />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
