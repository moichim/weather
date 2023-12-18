
import { Graphs } from '@/components/graphs/graphs';
import { SettingsContainer } from '@/components/settings/settingsContainer';
import { ScopeSelectScreen } from '@/state/scope/components/scopeSelectScreen';

export default function Home() {

  return <>

    <div className="flex">

      <ScopeSelectScreen />

    </div>
  </>
}
