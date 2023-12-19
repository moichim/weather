
import { ScopeSelectScreen } from '@/state/scope/components/scopeSelectScreen';
import img from "../../public/letecke-02.jpg";


export default function Home() {

  return <>

    <div className="h-screen w-full p-10" style={{backgroundImage: `url(${img.src})`}}>

      <ScopeSelectScreen />

    </div>
  </>
}
