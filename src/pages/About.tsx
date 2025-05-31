
import { Separator } from "@/components/ui/separator";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function About() {
  const { data: content, isLoading } = useSiteContent();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const getContent = (key: string) => {
    const item = content?.find(c => c.section_key === key);
    return item;
  };

  const heroTitle = getContent('hero_title');
  const heroSubtitle = getContent('hero_subtitle');
  const storyIntro = getContent('story_intro');
  const storyHelp = getContent('story_help');
  const storyImpact = getContent('story_impact');
  const whyTitle = getContent('why_title');
  const whyContent = getContent('why_content');
  const whyQuote = getContent('why_quote');
  const barriersIntro = getContent('barriers_intro');
  const projectDescription = getContent('project_description');
  const beliefsTitle = getContent('beliefs_title');
  const beliefTime = getContent('belief_time');
  const beliefGiving = getContent('belief_giving');
  const beliefAccessible = getContent('belief_accessible');
  const beliefEveryone = getContent('belief_everyone');
  const barrierTime = getContent('barrier_time');
  const barrierWhere = getContent('barrier_where');
  const barrierWhat = getContent('barrier_what');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-bleu mb-6">
            {heroTitle?.title || "Offrez votre temps – Même 15 minutes comptent"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {heroSubtitle?.title || "Je m'appelle Ben Mvouama."}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Story Section */}
          <div className="prose prose-lg prose-blue max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">
              {storyIntro?.content}
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              {storyHelp?.content}
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              {storyImpact?.content}
            </p>
          </div>

          <Separator className="my-12" />

          {/* Why Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-6">
              {whyTitle?.title || "Pourquoi ce projet"}
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              {whyContent?.content}
            </p>
            <blockquote className="text-2xl font-semibold text-center text-bleu italic border-l-4 border-orange pl-6 my-8">
              {whyQuote?.title}
            </blockquote>
          </div>

          {/* Barriers Section */}
          <div>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              {barriersIntro?.content}
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
              <li>{barrierTime?.title}</li>
              <li>{barrierWhere?.title}</li>
              <li>{barrierWhat?.title}</li>
            </ul>
            <p className="text-lg leading-relaxed text-gray-700">
              {projectDescription?.content}
            </p>
          </div>

          <Separator className="my-12" />

          {/* Beliefs Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-8">
              {beliefsTitle?.title || "Ce que nous croyons"}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-bleu mb-3">
                  {beliefTime?.title}
                </h3>
                <p className="text-gray-600">
                  {beliefTime?.content}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-bleu mb-3">
                  {beliefGiving?.title}
                </h3>
                <p className="text-gray-600">
                  {beliefGiving?.content}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-bleu mb-3">
                  {beliefAccessible?.title}
                </h3>
                <p className="text-gray-600">
                  {beliefAccessible?.content}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-bleu mb-3">
                  {beliefEveryone?.title}
                </h3>
                <p className="text-gray-600">
                  {beliefEveryone?.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
