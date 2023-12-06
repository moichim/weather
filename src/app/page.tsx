
import { GraphGrid } from '@/components/graphGrid/graphsGrid';
import { GraphStack } from '@/components/graphStack/graphStack';
import { SettingsContainer } from '@/components/settings/settingsContainer';
import { Toolbar } from '@/components/ui/toolbar/toolbar';

export default function Home() {

  return <>
    <div className="flex">

      <GraphStack />

    </div>

    <SettingsContainer>Ahoj</SettingsContainer>
  </>
}
