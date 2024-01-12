import { ScopeSelectScreen } from '@/components/scope/scopeSelectScreen';

import Intro from '@/components/content/intro';
import { ContentContainer } from '@/components/content/ui/contentContainer';

export default function Home() {

  return <div className="bg-foreground pb-20">
    
    <Intro />

    <ContentContainer element="main" id="main">
      <ScopeSelectScreen />
    </ContentContainer>

  </div>;

}
