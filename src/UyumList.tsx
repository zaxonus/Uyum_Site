
import React, { useState, useEffect } from "react";
import Parse from "parse";


function UyumList() {
  const [dataArray,setDataArray] = useState<Parse.Object[]>([]),
        [loading,setLoading] = useState(true),
        [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const MyClass = Parse.Object.extend("Uyum_Sentences");
        const query = new Parse.Query(MyClass);
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
        <SentenceUnit key={item.id}
                      sentence={item.get("sentence")} />
      ))}
    </div>
  );
} /* End of UyumList */


function SentenceUnit({sentence}:{sentence:string}) {
  const dspAtrb = 'bg-amber-200 text-stone-950 \
                   font-serif text-2xl font-normal m-1 px-2 \
                   border-2 border-indigo-400 rounded-lg'
  return (
    <div className={dspAtrb}>
      {sentence}
    </div>
  )
} /* End of SentenceUnit */


export default UyumList;