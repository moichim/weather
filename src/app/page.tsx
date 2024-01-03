import { ScopeSelectScreen } from '@/state/scope/components/scopeSelectScreen';

import Intro from '@/components/content/intro';
import { Footer } from '@/components/content/footer';
import { ContentContainer } from '@/components/content/ui/contentContainer';

export default function Home() {

  return <div className="bg-foreground text-background pb-20">
    
    <Intro />

    <ContentContainer element="main" id="main">
      <ScopeSelectScreen />
    </ContentContainer>

  </div>;

}
