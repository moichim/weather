
import { GraphsGrid } from '@/components/graph/graphsGrid';
import { SettingsContainer } from '@/components/settings/settingsContainer';

export default function Home() {

  return <>
    <div className="flex">

      <GraphsGrid />

    </div>

    <SettingsContainer>Ahoj</SettingsContainer>
  </>
}
