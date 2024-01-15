import Intro from '@/components/content/intro';
import { ContentContainer } from '@/components/content/ui/contentContainer';
import { GoogleDocsViewer } from '@/components/documents/googleDocumentViewer';
import { ScopeSelectScreen } from '@/components/scope/scopeSelectScreen';
import { googleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';

export default async function Home() {

  const data = await googleSheetsProvider.getAllScopes();

  return <div className="bg-foreground pb-20">
    
    <Intro />

    <ContentContainer element="main" id="main">
      <ScopeSelectScreen scopes={data}/>
    </ContentContainer>

  </div>;

}
