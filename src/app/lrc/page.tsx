import { Lrc } from "@/components/thermogram/lrc";
import { SAMPLE_URL } from "@/utils/reader/lrcReader.test";

export default async function Home() {
  
    return <div className="">
      
      <Lrc url="http://localhost:3000/sample.lrc" />
  
    </div>;
  
  }