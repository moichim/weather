
import { Graphs } from '@/components/graphs/graphs';
import { SettingsContainer } from '@/components/settings/settingsContainer';

export default function Home() {

  return <>

    <div className="flex">

      <Graphs />

    </div>

    <SettingsContainer>Ahoj</SettingsContainer>
  </>
}
