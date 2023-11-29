
import { GraphsGrid } from '@/components/graph/graphsGrid';
import { GraphGridSettings } from '@/components/graph/settings/graphGridSettings';
import { Header } from '@/components/header/header';
import { SettingsContainer } from '@/components/settings/settingsContainer';

export default function Home() {

  return <>
    <div className="flex">

      <GraphsGrid />

    </div>

    <SettingsContainer>Ahoj</SettingsContainer>
  </>
}
