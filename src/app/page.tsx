import { ScopeSelectScreen } from '@/state/scope/components/scopeSelectScreen';


export default function Home() {

  return <>

    <div className="h-screen w-full p-10 bg-gray-200">

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
