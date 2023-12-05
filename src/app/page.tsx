
import { GraphsGrid } from '@/components/graph/graphsGrid';
import { SettingsContainer } from '@/components/settings/settingsContainer';
import { Toolbar } from '@/components/ui/toolbar/toolbar';

export default function Home() {

  return <>
    <div className="flex">

      <GraphsGrid />

    </div>

    <SettingsContainer>Ahoj</SettingsContainer>
  </>
}
