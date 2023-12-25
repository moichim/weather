
import { ScopeSelectScreen } from '@/state/scope/components/scopeSelectScreen';
import img from "../../public/letecke-02.jpg";


export default function Home() {

  return <>

    <div className="h-screen w-full p-10" style={{backgroundImage: `url(${img.src})`}}>

      <div className="flex gap-3 w-full">

        <div className="w-2/3">

          <ScopeSelectScreen />

        </div>

        <div className=" w-1/3">
          Tady je text
        </div>


      </div>

    </div>
  </>
}
