import { ScopeSelectDwopdown } from "@/state/scope/components/scopeSelectDropdown";
import { ScopeSelectScreen } from "@/state/scope/components/scopeSelectScreen";

export default function Home() {

    return <>
  
      <div className="flex">
  
        <ScopeSelectDwopdown />
        

      </div>

      <ScopeSelectScreen />
  
    </>
  }