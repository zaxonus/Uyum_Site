/**
 * The idea of this component would require to register a Credit Card
 * in App Settings > Server URL and Live Query in Back4App.
 * We may want to do that at a later point in time if needed.
 */



import React,{useState,useEffect} from "react";
import Parse from "parse";
import {SentenceShow} from './Sentence';


function UyumDynaList() {
  const [dataArray,setDataArray] = useState<Parse.Object[]>([]),
        [loading,setLoading] = useState(true),
        [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const Uyum_Sentences = Parse.Object.extend("Uyum_Sentences");
        const query = new Parse.Query(Uyum_Sentences);
        query.ascending("order");
        query.limit(50);

        const results = await query.find();
        setDataArray(results);
      } catch (err) {
        //setError(err.message);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center">
      {dataArray.map((item) => (
        <SentenceShow key={item.id}
                      sentence={item.get("sentence")} />
      ))}
    </div>
  );
} /* End of UyumDynaList */


export default UyumDynaList;